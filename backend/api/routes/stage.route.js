const stageService = require('../services/stage.service');
const taskService = require('../services/task.service');
var schema = require('../schemas/stage.validation.schema.json')
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
  router.route('/stages')
    .get(getAllStages)
    .post(addStage);
  router.route('/stages/count')
    .get(getAllStagesCount);
  router.route('/stages/overview')
    .get(getAllStagesOverview);
  router.route('/stages/exist')
    .post(isExist);
  router.route('/stages/kanban/:id')
    .get(kanban)
  router.route('/stages/tasksExistInStage/:id')
    .get(taskExist)
  router.route('/stages/:id')
    .get(getStageById)
    .delete(deleteStage)
    .put(updateStage);
  router.route('/stages/search')
    .post(searchStages);
}

/**
 * Get all a stages api
 * @route GET /api/stages
 * @group stages - Operations about stages
 * @returns {object} 200 - An object of stages info
 * @returns {Error}  default - Unexpected error
 */
function getAllStages(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
 if (pageNo > 0 && pageSize > 0 && !isNaN(pageSize)) {
    if (sortBy != null || sortBy != undefined) {
      stageService.getStagesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      stageService.getStagesByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    stageService.getAllStages().then((data) => {
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
 * Search stages api
 * @route POST /api/stages/search
 * @group stages - Operations about stages
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of stages info
 * @returns {Error}  default - Unexpected error
 */
function searchStages(req, res, next) {
  let searchCriteria = req.body;
  stageService.searchStages(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get stages by id api
 * @route GET /api/stages/:id
 * @group stages - Operations about stages
 * @returns {object} 200 - An object of stages info
 * @returns {Error}  default - Unexpected error
 */
function getStageById(req,res,next) {

  let stageId = req.params.id;

  console.log("id"+ stageId);
  var json_format = iValidator.json_schema(schema.getSchema,stageId,"stage");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  stageService.getStageById(stageId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.STAGE_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add stages api
 * @route POST /api/stages
 * @group stages - Operations about stages
 * @param {object} stage.body.required - stages details
 * @returns {object} 200 - An object of stages info
 * @returns {Error}  default - Unexpected error
 */
async function addStage(req,res, next) {
  try{
  var stageData=req.body;
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, stageData, "stage");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   var data = await stageService.exists(stageData.project, stageData.name)
   console.log(data)
    if(data.isExist == true){
      return next(errorMethods.sendBadRequest(errorCode.STAGE_ALREADY_EXISTS_FOR_PROJECT));
    }else{
      var response = await stageService.addStage(stageData)
        res.json(response);
      
    }
  }
  catch(err){ next(errorMethods.sendServerError(err))}

}

/**
 * update stages by id api
 * @route PUT /api/stages
 * @group stages - Operations about stages
 * @returns {object} 200 - An object of stages info
 * @returns {Error}  default - Unexpected error
 */
function updateStage(req,res, next) {
   var stageData=req.body;
   var id = req.params.id;
   stageService.getStageById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.STAGE_DOES_NOT_EXIST));
    }else{
      stageService.updateStage(id,stageData,next).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete stages by id api
 * @route DELETE /api/stages/:id
 * @group stages - Operations about stages
 * @returns {object} 200 - An object of stages info
 * @returns {Error}  default - Unexpected error
 */
function deleteStage(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  stageService.getStageById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.STAGE_DOES_NOT_EXIST));
    }else{
      stageService.deleteStage(delId, next).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get stages count api
 * @route GET /api/stages/count
 * @group stages - Operations about stages
 * @returns {object} 200 - An object of stages info
 * @returns {Error}  default - Unexpected error
 */
function getAllStagesCount(req,res,next) {
  stageService.getAllStagesCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.STAGE_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of stages api
 * @route GET /api/stages/overview
 * @group stages - Operations about stages
 * @returns {object} 200 - An object of stages info
 * @returns {Error}  default - Unexpected error
 */
function getAllStagesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  stageService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
  stageService.exists(project, name).then((data) => {
    res.send(data)
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


function taskExist(req, res, next){
  query = {
    query:{
    "stage":req.params.id
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

function kanban(req, res, next){
  let projectId = req.params.id;
  stageService.kanban(projectId).then((data) => {
    res.send(data)
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;