// var kanbanModel = require("../models/kanban.model");
// var currentContext = require('../../common/currentContext');

// var kanbanService = {
//     getAllKanbans: getAllKanbans,
//     getKanbanById: getKanbanById,
//     addKanban: addKanban,
//     updateKanban: updateKanban,
//     deleteKanban: deleteKanban,
//     getKanbanByKanbanName: getKanbanByKanbanName,
//     getKanbansByPage: getKanbansByPage,
//     getAllKanbansCount: getAllKanbansCount,
//     getKanbansByPageWithSort: getKanbansByPageWithSort,
//     groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
//     searchKanbans: searchKanbans
  
// }

// function addKanban(kanbanData) {
//     return new Promise((resolve,reject) => {
//         var user = currentContext.getCurrentContext();
//         kanbanData.createdBy = user.email;
//         kanbanData.lastModifiedBy = user.email;
        
//         kanbanModel.create(kanbanData).then((data)=>{
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     })
   
// }
// function updateKanban(id, kanbanData, callback) {
//     return new Promise((resolve, reject) => {
//         var user = currentContext.getCurrentContext();
//         kanbanData.lastModifiedBy = user.email;

//         kanbanModel.updateById(id, kanbanData).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     })

// }

// function deleteKanban(id) {
//     return new Promise((resolve, reject) => {
//         kanbanModel.deletebyId(id).then((data) => {
//             resolve({ 'success': true });
//         }).catch((err) => {
//             reject(err);
//         })
//     })
// }

// function getAllKanbans() {
//     return new Promise((resolve, reject) => {
//         kanbanModel.search({}).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getKanbanById(id) {
//     return new Promise((resolve, reject) => {
//         kanbanModel.getById(id).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getKanbanByKanbanName(kanbanName, tenant) {
//     return new Promise((resolve, reject) => {
//         kanbanModel.searchOne({ 'kanbanName': kanbanName }).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getAllKanbansCount(query) {
//     return new Promise((resolve, reject) => {
//         kanbanModel.countDocuments(query).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getKanbansByPage(pageNo, pageSize) {
//     const options = {};
//     options.skip = pageSize * (pageNo - 1);
//     options.limit = pageSize;

//     return new Promise((resolve, reject) => {
//         kanbanModel.getPaginatedResult({}, options).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getKanbansByPageWithSort(pageNo, pageSize, sortBy) {
//     const options = {};
//     const sortTemp = {};
//     sortTemp[sortBy] = 1;
//     options.skip = pageSize * (pageNo - 1);
//     options.limit = pageSize;
//     options.sort = sortTemp;

//     return new Promise((resolve, reject) => {
//         kanbanModel.getPaginatedResult({}, options).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function groupByKeyAndCountDocuments(key) {
//     return new Promise((resolve, reject) => {
//         kanbanModel.groupByKeyAndCountDocuments(key).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function searchKanbans(searchCriteria) {
//     let pageSize = searchCriteria.pageSize;
//     let pageNo = searchCriteria.pageNo;
//     let query = searchCriteria.query;
//     const options = {};
//     options.skip = pageSize * (pageNo - 1);
//     options.limit = pageSize;
//     return new Promise((resolve, reject) => {
//         kanbanModel.getPaginatedResult(query, options).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }





// module.exports = kanbanService;

