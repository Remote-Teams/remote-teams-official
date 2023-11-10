const memberdayoffService = require('../services/memberdayoff.service');
var schema = require('../schemas/memberdayoff.validation.schema.json')
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
  router.route('/memberdayoffs')
    .get(getAllMemberdayoffs)
    .post(addMemberdayoff);
  router.route('/memberdayoffs/bulk')
    .post( addMemberDayoffInBulk )
    .put( updateMemberdayoffInBulk );
  router.route('/memberdayoffs/count')
    .get(getAllMemberdayoffsCount);
  router.route('/memberdayoffs/overview')
    .get(getAllMemberdayoffsOverview);
  router.route('/memberdayoffs/:id')
    .get(getMemberdayoffById)
    .delete(deleteMemberdayoff)
    .put(updateMemberdayoff);
  router.route('/memberdayoffs/search')
    .post(searchMemberdayoffs);
  router.route('/memberdayoffs/exist')
    .get(isExist);
}

/**
 * Get all a memberdayoffs api
 * @route GET /api/memberdayoffs
 * @group memberdayoffs - Operations about memberdayoffs
 * @returns {object} 200 - An object of memberdayoffs info
 * @returns {Error}  default - Unexpected error
 */
function getAllMemberdayoffs(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      memberdayoffService.getMemberdayoffsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      memberdayoffService.getMemberdayoffsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    memberdayoffService.getAllMemberdayoffs().then((data) => {
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
 * Search memberdayoffs api
 * @route POST /api/memberdayoffs/search
 * @group memberdayoffs - Operations about memberdayoffs
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of memberdayoffs info
 * @returns {Error}  default - Unexpected error
 */
function searchMemberdayoffs(req, res, next) {
  let searchCriteria = req.body;
  memberdayoffService.searchMemberdayoffs(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    console.log( err );
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get memberdayoffs by id api
 * @route GET /api/memberdayoffs/:id
 * @group memberdayoffs - Operations about memberdayoffs
 * @returns {object} 200 - An object of memberdayoffs info
 * @returns {Error}  default - Unexpected error
 */
function getMemberdayoffById(req,res,next) {

  let memberdayoffId = req.params.id;

  console.log("id"+ memberdayoffId);
  var json_format = iValidator.json_schema(schema.getSchema,memberdayoffId,"memberdayoff");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  memberdayoffService.getMemberdayoffById(memberdayoffId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.MEMBERDAYOFF_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add memberdayoffs api
 * @route POST /api/memberdayoffs
 * @group memberdayoffs - Operations about memberdayoffs
 * @param {object} memberdayoff.body.required - memberdayoffs details
 * @returns {object} 200 - An object of memberdayoffs info
 * @returns {Error}  default - Unexpected error
 */
function addMemberdayoff(req,res, next) {
  var memberdayoffData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, memberdayoffData, "memberdayoff");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   memberdayoffService.getMemberdayoffByMemberdayoffName(memberdayoffData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.MEMBERDAYOFF_ALREADY_EXIST));
    }else{
      memberdayoffService.addMemberdayoff(memberdayoffData).then((data) => {
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
 * update memberdayoffs by id api
 * @route PUT /api/memberdayoffs
 * @group memberdayoffs - Operations about memberdayoffs
 * @returns {object} 200 - An object of memberdayoffs info
 * @returns {Error}  default - Unexpected error
 */
function updateMemberdayoff(req,res, next) {
   var memberdayoffData=req.body;
   var id = req.params.id;
   memberdayoffService.getMemberdayoffById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.MEMBERDAYOFF_NOT_EXIST));
    }else{
      memberdayoffService.updateMemberdayoff(id,memberdayoffData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete memberdayoffs by id api
 * @route DELETE /api/memberdayoffs/:id
 * @group memberdayoffs - Operations about memberdayoffs
 * @returns {object} 200 - An object of memberdayoffs info
 * @returns {Error}  default - Unexpected error
 */
function deleteMemberdayoff(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  memberdayoffService.getMemberdayoffById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.MEMBERDAYOFF_NOT_EXIST));
    }else{
      memberdayoffService.deleteMemberdayoff(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get memberdayoffs count api
 * @route GET /api/memberdayoffs/count
 * @group memberdayoffs - Operations about memberdayoffs
 * @returns {object} 200 - An object of memberdayoffs info
 * @returns {Error}  default - Unexpected error
 */
function getAllMemberdayoffsCount(req,res,next) {
  memberdayoffService.getAllMemberdayoffsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.MEMBERDAYOFF_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of memberdayoffs api
 * @route GET /api/memberdayoffs/overview
 * @group memberdayoffs - Operations about memberdayoffs
 * @returns {object} 200 - An object of memberdayoffs info
 * @returns {Error}  default - Unexpected error
 */
function getAllMemberdayoffsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  memberdayoffService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is memberdayoffs exist api
 * @route GET /api/memberdayoffs/exist
 * @group memberdayoffs - Operations about memberdayoffs
 * @param {string} memberdayoffname.query.required - memberdayoffs name
 * @returns {object} 200 - An object of memberdayoffs info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let memberdayoffId = req.query.memberdayoffId
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  memberdayoffService.getMemberdayoffByName(name).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

async function addMemberDayoffInBulk( req, res, next ){
  try{
    let body = req.body;
    let response = await memberdayoffService.addMemberDayOffBulk( body );
    return res.json( response );
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  } 
}

async function updateMemberdayoffInBulk( req, res, next ){
  try{
    let body = req.body;
    console.log( body );
    let response = await memberdayoffService.updateMemberdayoffBulk( body );
    return res.json( response );
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  }
} 

module.exports.init = init;