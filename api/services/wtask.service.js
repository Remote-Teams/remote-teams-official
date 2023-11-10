var wtaskModel = require("../models/wtask.model");
var taskModel = require("../models/task.model");
var currentContext = require('../../common/currentContext');
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
const { response } = require("express");

var wtaskService = {
    getAllWtasks: getAllWtasks,
    getWtaskById:getWtaskById,
    addWtask: addWtask,
    updateWtask:updateWtask,
    deleteWtask:deleteWtask,
    getWtaskByWtaskName: getWtaskByWtaskName,
    getWtasksByPage: getWtasksByPage,
    getAllWtasksCount: getAllWtasksCount,
    getWtasksByPageWithSort: getWtasksByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchWtasks: searchWtasks,
    getWtaskByName: getWtaskByName,
    exists: exists
}

function addWtask(wtaskData) {
    return new Promise((resolve,reject) => {
        try{
        var user = currentContext.getCurrentContext();
        wtaskData.createdBy = user.email;
        wtaskData.lastModifiedBy = user.email;
        
        wtaskModel.create(wtaskData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    }catch(err){reject(err)}
    })
}

function updateWtask(id,wtaskData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        wtaskData.lastModifiedBy = user.email;
        
        wtaskModel.updateById(id,wtaskData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteWtask(id) {
    return new Promise((resolve,reject) => {
        wtaskModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllWtasks() {
    return new Promise((resolve,reject) => {
        wtaskModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWtaskById(id) {
    return new Promise((resolve,reject) => {
        wtaskModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWtaskByWtaskName(wtaskName, tenant){
    return new Promise((resolve,reject) => {
        wtaskModel.searchOne({'wtaskName': wtaskName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllWtasksCount() {
    return new Promise((resolve, reject) => {
        wtaskModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWtasksByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        wtaskModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWtasksByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        wtaskModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        wtaskModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchWtasks(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        wtaskModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWtaskByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        wtaskModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function exists(wstep, name, next) {
    return new Promise(async(resolve,reject) => {
        try{

        query = { $and: [ { wstep: wstep }, { name: name} ] }
        data = await wtaskModel.search(query)
        isExist = Array.isArray(data) && data.length ? true : false 
        resolve({isExist})
        }catch(err){reject(err)}
    })
}





module.exports = wtaskService;

