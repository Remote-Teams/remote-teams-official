const expenseSubscriptionService = require('../services/expenseSubscription.service');
var schema = require('../schemas/expenseSubscription.validation.schema.json')
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
  router.route('/expenseSubscriptions')
    .get(getAllExpenseSubscriptions)
    .post(addExpenseSubscription);
  router.route('/expenseSubscriptions/count')
    .get(getAllExpenseSubscriptionsCount);
  router.route('/expenseSubscriptions/overview')
    .get(getAllExpenseSubscriptionsOverview);
  router.route('/expenseSubscriptions/tsubs')
    .get(totalSubscription);
  router.route('/expenseSubscriptions/:id')
    .get(getExpenseSubscriptionById)
    .delete(deleteExpenseSubscription)
    .put(updateExpenseSubscription);
  router.route('/expenseSubscriptions/search')
    .post(searchExpenseSubscriptions);
  router.route('/expenseSubscriptions/search/text')
    .get(textSearch);
  }

/**
 * Get all invoices api
 * @route GET /api/invoices
 * @group invoices - Operations about invoices
 * @returns {object} 200 - An object of invoices info
 * @returns {Error}  default - Unexpected error
 */
function getAllExpenseSubscriptions(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  // if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
  //   errMsg = { "error": true, "message": "invalid page number or page Size." };
  //   res.send(errMsg);
  // }
 if (pageNo > 0 && pageSize >= 0 && !isNaN(pageSize)) {
    if (sortBy != null || sortBy != undefined) {
      expenseSubscriptionService.getExpenseSubscriptionsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      expenseSubscriptionService.getExpenseSubscriptionsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    expenseSubscriptionService.getAllExpenseSubscriptions().then((data) => {
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
 * Search invoices api
 * @route POST /api/invoices/search
 * @group invoices - Operations about projects
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of invoices info
 * @returns {Error}  default - Unexpected error
 */
function searchExpenseSubscriptions(req, res, next) {
  let searchCriteria = req.body;
  expenseSubscriptionService.searchExpenseSubscriptions(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get invoices by id api
 * @route GET /api/invoices/:id
 * @group invoices - Operations about projects
 * @returns {object} 200 - An object of invoices info
 * @returns {Error}  default - Unexpected error
 */
function getExpenseSubscriptionById(req,res,next) {

  let expenseSubscriptionId = req.params.id;

  console.log("id"+ expenseSubscriptionId);
  var json_format = iValidator.json_schema(schema.getSchema,expenseSubscriptionId,"expenseSubscription");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  expenseSubscriptionService.getExpenseSubscriptionById(expenseSubscriptionId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.EXPENSESUBSCRIPTION_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add invoices api
 * @route POST /api/invoices
 * @group invoices - Operations about projects
 * @param {object} invoice.body.required - invoices details
 * @returns {object} 200 - An object of invoices info
 * @returns {Error}  default - Unexpected error
 */
function addExpenseSubscription(req,res, next) {
  var expenseSubscriptionData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, expenseSubscriptionData, "expenseSubscription");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
  expenseSubscriptionService.addExpenseSubscription(expenseSubscriptionData).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * update invoices by id api
 * @route PUT /api/invoices
 * @group invoices - Operations about invoices
 * @returns {object} 200 - An object of invoices info
 * @returns {Error}  default - Unexpected error
 */
function updateExpenseSubscription(req,res, next) {
   var expenseSubscriptionData=req.body;
   var id = req.params.id;
   expenseSubscriptionService.getExpenseSubscriptionById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.EXPENSESUBSCRIPTION_DOES_NOT_EXIST));
    }else{
      expenseSubscriptionService.updateExpenseSubscription(id,expenseSubscriptionData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete invoices by id api
 * @route DELETE /api/invoices/:id
 * @group invoices - Operations about invoices
 * @returns {object} 200 - An object of invoices info
 * @returns {Error}  default - Unexpected error
 */
function deleteExpenseSubscription(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  expenseSubscriptionService.getExpenseSubscriptionById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.EXPENSESUBSCRIPTION_DOES_NOT_EXIST));
    }else{
      expenseSubscriptionService.deleteExpenseSubscription(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get invoices count api
 * @route GET /api/invoices/count
 * @group invoices - Operations about invoices
 * @returns {object} 200 - An object of invoices info
 * @returns {Error}  default - Unexpected error
 */
function getAllExpenseSubscriptionsCount(req,res,next) {
  expenseSubscriptionService.getAllExpenseSubscriptionsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.EXPENSESUBSCRIPTION_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of invoices api
 * @route GET /api/invoices/overview
 * @group invoices - Operations about invoices
 * @returns {object} 200 - An object of invoices info
 * @returns {Error}  default - Unexpected error
 */
function getAllExpenseSubscriptionsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  expenseSubscriptionService.getSubscriptionOverviewWithCost(overviewKey).then((data) => {
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
  expenseSubscriptionService.textSearch(text).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/*
total subscription this month
*/
function totalSubscription(req, res, next) {
  expenseSubscriptionService.totalSubscription().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;
