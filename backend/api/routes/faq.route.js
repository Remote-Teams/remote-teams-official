const faqService = require('../services/faq.service');
var schema = require('../schemas/faq.validation.schema.json')
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
  router.route('/faqs')
    .get(getAllFaqs)
    .post(addFaq);
  router.route('/faqs/count')
    .get(getAllFaqsCount);
  router.route('/faqs/overview')
    .get(getAllFaqsOverview);
  router.route('/faqs/:id')
    .get(getFaqById)
    .delete(deleteFaq)
    .put(updateFaq);
  router.route('/faqs/search')
    .post(searchFaqs);
}

/**
 * Get all faqs api
 * @route GET /api/faqs
 * @group faqs - Operations about faqs
 * @returns {object} 200 - An object of faqs info
 * @returns {Error}  default - Unexpected error
 */
function getAllFaqs(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      faqService.getFaqsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      faqService.getFaqsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    faqService.getAllFaqs().then((data) => {
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
 * Search faqs api
 * @route POST /api/faqs/search
 * @group faqs - Operations about faq
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of faqs info
 * @returns {Error}  default - Unexpected error
 */
function searchFaqs(req, res, next) {
  let searchCriteria = req.body;
  faqService.searchFaqs(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * Get faqs by id api
 * @route GET /api/faqs/:id
 * @group faqs - Operations about faq
 * @returns {object} 200 - An object of faqs info
 * @returns {Error}  default - Unexpected error
 */
function getFaqById(req,res,next) {

  let faqId = req.params.id;

  console.log("id"+ faqId);
  var json_format = iValidator.json_schema(schema.getSchema,faqId,"faq");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  faqService.getFaqById(faqId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.FAQ_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add faqs api
 * @route POST /api/faqs
 * @group faqs - Operations about faq
 * @param {object} faq.body.required - faqs details
 * @returns {object} 200 - An object of faqs info
 * @returns {Error}  default - Unexpected error
 */
function addFaq(req,res, next) {
  var faqData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, faqData, "faq");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
  {
      faqService.addFaq(faqData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }

}

/**
 * update faqs by id api
 * @route PUT /api/faqs
 * @group faqs - Operations about faqs
 * @returns {object} 200 - An object of faqs info
 * @returns {Error}  default - Unexpected error
 */
function updateFaq(req,res, next) {
   var faqData=req.body;
   var id = req.params.id;
   faqService.getFaqById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.FAQ_DOES_NOT_EXIST));
    }else{
      faqService.updateFaq(id,faqData).then((data)=>{
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
function deleteFaq(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  faqService.getFaqById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.FAQ_DOES_NOT_EXIST));
    }else{
      faqService.deleteFaq(delId).then((data)=>{
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
function getAllFaqsCount(req,res,next) {
  faqService.getAllFaqsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.FAQ_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of faqs api
 * @route GET /api/faqs/overview
 * @group faqs - Operations about faqs
 * @returns {object} 200 - An object of faqs info
 * @returns {Error}  default - Unexpected error
 */
function getAllFaqsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  faqService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}



/*possible routes required - 

1. average cost of team on project
2. total cost of team on project
3. open tasks in this project
4. sprints in this project
5. total tasks in this project
6. api that returns actual cost of the project
7. api that returns actual consumed hours for the project
8. api that returns the total expenses so far on the project
9. api to return the upcoming scrums in the project
10. api that returns all tasks in the project

*/

module.exports.init = init;
