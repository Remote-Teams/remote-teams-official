// const sprintService = require('../services/sprint.service');
// var schema = require('../schemas/sprint.validation.schema.json')
// var iValidator = require('../../common/iValidator');
// var errorCode = require('../../common/error-code');
// var logger = require('../../config/winston')(__filename);
// var errorCode = require('../../common/error-code');
// var errorMethods = require('../../common/error-methods');
// var accessResolver = require('../../common/accessResolver');
// var generator = require('../../common/idGenerator');
// const redis = require('redis');
// var configResolve = require("../../common/configResolver");
// const redisHost = configResolve.getConfig().redisHost;
// const client = redis.createClient({ host: redisHost, port: 6379 })


// function init(router) {
//   router.route('/sprints')
//     .get(getAllSprints)
//     .post(addSprint);
//   router.route('/sprints/count')
//     .get(getAllSprintsCount);
//   router.route('/sprints/overview')
//     .get(getAllSprintsOverview);
//   router.route('/sprints/graph/overview/:id')
//     .get( getAllSprintsChartWithModulesId );
//   router.route('/sprints/:id')
//     .get(getSprintById)
//     .delete(deleteSprint)
//     .put(updateSprint);
//   router.route('/sprints/search')
//     .post(searchSprints);
//   router.route('/sprints/search/text')
//     .get(textSearch);
//   // router.route('/sprints/exist')
//   //   .get(isExist);
// }

// /**
//  * Get all a sprints api
//  * @route GET /api/sprints
//  * @group sprints - Operations about sprints
//  * @returns {object} 200 - An object of sprints info
//  * @returns {Error}  default - Unexpected error
//  */
// function getAllSprints(req, res, next) {
//   var pageNo = parseInt(req.query.pageNo);
//   var pageSize = parseInt(req.query.pageSize);
//   var sortBy = req.query.sortBy;
// if (pageNo > 0 && pageSize > 0 && !isNaN(pageSize) ) {
//     if (sortBy != null || sortBy != undefined) {
//       sprintService.getSprintsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
//       res.send(data);
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err));
//     });
//     } else {
//       sprintService.getSprintsByPage(pageNo, pageSize).then((data) => {
//       res.send(data);
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err));
//     });
//     }
//   } else {
//     sprintService.getAllSprints().then((data) => {
//     res.send(data);
//   }).catch((err) => {
//     next(errorMethods.sendServerError(err));
//   });
//   }
// }

// /**
//  * @typedef SearchCriteria
//  * @property {string} pageSize.required
//  * @property {string} pageNo.required 
//  * @property {string} query.required 
//  */
// /**
//  * Search sprints api
//  * @route POST /api/sprints/search
//  * @group sprints - Operations about sprints
//  * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
//  * @returns {object} 200 - An object of sprints info
//  * @returns {Error}  default - Unexpected error
//  */
// function searchSprints(req, res, next) {
//   let searchCriteria = req.body;
//   sprintService.searchSprints(searchCriteria).then((data) => {
//     res.json(data);
//   }).catch((err) => {
//     next(errorMethods.sendServerError(err));
//   });
// }

// /**
//  * Get sprints by id api
//  * @route GET /api/sprints/:id
//  * @group sprints - Operations about sprints
//  * @returns {object} 200 - An object of sprints info
//  * @returns {Error}  default - Unexpected error
//  */
// function getSprintById(req,res,next) {

//   let sprintId = req.params.id;

//   console.log("id"+ sprintId);
//   var json_format = iValidator.json_schema(schema.getSchema,sprintId,"sprint");
//   if (json_format.valid == false) {
//     return res.status(422).send(json_format.errorMessage);
//   }
//   sprintService.getSprintById(sprintId).then((data) => {
//       if(data == undefined || data.size == 0){
//         return next(errorMethods.sendBadRequest(errorCode.SPRINT_DOES_NOT_EXIST));
//       }
//       res.send(data);
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err));
//     });
// }

// /**
//  * add sprints api
//  * @route POST /api/sprints
//  * @group sprints - Operations about sprints
//  * @param {object} sprint.body.required - sprints details
//  * @returns {object} 200 - An object of sprints info
//  * @returns {Error}  default - Unexpected error
//  */
// function addSprint(req,res, next) {
//   var sprintData=req.body;
  
  
//   //Validating the input entity
//    var json_format = iValidator.json_schema(schema.postSchema, sprintData, "sprint");
//    if (json_format.valid == false) {
//      return res.status(422).send(json_format.errorMessage);
//    }
//    sprintService.getSprintBySprintName(sprintData.name).then((data)=>{
//     if(data != undefined && data.length > 0){
//       return next(errorMethods.sendBadRequest(errorCode.SPRINT_ALREADY_EXISTS));
//     }else{
//       sprintService.addSprint(sprintData).then((data) => {
//         res.json(data);
//       }).catch((err) => {
//         next(errorMethods.sendServerError(err));
//       });
//     }
//   }).catch((err) => {
//     next(errorMethods.sendServerError(err));
//   });

// }

// /**
//  * update sprints by id api
//  * @route PUT /api/sprints
//  * @group sprints - Operations about sprints
//  * @returns {object} 200 - An object of sprints info
//  * @returns {Error}  default - Unexpected error
//  */
// function updateSprint(req,res, next) {
//    var sprintData=req.body;
//    var id = req.params.id;
//    sprintService.getSprintById(id).then((data)=>{
//     if(data == undefined || data.length == 0){
//       return next(errorMethods.sendBadRequest(errorCode.SPRINT_DOES_NOT_EXIST));
//     }else{
//       sprintService.updateSprint(id,sprintData).then((data)=>{
//         res.json(data);
//       }).catch((err)=>{
//       next(errorMethods.sendServerError(err));
//      });
//     }
//   });
// }

// /**
//  * delete sprints by id api
//  * @route DELETE /api/sprints/:id
//  * @group sprints - Operations about sprints
//  * @returns {object} 200 - An object of sprints info
//  * @returns {Error}  default - Unexpected error
//  */
// function deleteSprint(req,res, next) {
//   var delId = req.params.id;
//   if (!delId) {
//     return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
//   }
//   sprintService.getSprintById(delId).then((data)=>{
//     if(data == undefined || data.length == 0){
//       return next(errorMethods.sendBadRequest(errorCode.SPRINT_DOES_NOT_EXIST));
//     }else{
//       sprintService.deleteSprint(delId).then((data)=>{
//         res.json(data);
//       }).catch((err)=>{
//         next(errorMethods.sendServerError(err));
//       });
//     }
//   });
// }

// /**
//  * Get sprints count api
//  * @route GET /api/sprints/count
//  * @group sprints - Operations about sprints
//  * @returns {object} 200 - An object of sprints info
//  * @returns {Error}  default - Unexpected error
//  */
// function getAllSprintsCount(req,res,next) {
//   sprintService.getAllSprintsCount().then((data) => {
//       if(data == undefined){
//         return next(errorMethods.sendBadRequest(errorCode.SPRINT_DOES_NOT_EXIST));
//       }
//       res.send({ 'count': data });
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err));
//     });
// }

// /**
//  * get overview of sprints api
//  * @route GET /api/sprints/overview
//  * @group sprints - Operations about sprints
//  * @returns {object} 200 - An object of sprints info
//  * @returns {Error}  default - Unexpected error
//  */
// function getAllSprintsOverview(req, res, next) {
//   let overviewKey = req.query.key;
//   if (!overviewKey) {
//     return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
//   }
//   sprintService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
//     res.send(data);
//   }).catch((err) => {
//     next(errorMethods.sendServerError(err));
//   });
// }

// /*
// text search function
// */

// function textSearch(req, res, next) {
//   let text = req.query.text;
//   sprintService.textSearch(text).then((data) => {
//     res.json(data);
//   }).catch((err) => {
//     next(errorMethods.sendServerError(err));
//   });
// }

// /**
//  * GET GRAPH DATA WITH OVERVIEW
//  * @route GET /sprints/graph/overview/:id
//  */
// function getAllSprintsChartWithModulesId( req, res, next ){
//   let module = req.params.id;
//   sprintService.getAllSprintsChartWithModuleId(module  )
//   .then((data) => {
//     res.json(data);
//   }).catch((err) => {
//     next(errorMethods.sendServerError(err));
//   });
// } 


// module.exports.init = init;