const taskService = require('../services/task.service');
var schema = require('../schemas/task.validation.schema.json')
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
  router.route('/tasks')
    .get(getAllTasks)
    .post(addTask);
  router.route('/tasks/count')
    .get(getAllTasksCount);
  router.route('/tasks/overview')
    .get(getAllTasksOverview);
  router.route('/tasks/summaryTab')
    .get(summaryTab);
  router.route('/tasks/priorityDist')
    .get(priorityDist);
  router.route('/tasks/impPerProj')
    .get(impPerProj);
  router.route('/tasks/hrsLog')
    .get(hrsLog);
  router.route('/tasks/projectTaskStatusReport')
    .get(projectTaskStatusReport);
  router.route('/tasks/projectTaskCompletionStatus')
    .get(projectTaskCompletionStatus);
  router.route('/tasks/taskCompletionByWeeks')
    .get(taskCompletionByWeeks);
  router.route('/tasks/totalTasksThisMonth')
    .get(totalTasksThisMonth);
  router.route('/tasks/countByProject')
    .get(tasksCountByProject)
  router.route('/tasks/tasksGrouping/:id')
    .get(tasksGrouping);
  router.route('/tasks/tasksProgress/:id')
    .get(tasksProgress);
  router.route('/tasks/:id')
    .get(getTaskById)
    .delete(deleteTask)
    .put(updateTask);
  router.route('/tasks/search')
    .post(searchTasks);
  router.route('/tasks/search/text')
    .get(textSearch);
  router.route('/tasks/overview/:id')
    .get(getTaskOverviewByProjectId)
  router.route('/tasks/scheduleindicator/:id')
    .get( onScheduleIndicator );
  router.route('/tasks/exist')
    .post(isExist);
}

/**
 * Get all a tasks api
 * @route GET /api/tasks
 * @group tasks - Operations about tasks
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function getAllTasks(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
 if (pageNo > 0 && pageSize > 0 && !isNaN(pageSize)) {
    if (sortBy != null || sortBy != undefined) {
      taskService.getTasksByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      taskService.getTasksByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    taskService.getAllTasks().then((data) => {
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
 * Search tasks api
 * @route POST /api/tasks/search
 * @group tasks - Operations about tasks
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function searchTasks(req, res, next) {
  let searchCriteria = req.body;
  taskService.searchTasks(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get tasks by id api
 * @route GET /api/tasks/:id
 * @group tasks - Operations about tasks
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function getTaskById(req,res,next) {

  let taskId = req.params.id;

  console.log("id"+ taskId);
  var json_format = iValidator.json_schema(schema.getSchema,taskId,"task");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  taskService.getTaskById(taskId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.TASK_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add tasks api
 * @route POST /api/tasks
 * @group tasks - Operations about tasks
 * @param {object} task.body.required - tasks details
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function addTask(req,res, next) {
  var taskData=req.body;
  
  console.log("reached here")
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, taskData, "task");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   console.log("reached here 1")
   taskService.getTaskByTaskName(taskData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.TASK_ALREADY_EXISTS));
    }else{
      console.log("reached here 2")
      taskService.addTask(taskData, next).then((data) => {
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
 * update tasks by id api
 * @route PUT /api/tasks
 * @group tasks - Operations about tasks
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function updateTask(req,res, next) {
   var taskData=req.body;
   var id = req.params.id;
   taskService.getTaskById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.TASK_DOES_NOT_EXIST));
    }else{
      let activityData = {
        "entityType":"TASK",
        "activityType":"UPDATE",
        "projectId":data.project
    };
      if( data.status !== taskData.status ){
        activityData.text = "Task "+ data.name +" was changed from "+data.status+" to "+taskData.status;
      } else {
        activityData.text = "Task "+ data.name +" was updated";
      }
      taskService.updateTask(id,taskData, activityData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete tasks by id api
 * @route DELETE /api/tasks/:id
 * @group tasks - Operations about tasks
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function deleteTask(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  taskService.getTaskById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.TASK_DOES_NOT_EXIST));
    }else{
      taskService.deleteTask(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get tasks count api
 * @route GET /api/tasks/count
 * @group tasks - Operations about tasks
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function getAllTasksCount(req,res,next) {
  taskService.getAllTasksCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.TASK_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of tasks api
 * @route GET /api/tasks/overview
 * @group tasks - Operations about tasks
 * @returns {object} 200 - An object of tasks info
 * @returns {Error}  default - Unexpected error
 */
function getAllTasksOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  taskService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/*
text search function
*/

function textSearch(req, res, next) {
  let text = req.query.text;
  taskService.textSearch(text).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * GET TASK OVERVIEW BY PROJECT ID
 * @route GET /tasks/overview/:id
 */

function getTaskOverviewByProjectId( req, res, next ){
  let projectId = req.params.id;
  console.log("hellozzz")
   if( projectId === undefined && projectId === "" ){
    next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
   } else {
      taskService.getTaskOverviewByProjectId( projectId )
        .then( data => {
          return res.json( data );
        })
        .catch( err =>  next(errorMethods.sendServerError(err)))
   }
}

function onScheduleIndicator( req, res, next ){
  let projectid = req.params.id;
  if( projectid === undefined && projectid === "" ){
    next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
   } else {
    taskService.getTaskScheduleIndicator( projectid )
    .then( data => {
      return res.json( data );
    })
    .catch( err =>  next(errorMethods.sendServerError(err)))
  }
}



/**
 * GET PROJECT TASK STATUS REPORT IN DASHBOARD API
 * 
 */
function projectTaskStatusReport(req, res, next) {
  taskService.projectTaskStatusReport().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * GET PROJECT TASK COMPLETION REPORT IN DASHBOARD API
 * 
 */
function projectTaskCompletionStatus(req, res, next) {
  taskService.projectTaskCompletionStatus().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * TASK COMPLETION BY WEEKS
 * 
 */
function taskCompletionByWeeks(req, res, next) {
  projectId = req.query.project
  taskService.taskWeeks(projectId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

//total tasks this month

function totalTasksThisMonth(req,res,next){
  let startDate = req.query.from;
  let endDate = req.query.to;
  taskService.totalTasksThisMonth(startDate, endDate).then((data)=>{
    res.json(data);
  }).catch((err)=>{
    next(errorMethods.sendServerError(err));
  });
}

function summaryTab(req,res,next){

  taskService.summaryTab().then((data)=>{
    res.json(data);
  }).catch((err)=>{
    next(errorMethods.sendServerError(err));
  });
}

function priorityDist(req,res,next){
  taskService.priorityDist().then((data)=>{
    res.json(data);
  }).catch((err)=>{
    next(errorMethods.sendServerError(err));
  });
}

function impPerProj(req,res,next){
  taskService.impPerProj().then((data)=>{
    res.json(data);
  }).catch((err)=>{
    next(errorMethods.sendServerError(err));
  });
}

function hrsLog(req,res,next){
  taskService.hrsLog().then((data)=>{
    res.json(data);
  }).catch((err)=>{
    next(errorMethods.sendServerError(err));
  });
}

function tasksCountByProject(req,res,next){
  taskService.tasksCountByProject().then((data)=>{
    res.json(data);
  }).catch((err)=>{
    next(errorMethods.sendServerError(err));
  });
}

function tasksGrouping(req,res,next){
  projectId = req.params.id;
  taskService.tasksGrouping(projectId).then((data)=>{
    res.json(data);
  }).catch((err)=>{
    next(errorMethods.sendServerError(err));
  });
}

function tasksProgress(req,res,next){
  projectId = req.params.id;
  taskService.tasksProgress(projectId).then((data)=>{
    res.json(data);
  }).catch((err)=>{
    next(errorMethods.sendServerError(err));
  });
}

function isExist(req, res, next){
  let project = req.body.project;
  let taskName = req.body.taskName;
  taskService.exists(project, taskName).then((data) => {
    res.send(data)
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;