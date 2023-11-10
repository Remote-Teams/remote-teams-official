const winstanceService = require('../services/winstance.service');
const taskService = require('../services/task.service');
var schema = require('../schemas/winstance.validation.schema.json')
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
  router.route('/winstances')
    .get(getAllWinstances)
    .post(addWinstance);
  router.route('/winstances/count')
    .get(getAllWinstancesCount);
  router.route('/winstances/overview')
    .get(getAllWinstancesOverview);
  router.route('/winstances/exist')
    .post(isExist);
  router.route('/winstances/kanban/:id')
    .get(kanban)
  router.route('/winstances/tasksExistInWinstance/:id')
    .get(taskExist)
  router.route('/winstances/:id')
    .get(getWinstanceById)
    .delete(deleteWinstance)
    .put(updateWinstance);
  router.route('/winstances/search')
    .post(searchWinstances);
}

/**
 * Get all a winstances api
 * @route GET /api/winstances
 * @group winstances - Operations about winstances
 * @returns {object} 200 - An object of winstances info
 * @returns {Error}  default - Unexpected error
 */
function getAllWinstances(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
 if (pageNo > 0 && pageSize > 0 && !isNaN(pageSize)) {
    if (sortBy != null || sortBy != undefined) {
      winstanceService.getWinstancesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      winstanceService.getWinstancesByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    winstanceService.getAllWinstances().then((data) => {
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
 * Search winstances api
 * @route POST /api/winstances/search
 * @group winstances - Operations about winstances
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of winstances info
 * @returns {Error}  default - Unexpected error
 */
function searchWinstances(req, res, next) {
  let searchCriteria = req.body;
  winstanceService.searchWinstances(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get winstances by id api
 * @route GET /api/winstances/:id
 * @group winstances - Operations about winstances
 * @returns {object} 200 - An object of winstances info
 * @returns {Error}  default - Unexpected error
 */
function getWinstanceById(req,res,next) {

  let winstanceId = req.params.id;

  console.log("id"+ winstanceId);
  var json_format = iValidator.json_schema(schema.getSchema,winstanceId,"winstance");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  winstanceService.getWinstanceById(winstanceId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.WINSTANCE_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add winstances api
 * @route POST /api/winstances
 * @group winstances - Operations about winstances
 * @param {object} winstance.body.required - winstances details
 * @returns {object} 200 - An object of winstances info
 * @returns {Error}  default - Unexpected error
 */
async function addWinstance(req,res, next) {
  try{
  var winstanceData=req.body;
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, winstanceData, "winstance");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
  //  var data = await winstanceService.exists(winstanceData.project, winstanceData.name)
  //  console.log(data)
  //   if(data.isExist == true){
  //     return next(errorMethods.sendBadRequest(errorCode.WINSTANCE_ALREADY_EXISTS));
  //   }else{
      var response = await winstanceService.addWinstance(winstanceData)
        res.json(response);
      
    //}
  }
  catch(err){ next(errorMethods.sendServerError(err))}

}

/**
 * update winstances by id api
 * @route PUT /api/winstances
 * @group winstances - Operations about winstances
 * @returns {object} 200 - An object of winstances info
 * @returns {Error}  default - Unexpected error
 */
function updateWinstance(req,res, next) {
   var winstanceData=req.body;
   var id = req.params.id;
   winstanceService.getWinstanceById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WINSTANCE_DOES_NOT_EXIST));
    }else{
      winstanceService.updateWinstance(id,winstanceData,next).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete winstances by id api
 * @route DELETE /api/winstances/:id
 * @group winstances - Operations about winstances
 * @returns {object} 200 - An object of winstances info
 * @returns {Error}  default - Unexpected error
 */
function deleteWinstance(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  winstanceService.getWinstanceById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WINSTANCE_DOES_NOT_EXIST));
    }else{
      winstanceService.deleteWinstance(delId, next).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get winstances count api
 * @route GET /api/winstances/count
 * @group winstances - Operations about winstances
 * @returns {object} 200 - An object of winstances info
 * @returns {Error}  default - Unexpected error
 */
function getAllWinstancesCount(req,res,next) {
  winstanceService.getAllWinstancesCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.WINSTANCE_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of winstances api
 * @route GET /api/winstances/overview
 * @group winstances - Operations about winstances
 * @returns {object} 200 - An object of winstances info
 * @returns {Error}  default - Unexpected error
 */
function getAllWinstancesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  winstanceService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
  winstanceService.exists(project, name).then((data) => {
    res.send(data)
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


function taskExist(req, res, next){
  query = {
    query:{
    "winstance":req.params.id
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
  winstanceService.kanban(projectId).then((data) => {
    res.send(data)
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;