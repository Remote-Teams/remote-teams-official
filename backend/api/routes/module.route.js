// const moduleService = require('../services/module.service');
// var schema = require('../schemas/module.validation.schema.json')
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
//   router.route('/modules')
//     .get(getAllModules)
//     .post(addModule);
//   router.route('/modules/count')
//     .get(getAllModulesCount);
//   router.route('/modules/overview')
//     .get(getAllModulesOverview);
//   router.route('/modules/gantt/:id')
//     .get(getGantViewData);
//   router.route('/modules/:id')
//     .get(getModuleById)
//     .delete(deleteModule)
//     .put(updateModule);
//   router.route('/modules/search')
//     .post(searchModules);
//   router.route('/modules/search/text')
//     .get(textSearch);
//   }

// /**
//  * Get all modules api
//  * @route GET /api/modules
//  * @group modules - Operations about modules
//  * @returns {object} 200 - An object of modules info
//  * @returns {Error}  default - Unexpected error
//  */
// function getAllModules(req, res, next) {
//   var pageNo = parseInt(req.query.pageNo);
//   var pageSize = parseInt(req.query.pageSize);
//   var sortBy = req.query.sortBy;
//   if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
//     errMsg = { "error": true, "message": "invalid page number or page Size." };
//     res.send(errMsg);
//   }
//   else if (pageNo > 0) {
//     if (sortBy != null || sortBy != undefined) {
//       moduleService.getModulesByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
//       res.send(data);
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err));
//     });
//     } else {
//       moduleService.getModulesByPage(pageNo, pageSize).then((data) => {
//       res.send(data);
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err));
//     });
//     }
//   } else {
//     moduleService.getAllModules().then((data) => {
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
//  * Search modules api
//  * @route POST /api/modules/search
//  * @group modules - Operations about projects
//  * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
//  * @returns {object} 200 - An object of modules info
//  * @returns {Error}  default - Unexpected error
//  */
// function searchModules(req, res, next) {
//   let searchCriteria = req.body;
//   moduleService.searchModules(searchCriteria).then((data) => {
//     res.json(data);
//   }).catch((err) => {
//     next(errorMethods.sendServerError(err));
//   });
// }


// /**
//  * Get modules by id api
//  * @route GET /api/modules/:id
//  * @group modules - Operations about projects
//  * @returns {object} 200 - An object of modules info
//  * @returns {Error}  default - Unexpected error
//  */
// function getModuleById(req,res,next) {

//   let moduleId = req.params.id;

//   console.log("id"+ moduleId);
//   var json_format = iValidator.json_schema(schema.getSchema,moduleId,"module");
//   if (json_format.valid == false) {
//     return res.status(422).send(json_format.errorMessage);
//   }
//   moduleService.getModuleById(moduleId).then((data) => {
//       if(data == undefined || data.size == 0){
//         return next(errorMethods.sendBadRequest(errorCode.MODULE_DOES_NOT_EXIST));
//       }
//       res.send(data);
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err));
//     });
// }

// /**
//  * add modules api
//  * @route POST /api/modules
//  * @group modules - Operations about projects
//  * @param {object} module.body.required - modules details
//  * @returns {object} 200 - An object of modules info
//  * @returns {Error}  default - Unexpected error
//  */
// function addModule(req,res, next) {
//   var moduleData=req.body;
  
  
//   //Validating the input entity
//    var json_format = iValidator.json_schema(schema.postSchema, moduleData, "module");
//    if (json_format.valid == false) {
//      return res.status(422).send(json_format.errorMessage);
//    }
//   {
//       moduleService.addModule(moduleData).then((data) => {
//         res.json(data);
//       }).catch((err) => {
//         next(errorMethods.sendServerError(err));
//       });
//     }

// }

// /**
//  * update modules by id api
//  * @route PUT /api/modules
//  * @group modules - Operations about modules
//  * @returns {object} 200 - An object of modules info
//  * @returns {Error}  default - Unexpected error
//  */
// function updateModule(req,res, next) {
//    var moduleData=req.body;
//    var id = req.params.id;
//    moduleService.getModuleById(id).then((data)=>{
//     if(data == undefined || data.length == 0){
//       return next(errorMethods.sendBadRequest(errorCode.MODULE_DOES_NOT_EXIST));
//     }else{
//       moduleService.updateModule(id,moduleData).then((data)=>{
//         res.json(data);
//       }).catch((err)=>{
//       next(errorMethods.sendServerError(err));
//      });
//     }
//   });
// }

// /**
//  * delete modules by id api
//  * @route DELETE /api/modules/:id
//  * @group modules - Operations about modules
//  * @returns {object} 200 - An object of modules info
//  * @returns {Error}  default - Unexpected error
//  */
// function deleteModule(req,res, next) {
//   var delId = req.params.id;
//   if (!delId) {
//     return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
//   }
//   moduleService.getModuleById(delId).then((data)=>{
//     if(data == undefined || data.length == 0){
//       return next(errorMethods.sendBadRequest(errorCode.MODULE_DOES_NOT_EXIST));
//     }else{
//       moduleService.deleteModule(delId).then((data)=>{
//         res.json(data);
//       }).catch((err)=>{
//         next(errorMethods.sendServerError(err));
//       });
//     }
//   });
// }

// /**
//  * Get modules count api
//  * @route GET /api/modules/count
//  * @group modules - Operations about modules
//  * @returns {object} 200 - An object of modules info
//  * @returns {Error}  default - Unexpected error
//  */
// function getAllModulesCount(req,res,next) {
//   moduleService.getAllModulesCount().then((data) => {
//       if(data == undefined){
//         return next(errorMethods.sendBadRequest(errorCode.MODULE_DOES_NOT_EXIST));
//       }
//       res.send({ 'count': data });
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err));
//     });
// }

// /**
//  * get overview of modules api
//  * @route GET /api/modules/overview
//  * @group modules - Operations about modules
//  * @returns {object} 200 - An object of modules info
//  * @returns {Error}  default - Unexpected error
//  */
// function getAllModulesOverview(req, res, next) {
//   let overviewKey = req.query.key;
//   if (!overviewKey) {
//     return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
//   }
//   moduleService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
//   moduleService.textSearch(text).then((data) => {
//     res.json(data);
//   }).catch((err) => {
//     next(errorMethods.sendServerError(err));
//   });
// }


// /**
//  * GET DATA FOR GANTT VIEW
//  * @route GET /project/planning/gantt-view
//  */
// function getGantViewData( req, res, next ){
//   let projectid = req.params.id;
//   if (!projectid) {
//     return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
//   } else {
//     moduleService.getGanttView(projectid)
//       .then( data => { return res.json( data ) } )
//       .catch( err => next(errorMethods.sendServerError(err)) )
//   }
// }



// module.exports.init = init;
