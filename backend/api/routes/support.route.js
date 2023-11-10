const supportServices = require('../services/support.service');
var schema = require('../schemas/support.validation.schema.json')
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
  router.route('/support')
    .get(getAllSupport)
    .post(addSupport);
  router.route('/support/count')
    .get(getAllSupportCount);
  router.route('/support/overview')
    .get(getAllSupportOverview);
  router.route('/support/:id')
    .get(getSupportById)
    .delete(deleteSupportById)
    .put(updateSupportById);
  router.route('/support/search')
    .post(searchFaqs);
}

/**
 * Get all support api
 * @route GET /api/support
 * @group support -> get all support
 * @returns {object} 200 - An object of support info
 * @returns {Error}  default - Unexpected error
 */
function getAllSupport(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var fromDate = req.query.fromDate;
  var toDate = req.query.toDate;
  var sortBy = req.query.sortBy;
  var count = req.query.count;
  if( fromDate !== undefined && toDate !== undefined ){
      supportServices.getSupportWithinTimeFrame( fromDate, toDate, count ).then( data =>{
        return res.json(data);
      }).catch( err => next(errorMethods.sendServerError(err)) )
  } else
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
        supportServices.getSupportByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
        res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
        supportServices.getSupportByPage(pageNo, pageSize).then((data) => {
        res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    supportServices.getAllSupport().then((data) => {
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
 * Search support api
 * @route POST /api/support/search
 * @group support - Operations about faq
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of support info
 * @returns {Error}  default - Unexpected error
 */
function searchFaqs(req, res, next) {
  let searchCriteria = req.body;
  supportServices.searchSupport(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get support by id api
 * @route GET /api/support/:id
 * @group support - Operations about faq
 * @returns {object} 200 - An object of support info
 * @returns {Error}  default - Unexpected error
 */
function getSupportById(req,res,next) {
  let supportId = req.params.id;
  var json_format = iValidator.json_schema(schema.getSchema,supportId,"support");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  supportServices.getSupportById(supportId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.SUPPORT_DOES_NOT_EXISTS));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add support api
 * @route POST /api/support
 * @group faqs - Operations about support
 * @param {object} faq.body.required - support details
 * @returns {object} 200 - An object of support info
 * @returns {Error}  default - Unexpected error
 */
function addSupport(req,res, next) {
  var supportData = req.body;
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, supportData, "support");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   else {
       supportServices.addSupport( supportData ).then( data => {
           res.json( data )
       })
       .catch( err => {
        next(errorMethods.sendServerError(err));
       })
    }
}

/**
 * update suport by id api
 * @route PUT /api/suport
 * @group suport - Operations about suport
 * @returns {object} 200 - An object of suport info
 * @returns {Error}  default - Unexpected error
 */
function updateSupportById(req,res, next) {
   var supportData = req.body;
   var id = req.params.id;
   supportServices.getSupportById(id).then( data => {
    if(data == undefined || data.length == 0){
        return next(errorMethods.sendBadRequest(errorCode.FAQ_DOES_NOT_EXIST));
    } else {
        supportServices.updateSupport( id, supportData ).then((data)=>{
            res.json(data);
        }).catch((err)=>{
            next(errorMethods.sendServerError(err));
        });
    }
   });
}

/**
 * delete faqs by id api
 * @route DELETE /api/faqs/:id
 * @group faqs - Operations about faqs
 * @returns {object} 200 - An object of faqs info
 * @returns {Error}  default - Unexpected error
 */
function deleteSupportById(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  supportServices.getSupportById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.SUPPORT_DOES_NOT_EXISTS));
    }else{
      supportServices.deleteSupport(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get faqs count api
 * @route GET /api/faqs/count
 * @group faqs - Operations about faqs
 * @returns {object} 200 - An object of faqs info
 * @returns {Error}  default - Unexpected error
 */
function getAllSupportCount(req,res,next) {
    supportServices.getAllSupportCount().then( data => {
        if( data === undefined ){
            return next(errorMethods.sendBadRequest(errorCode.SUPPORT_DOES_NOT_EXISTS));
        }
        res.send({ count :data });
    } ).catch( err => {
        next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of support api
 * @route GET /api/support/overview
 * @group support - Operations about support
 * @returns {object} 200 - An object of support info
 * @returns {Error}  default - Unexpected error
 */
function getAllSupportOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  supportServices.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


module.exports.init = init;
