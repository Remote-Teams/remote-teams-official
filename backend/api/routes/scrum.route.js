const scrumService = require('../services/scrum.service');
const scrumNoteService = require('../services/scrumNotes.service');
var schema = require('../schemas/scrum.validation.schema.json');
var noteschema = require('../schemas/scrumnotes.validation.schema.json');
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
  router.route('/scrums')
    .get(getAllScrums)
    .post(addScrum);
  router.route('/scrums/notes')
    .post( createNotesWithScrumID );
  router.route(`/scrums/notes/get`)
    .post( getAllNotesWithScrumID );
  router.route(`/scrums/notes/:id`)
    .put( updateNotes )
    .delete( deleteNotes );
  router.route('/scrums/count')
    .get(getAllScrumsCount);
  router.route('/scrums/overview')
    .get(getAllScrumsOverview);
  router.route('/scrums/:id')
    .get(getScrumById)
    .delete(deleteScrum)
    .put(updateScrum);
  router.route('/scrums/search')
    .post(searchScrums);
  router.route('/scrums/search/text')
    .get(textSearch);
  // router.route('/scrums/exist')
  //   .get(isExist);
}

/**
 * Get all a scrums api
 * @route GET /api/scrums
 * @group scrums - Operations about scrums
 * @returns {object} 200 - An object of scrums info
 * @returns {Error}  default - Unexpected error
 */
function getAllScrums(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
   if (pageNo > 0 &&  pageSize > 0 && !isNaN(pageSize)) {
    if (sortBy != null || sortBy != undefined) {
      scrumService.getScrumsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      scrumService.getScrumsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    scrumService.getAllScrums().then((data) => {
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
 * Search scrums api
 * @route POST /api/scrums/search
 * @group scrums - Operations about scrums
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of scrums info
 * @returns {Error}  default - Unexpected error
 */
function searchScrums(req, res, next) {
  let searchCriteria = req.body;
  scrumService.searchScrums(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get scrums by id api
 * @route GET /api/scrums/:id
 * @group scrums - Operations about scrums
 * @returns {object} 200 - An object of scrums info
 * @returns {Error}  default - Unexpected error
 */
function getScrumById(req,res,next) {

  let scrumId = req.params.id;

  console.log("id"+ scrumId);
  var json_format = iValidator.json_schema(schema.getSchema,scrumId,"scrum");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  scrumService.getScrumById(scrumId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.SCRUM_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add scrums api
 * @route POST /api/scrums
 * @group scrums - Operations about scrums
 * @param {object} scrum.body.required - scrums details
 * @returns {object} 200 - An object of scrums info
 * @returns {Error}  default - Unexpected error
 */
function addScrum(req,res, next) {
  var scrumData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, scrumData, "scrum");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   scrumService.getScrumByScrumName(scrumData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.SCRUM_ALREADY_EXISTS));
    }else{
      scrumService.addScrum(scrumData).then((data) => {
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
 * update scrums by id api
 * @route PUT /api/scrums
 * @group scrums - Operations about scrums
 * @returns {object} 200 - An object of scrums info
 * @returns {Error}  default - Unexpected error
 */
function updateScrum(req,res, next) {
   var scrumData=req.body;
   var id = req.params.id;
   scrumService.getScrumById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.SCRUM_DOES_NOT_EXIST));
    }else{
      scrumService.updateScrum(id,scrumData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete scrums by id api
 * @route DELETE /api/scrums/:id
 * @group scrums - Operations about scrums
 * @returns {object} 200 - An object of scrums info
 * @returns {Error}  default - Unexpected error
 */
function deleteScrum(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  scrumService.getScrumById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.SCRUM_DOES_NOT_EXIST));
    }else{
      scrumService.deleteScrum(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get scrums count api
 * @route GET /api/scrums/count
 * @group scrums - Operations about scrums
 * @returns {object} 200 - An object of scrums info
 * @returns {Error}  default - Unexpected error
 */
function getAllScrumsCount(req,res,next) {
  scrumService.getAllScrumsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.SCRUM_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of scrums api
 * @route GET /api/scrums/overview
 * @group scrums - Operations about scrums
 * @returns {object} 200 - An object of scrums info
 * @returns {Error}  default - Unexpected error
 */
function getAllScrumsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  scrumService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * @route POST /api/scrums/notes
 * @group scrums - CREATE NEW NOTE with SCRUM ID
 */
async function createNotesWithScrumID( req, res, next ){
  let scrumnotes = req.body;
  try{
    // CHECK VALIDATION SCHEMA FOR NOTES
    var json_format = iValidator.json_schema(noteschema.postSchema, scrumnotes, "ScrumsNotes");
    if (json_format.valid == false) {
      return res.status(422).send(json_format.errorMessage);
    } else {
      // CHECK IF SCRUM EXISTS
      let isExist = await scrumService.getScrumByQuery({ _id : scrumnotes.scrumId });
      if( isExist ){
        let scurm_notes = await scrumNoteService.createScrumNotesByScrumId( scrumnotes );
        return res.json( scurm_notes );
      } else {
        return next(errorMethods.sendBadRequest(errorCode.SCRUM_DOES_NOT_EXIST));
      }
    }
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  }
}

/**
 * @route POST /api/scrums/notes/get
 * @group scrums - GET NEW NOTE with SCRUM ID
 */
async function getAllNotesWithScrumID( req, res, next ){
  try{
    let query = req.body.query;
    if( query === undefined ){
      query = {};
    }
    let all_notes = await scrumNoteService.getAllScrumNotesByScrumId( query );
    return res.json( all_notes );
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  }
}

/**
 * @route PUT /api/scrums/notes/:id
 * @group scrums - UPDATE NEW NOTE with SCRUM ID
 */
async function updateNotes( req, res, next ) {
  let scrumnotes = req.body;
  let id = req.query.id;
  try{
    // CHECK VALIDATION SCHEMA FOR NOTES
    var json_format = iValidator.json_schema(noteschema.postSchema, scrumnotes, "ScrumsNotes");
    if (json_format.valid == false) {
      return res.status(422).send(json_format.errorMessage);
    } else {
      // CHECK IF SCRUM EXISTS
      let isExist = await scrumService.getScrumByQuery({ _id : scrumnotes.scrumId });
      if( isExist ){
        let scurm_notes = await scrumNoteService.updateScrumNotes( scrumnotes._id, scrumnotes );
        return res.json( scurm_notes );
      } else {
        return next(errorMethods.sendBadRequest(errorCode.SCRUM_DOES_NOT_EXIST));
      }
    }
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  }
}

/**
 * @route DELETE /api/scrums/notes/:id
 * @group scrums - DELETE NEW NOTE with SCRUM ID
 */
async function deleteNotes( req, res, next ){
  try{
    let id = req.params.id;
    if( id === undefined || id === "" ){
      return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
    }
    let all_notes = await scrumNoteService.deleteScrumNotes( id );
    return res.json({success : true});
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  }
}  

/*
text search function
*/

function textSearch(req, res, next) {
  let text = req.query.text;
  scrumService.textSearch(text).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


module.exports.init = init;