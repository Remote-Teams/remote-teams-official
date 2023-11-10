const wsubtaskService = require('../services/wsubtask.service');
const taskService = require('../services/task.service');
var schema = require('../schemas/wsubtask.validation.schema.json')
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
  router.route('/wsubtasks')
    .get(getAllWsubtasks)
    .post(addWsubtask);
  router.route('/wsubtasks/count')
    .get(getAllWsubtasksCount);
  router.route('/wsubtasks/overview')
    .get(getAllWsubtasksOverview);
  router.route('/wsubtasks/exist')
    .post(isExist);
  router.route('/wsubtasks/tasksExistInWsubtask/:id')
    .get(taskExist)
  router.route('/wsubtasks/:id')
    .get(getWsubtaskById)
    .delete(deleteWsubtask)
    .put(updateWsubtask);
  router.route('/wsubtasks/search')
    .post(searchWsubtasks);
}

/**
 * Get all a wsubtasks api
 * @route GET /api/wsubtasks
 * @group wsubtasks - Operations about wsubtasks
 * @returns {object} 200 - An object of wsubtasks info
 * @returns {Error}  default - Unexpected error
 */
function getAllWsubtasks(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
 if (pageNo > 0 && pageSize > 0 && !isNaN(pageSize)) {
    if (sortBy != null || sortBy != undefined) {
      wsubtaskService.getWsubtasksByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      wsubtaskService.getWsubtasksByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    wsubtaskService.getAllWsubtasks().then((data) => {
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
 * Search wsubtasks api
 * @route POST /api/wsubtasks/search
 * @group wsubtasks - Operations about wsubtasks
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of wsubtasks info
 * @returns {Error}  default - Unexpected error
 */
function searchWsubtasks(req, res, next) {
  let searchCriteria = req.body;
  wsubtaskService.searchWsubtasks(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get wsubtasks by id api
 * @route GET /api/wsubtasks/:id
 * @group wsubtasks - Operations about wsubtasks
 * @returns {object} 200 - An object of wsubtasks info
 * @returns {Error}  default - Unexpected error
 */
function getWsubtaskById(req,res,next) {

  let wsubtaskId = req.params.id;

  console.log("id"+ wsubtaskId);
  var json_format = iValidator.json_schema(schema.getSchema,wsubtaskId,"wsubtask");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  wsubtaskService.getWsubtaskById(wsubtaskId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.WSUBTASK_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add wsubtasks api
 * @route POST /api/wsubtasks
 * @group wsubtasks - Operations about wsubtasks
 * @param {object} wsubtask.body.required - wsubtasks details
 * @returns {object} 200 - An object of wsubtasks info
 * @returns {Error}  default - Unexpected error
 */
async function addWsubtask(req,res, next) {
  try{
  var wsubtaskData=req.body;
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, wsubtaskData, "wsubtask");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   var data = await wsubtaskService.exists(wsubtaskData.wtask, wsubtaskData.name)
    if(data.isExist == true){
      return next(errorMethods.sendBadRequest(errorCode.WSUBTASK_ALREADY_EXISTS_FOR_WTASK));
    }else{
      var response = await wsubtaskService.addWsubtask(wsubtaskData)
        res.json(response);
      
    }
  }
  catch(err){ next(errorMethods.sendServerError(err))}

}

/**
 * update wsubtasks by id api
 * @route PUT /api/wsubtasks
 * @group wsubtasks - Operations about wsubtasks
 * @returns {object} 200 - An object of wsubtasks info
 * @returns {Error}  default - Unexpected error
 */
function updateWsubtask(req,res, next) {
   var wsubtaskData=req.body;
   var id = req.params.id;
   wsubtaskService.getWsubtaskById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WSUBTASK_DOES_NOT_EXIST));
    }else{
      wsubtaskService.updateWsubtask(id,wsubtaskData,next).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete wsubtasks by id api
 * @route DELETE /api/wsubtasks/:id
 * @group wsubtasks - Operations about wsubtasks
 * @returns {object} 200 - An object of wsubtasks info
 * @returns {Error}  default - Unexpected error
 */
function deleteWsubtask(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  wsubtaskService.getWsubtaskById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WSUBTASK_DOES_NOT_EXIST));
    }else{
      wsubtaskService.deleteWsubtask(delId, next).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get wsubtasks count api
 * @route GET /api/wsubtasks/count
 * @group wsubtasks - Operations about wsubtasks
 * @returns {object} 200 - An object of wsubtasks info
 * @returns {Error}  default - Unexpected error
 */
function getAllWsubtasksCount(req,res,next) {
  wsubtaskService.getAllWsubtasksCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.WSUBTASK_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of wsubtasks api
 * @route GET /api/wsubtasks/overview
 * @group wsubtasks - Operations about wsubtasks
 * @returns {object} 200 - An object of wsubtasks info
 * @returns {Error}  default - Unexpected error
 */
function getAllWsubtasksOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  wsubtaskService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
  wsubtaskService.exists(project, name).then((data) => {
    res.send(data)
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


function taskExist(req, res, next){
  query = {
    query:{
    "wsubtask":req.params.id
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