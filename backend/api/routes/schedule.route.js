const scheduleService = require('../services/schedule.service');
var schema = require('../schemas/schedule.validation.schema.json')
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
  router.route('/schedules')
    .get(getAllSchedules)
    .post(addSchedule);
  router.route('/schedules/bulk')
    .post(bulkaddSchedule)
    .delete(bulkDeleteSchedule)
  router.route('/schedules/count')
    .get(getAllSchedulesCount);
  router.route('/schedules/timesheet')
    .get( getTimeSheetForUser );
  router.route('/schedules/todayTimesheet')
    .get(getTodayTimesheet);
  router.route('/schedules/timesheetRange')
    .get(timesheetWithRange);
  router.route('/schedules/overview')
    .get(getAllSchedulesOverview);
  router.route('/schedules/search')
    .post(searchSchedules);
  router.route('/schedules/exist')
    .get(isExist);
  router.route('/schedules/todaysTasks')
    .post(getTodaysTasks);
  router.route('/schedules/resourceSchedule')
    .get(resourceSchedule);
  router.route('/schedules/calendar')
    .post(calendar);
  router.route('/schedules/collaborators/tasks/:id')
    .get(collaborators);
  router.route('/schedules/users/:id')
    .get(getTaskByUserId);
  router.route('/schedules/projects/:id/:userid')
    .get( getTaskOverviewByProjectAndUserId);
  router.route('/schedules/:id')
    .get(getScheduleById)
    .delete(deleteSchedule)
    .put(updateSchedule);
 
}

/**
 * Get all a schedules api
 * @route GET /api/schedules
 * @group schedules - Operations about schedules
 * @returns {object} 200 - An object of schedules info
 * @returns {Error}  default - Unexpected error
 */
function getAllSchedules(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      scheduleService.getSchedulesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      scheduleService.getSchedulesByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    scheduleService.getAllSchedules().then((data) => {
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
 * Search schedules api
 * @route POST /api/schedules/search
 * @group schedules - Operations about schedules
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of schedules info
 * @returns {Error}  default - Unexpected error
 */
function searchSchedules(req, res, next) {
  let searchCriteria = req.body;
  scheduleService.searchSchedules(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get todays tasks from schedules
 * @route POST /api/schedules/todaysTasks
 * @group schedules - Operations about schedules
 * @returns {object} 200 - An object of schedules info
 * @returns {Error}  default - Unexpected error
 */

function getTodaysTasks(req, res, next) {
  let todaysDate = req.body.date;
  let userId = req.body.user;
  scheduleService.getTodaysTasks(todaysDate, userId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get schedules by id api
 * @route GET /api/schedules/:id
 * @group schedules - Operations about schedules
 * @returns {object} 200 - An object of schedules info
 * @returns {Error}  default - Unexpected error
 */
function getScheduleById(req,res,next) {

  let scheduleId = req.params.id;

  console.log("id"+ scheduleId);
  var json_format = iValidator.json_schema(schema.getSchema,scheduleId,"schedule");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  scheduleService.getScheduleById(scheduleId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add schedules api
 * @route POST /api/schedules
 * @group schedules - Operations about schedules
 * @param {object} schedule.body.required - schedules details
 * @returns {object} 200 - An object of schedules info
 * @returns {Error}  default - Unexpected error
 */
function addSchedule(req,res, next) {
  var scheduleData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, scheduleData, "schedule");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   scheduleService.getScheduleByScheduleName(scheduleData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.PROJECT_ALREADY_EXIST));
    }else{
      scheduleService.addSchedule(scheduleData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });

}

function bulkaddSchedule( req, res, next ){
  let body =  req.body;
  scheduleService.addBulkSchedule( body )
    .then( data => {
      return res.json(data);
    })
    .catch( err => {
      next(errorMethods.sendServerError(err));
    });
}

function bulkDeleteSchedule( req, res, next ){
  let group_id = req.query.id;
  if (!group_id) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  } else {
    scheduleService.deleteBulkSchedule( group_id )
    .then( data => {
      return res.json("OK");
    })
    .catch( err => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * update schedules by id api
 * @route PUT /api/schedules
 * @group schedules - Operations about schedules
 * @returns {object} 200 - An object of schedules info
 * @returns {Error}  default - Unexpected error
 */
function updateSchedule(req,res, next) {
   var scheduleData=req.body;
   var id = req.params.id;
   scheduleService.getScheduleById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
    }else{
      scheduleService.updateSchedule(id,scheduleData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete schedules by id api
 * @route DELETE /api/schedules/:id
 * @group schedules - Operations about schedules
 * @returns {object} 200 - An object of schedules info
 * @returns {Error}  default - Unexpected error
 */
function deleteSchedule(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  scheduleService.getScheduleById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
    }else{
      scheduleService.deleteSchedule(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get schedules count api
 * @route GET /api/schedules/count
 * @group schedules - Operations about schedules
 * @returns {object} 200 - An object of schedules info
 * @returns {Error}  default - Unexpected error
 */
function getAllSchedulesCount(req,res,next) {
  scheduleService.getAllSchedulesCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of schedules api
 * @route GET /api/schedules/overview
 * @group schedules - Operations about schedules
 * @returns {object} 200 - An object of schedules info
 * @returns {Error}  default - Unexpected error
 */
function getAllSchedulesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  scheduleService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is schedules exist api
 * @route GET /api/schedules/exist
 * @group schedules - Operations about schedules
 * @param {string} schedulename.query.required - schedules name
 * @returns {object} 200 - An object of schedules info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let scheduleId = req.query.scheduleId
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  scheduleService.getScheduleByName(name).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * GET TASKS BY USER ID
 * @route GET /api/schedules/users/:id
 * @group schedules - GET ALL THE TASKS TO USER ID
 */
function getTaskByUserId( req, res, next ){
  let userId = req.params.id;
  if (!userId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  } else {
    scheduleService.getTaskAndGroup(userId)
      .then( data => { 
        res.json( data );
      })
      .catch( err => next(errorMethods.sendServerError(err)) )
  }
}

function getTaskOverviewByProjectAndUserId( req, res, next ){
  let projectid = req.params.id;
  let userid = req.params.userid;
  if( (projectid === undefined || userid === undefined) || (projectid === "" || userid === "")){
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM))
  }   else {
    scheduleService.getTaskByProjectAndResource(projectid, userid)
    .then( data => { 
      return res.json( data );
    })
    .catch( err => next(errorMethods.sendServerError(err)) )
  }
}

/**
 * GET TIMESHEET FOR USER WITH DATE FILTER
 * @route GET /api/schedules/timesheet
 * @group schedules - GET ALL THE TASKS TO USER ID
 */

async function getTimeSheetForUser( req, res, next ){
  try{
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    let userId = req.query.id;
    let getTimeSheet = await scheduleService.getScheduleWithDateFilters( fromDate, toDate, userId );
    return res.json( getTimeSheet );
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  }
}

//function by akhil for schedule of resources
async function resourceSchedule(req, res, next) {
  try {
  let data = await scheduleService.scheduleByRes();
    console.log(data);
    return res.json(data);
  }catch(err){
    next(errorMethods.sendServerError(err));
  }
}


function collaborators(req, res, next) {
  let taskId = req.params.id;
  scheduleService.collaborators(taskId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function getTodayTimesheet(req, res, next) {
  //let startTime = req.query.startTime;
  //let endTime = req.query.endTime;
  let todaysDate = req.query.todaysDate;
  let member = req.query.member;
  scheduleService.getTodayTimesheet(todaysDate, member).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function timesheetWithRange(req, res, next) {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  let member = req.query.member;
  scheduleService.timesheetWithRange(startDate, endDate, member).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function calendar(req, res, next) {
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  let member = req.body.member;
  scheduleService.calendar(startDate, endDate, member).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


module.exports.init = init;