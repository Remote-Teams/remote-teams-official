// var moduleModel = require("../models/module.model");
// var taskModel = require("../models/task.model");
// var currentContext = require('../../common/currentContext');
// var activityService = require('./activity.service');

// var moduleService = {
//     getAllModules: getAllModules,
//     getModuleById: getModuleById,
//     addModule: addModule,
//     updateModule: updateModule,
//     deleteModule: deleteModule,
//     getModuleByModuleName: getModuleByModuleName,
//     getModulesByPage: getModulesByPage,
//     getAllModulesCount: getAllModulesCount,
//     getModulesByPageWithSort: getModulesByPageWithSort,
//     groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
//     searchModules: searchModules,
//     textSearch: textSearch,
//     getGanttView:getGanttView,
//     getModByProj: getModByProj,
//     modHealth: modHealth
// }

// function addModule(moduleData) {
//     return new Promise((resolve,reject) => {
//         var user = currentContext.getCurrentContext();
//         moduleData.createdBy = user.email;
//         moduleData.lastModifiedBy = user.email;
//         moduleModel.create(moduleData).then((data)=>{
//             let activityData = {
//                 "entityType":"TIMELINE",
//                 "activityType":"CREATE",
//                 "data":data,
//                 "user":user.userId,
//                 "projectId":data.project,
//                 "text":"Module "+ data.name +" was created"
//             };
//             activityService.addActivity( activityData );
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     })
   
// }
// function updateModule(id, moduleData, callback) {
//     return new Promise((resolve, reject) => {
//         var user = currentContext.getCurrentContext();
//         moduleData.lastModifiedBy = user.email;
//         moduleModel.updateById(id, moduleData).then((data) => {
//             let activityData = {
//                 "entityType":"TIMELINE",
//                 "activityType":"UPDATE",
//                 "data":data,
//                 "user":user.userId,
//                 "projectId":data.project,
//                 "text":"Module "+ data.name +" was updated"
//             };
//             activityService.addActivity( activityData );
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     })

// }

// function deleteModule(id) {
//     return new Promise((resolve, reject) => {
//         moduleModel.deletebyId(id).then((data) => {
//             resolve({ 'success': true });
//         }).catch((err) => {
//             reject(err);
//         })
//     })
// }

// function getAllModules() {
//     return new Promise((resolve, reject) => {
//         moduleModel.search({}).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getModuleById(id) {
//     return new Promise((resolve, reject) => {
//         moduleModel.getById(id).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getModuleByModuleName(moduleName, tenant) {
//     return new Promise((resolve, reject) => {
//         moduleModel.searchOne({ 'moduleName': moduleName }).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getAllModulesCount(query) {
//     return new Promise((resolve, reject) => {
//         moduleModel.countDocuments(query).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getModulesByPage(pageNo, pageSize) {
//     const options = {};
//     options.skip = pageSize * (pageNo - 1);
//     options.limit = pageSize;

//     return new Promise((resolve, reject) => {
//         moduleModel.getPaginatedResult({}, options).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getModulesByPageWithSort(pageNo, pageSize, sortBy) {
//     const options = {};
//     const sortTemp = {};
//     sortTemp[sortBy] = 1;
//     options.skip = pageSize * (pageNo - 1);
//     options.limit = pageSize;
//     options.sort = sortTemp;

//     return new Promise((resolve, reject) => {
//         moduleModel.getPaginatedResult({}, options).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function groupByKeyAndCountDocuments(key) {
//     return new Promise((resolve, reject) => {
//         moduleModel.groupByKeyAndCountDocuments(key).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function searchModules(searchCriteria) {
//     let pageSize = searchCriteria.pageSize;
//     let pageNo = searchCriteria.pageNo;
//     let query = searchCriteria.query;
//     const options = {};
//     options.skip = pageSize * (pageNo - 1);
//     options.limit = pageSize;
//     return new Promise((resolve, reject) => {
//         moduleModel.getPaginatedResult(query, options).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }



// function textSearch(text) {
//     return new Promise((resolve, reject) => {
//         moduleModel.getTextSearchResult(text).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }


// function getGanttView( projectId ){
//     return new Promise( async ( resolve, reject ) => {
//         try{
//            let response = await moduleModel.ganttView( projectId );
//             resolve( response );
//         } catch( err ){
//             reject( err );
//         }
//     })
// }

// function getModByProj(projectId){
//     return new Promise((resolve, reject) => {
//         moduleModel.search({"project":projectId}).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function modHealth(moduleId){
//     return new Promise((resolve, reject) => {
//         taskModel.moduleSchedule(moduleId).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// module.exports = moduleService;

