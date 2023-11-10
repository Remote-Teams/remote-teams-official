// var sprintModel = require("../models/sprint.model");
// var taskModel = require("../models/task.model");
// var currentContext = require('../../common/currentContext');
// var activityService = require('./activity.service');

// var sprintService = {
//     getAllSprints: getAllSprints,
//     getSprintById:getSprintById,
//     addSprint: addSprint,
//     updateSprint:updateSprint,
//     deleteSprint:deleteSprint,
//     getSprintBySprintName: getSprintBySprintName,
//     getSprintsByPage: getSprintsByPage,
//     getAllSprintsCount: getAllSprintsCount,
//     getSprintsByPageWithSort: getSprintsByPageWithSort,
//     groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
//     searchSprints: searchSprints,
//     getSprintByName: getSprintByName,
//     textSearch: textSearch,
//     getAllSprintsChartWithModuleId:getAllSprintsChartWithModuleId,
//     getSprByProj: getSprByProj,
//     sprHealth: sprHealth
// }

// function addSprint(sprintData) {
//     return new Promise((resolve,reject) => {
//         var user = currentContext.getCurrentContext();
//         sprintData.createdBy = user.email;
//         sprintData.lastModifiedBy = user.email;
        
//         sprintModel.create(sprintData).then((data)=>{
//             let activityData = {
//                 "entityType":"TIMELINE",
//                 "activityType":"CREATE",
//                 "data":data,
//                 "user":user.userId,
//                 "projectId":data.project,
//                 "text":"Sprint "+ data.name +" was created"
//             };
//             activityService.addActivity( activityData );
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     })
   
// }

// function updateSprint(id,sprintData,callback) {
//     return new Promise((resolve,reject) => {
//         var user = currentContext.getCurrentContext();
//         sprintData.lastModifiedBy = user.email;
        
//         sprintModel.updateById(id,sprintData).then((data)=>{
//             let activityData = {
//                 "entityType":"ACTIVITY",
//                 "activityType":"UPDATE",
//                 "data":data,
//                 "user":user.userId,
//                 "projectId":data.project,
//                 "text":"Sprint "+ data.name +" was updated"
//             };
//             activityService.addActivity( activityData );
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     })
     
// }

// function deleteSprint(id) {
//     return new Promise((resolve,reject) => {
//         sprintModel.deletebyId(id).then((data)=>{
//             resolve({'success':true});
//         }).catch((err) => {
//             reject(err);
//         })
//     })
// }

// function getAllSprints() {
//     return new Promise((resolve,reject) => {
//         sprintModel.search({}).then((data)=>{
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getSprintById(id) {
//     return new Promise((resolve,reject) => {
//         sprintModel.getById(id).then((data)=>{
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getSprintBySprintName(sprintName, tenant){
//     return new Promise((resolve,reject) => {
//         sprintModel.searchOne({'sprintName': sprintName}).then((data)=>{
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getAllSprintsCount() {
//     return new Promise((resolve, reject) => {
//         sprintModel.countDocuments({}).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getSprintsByPage(pageNo, pageSize) {
//     const options = {};
//     options.skip = pageSize * (pageNo - 1);
//     options.limit = pageSize;

//     return new Promise((resolve, reject) => {
//         sprintModel.getPaginatedResult({}, options).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getSprintsByPageWithSort(pageNo, pageSize, sortBy) {
//     const options = {};
//     const sortTemp = {};
//     sortTemp[sortBy] = 1;
//     options.skip = pageSize * (pageNo - 1);
//     options.limit = pageSize;
//     options.sort = sortTemp;

//     return new Promise((resolve, reject) => {
//         sprintModel.getPaginatedResult({}, options).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function groupByKeyAndCountDocuments(key) {
//     return new Promise((resolve,reject) => {
//         sprintModel.groupByKeyAndCountDocuments(key).then((data)=>{
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function searchSprints(searchCriteria) {
//     let pageSize = searchCriteria.pageSize;
//     let pageNo = searchCriteria.pageNo;
//     let query = searchCriteria.query;
//     const options = {};
//     options.skip = pageSize * (pageNo - 1);
//     options.limit = pageSize;
//     return new Promise((resolve, reject) => {
//         sprintModel.getPaginatedResult(query, options).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getSprintByName(name) {
//     var query = {
//         name: name
//     }
//     return new Promise((resolve,reject) => {
//         sprintModel.search(query).then((data)=>{
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// //text search service

// function textSearch(text) {
//     return new Promise((resolve, reject) => {
//         sprintModel.getTextSearchResult(text).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getAllSprintsChartWithModuleId( module ){
//     return new Promise( async ( resolve, reject ) => {
//         try{
        
//             let response = await sprintModel.sprintChart(module);
//             resolve( response );
//         } catch ( err ){
//             reject(err);
//         }
//     })
// }

// function getSprByProj(projectId){
//     return new Promise((resolve, reject) => {
//         sprintModel.search({"project":projectId}).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function sprHealth(sprintId){
//     return new Promise((resolve, reject) => {
//         console.log("reached here atleast!")
//         taskModel.sprintSchedule(sprintId).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// module.exports = sprintService;

