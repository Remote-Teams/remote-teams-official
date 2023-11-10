// var klistModel = require("../models/klist.model");
// var currentContext = require('../../common/currentContext');

// var klistService = {
//     getAllKlists: getAllKlists,
//     getKlistById: getKlistById,
//     addKlist: addKlist,
//     updateKlist: updateKlist,
//     deleteKlist: deleteKlist,
//     getKlistByKlistName: getKlistByKlistName,
//     getKlistsByPage: getKlistsByPage,
//     getAllKlistsCount: getAllKlistsCount,
//     getKlistsByPageWithSort: getKlistsByPageWithSort,
//     groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
//     searchKlists: searchKlists,
//     textSearch: textSearch
// }

// function addKlist(klistData) {
//     return new Promise((resolve,reject) => {
//         var user = currentContext.getCurrentContext();
//         klistData.createdBy = user.email;
//         klistData.lastModifiedBy = user.email;
        
//         klistModel.create(klistData).then((data)=>{
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     })
   
// }
// function updateKlist(id, klistData, callback) {
//     return new Promise((resolve, reject) => {
//         var user = currentContext.getCurrentContext();
//         klistData.lastModifiedBy = user.email;

//         klistModel.updateById(id, klistData).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     })

// }

// function deleteKlist(id) {
//     return new Promise((resolve, reject) => {
//         klistModel.deletebyId(id).then((data) => {
//             resolve({ 'success': true });
//         }).catch((err) => {
//             reject(err);
//         })
//     })
// }

// function getAllKlists() {
//     return new Promise((resolve, reject) => {
//         klistModel.search({}).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getKlistById(id) {
//     return new Promise((resolve, reject) => {
//         klistModel.getById(id).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getKlistByKlistName(klistName, tenant) {
//     return new Promise((resolve, reject) => {
//         klistModel.searchOne({ 'klistName': klistName }).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getAllKlistsCount(query) {
//     return new Promise((resolve, reject) => {
//         klistModel.countDocuments(query).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getKlistsByPage(pageNo, pageSize) {
//     const options = {};
//     options.skip = pageSize * (pageNo - 1);
//     options.limit = pageSize;

//     return new Promise((resolve, reject) => {
//         klistModel.getPaginatedResult({}, options).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function getKlistsByPageWithSort(pageNo, pageSize, sortBy) {
//     const options = {};
//     const sortTemp = {};
//     sortTemp[sortBy] = 1;
//     options.skip = pageSize * (pageNo - 1);
//     options.limit = pageSize;
//     options.sort = sortTemp;

//     return new Promise((resolve, reject) => {
//         klistModel.getPaginatedResult({}, options).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function groupByKeyAndCountDocuments(key) {
//     return new Promise((resolve, reject) => {
//         klistModel.groupByKeyAndCountDocuments(key).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

// function searchKlists(searchCriteria) {
//     let pageSize = searchCriteria.pageSize;
//     let pageNo = searchCriteria.pageNo;
//     let query = searchCriteria.query;
//     const options = {};
//     options.skip = pageSize * (pageNo - 1);
//     options.limit = pageSize;
//     return new Promise((resolve, reject) => {
//         klistModel.getPaginatedResult(query, options).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }



// function textSearch(text) {
//     return new Promise((resolve, reject) => {
//         klistModel.getTextSearchResult(text).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }



// module.exports = klistService;

