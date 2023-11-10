var wstepModel = require("../models/wstep.model");
var taskModel = require("../models/task.model");
var currentContext = require('../../common/currentContext');
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
const { response } = require("express");

var wstepService = {
    getAllWsteps: getAllWsteps,
    getWstepById:getWstepById,
    addWstep: addWstep,
    updateWstep:updateWstep,
    deleteWstep:deleteWstep,
    getWstepByWstepName: getWstepByWstepName,
    getWstepsByPage: getWstepsByPage,
    getAllWstepsCount: getAllWstepsCount,
    getWstepsByPageWithSort: getWstepsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchWsteps: searchWsteps,
    getWstepByName: getWstepByName,
    exists: exists
}

function addWstep(wstepData) {
    return new Promise((resolve,reject) => {
        try{
        var user = currentContext.getCurrentContext();
        wstepData.createdBy = user.email;
        wstepData.lastModifiedBy = user.email;
        
        wstepModel.create(wstepData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    }catch(err){reject(err)}
    })
}

function updateWstep(id,wstepData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        wstepData.lastModifiedBy = user.email;
        
        wstepModel.updateById(id,wstepData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteWstep(id) {
    return new Promise((resolve,reject) => {
        wstepModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllWsteps() {
    return new Promise((resolve,reject) => {
        wstepModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWstepById(id) {
    return new Promise((resolve,reject) => {
        wstepModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWstepByWstepName(wstepName, tenant){
    return new Promise((resolve,reject) => {
        wstepModel.searchOne({'wstepName': wstepName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllWstepsCount() {
    return new Promise((resolve, reject) => {
        wstepModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWstepsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        wstepModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWstepsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        wstepModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        wstepModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchWsteps(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        wstepModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWstepByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        wstepModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function exists(workflow, name, next) {
    return new Promise(async(resolve,reject) => {
        try{

        query = { $and: [ { workflow: workflow }, { name: name} ] }
        data = await wstepModel.search(query)
        isExist = Array.isArray(data) && data.length ? true : false 
        resolve({isExist})
        }catch(err){reject(err)}
    })
}




module.exports = wstepService;

