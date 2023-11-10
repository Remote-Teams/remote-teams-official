const workinghourService = require('../services/workinghour.service');
var schema = require('../schemas/workinghour.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');


function init(router) {
  router.route('/workinghours')
    .get(getAllWorkinghours)
    .post(addWorkinghour);
  router.route('/workinghours/count')
    .get(getAllWorkinghoursCount);
  router.route('/workinghours/overview')
    .get(getAllWorkinghoursOverview);
  router.route('/workinghours/:id')
    .get(getWorkinghourById)
    .delete(deleteWorkinghour)
    .put(updateWorkinghour);
  router.route('/workinghours/search')
    .post(searchWorkinghours);
  router.route('/workinghours/exist')
    .get(isExist);
}

/**
 * Get all a workinghours api
 * @route GET /api/workinghours
 * @group workinghours - Operations about workinghours
 * @returns {object} 200 - An object of workinghours info
 * @returns {Error}  default - Unexpected error
 */
function getAllWorkinghours(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      workinghourService.getWorkinghoursByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      workinghourService.getWorkinghoursByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    workinghourService.getAllWorkinghours().then((data) => {
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
 * Search workinghours api
 * @route POST /api/workinghours/search
 * @group workinghours - Operations about workinghours
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of workinghours info
 * @returns {Error}  default - Unexpected error
 */
function searchWorkinghours(req, res, next) {
  let searchCriteria = req.body;
  workinghourService.searchWorkinghour(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get workinghours by id api
 * @route GET /api/workinghours/:id
 * @group workinghours - Operations about workinghours
 * @returns {object} 200 - An object of workinghours info
 * @returns {Error}  default - Unexpected error
 */
function getWorkinghourById(req,res,next) {

  let workinghourId = req.params.id;

  console.log("id"+ workinghourId);
  var json_format = iValidator.json_schema(schema.getSchema,workinghourId,"workinghour");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  workinghourService.getWorkinghourById(workinghourId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.WORKINGHOUR_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add workinghours api
 * @route POST /api/workinghours
 * @group workinghours - Operations about workinghours
 * @param {object} workinghour.body.required - workinghours details
 * @returns {object} 200 - An object of workinghours info
 * @returns {Error}  default - Unexpected error
 */
function addWorkinghour(req,res, next) {
  var workinghourData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, workinghourData, "workinghour");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   workinghourService.getWorkinghourByWorkinghourName(workinghourData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.WORKINGHOUR_ALREADY_EXIST));
    }else{
      workinghourService.addWorkinghour(workinghourData).then((data) => {
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
 * update workinghours by id api
 * @route PUT /api/workinghours
 * @group workinghours - Operations about workinghours
 * @returns {object} 200 - An object of workinghours info
 * @returns {Error}  default - Unexpected error
 */
function updateWorkinghour(req,res, next) {
   var workinghourData=req.body;
   var id = req.params.id;
   workinghourService.getWorkinghourById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WORKINGHOUR_NOT_EXIST));
    }else{
      workinghourService.updateWorkinghour(id,workinghourData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete workinghours by id api
 * @route DELETE /api/workinghours/:id
 * @group workinghours - Operations about workinghours
 * @returns {object} 200 - An object of workinghours info
 * @returns {Error}  default - Unexpected error
 */
function deleteWorkinghour(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  workinghourService.getWorkinghourById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.WORKINGHOUR_NOT_EXIST));
    }else{
      workinghourService.deleteWorkinghour(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get workinghours count api
 * @route GET /api/workinghours/count
 * @group workinghours - Operations about workinghours
 * @returns {object} 200 - An object of workinghours info
 * @returns {Error}  default - Unexpected error
 */
function getAllWorkinghoursCount(req,res,next) {
  workinghourService.getAllWorkinghoursCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.WORKINGHOUR_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of workinghours api
 * @route GET /api/workinghours/overview
 * @group workinghours - Operations about workinghours
 * @returns {object} 200 - An object of workinghours info
 * @returns {Error}  default - Unexpected error
 */
function getAllWorkinghoursOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  workinghourService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is workinghours exist api
 * @route GET /api/workinghours/exist
 * @group workinghours - Operations about workinghours
 * @param {string} workinghourname.query.required - workinghours name
 * @returns {object} 200 - An object of workinghours info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let workinghourId = req.query.workinghourId
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  workinghourService.getWorkinghourByName(name).then((data) => {
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