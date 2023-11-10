const wstepService = require('../services/wstep.service');
const taskService = require('../services/task.service');
var schema = require('../schemas/wstep.validation.schema.json')
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
  router.route('/wsteps')
    .get(getAllWsteps)
    .post(addWstep);
  router.route('/wsteps/count')
    .get(getAllWstepsCount);
  router.route('/wsteps/overview')
    .get(getAllWstepsOverview);
  router.route('/wsteps/exist')
    .post(isExist);
  router.route('/wsteps/tasksExistInWstep/:id')
    .get(taskExist)
  router.route('/wsteps/:id')
    .get(getWstepById)
    .delete(deleteWstep)
    .put(updateWstep);
  router.route('/wsteps/search')
    .post(searchWsteps);
}

/**
 * Get all a wsteps api
 * @route GET /api/wsteps
 * @group wsteps - Operations about wsteps
 * @returns {object} 200 - An object of wsteps info
 * @returns {Error}  default - Unexpected error
 */
function getAllWsteps(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
 if (pageNo > 0 && pageSize > 0 && !isNaN(pageSize)) {
    if (sortBy != null || sortBy != undefined) {
      wstepService.getWstepsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      wstepService.getWstepsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    wstepService.getAllWsteps().then((data) => {
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
 * Search wsteps api
 * @route POST /api/wsteps/search
 * @group wsteps - Operations about wsteps
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of wsteps info
 * @returns {Error}  default - Unexpected error
 */
function searchWsteps(req, res, next) {
  let searchCriteria = req.body;
  wstepService.searchWsteps(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get wsteps by id api
 * @route GET /api/wsteps/:id
 * @group wsteps - Operations about wsteps
 * @returns {object} 200 - An object of wsteps info
 * @returns {Error}  default - Unexpected error
 */
function getWstepById(req,res,next) {

  let wstepId = req.params.id;

  console.log("id"+ wstepId);
  var json_format = iValidator.json_schema(schema.getSchema,wstepId,"wstep");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  wstepService.getWstepById(wstepId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.WSTEP_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add wsteps api
 * @route POST /api/wsteps
 * @group wsteps - Operations about wsteps
 * @param {object} wstep.body.required - wsteps details
 * @returns {object} 200 - An object of wsteps info
 * @returns {Error}  default - Unexpected error
 */
async function addWstep(req,res, next) {
  try{
  var wstepData=req.body;
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, wstepData, "wstep");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   var data = await wstepService.exists(wstepData.workflow, wstepData.name)
    if(data.isExist == true){
      return next(errorMethods.sendBadRequest(errorCode.WSTEP_ALREADY_EXISTS_FOR_WORKFLOW));
    }else{
      var response = await wstepService.addWstep(wstepData)
        res.json(response);
    }
  }
  catch(err){ next(errorMethods.sendServerError(err))}

}

/**
 * update wsteps by id api
 * @route PUT /api/wsteps
 * @group wsteps - Operations about wsteps
 * @returns {object} 200 - An object of wsteps info
 * @returns {Error}  default - Unexpected error
 */
function updateWstep(req,res, next) {
   var wstepData=req.body;
   var id = req.params.id;
   wstepService.getWstepById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WSTEP_DOES_NOT_EXIST));
    }else{
      wstepService.updateWstep(id,wstepData,next).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete wsteps by id api
 * @route DELETE /api/wsteps/:id
 * @group wsteps - Operations about wsteps
 * @returns {object} 200 - An object of wsteps info
 * @returns {Error}  default - Unexpected error
 */
function deleteWstep(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  wstepService.getWstepById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WSTEP_DOES_NOT_EXIST));
    }else{
      wstepService.deleteWstep(delId, next).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get wsteps count api
 * @route GET /api/wsteps/count
 * @group wsteps - Operations about wsteps
 * @returns {object} 200 - An object of wsteps info
 * @returns {Error}  default - Unexpected error
 */
function getAllWstepsCount(req,res,next) {
  wstepService.getAllWstepsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.WSTEP_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of wsteps api
 * @route GET /api/wsteps/overview
 * @group wsteps - Operations about wsteps
 * @returns {object} 200 - An object of wsteps info
 * @returns {Error}  default - Unexpected error
 */
function getAllWstepsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  wstepService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
  wstepService.exists(project, name).then((data) => {
    res.send(data)
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


function taskExist(req, res, next){
  query = {
    query:{
    "wstep":req.params.id
    }
  }
  taskService.searchTasks(query).then((data) => {
    if(data == undefined || data.length == 0){
      res.send('false');
    }else{
      res.send('true')
    }
   
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;