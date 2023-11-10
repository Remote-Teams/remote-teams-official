const workboardService = require('../services/workboard.service');
var schema = require('../schemas/workboard.validation.schema.json')
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
  router.route('/workboards')
    .get(getAllWorkboards)
    .post(addWorkboard);
  router.route('/workboards/count')
    .get(getAllWorkboardsCount);
  router.route('/workboards/overview')
    .get(getAllWorkboardsOverview);
  router.route('/workboards/exist')
    .get(isExist);
  router.route('/workboards/:id')
    .get(getWorkboardById)
    .delete(deleteWorkboard)
    .put(updateWorkboard);
  router.route('/workboards/search')
    .post(searchWorkboards);
}

/**
 * Get all a workboards api
 * @route GET /api/workboards
 * @group workboards - Operations about workboards
 * @returns {object} 200 - An object of workboards info
 * @returns {Error}  default - Unexpected error
 */
function getAllWorkboards(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
 if (pageNo > 0 && pageSize > 0 && !isNaN(pageSize)) {
    if (sortBy != null || sortBy != undefined) {
      workboardService.getWorkboardsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      workboardService.getWorkboardsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    workboardService.getAllWorkboards().then((data) => {
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
 * Search workboards api
 * @route POST /api/workboards/search
 * @group workboards - Operations about workboards
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of workboards info
 * @returns {Error}  default - Unexpected error
 */
function searchWorkboards(req, res, next) {
  let searchCriteria = req.body;
  workboardService.searchWorkboards(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get workboards by id api
 * @route GET /api/workboards/:id
 * @group workboards - Operations about workboards
 * @returns {object} 200 - An object of workboards info
 * @returns {Error}  default - Unexpected error
 */
function getWorkboardById(req,res,next) {

  let workboardId = req.params.id;

  console.log("id"+ workboardId);
  var json_format = iValidator.json_schema(schema.getSchema,workboardId,"workboard");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  workboardService.getWorkboardById(workboardId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.WORKBOARD_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add workboards api
 * @route POST /api/workboards
 * @group workboards - Operations about workboards
 * @param {object} workboard.body.required - workboards details
 * @returns {object} 200 - An object of workboards info
 * @returns {Error}  default - Unexpected error
 */
function addWorkboard(req,res, next) {
  var workboardData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, workboardData, "workboard");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   workboardService.getWorkboardByWorkboardName(workboardData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.WORKBOARD_ALREADY_EXISTS));
    }else{
      workboardService.addWorkboard(workboardData).then((data) => {
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
 * update workboards by id api
 * @route PUT /api/workboards
 * @group workboards - Operations about workboards
 * @returns {object} 200 - An object of workboards info
 * @returns {Error}  default - Unexpected error
 */
function updateWorkboard(req,res, next) {
   var workboardData=req.body;
   var id = req.params.id;
   workboardService.getWorkboardById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WORKBOARD_DOES_NOT_EXIST));
    }else{
      workboardService.updateWorkboard(id,workboardData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete workboards by id api
 * @route DELETE /api/workboards/:id
 * @group workboards - Operations about workboards
 * @returns {object} 200 - An object of workboards info
 * @returns {Error}  default - Unexpected error
 */
function deleteWorkboard(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  workboardService.getWorkboardById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WORKBOARD_DOES_NOT_EXIST));
    }else{
      workboardService.deleteWorkboard(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get workboards count api
 * @route GET /api/workboards/count
 * @group workboards - Operations about workboards
 * @returns {object} 200 - An object of workboards info
 * @returns {Error}  default - Unexpected error
 */
function getAllWorkboardsCount(req,res,next) {
  workboardService.getAllWorkboardsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.WORKBOARD_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of workboards api
 * @route GET /api/workboards/overview
 * @group workboards - Operations about workboards
 * @returns {object} 200 - An object of workboards info
 * @returns {Error}  default - Unexpected error
 */
function getAllWorkboardsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  workboardService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is workboards exist api
 * @route GET /api/workboards/exist
 * @group workboards - Operations about workboards
 * @param {string} workboardname.query.required - workboards name
 * @returns {object} 200 - An object of workboards info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let workboardId = req.query.workboardId
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  workboardService.getWorkboardByName(name).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;