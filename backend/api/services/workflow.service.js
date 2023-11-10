var workflowModel = require("../models/workflow.model");
var taskModel = require("../models/task.model");
var currentContext = require('../../common/currentContext');
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
const { response } = require("express");

var workflowService = {
    getAllWorkflows: getAllWorkflows,
    getWorkflowById:getWorkflowById,
    addWorkflow: addWorkflow,
    updateWorkflow:updateWorkflow,
    deleteWorkflow:deleteWorkflow,
    getWorkflowByWorkflowName: getWorkflowByWorkflowName,
    getWorkflowsByPage: getWorkflowsByPage,
    getAllWorkflowsCount: getAllWorkflowsCount,
    getWorkflowsByPageWithSort: getWorkflowsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchWorkflows: searchWorkflows,
    getWorkflowByName: getWorkflowByName,
    exists: exists
}

function addWorkflow(workflowData) {
    return new Promise((resolve,reject) => {
        try{
        var user = currentContext.getCurrentContext();
        workflowData.createdBy = user.email;
        workflowData.lastModifiedBy = user.email;
        
        workflowModel.create(workflowData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    }catch(err){reject(err)}
    })
}

function updateWorkflow(id,workflowData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        workflowData.lastModifiedBy = user.email;
        
        workflowModel.updateById(id,workflowData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteWorkflow(id) {
    return new Promise((resolve,reject) => {
        workflowModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllWorkflows() {
    return new Promise((resolve,reject) => {
        workflowModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorkflowById(id) {
    return new Promise((resolve,reject) => {
        workflowModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorkflowByWorkflowName(workflowName, tenant){
    return new Promise((resolve,reject) => {
        workflowModel.searchOne({'workflowName': workflowName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllWorkflowsCount() {
    return new Promise((resolve, reject) => {
        workflowModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorkflowsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        workflowModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorkflowsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        workflowModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        workflowModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchWorkflows(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        workflowModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorkflowByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        workflowModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function exists(name, next) {
    return new Promise(async(resolve,reject) => {
        try{

        query = { name: name}
        data = await workflowModel.search(query)
        isExist = Array.isArray(data) && data.length ? true : false 
        resolve({isExist})
        }catch(err){reject(err)}
    })
}



module.exports = workflowService;

