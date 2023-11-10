// const klistService = require('../services/klist.service');
// var schema = require('../schemas/kanbanlist.validation.schema.json')
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
//   router.route('/klists')
//     .get(getAllKlists)
//     .post(addKlist);
//   router.route('/klists/count')
//     .get(getAllKlistsCount);
//   router.route('/klists/overview')
//     .get(getAllKlistsOverview);
//   router.route('/klists/:id')
//     .get(getKlistById)
//     .delete(deleteKlist)
//     .put(updateKlist);
//   router.route('/klists/search')
//     .post(searchKlists);
// }

// /**
//  * Get all klists api
//  * @route GET /api/klists
//  * @group klists - Operations about klists
//  * @returns {object} 200 - An object of klists info
//  * @returns {Error}  default - Unexpected error
//  */
// function getAllKlists(req, res, next) {
//   var pageNo = parseInt(req.query.pageNo);
//   var pageSize = parseInt(req.query.pageSize);
//   var sortBy = req.query.sortBy;

//   if (pageNo > 0 && !isNaN(pageNo) && !pageSize > 0 && !isNaN(pageSize)) {
//     if (sortBy != null || sortBy != undefined) {
//       klistService.getKlistsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
//       res.send(data);
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err));
//     });
//     } else {
//       klistService.getKlistsByPage(pageNo, pageSize).then((data) => {
//       res.send(data);
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err));
//     });
//     }
//   } else {
//     klistService.getAllKlists().then((data) => {
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
//  * Search klists api
//  * @route POST /api/klists/search
//  * @group klists - Operations about projects
//  * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
//  * @returns {object} 200 - An object of klists info
//  * @returns {Error}  default - Unexpected error
//  */
// function searchKlists(req, res, next) {
//   let searchCriteria = req.body;
//   klistService.searchKlists(searchCriteria).then((data) => {
//     res.json(data);
//   }).catch((err) => {
//     next(errorMethods.sendServerError(err));
//   });
// }


// /**
//  * Get klists by id api
//  * @route GET /api/klists/:id
//  * @group klists - Operations about projects
//  * @returns {object} 200 - An object of klists info
//  * @returns {Error}  default - Unexpected error
//  */
// function getKlistById(req,res,next) {

//   let klistId = req.params.id;

//   console.log("id"+ klistId);
//   var json_format = iValidator.json_schema(schema.getSchema,klistId,"klist");
//   if (json_format.valid == false) {
//     return res.status(422).send(json_format.errorMessage);
//   }
//   klistService.getKlistById(klistId).then((data) => {
//       if(data == undefined || data.size == 0){
//         return next(errorMethods.sendBadRequest(errorCode.KLIST_DOES_NOT_EXIST));
//       }
//       res.send(data);
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err));
//     });
// }

// /**
//  * add klists api
//  * @route POST /api/klists
//  * @group klists - Operations about projects
//  * @param {object} klist.body.required - klists details
//  * @returns {object} 200 - An object of klists info
//  * @returns {Error}  default - Unexpected error
//  */
// function addKlist(req,res, next) {
//   var klistData=req.body;
  
  
//   //Validating the input entity
//    var json_format = iValidator.json_schema(schema.postSchema, klistData, "klist");
//    if (json_format.valid == false) {
//      return res.status(422).send(json_format.errorMessage);
//    }
//   {
//       klistService.addKlist(klistData).then((data) => {
//         res.json(data);
//       }).catch((err) => {
//         next(errorMethods.sendServerError(err));
//       });
//     }

// }

// /**
//  * update klists by id api
//  * @route PUT /api/klists
//  * @group klists - Operations about klists
//  * @returns {object} 200 - An object of klists info
//  * @returns {Error}  default - Unexpected error
//  */
// function updateKlist(req,res, next) {
//    var klistData=req.body;
//    var id = req.params.id;
//    klistService.getKlistById(id).then((data)=>{
//     if(data == undefined || data.length == 0){
//       return next(errorMethods.sendBadRequest(errorCode.KLIST_DOES_NOT_EXIST));
//     }else{
//       klistService.updateKlist(id,klistData).then((data)=>{
//         res.json(data);
//       }).catch((err)=>{
//       next(errorMethods.sendServerError(err));
//      });
//     }
//   });
// }

// /**
//  * delete klists by id api
//  * @route DELETE /api/klists/:id
//  * @group klists - Operations about klists
//  * @returns {object} 200 - An object of klists info
//  * @returns {Error}  default - Unexpected error
//  */
// function deleteKlist(req,res, next) {
//   var delId = req.params.id;
//   if (!delId) {
//     return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
//   }
//   klistService.getKlistById(delId).then((data)=>{
//     if(data == undefined || data.length == 0){
//       return next(errorMethods.sendBadRequest(errorCode.KLIST_DOES_NOT_EXIST));
//     }else{
//       klistService.deleteKlist(delId).then((data)=>{
//         res.json(data);
//       }).catch((err)=>{
//         next(errorMethods.sendServerError(err));
//       });
//     }
//   });
// }

// /**
//  * Get klists count api
//  * @route GET /api/klists/count
//  * @group klists - Operations about klists
//  * @returns {object} 200 - An object of klists info
//  * @returns {Error}  default - Unexpected error
//  */
// function getAllKlistsCount(req,res,next) {
//   klistService.getAllKlistsCount().then((data) => {
//       if(data == undefined){
//         return next(errorMethods.sendBadRequest(errorCode.KLIST_DOES_NOT_EXIST));
//       }
//       res.send({ 'count': data });
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err));
//     });
// }

// /**
//  * get overview of klists api
//  * @route GET /api/klists/overview
//  * @group klists - Operations about klists
//  * @returns {object} 200 - An object of klists info
//  * @returns {Error}  default - Unexpected error
//  */
// function getAllKlistsOverview(req, res, next) {
//   let overviewKey = req.query.key;
//   if (!overviewKey) {
//     return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
//   }
//   klistService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
//     res.send(data);
//   }).catch((err) => {
//     next(errorMethods.sendServerError(err));
//   });
// }



// /*possible routes required - 

// 1. average cost of team on project
// 2. total cost of team on project
// 3. open tasks in this project
// 4. sprints in this project
// 5. total tasks in this project
// 6. api that returns actual cost of the project
// 7. api that returns actual consumed hours for the project
// 8. api that returns the total expenses so far on the project
// 9. api to return the upcoming scrums in the project
// 10. api that returns all tasks in the project

// */

// module.exports.init = init;
