var wsubtaskModel = require("../models/wsubtask.model");
var taskModel = require("../models/task.model");
var currentContext = require('../../common/currentContext');
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
const { response } = require("express");

var wsubtaskService = {
    getAllWsubtasks: getAllWsubtasks,
    getWsubtaskById:getWsubtaskById,
    addWsubtask: addWsubtask,
    updateWsubtask:updateWsubtask,
    deleteWsubtask:deleteWsubtask,
    getWsubtaskByWsubtaskName: getWsubtaskByWsubtaskName,
    getWsubtasksByPage: getWsubtasksByPage,
    getAllWsubtasksCount: getAllWsubtasksCount,
    getWsubtasksByPageWithSort: getWsubtasksByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchWsubtasks: searchWsubtasks,
    getWsubtaskByName: getWsubtaskByName,
    exists: exists
}

function addWsubtask(wsubtaskData) {
    return new Promise((resolve,reject) => {
        try{
        var user = currentContext.getCurrentContext();
        wsubtaskData.createdBy = user.email;
        wsubtaskData.lastModifiedBy = user.email;
        
        wsubtaskModel.create(wsubtaskData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    }catch(err){reject(err)}
    })
}

function updateWsubtask(id,wsubtaskData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        wsubtaskData.lastModifiedBy = user.email;
        
        wsubtaskModel.updateById(id,wsubtaskData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteWsubtask(id) {
    return new Promise((resolve,reject) => {
        wsubtaskModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllWsubtasks() {
    return new Promise((resolve,reject) => {
        wsubtaskModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWsubtaskById(id) {
    return new Promise((resolve,reject) => {
        wsubtaskModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWsubtaskByWsubtaskName(wsubtaskName, tenant){
    return new Promise((resolve,reject) => {
        wsubtaskModel.searchOne({'wsubtaskName': wsubtaskName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllWsubtasksCount() {
    return new Promise((resolve, reject) => {
        wsubtaskModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWsubtasksByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        wsubtaskModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWsubtasksByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        wsubtaskModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        wsubtaskModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchWsubtasks(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        wsubtaskModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWsubtaskByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        wsubtaskModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function exists(wtask, name, next) {
    return new Promise(async(resolve,reject) => {
        try{

        query = { $and: [ { wtask: wtask }, { name: name} ] }
        data = await wsubtaskModel.search(query)
        isExist = Array.isArray(data) && data.length ? true : false 
        resolve({isExist})
        }catch(err){reject(err)}
    })
}





module.exports = wsubtaskService;

