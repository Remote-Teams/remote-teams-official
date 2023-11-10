const pinService = require('../services/pin.service');
var schema = require('../schemas/pin.validation.schema.json')
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
  router.route('/pins')
    .get(getAllPins)
    .post(addPin);
  router.route('/pins/count')
    .get(getAllPinsCount);
  router.route('/pins/overview')
    .get(getAllPinsOverview);
  router.route('/pins/exist')
    .get(isExist);
  router.route('/pins/:id')
    .get(getPinById)
    .delete(deletePin)
    .put(updatePin);
  router.route('/pins/search')
    .post(searchPins);
  router.route('/pins/search/text')
    .get(textSearch);
}

/**
 * Get all a pins api
 * @route GET /api/pins
 * @group pins - Operations about pins
 * @returns {object} 200 - An object of pins info
 * @returns {Error}  default - Unexpected error
 */
function getAllPins(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
 if (pageNo > 0 && !isNaN(pageNo) && pageSize > 0 && !isNaN(pageSize)) {
    if (sortBy != null || sortBy != undefined) {
      pinService.getPinsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      pinService.getPinsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    pinService.getAllPins().then((data) => {
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
 * Search pins api
 * @route POST /api/pins/search
 * @group pins - Operations about pins
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of pins info
 * @returns {Error}  default - Unexpected error
 */
function searchPins(req, res, next) {
  let searchCriteria = req.body;
  pinService.searchPins(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get pins by id api
 * @route GET /api/pins/:id
 * @group pins - Operations about pins
 * @returns {object} 200 - An object of pins info
 * @returns {Error}  default - Unexpected error
 */
function getPinById(req,res,next) {

  let pinId = req.params.id;

  console.log("id"+ pinId);
  var json_format = iValidator.json_schema(schema.getSchema,pinId,"pin");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  pinService.getPinById(pinId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.NOTE_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add pins api
 * @route POST /api/pins
 * @group pins - Operations about pins
 * @param {object} pin.body.required - pins details
 * @returns {object} 200 - An object of pins info
 * @returns {Error}  default - Unexpected error
 */
function addPin(req,res, next) {
  var pinData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, pinData, "pin");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   pinService.getPinByPinName(pinData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.NOTE_ALREADY_EXISTS));
    }else{
      pinService.addPin(pinData).then((data) => {
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
 * update pins by id api
 * @route PUT /api/pins
 * @group pins - Operations about pins
 * @returns {object} 200 - An object of pins info
 * @returns {Error}  default - Unexpected error
 */
function updatePin(req,res, next) {
   var pinData=req.body;
   var id = req.params.id;
   pinService.getPinById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.NOTE_DOES_NOT_EXIST));
    }else{
      pinService.updatePin(id,pinData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete pins by id api
 * @route DELETE /api/pins/:id
 * @group pins - Operations about pins
 * @returns {object} 200 - An object of pins info
 * @returns {Error}  default - Unexpected error
 */
function deletePin(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  pinService.getPinById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.NOTE_DOES_NOT_EXIST));
    }else{
      pinService.deletePin(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get pins count api
 * @route GET /api/pins/count
 * @group pins - Operations about pins
 * @returns {object} 200 - An object of pins info
 * @returns {Error}  default - Unexpected error
 */
function getAllPinsCount(req,res,next) {
  pinService.getAllPinsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.NOTE_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of pins api
 * @route GET /api/pins/overview
 * @group pins - Operations about pins
 * @returns {object} 200 - An object of pins info
 * @returns {Error}  default - Unexpected error
 */
function getAllPinsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  pinService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is pins exist api
 * @route GET /api/pins/exist
 * @group pins - Operations about pins
 * @param {string} pinname.query.required - pins name
 * @returns {object} 200 - An object of pins info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let pinId = req.query.pinId;
  pinService.getPinByName(name).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/*
text search function
*/

function textSearch(req, res, next) {
  let text = req.query.text;
  pinService.textSearch(text).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;