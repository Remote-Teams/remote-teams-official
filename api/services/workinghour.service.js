var workinghourModel = require("../models/workinghour.model");
var currentContext = require('../../common/currentContext');

var workinghourService = {
    getAllWorkinghours: getAllWorkinghours,
    getWorkinghourById:getWorkinghourById,
    addWorkinghour: addWorkinghour,
    updateWorkinghour:updateWorkinghour,
    deleteWorkinghour:deleteWorkinghour,
    getWorkinghourByWorkinghourName: getWorkinghourByWorkinghourName,
    getWorkinghoursByPage: getWorkinghoursByPage,
    getAllWorkinghoursCount: getAllWorkinghoursCount,
    getWorkinghoursByPageWithSort: getWorkinghoursByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchWorkinghours: searchWorkinghours,
    getWorkinghourByName: getWorkinghourByName
}

function addWorkinghour(workinghourData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        workinghourData.createdBy = user.email;
        workinghourData.lastModifiedBy = user.email;
        
        workinghourModel.create(workinghourData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateWorkinghour(id,workinghourData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        workinghourData.lastModifiedBy = user.email;
        
        workinghourModel.updateById(id,workinghourData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteWorkinghour(id) {
    return new Promise((resolve,reject) => {
        workinghourModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllWorkinghours() {
    return new Promise((resolve,reject) => {
        workinghourModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorkinghourById(id) {
    return new Promise((resolve,reject) => {
        workinghourModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorkinghourByWorkinghourName(workinghourName, tenant){
    return new Promise((resolve,reject) => {
        workinghourModel.searchOne({'workinghourName': workinghourName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllWorkinghoursCount() {
    return new Promise((resolve, reject) => {
        workinghourModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorkinghoursByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        workinghourModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorkinghoursByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        workinghourModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        workinghourModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchWorkinghours(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        workinghourModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorkinghourByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        workinghourModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


module.exports = workinghourService;

