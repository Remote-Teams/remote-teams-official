const wtaskService = require('../services/wtask.service');
const taskService = require('../services/task.service');
var schema = require('../schemas/wtask.validation.schema.json')
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
  router.route('/wtasks')
    .get(getAllWtasks)
    .post(addWtask);
  router.route('/wtasks/count')
    .get(getAllWtasksCount);
  router.route('/wtasks/overview')
    .get(getAllWtasksOverview);
  router.route('/wtasks/exist')
    .post(isExist);
  router.route('/wtasks/tasksExistInWtask/:id')
    .get(taskExist)
  router.route('/wtasks/:id')
    .get(getWtaskById)
    .delete(deleteWtask)
    .put(updateWtask);
  router.route('/wtasks/search')
    .post(searchWtasks);
}

/**
 * Get all a wtasks api
 * @route GET /api/wtasks
 * @group wtasks - Operations about wtasks
 * @returns {object} 200 - An object of wtasks info
 * @returns {Error}  default - Unexpected error
 */
function getAllWtasks(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
 if (pageNo > 0 && pageSize > 0 && !isNaN(pageSize)) {
    if (sortBy != null || sortBy != undefined) {
      wtaskService.getWtasksByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      wtaskService.getWtasksByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    wtaskService.getAllWtasks().then((data) => {
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
 * Search wtasks api
 * @route POST /api/wtasks/search
 * @group wtasks - Operations about wtasks
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of wtasks info
 * @returns {Error}  default - Unexpected error
 */
function searchWtasks(req, res, next) {
  let searchCriteria = req.body;
  wtaskService.searchWtasks(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get wtasks by id api
 * @route GET /api/wtasks/:id
 * @group wtasks - Operations about wtasks
 * @returns {object} 200 - An object of wtasks info
 * @returns {Error}  default - Unexpected error
 */
function getWtaskById(req,res,next) {

  let wtaskId = req.params.id;

  console.log("id"+ wtaskId);
  var json_format = iValidator.json_schema(schema.getSchema,wtaskId,"wtask");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  wtaskService.getWtaskById(wtaskId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.WTASK_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add wtasks api
 * @route POST /api/wtasks
 * @group wtasks - Operations about wtasks
 * @param {object} wtask.body.required - wtasks details
 * @returns {object} 200 - An object of wtasks info
 * @returns {Error}  default - Unexpected error
 */
async function addWtask(req,res, next) {
  try{
  var wtaskData=req.body;
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, wtaskData, "wtask");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   var data = await wtaskService.exists(wtaskData.wstep, wtaskData.name)
    if(data.isExist == true){
      return next(errorMethods.sendBadRequest(errorCode.WTASK_ALREADY_EXISTS_FOR_WSTEP));
    }else{
      var response = await wtaskService.addWtask(wtaskData)
        res.json(response);
      
    }
  }
  catch(err){ next(errorMethods.sendServerError(err))}

}

/**
 * update wtasks by id api
 * @route PUT /api/wtasks
 * @group wtasks - Operations about wtasks
 * @returns {object} 200 - An object of wtasks info
 * @returns {Error}  default - Unexpected error
 */
function updateWtask(req,res, next) {
   var wtaskData=req.body;
   var id = req.params.id;
   wtaskService.getWtaskById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WTASK_DOES_NOT_EXIST));
    }else{
      wtaskService.updateWtask(id,wtaskData,next).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete wtasks by id api
 * @route DELETE /api/wtasks/:id
 * @group wtasks - Operations about wtasks
 * @returns {object} 200 - An object of wtasks info
 * @returns {Error}  default - Unexpected error
 */
function deleteWtask(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  wtaskService.getWtaskById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WTASK_DOES_NOT_EXIST));
    }else{
      wtaskService.deleteWtask(delId, next).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get wtasks count api
 * @route GET /api/wtasks/count
 * @group wtasks - Operations about wtasks
 * @returns {object} 200 - An object of wtasks info
 * @returns {Error}  default - Unexpected error
 */
function getAllWtasksCount(req,res,next) {
  wtaskService.getAllWtasksCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.WTASK_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of wtasks api
 * @route GET /api/wtasks/overview
 * @group wtasks - Operations about wtasks
 * @returns {object} 200 - An object of wtasks info
 * @returns {Error}  default - Unexpected error
 */
function getAllWtasksOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  wtaskService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
  wtaskService.exists(project, name).then((data) => {
    res.send(data)
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


function taskExist(req, res, next){
  query = {
    query:{
    "wtask":req.params.id
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