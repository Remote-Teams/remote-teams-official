const expenseService = require('../services/expense.service');
var schema = require('../schemas/expense.validation.schema.json')
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
var moment = require('moment');

function init(router) {
  router.route('/expenses')
    .get(getAllExpenses)
    .post(addExpense);
  router.route('/expenses/count')
    .get(getAllExpensesCount);
  router.route('/expenses/overview')
    .get(getAllExpensesOverview);
  router.route('/expenses/approve')
    .put( expenseApproval )
    .post( expenseBulkApproval );
  router.route('/expenses/summaryTab')
    .get(summaryTab);
  router.route('/expenses/reports/summary')
    .get( getTotalExpenseReport );
  router.route('/expenses/yearlyExpenseReport')
    .get(yearlyExpenseReport);
  router.route('/expenses/yearlyBillableExpenses')
    .get(yearlyBillableExpenses);
  router.route('/expenses/yearlyMiscellaneousExpenses')
    .get(yearlyMiscellaneousExpenses);
  router.route('/expenses/totalExpenseThisMonth')
    .get(totalExpenseThisMonth);
  router.route('/expenses/monthlyExpenseType')
    .get(monthlyExpenseType);
  router.route('/expenses/table')
    .post(expensesTable);
  router.route('/expenses/:id')
    .get(getExpenseById)
    .delete(deleteExpense)
    .put(updateExpense);
  router.route('/expenses/search')
    .post(searchExpenses);
  router.route('/expenses/search/text')
    .get(textSearch);
  router.route('/expenses/rough')
    .get(rough);
}

/**
 * Get all invoices api
 * @route GET /api/invoices
 * @group invoices - Operations about invoices
 * @returns {object} 200 - An object of invoices info
 * @returns {Error}  default - Unexpected error
 */
function getAllExpenses(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var fromDate = req.query.fromDate;
  var toDate = req.query.toDate;
  var sortBy = req.query.sortBy;
  if( fromDate !== undefined && toDate !== undefined ){
      expenseService.getExpensesWithinTimeFrame( fromDate, toDate ).then( data =>{
        return res.json(data);
      }).catch( err => next(errorMethods.sendServerError(err)) )
  } else
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      expenseService.getExpensesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      expenseService.getExpensesByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  }  else {
    expenseService.getAllExpenses().then((data) => {
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
function searchExpenses(req, res, next) {
  let searchCriteria = req.body;
  expenseService.searchExpenses(searchCriteria).then((data) => {
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
function getExpenseById(req,res,next) {

  let expenseId = req.params.id;
  var json_format = iValidator.json_schema(schema.getSchema,expenseId,"expense");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  expenseService.getExpenseById(expenseId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.EXPENSE_DOES_NOT_EXIST));
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
async function addExpense(req,res, next) {
  var expenseData=req.body;
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, expenseData, "expense");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
  let expenses = await expenseService.getExpenseByName(expenseData.expenseTitle);
  if( expenses.length > 0 ){
    return next(errorMethods.sendBadRequest(errorCode.EXPENSE_ALREADY_EXISTS));
  } else {
    expenseService.addExpense(expenseData).then((data) => {
      res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * update invoices by id api
 * @route PUT /api/invoices
 * @group invoices - Operations about invoices
 * @returns {object} 200 - An object of invoices info
 * @returns {Error}  default - Unexpected error
 */
function updateExpense(req,res, next) {
   var expenseData=req.body;
   var id = req.params.id;
   expenseService.getExpenseById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.EXPENSE_DOES_NOT_EXIST));
    }else{
      expenseService.updateExpense(id,expenseData).then((data)=>{
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
function deleteExpense(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  expenseService.getExpenseById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.EXPENSE_DOES_NOT_ESIT));
    }else{
      expenseService.deleteExpense(delId).then((data)=>{
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
function getAllExpensesCount(req,res,next) {
  expenseService.getAllExpensesCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.EXPENSE_DOES_NOT_EXIST));
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
function getAllExpensesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  expenseService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
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
function getAllEzpensesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  expenseService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * approcve or reject expeses
 * @route PUT /api/expenses/approve
 */
async function expenseApproval( req, res, next ){
  try{
    let expenseBody = req.body;
    var json_format = iValidator.json_schema(schema.approveSchema, expenseBody, "expense");
    if (json_format.valid == false) {
      return res.status(422).send(json_format.errorMessage);
    }
    let approveExpense = await expenseService.expenseApproval( expenseBody );
    return res.json(approveExpense);
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  }
}

/**
 * bulk approve or reject
 * @route - POST /api/expenses/approve
 */
async function expenseBulkApproval( req, res, next ){
  try{
    let all_expenses = req.body.expenses;
    let reolve_all = await expenseService.expenseBulkApproval( all_expenses );
    return res.json(reolve_all)
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  }
}

/*
text search function
*/

function textSearch(req, res, next) {
  let text = req.query.text;
  expenseService.textSearch(text)
  .then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function getTotalExpenseReport( req, res, next ){
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  expenseService.getExpenseSummaryForReports( fromDate, toDate )
    .then((data) => {
      res.json(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

// /*possible routes required - 
//yearly expense report
function yearlyExpenseReport(req, res, next) {
  expenseService.yearlyExpenseReport().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

//yearlyBillableExpenses
function yearlyBillableExpenses(req, res, next) {
  expenseService.yearlyBillableExpenses().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

//yearlyMiscellaneousExpenses
function yearlyMiscellaneousExpenses(req, res, next) {
  expenseService.yearlyMiscellaneousExpenses().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

//rough
function rough(req, res, next) {
  expenseService.rough().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

//total expenses this month

function totalExpenseThisMonth(req, res, next) {
  startDate = req.query.from;
  endDate = req.query.to;
  expenseService.totalExpenseThisMonth(startDate, endDate).then((data)=>{
    res.json(data);
  }).catch((err)=>{
    next(errorMethods.sendServerError(err));
  });
}

function monthlyExpenseType(req,res,next) {
  startDate = req.query.from;
  endDate = req.query.to;
  expenseService.monthlyExpenseType(startDate, endDate).then((data)=>{
    res.json(data);
  }).catch((err)=>{
    next(errorMethods.sendServerError(err));
  });

}

function summaryTab(req, res, next) {
  from = req.query.from;
  to = req.query.to;
  if(req.query.project){
  project = req.query.project;
  }
  else{project=null}
  expenseService.summaryTab(from, to, project).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function expensesTable(req,res,next) {
  startDate = req.body.from;
  endDate = req.body.to;
  expenseService.expensesTable(startDate, endDate).then((data)=>{
    res.json(data);
  }).catch((err)=>{
    next(errorMethods.sendServerError(err));
  });

}

module.exports.init = init;
