const worklogService = require('../services/worklog.service');
var schema = require('../schemas/worklog.validation.schema.json')
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
  router.route('/worklogs')
    .get(getAllWorklogs)
    .post(addWorklog);
  router.route('/worklogs/count')
    .get(getAllWorklogsCount);
  router.route('/worklogs/overview')
    .get(getAllWorklogsOverview);
  router.route('/worklogs/search')
    .post(searchWorklogs);
  router.route('/worklogs/weeklytimesheet')
    .post(weekTS)
  router.route('/worklogs/total/:id')
    .get(getTotalHours);
  router.route('/worklogs/:id')
    .get(getWorklogById)
    .delete(deleteWorklog)
    .put(updateWorklog);
  router.route('/worklogs/hours')
    .post(getHoursWithUserAndSchedule);
}

/**
 * Get all a worklogs api
 * @route GET /api/worklogs
 * @group worklogs - Operations about worklogs
 * @returns {object} 200 - An object of worklogs info
 * @returns {Error}  default - Unexpected error
 */
function getAllWorklogs(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      worklogService.getWorklogsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      worklogService.getWorklogsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    worklogService.getAllWorklogs().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
  }
}

/**
 * Get worklogs by id api
 * @route GET /api/worklogs/:id
 * @group worklogs - Operations about worklogs
 * @returns {object} 200 - An object of worklogs info
 * @returns {Error}  default - Unexpected error
 */
function getWorklogById(req,res,next) {

  let worklogId = req.params.id;

  console.log("id"+ worklogId);
  var json_format = iValidator.json_schema(schema.getSchema,worklogId,"worklog");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  worklogService.getWorklogById(worklogId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.WORKLOG_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * Get total hours by userid api
 * @route GET /api/worklogs/total/:userid
 * @group worklogs - Operations about worklogs
 * @returns {object} 200 - An object of worklogs info
 * @returns {Error}  default - Unexpected error
 */
function getTotalHours(req,res,next) {

  let userId = req.params.id;

  console.log("id"+ userId);
  // var json_format = iValidator.json_schema(schema.getSchema,worklogId,"worklog");
  // if (json_format.valid == false) {
  //   return res.status(422).send(json_format.errorMessage);
  // }
  worklogService.getTotalHours(userId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.WORKLOG_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add worklogs api
 * @route POST /api/worklogs
 * @group worklogs - Operations about worklogs
 * @param {object} worklogData.body.required - worklogs details
 * @returns {object} 200 - An object of worklogs info
 * @returns {Error}  default - Unexpected error
 */
function addWorklog(req,res, next) {
  var worklogData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, worklogData, "worklog");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   worklogService.getWorklogByWorklogName(worklogData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.WORKLOG_ALREADY_EXIST));
    }else{
      worklogService.addWorklog(worklogData).then((data) => {
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
 * update worklogs by id api
 * @route PUT /api/worklogs
 * @group worklogs - Operations about worklogs
 * @returns {object} 200 - An object of worklogs info
 * @returns {Error}  default - Unexpected error
 */
function updateWorklog(req,res, next) {
   var worklogData=req.body;
   var id = req.params.id;
   worklogService.getWorklogById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WORKLOG_NOT_EXIST));
    }else{
      worklogService.updateWorklog(id,worklogData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete worklogs by id api
 * @route DELETE /api/worklogs/:id
 * @group worklogs - Operations about worklogs
 * @returns {object} 200 - An object of worklogs info
 * @returns {Error}  default - Unexpected error
 */
function deleteWorklog(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  worklogService.getWorklogById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WORKLOG_NOT_EXIST));
    }else{
      worklogService.deleteWorklog(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get worklogs count api
 * @route GET /api/worklogs/count
 * @group worklogs - Operations about worklogs
 * @returns {object} 200 - An object of worklogs info
 * @returns {Error}  default - Unexpected error
 */
function getAllWorklogsCount(req,res,next) {
  worklogService.getAllWorklogsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.WORKLOG_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}


function getHoursWithUserAndSchedule(req,res,next){
  var userId=req.body.user;
  var scheduleId=req.body.schedule;
  worklogService.getHoursWithUserAndSchedule(userId, scheduleId).then((data) => {
    if(data == undefined){
      return next(errorMethods.sendBadRequest(errorCode.WORKLOG_NOT_EXIST));
    }
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * get worklogs of quotations api
 * @route GET /api/worklogs/overview
 * @group worklogs - Operations about worklogs
 * @returns {object} 200 - An object of worklogs info
 * @returns {Error}  default - Unexpected error
 */
function getAllWorklogsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  worklogService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function searchWorklogs(req, res, next) {
  let searchCriteria = req.body;
  worklogService.searchWorklogs(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function weekTS(req, res, next) {
  let startDate = req.body.startDate, endDate = req.body.endDate, member = req.body.member;

  worklogService.weekTS(startDate, endDate, member).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;