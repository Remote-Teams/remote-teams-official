// const kanbanService = require('../services/kanban.service');
// var schema = require('../schemas/kanban.validation.schema.json')
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
//   router.route('/kanbans')
//     .get(getAllKanbans)
//     .post(addKanban);
//   router.route('/kanbans/count')
//     .get(getAllKanbansCount);
//   router.route('/kanbans/overview')
//     .get(getAllKanbansOverview);
//   router.route('/kanbans/:id')
//     .get(getKanbanById)
//     .delete(deleteKanban)
//     .put(updateKanban);
//   router.route('/kanbans/search')
//     .post(searchKanbans);
// }

// /**
//  * Get all kanbans api
//  * @route GET /api/kanbans
//  * @group kanbans - Operations about kanbans
//  * @returns {object} 200 - An object of kanbans info
//  * @returns {Error}  default - Unexpected error
//  */
// function getAllKanbans(req, res, next) {
//   var pageNo = parseInt(req.query.pageNo);
//   var pageSize = parseInt(req.query.pageSize);
//   var sortBy = req.query.sortBy;

//   if (pageNo > 0  &&  !isNaN(pageNo) && pageSize > 0 && !isNaN(pageSize) ) {
//     if (sortBy != null || sortBy != undefined) {
//       kanbanService.getKanbansByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
//       res.send(data);
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err));
//     });
//     } else {
//       kanbanService.getKanbansByPage(pageNo, pageSize).then((data) => {
//       res.send(data);
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err));
//     });
//     }
//   } else {
//     kanbanService.getAllKanbans().then((data) => {
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
//  * Search kanbans api
//  * @route POST /api/kanbans/search
//  * @group kanbans - Operations about projects
//  * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
//  * @returns {object} 200 - An object of kanbans info
//  * @returns {Error}  default - Unexpected error
//  */
// function searchKanbans(req, res, next) {
//   let searchCriteria = req.body;
//   kanbanService.searchKanbans(searchCriteria).then((data) => {
//     res.json(data);
//   }).catch((err) => {
//     next(errorMethods.sendServerError(err));
//   });
// }


// /**
//  * Get kanbans by id api
//  * @route GET /api/kanbans/:id
//  * @group kanbans - Operations about projects
//  * @returns {object} 200 - An object of kanbans info
//  * @returns {Error}  default - Unexpected error
//  */
// function getKanbanById(req,res,next) {

//   let kanbanId = req.params.id;

//   console.log("id"+ kanbanId);
//   var json_format = iValidator.json_schema(schema.getSchema,kanbanId,"kanban");
//   if (json_format.valid == false) {
//     return res.status(422).send(json_format.errorMessage);
//   }
//   kanbanService.getKanbanById(kanbanId).then((data) => {
//       if(data == undefined || data.size == 0){
//         return next(errorMethods.sendBadRequest(errorCode.MODULE_DOES_NOT_EXIST));
//       }
//       res.send(data);
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err));
//     });
// }

// /**
//  * add kanbans api
//  * @route POST /api/kanbans
//  * @group kanbans - Operations about projects
//  * @param {object} kanban.body.required - kanbans details
//  * @returns {object} 200 - An object of kanbans info
//  * @returns {Error}  default - Unexpected error
//  */
// function addKanban(req,res, next) {
//   var kanbanData=req.body;
  
  
//   //Validating the input entity
//    var json_format = iValidator.json_schema(schema.postSchema, kanbanData, "kanban");
//    if (json_format.valid == false) {
//      return res.status(422).send(json_format.errorMessage);
//    }
//   {
//       kanbanService.addKanban(kanbanData).then((data) => {
//         res.json(data);
//       }).catch((err) => {
//         next(errorMethods.sendServerError(err));
//       });
//     }

// }

// /**
//  * update kanbans by id api
//  * @route PUT /api/kanbans
//  * @group kanbans - Operations about kanbans
//  * @returns {object} 200 - An object of kanbans info
//  * @returns {Error}  default - Unexpected error
//  */
// function updateKanban(req,res, next) {
//    var kanbanData=req.body;
//    var id = req.params.id;
//    kanbanService.getKanbanById(id).then((data)=>{
//     if(data == undefined || data.length == 0){
//       return next(errorMethods.sendBadRequest(errorCode.MODULE_DOES_NOT_EXIST));
//     }else{
//       kanbanService.updateKanban(id,kanbanData).then((data)=>{
//         res.json(data);
//       }).catch((err)=>{
//       next(errorMethods.sendServerError(err));
//      });
//     }
//   });
// }

// /**
//  * delete kanbans by id api
//  * @route DELETE /api/kanbans/:id
//  * @group kanbans - Operations about kanbans
//  * @returns {object} 200 - An object of kanbans info
//  * @returns {Error}  default - Unexpected error
//  */
// function deleteKanban(req,res, next) {
//   var delId = req.params.id;
//   if (!delId) {
//     return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
//   }
//   kanbanService.getKanbanById(delId).then((data)=>{
//     if(data == undefined || data.length == 0){
//       return next(errorMethods.sendBadRequest(errorCode.MODULE_DOES_NOT_EXIST));
//     }else{
//       kanbanService.deleteKanban(delId).then((data)=>{
//         res.json(data);
//       }).catch((err)=>{
//         next(errorMethods.sendServerError(err));
//       });
//     }
//   });
// }

// /**
//  * Get kanbans count api
//  * @route GET /api/kanbans/count
//  * @group kanbans - Operations about kanbans
//  * @returns {object} 200 - An object of kanbans info
//  * @returns {Error}  default - Unexpected error
//  */
// function getAllKanbansCount(req,res,next) {
//   kanbanService.getAllKanbansCount().then((data) => {
//       if(data == undefined){
//         return next(errorMethods.sendBadRequest(errorCode.MODULE_DOES_NOT_EXIST));
//       }
//       res.send({ 'count': data });
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err));
//     });
// }

// /**
//  * get overview of kanbans api
//  * @route GET /api/kanbans/overview
//  * @group kanbans - Operations about kanbans
//  * @returns {object} 200 - An object of kanbans info
//  * @returns {Error}  default - Unexpected error
//  */
// function getAllKanbansOverview(req, res, next) {
//   let overviewKey = req.query.key;
//   if (!overviewKey) {
//     return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
//   }
//   kanbanService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
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
