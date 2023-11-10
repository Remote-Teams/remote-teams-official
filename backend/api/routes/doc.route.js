const docService = require('../services/doc.service');
const taskService = require('../services/task.service');
var schema = require('../schemas/doc.validation.schema.json')
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
  router.route('/docs')
    .get(getAllDocs)
    .post(addDoc);
  router.route('/docs/count')
    .get(getAllDocsCount);
  router.route('/docs/overview')
    .get(getAllDocsOverview);
  router.route('/docs/exist')
    .post(isExist);
  router.route('/docs/:id')
    .get(getDocById)
    .delete(deleteDoc)
    .put(updateDoc);
  router.route('/docs/search')
    .post(searchDocs);
}

/**
 * Get all a docs api
 * @route GET /api/docs
 * @group docs - Operations about docs
 * @returns {object} 200 - An object of docs info
 * @returns {Error}  default - Unexpected error
 */
function getAllDocs(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
 if (pageNo > 0 && pageSize > 0 && !isNaN(pageSize)) {
    if (sortBy != null || sortBy != undefined) {
      docService.getDocsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      docService.getDocsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    docService.getAllDocs().then((data) => {
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
 * Search docs api
 * @route POST /api/docs/search
 * @group docs - Operations about docs
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of docs info
 * @returns {Error}  default - Unexpected error
 */
function searchDocs(req, res, next) {
  let searchCriteria = req.body;
  docService.searchDocs(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get docs by id api
 * @route GET /api/docs/:id
 * @group docs - Operations about docs
 * @returns {object} 200 - An object of docs info
 * @returns {Error}  default - Unexpected error
 */
function getDocById(req,res,next) {

  let docId = req.params.id;

  console.log("id"+ docId);
  var json_format = iValidator.json_schema(schema.getSchema,docId,"doc");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  docService.getDocById(docId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.DOC_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add docs api
 * @route POST /api/docs
 * @group docs - Operations about docs
 * @param {object} doc.body.required - docs details
 * @returns {object} 200 - An object of docs info
 * @returns {Error}  default - Unexpected error
 */
async function addDoc(req,res, next) {
  try{
  var docData=req.body;
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, docData, "doc");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   var data = await docService.exists(docData.project, docData.name)
    if(data.isExist == true){
      return next(errorMethods.sendBadRequest(errorCode.DOC_ALREADY_EXISTS_FOR_PROJECT));
    }else{
      var response = await docService.addDoc(docData)
        res.json(response);
    }
  }
  catch(err){ next(errorMethods.sendServerError(err))}

}

/**
 * update docs by id api
 * @route PUT /api/docs
 * @group docs - Operations about docs
 * @returns {object} 200 - An object of docs info
 * @returns {Error}  default - Unexpected error
 */
function updateDoc(req,res, next) {
   var docData=req.body;
   var id = req.params.id;
   docService.getDocById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.DOC_DOES_NOT_EXIST));
    }else{
      docService.updateDoc(id,docData,next).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete docs by id api
 * @route DELETE /api/docs/:id
 * @group docs - Operations about docs
 * @returns {object} 200 - An object of docs info
 * @returns {Error}  default - Unexpected error
 */
function deleteDoc(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  docService.getDocById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.DOC_DOES_NOT_EXIST));
    }else{
      docService.deleteDoc(delId, next).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get docs count api
 * @route GET /api/docs/count
 * @group docs - Operations about docs
 * @returns {object} 200 - An object of docs info
 * @returns {Error}  default - Unexpected error
 */
function getAllDocsCount(req,res,next) {
  docService.getAllDocsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.DOC_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of docs api
 * @route GET /api/docs/overview
 * @group docs - Operations about docs
 * @returns {object} 200 - An object of docs info
 * @returns {Error}  default - Unexpected error
 */
function getAllDocsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  docService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is pipelines exist api
 * @route GET /api/pipelines/exist
 * @group pipelines - Operations about pipelines
 * @param {string} pipelinename.query.required - pipelines name
 * @returns {object} 200 - An object of pipelines info
 * @returns {Error}  default - Unexpected error
 */
 function isExist(req, res, next){
  let project = req.body.project;
  let name = req.body.name;
  docService.exists(project, name).then((data) => {
    res.send(data)
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


module.exports.init = init;