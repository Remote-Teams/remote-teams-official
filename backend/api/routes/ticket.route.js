const ticketService = require('../services/ticket.service');
var schema = require('../schemas/ticket.validation.schema.json')
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
  router.route('/tickets')
    .get(getAllTickets)
    .post(addTicket);
  router.route('/tickets/count')
    .get(getAllTicketsCount);
  router.route('/tickets/overview')
    .get(getAllTicketsOverview);
  router.route('/tickets/search')
    .post(searchTickets);
  router.route('/tickets/summaryReport')
    .get(summaryReport);
  router.route('/tickets/ticketSummaryTillDate')
    .get(ticketSummaryTillDate);
  router.route('/tickets/ticketSummaryByTimeRange')
    .get(ticketSummaryThisMonth);
  router.route('/tickets/exist')
    .get(isExist);
  router.route('/tickets/ticketSummary')
    .get(ticketSummary);
  router.route('/tickets/summaryTab')
    .get(summaryTab);
  router.route('/tickets/:id')
    .get(getTicketById)
    .delete(deleteTicket)
    .put(updateTicket);
  router.route('/tickets/search/text')
    .get(textSearch);
}

/**
 * Get all a tickets api
 * @route GET /api/tickets
 * @group tickets - Operations about tickets
 * @returns {object} 200 - An object of tickets info
 * @returns {Error}  default - Unexpected error
 */
function getAllTickets(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
if (pageNo > 0  && !isNaN(pageNo) && pageSize > 0 && !isNaN(pageSize)) {
    if (sortBy != null || sortBy != undefined) {
      ticketService.getTicketsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      ticketService.getTicketsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    ticketService.getAllTickets().then((data) => {
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
 * Search tickets api
 * @route POST /api/tickets/search
 * @group tickets - Operations about tickets
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of tickets info
 * @returns {Error}  default - Unexpected error
 */
function searchTickets(req, res, next) {
  let searchCriteria = req.body;
  ticketService.searchTickets(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get tickets by id api
 * @route GET /api/tickets/:id
 * @group tickets - Operations about tickets
 * @returns {object} 200 - An object of tickets info
 * @returns {Error}  default - Unexpected error
 */
function getTicketById(req,res,next) {

  let ticketId = req.params.id;

  console.log("id"+ ticketId);
  var json_format = iValidator.json_schema(schema.getSchema,ticketId,"ticket");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  ticketService.getTicketById(ticketId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.TICKET_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add tickets api
 * @route POST /api/tickets
 * @group tickets - Operations about tickets
 * @param {object} ticketData.body.required - tickets details
 * @returns {object} 200 - An object of tickets info
 * @returns {Error}  default - Unexpected error
 */
function addTicket(req,res, next) {
  var ticketData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, ticketData, "ticket");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   ticketService.getTicketByTicketName(ticketData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.TICKET_ALREADY_EXISTS));
    }else{
      ticketService.addTicket(ticketData).then((data) => {
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
 * update tickets by id api
 * @route PUT /api/tickets
 * @group tickets - Operations about tickets
 * @returns {object} 200 - An object of tickets info
 * @returns {Error}  default - Unexpected error
 */
function updateTicket(req,res, next) {
   var ticketData=req.body;
   var id = req.params.id;
   ticketService.getTicketById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.TICKET_DOES_NOT_EXIST));
    }else{
      ticketService.updateTicket(id,ticketData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete tickets by id api
 * @route DELETE /api/tickets/:id
 * @group tickets - Operations about tickets
 * @returns {object} 200 - An object of tickets info
 * @returns {Error}  default - Unexpected error
 */
function deleteTicket(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  ticketService.getTicketById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.TICKET_DOES_NOT_EXIST));
    }else{
      ticketService.deleteTicket(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get tickets count api
 * @route GET /api/tickets/count
 * @group tickets - Operations about tickets
 * @returns {object} 200 - An object of tickets info
 * @returns {Error}  default - Unexpected error
 */
function getAllTicketsCount(req,res,next) {
  ticketService.getAllTicketsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.TICKET_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get tickets of quotations api
 * @route GET /api/tickets/overview
 * @group tickets - Operations about tickets
 * @returns {object} 200 - An object of tickets info
 * @returns {Error}  default - Unexpected error
 */
function getAllTicketsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  ticketService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is tickets exist api
 * @route GET /api/tickets/exist
 * @group tickets - Operations about tickets
 * @param {string} ticketame.query.required - tickets name
 * @returns {object} 200 - An object of tickets info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let subject = req.query.subject;
  let projectId = req.query.projectId
  console.log("subject:" + subject);
  var json_format = iValidator.json_schema(schema.existSchema, subject, "subject");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  ticketService.getTicketByProjectId(projectId, subject).then((data) => {
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
  ticketService.textSearch(text).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * the ticket summary function
 */

function ticketSummary(req, res, next) {
  ticketService.ticketSummary().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


// total summary till date
function ticketSummaryTillDate(req, res, next) {
  ticketService.ticketSummaryTillDate().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

//ticket summary this month
function ticketSummaryThisMonth(req, res, next) {
  let startDate = req.query.from;
  let endDate = req.query.to;
  ticketService.ticketSummaryThisMonth(startDate, endDate).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function summaryReport(req, res, next) {
ticketService.summaryReport().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function summaryTab(req, res, next) {
  let from = req.query.from;
  let to = req.query.to;
  ticketService.summaryTab(from, to).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;