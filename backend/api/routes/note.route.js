const noteService = require('../services/note.service');
var schema = require('../schemas/note.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');
var generator = require('../../common/idGenerator');
const redis = require('redis');
var configResolve = require("../../common/configResolver");
const redisHost = configResolve.getConfig().redisHost;
const client = redis.createClient({ host: redisHost, port: 6379 })


function init(router) {
  router.route('/notes')
    .get(getAllNotes)
    .post(addNote);
  router.route('/notes/count')
    .get(getAllNotesCount);
  router.route('/notes/overview')
    .get(getAllNotesOverview);
  router.route('/notes/exist')
    .get(isExist);
  router.route('/notes/:id')
    .get(getNoteById)
    .delete(deleteNote)
    .put(updateNote);
  router.route('/notes/search')
    .post(searchNotes);
  router.route('/notes/search/text')
    .get(textSearch);
}

/**
 * Get all a notes api
 * @route GET /api/notes
 * @group notes - Operations about notes
 * @returns {object} 200 - An object of notes info
 * @returns {Error}  default - Unexpected error
 */
function getAllNotes(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
 if (pageNo > 0 && !isNaN(pageNo) && pageSize > 0 && !isNaN(pageSize)) {
    if (sortBy != null || sortBy != undefined) {
      noteService.getNotesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      noteService.getNotesByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    noteService.getAllNotes().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
  }
}

/**
 * @typedef SearchCriteria
 * @property {string} pageSize.required
 * @property {string} pageNo.required 
 * @property {string} query.required 
 */
/**
 * Search notes api
 * @route POST /api/notes/search
 * @group notes - Operations about notes
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of notes info
 * @returns {Error}  default - Unexpected error
 */
function searchNotes(req, res, next) {
  let searchCriteria = req.body;
  noteService.searchNotes(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get notes by id api
 * @route GET /api/notes/:id
 * @group notes - Operations about notes
 * @returns {object} 200 - An object of notes info
 * @returns {Error}  default - Unexpected error
 */
function getNoteById(req,res,next) {

  let noteId = req.params.id;

  console.log("id"+ noteId);
  var json_format = iValidator.json_schema(schema.getSchema,noteId,"note");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  noteService.getNoteById(noteId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.NOTE_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add notes api
 * @route POST /api/notes
 * @group notes - Operations about notes
 * @param {object} note.body.required - notes details
 * @returns {object} 200 - An object of notes info
 * @returns {Error}  default - Unexpected error
 */
function addNote(req,res, next) {
  var noteData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, noteData, "note");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   noteService.getNoteByNoteName(noteData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.NOTE_ALREADY_EXISTS));
    }else{
      noteService.addNote(noteData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });

}

/**
 * update notes by id api
 * @route PUT /api/notes
 * @group notes - Operations about notes
 * @returns {object} 200 - An object of notes info
 * @returns {Error}  default - Unexpected error
 */
function updateNote(req,res, next) {
   var noteData=req.body;
   var id = req.params.id;
   noteService.getNoteById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.NOTE_DOES_NOT_EXIST));
    }else{
      noteService.updateNote(id,noteData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete notes by id api
 * @route DELETE /api/notes/:id
 * @group notes - Operations about notes
 * @returns {object} 200 - An object of notes info
 * @returns {Error}  default - Unexpected error
 */
function deleteNote(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  noteService.getNoteById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.NOTE_DOES_NOT_EXIST));
    }else{
      noteService.deleteNote(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get notes count api
 * @route GET /api/notes/count
 * @group notes - Operations about notes
 * @returns {object} 200 - An object of notes info
 * @returns {Error}  default - Unexpected error
 */
function getAllNotesCount(req,res,next) {
  noteService.getAllNotesCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.NOTE_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of notes api
 * @route GET /api/notes/overview
 * @group notes - Operations about notes
 * @returns {object} 200 - An object of notes info
 * @returns {Error}  default - Unexpected error
 */
function getAllNotesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  noteService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is notes exist api
 * @route GET /api/notes/exist
 * @group notes - Operations about notes
 * @param {string} notename.query.required - notes name
 * @returns {object} 200 - An object of notes info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let noteId = req.query.noteId;
  noteService.getNoteByName(name).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/*
text search function
*/

function textSearch(req, res, next) {
  let text = req.query.text;
  noteService.textSearch(text).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;