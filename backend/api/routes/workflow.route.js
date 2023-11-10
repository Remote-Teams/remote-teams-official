const workflowService = require('../services/workflow.service');
const taskService = require('../services/task.service');
var schema = require('../schemas/workflow.validation.schema.json')
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
  router.route('/workflows')
    .get(getAllWorkflows)
    .post(addWorkflow);
  router.route('/workflows/count')
    .get(getAllWorkflowsCount);
  router.route('/workflows/overview')
    .get(getAllWorkflowsOverview);
  router.route('/workflows/exist')
    .post(isExist);
  router.route('/workflows/kanban/:id')
    .get(kanban)
  router.route('/workflows/tasksExistInWorkflow/:id')
    .get(taskExist)
  router.route('/workflows/:id')
    .get(getWorkflowById)
    .delete(deleteWorkflow)
    .put(updateWorkflow);
  router.route('/workflows/search')
    .post(searchWorkflows);
}

/**
 * Get all a workflows api
 * @route GET /api/workflows
 * @group workflows - Operations about workflows
 * @returns {object} 200 - An object of workflows info
 * @returns {Error}  default - Unexpected error
 */
function getAllWorkflows(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
 if (pageNo > 0 && pageSize > 0 && !isNaN(pageSize)) {
    if (sortBy != null || sortBy != undefined) {
      workflowService.getWorkflowsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      workflowService.getWorkflowsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    workflowService.getAllWorkflows().then((data) => {
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
 * Search workflows api
 * @route POST /api/workflows/search
 * @group workflows - Operations about workflows
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of workflows info
 * @returns {Error}  default - Unexpected error
 */
function searchWorkflows(req, res, next) {
  let searchCriteria = req.body;
  workflowService.searchWorkflows(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get workflows by id api
 * @route GET /api/workflows/:id
 * @group workflows - Operations about workflows
 * @returns {object} 200 - An object of workflows info
 * @returns {Error}  default - Unexpected error
 */
function getWorkflowById(req,res,next) {

  let workflowId = req.params.id;

  console.log("id"+ workflowId);
  var json_format = iValidator.json_schema(schema.getSchema,workflowId,"workflow");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  workflowService.getWorkflowById(workflowId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.WORKFLOW_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add workflows api
 * @route POST /api/workflows
 * @group workflows - Operations about workflows
 * @param {object} workflow.body.required - workflows details
 * @returns {object} 200 - An object of workflows info
 * @returns {Error}  default - Unexpected error
 */
async function addWorkflow(req,res, next) {
  try{
  var workflowData=req.body;
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, workflowData, "workflow");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   var data = await workflowService.exists(workflowData.name)
    if(data.isExist == true){
      return next(errorMethods.sendBadRequest(errorCode.WORKFLOW_ALREADY_EXISTS));
    }else{
      var response = await workflowService.addWorkflow(workflowData)
        res.json(response);
      
    }
  }
  catch(err){ next(errorMethods.sendServerError(err))}

}

/**
 * update workflows by id api
 * @route PUT /api/workflows
 * @group workflows - Operations about workflows
 * @returns {object} 200 - An object of workflows info
 * @returns {Error}  default - Unexpected error
 */
function updateWorkflow(req,res, next) {
   var workflowData=req.body;
   var id = req.params.id;
   workflowService.getWorkflowById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WORKFLOW_DOES_NOT_EXIST));
    }else{
      workflowService.updateWorkflow(id,workflowData,next).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete workflows by id api
 * @route DELETE /api/workflows/:id
 * @group workflows - Operations about workflows
 * @returns {object} 200 - An object of workflows info
 * @returns {Error}  default - Unexpected error
 */
function deleteWorkflow(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  workflowService.getWorkflowById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WORKFLOW_DOES_NOT_EXIST));
    }else{
      workflowService.deleteWorkflow(delId, next).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get workflows count api
 * @route GET /api/workflows/count
 * @group workflows - Operations about workflows
 * @returns {object} 200 - An object of workflows info
 * @returns {Error}  default - Unexpected error
 */
function getAllWorkflowsCount(req,res,next) {
  workflowService.getAllWorkflowsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.WORKFLOW_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of workflows api
 * @route GET /api/workflows/overview
 * @group workflows - Operations about workflows
 * @returns {object} 200 - An object of workflows info
 * @returns {Error}  default - Unexpected error
 */
function getAllWorkflowsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  workflowService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
  workflowService.exists(project, name).then((data) => {
    res.send(data)
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


function taskExist(req, res, next){
  query = {
    query:{
    "workflow":req.params.id
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
  workflowService.kanban(projectId).then((data) => {
    res.send(data)
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;