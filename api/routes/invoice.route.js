const invoiceService = require('../services/invoice.service');
var schema = require('../schemas/invoice.validation.schema.json')
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
  router.route('/invoices')
    .get(getAllInvoices)
    .post(addInvoice);
  router.route('/invoices/count')
    .get(getAllInvoicesCount);
  router.route('/invoices/overview')
    .get(getAllInvoicesOverview);
  router.route('/invoices/summary')
    .get(getInvoiceSummary);
  router.route('/invoices/summaryTab')
    .get(summaryTab);
  router.route('/invoices/invDist')
    .get(invDist);
  router.route('/invoices/revenueTillDate')
    .get(revenueTillDate);
  router.route('/invoices/revenueThisMonth')
    .get(revenueThisMonth);
  router.route('/invoices/invoicesIssuedByMonths')
  .get(invoicesIssuedByMonths);
  router.route('/invoices/paidInvoicesByMonths')
  .get(paidInvoicesByMonths);
  router.route('/invoices/invoiceCompleteSummary')
  .get(invoiceCompleteSummary);
  router.route('/invoices/invoiceSummaryPercent')
  .get(invoiceSummaryPercent);
  router.route('/invoices/dueTillDate')
  .get(dueTillDate);
  router.route('/invoices/:id')
    .get(getInvoiceById)
    .delete(deleteInvoice)
    .put(updateInvoice);
  router.route('/invoices/search')
    .post(searchInvoices);
  router.route('/invoices/table')
    .post(invoicesTable);
  router.route('/invoices/search/text')
    .get(textSearch);
  router.route('/invoices/reports/summary')
    .get( getTotalRevenueAndInvAmountforReports );
  router.route('/invoices/reports/summary/:id')
    .get( getTotalRevenueAndInvAmountforReportsWithClient );
  
}

/**
 * Get all invoices api
 * @route GET /api/invoices
 * @group invoices - Operations about invoices
 * @returns {object} 200 - An object of invoices info
 * @returns {Error}  default - Unexpected error
 */
function getAllInvoices(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      invoiceService.getInvoicesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      invoiceService.getInvoicesByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    invoiceService.getAllInvoices().then((data) => {
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
function searchInvoices(req, res, next) {
  let searchCriteria = req.body;
  invoiceService.searchInvoices(searchCriteria).then((data) => {
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
function getInvoiceById(req,res,next) {

  let invoiceId = req.params.id;

  console.log("id"+ invoiceId);
  var json_format = iValidator.json_schema(schema.getSchema,invoiceId,"invoice");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  invoiceService.getInvoiceById(invoiceId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.INVOICE_DOES_NOT_EXIST));
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
function addInvoice(req,res, next) {
  var invoiceData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, invoiceData, "invoice");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   invoiceService.getInvoiceByInvoiceId(invoiceData.invoice_number).then((data)=>{
    if(data != undefined ){
      return next(errorMethods.sendBadRequest(errorCode.INVOICE_ALREADY_EXISTS));
    }else{
      invoiceService.addInvoice(invoiceData).then((data) => {
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
 * update invoices by id api
 * @route PUT /api/invoices
 * @group invoices - Operations about invoices
 * @returns {object} 200 - An object of invoices info
 * @returns {Error}  default - Unexpected error
 */
function updateInvoice(req,res, next) {
   var invoiceData=req.body;
   var id = req.params.id;
   invoiceService.getInvoiceById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.INVOICE_DOES_NOT_EXIST));
    }else{
      invoiceService.updateInvoice(id,invoiceData).then((data)=>{
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
function deleteInvoice(req,res, next) {
  var delId = req.params.id;
  invoiceService.getInvoiceById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.INVOICE_DOES_NOT_EXIST));
    }else{
      invoiceService.deleteInvoice(delId).then((data)=>{
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
function getAllInvoicesCount(req,res,next) {
  invoiceService.getAllInvoicesCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.INVOICE_DOES_NOT_EXIST));
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
 * @returns {Error}  default - Unexpected errorrouter.route('/invoices/invoicesIssuedByMonths')
  .get(invoicesIssuedByMonths)
  router.route('/invoices/paidInvoicesByMonths')
  .get(paidInvoicesByMonths)
  router.route('/invoices/invoiceCompleteSummary')
  .get(invoiceCompleteSummary)
 */
function getAllInvoicesOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  invoiceService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
  invoiceService.textSearch(text).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function getInvoiceSummary( req, res, next ){
    invoiceService.invoiceSummary()
      .then( data => { return res.json( data ) })
      .catch( err =>  next(errorMethods.sendServerError(err)))
}

/**
 * get overview of invoices api
 * @route GET /invoices/reports/summary
 */
function getTotalRevenueAndInvAmountforReports( req, res, next ){
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  if( fromDate !== undefined && toDate !== undefined ){
    invoiceService.invoiceSummaryForReportsWithTimeFrame( fromDate, toDate )
    .then( data => { return res.json( data ) })
    .catch( err =>  next(errorMethods.sendServerError(err)))
  } else {
    invoiceService.invoiceSummaryForReports()
    .then( data => { return res.json( data ) })
    .catch( err =>  next(errorMethods.sendServerError(err)))
  }
}

/**
 * get overview of invoices api
 * @route GET /invoices/reports/summary/:id
 */
function getTotalRevenueAndInvAmountforReportsWithClient( req, res, next ){
  let clientid = req.params.id;
  console.log(clientid );
  if( clientid === undefined || clientid === "" ){
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  } else {
    invoiceService.invoiceSummaryForReportsWithClient( clientid )
      .then( data => { return res.json( data ) })
      .catch( err =>  next(errorMethods.sendServerError(err)))
  }
}

//invoice summary percent
function invoiceSummaryPercent( req, res, next ){
  invoiceService.invoiceSummaryPercent()
  .then( data => { return res.json( data ) })
  .catch( err =>  next(errorMethods.sendServerError(err)))
}


//invoices issued by months
function invoicesIssuedByMonths( req, res, next ){
  invoiceService.invoicesIssuedByMonths()
  .then( data => { return res.json( data ) })
  .catch( err =>  next(errorMethods.sendServerError(err)))
}

//paid invoices by months
function paidInvoicesByMonths( req, res, next ){
  invoiceService.paidInvoicesByMonths()
  .then( data => { return res.json( data ) })
  .catch( err =>  next(errorMethods.sendServerError(err)))
}

//invoice summary
function invoiceCompleteSummary(req, res, next) {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;
  invoiceService.invoiceCompleteSummary(startDate, endDate).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

//revenue till data
function revenueTillDate( req, res, next ){
  invoiceService.revenueTillDate()
  .then( data => { return res.json( data ) })
  .catch( err =>  next(errorMethods.sendServerError(err)))
}



//revenue this month
function revenueThisMonth( req, res, next ){
  startDate = req.query.from;
  endDate = req.query.to;
  invoiceService.revenueThisMonth(startDate, endDate)
  .then( data => { return res.json( data ) })
  .catch( err =>  next(errorMethods.sendServerError(err)))
}

function dueTillDate(req,res,next){
  invoiceService.dueTillDate().then( data => { 
    return res.json( data ) })
  .catch( err =>  next(errorMethods.sendServerError(err)))
}

function summaryTab(req,res,next){
  from = req.query.from;
  to = req.query.to;
  invoiceService.summaryTab(from, to).then( data => { 
    return res.json( data ) })
  .catch( err =>  next(errorMethods.sendServerError(err)))
}

function invDist(req,res,next){
  invoiceService.invDist().then( data => { 
    return res.json( data ) })
  .catch( err =>  next(errorMethods.sendServerError(err)))
}

function invoicesTable(req,res,next){
  startDate = req.body.from;
  endDate = req.body.to;
  invoiceService.invoicesTable(startDate, endDate).then( data => { 
    return res.json( data ) })
  .catch( err =>  next(errorMethods.sendServerError(err)))
}

module.exports.init = init;
