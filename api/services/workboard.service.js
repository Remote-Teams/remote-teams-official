var workboardModel = require("../models/workboard.model");
var currentContext = require('../../common/currentContext');

var workboardService = {
    getAllWorkboards: getAllWorkboards,
    getWorkboardById:getWorkboardById,
    addWorkboard: addWorkboard,
    updateWorkboard:updateWorkboard,
    deleteWorkboard:deleteWorkboard,
    getWorkboardByWorkboardName: getWorkboardByWorkboardName,
    getWorkboardsByPage: getWorkboardsByPage,
    getAllWorkboardsCount: getAllWorkboardsCount,
    getWorkboardsByPageWithSort: getWorkboardsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchWorkboards: searchWorkboards,
    getWorkboardByName: getWorkboardByName
}

function addWorkboard(workboardData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        workboardData.createdBy = user.email;
        workboardData.lastModifiedBy = user.email;
        
        workboardModel.create(workboardData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateWorkboard(id,workboardData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        workboardData.lastModifiedBy = user.email;
        
        workboardModel.updateById(id,workboardData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteWorkboard(id) {
    return new Promise((resolve,reject) => {
        workboardModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllWorkboards() {
    return new Promise((resolve,reject) => {
        workboardModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorkboardById(id) {
    return new Promise((resolve,reject) => {
        workboardModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorkboardByWorkboardName(workboardName, tenant){
    return new Promise((resolve,reject) => {
        workboardModel.searchOne({'workboardName': workboardName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllWorkboardsCount() {
    return new Promise((resolve, reject) => {
        workboardModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorkboardsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        workboardModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorkboardsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        workboardModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        workboardModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchWorkboards(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        workboardModel.search(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorkboardByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        workboardModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


module.exports = workboardService;

