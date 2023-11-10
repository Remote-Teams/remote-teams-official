var winstanceModel = require("../models/winstance.model");
var wtaskModel = require("../models/wtask.model");
var wsubtaskModel = require("../models/wsubtask.model");
var wstepModel = require("../models/wstep.model");
var workflowModel = require("../models/workflow.model");

var currentContext = require('../../common/currentContext');
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
const { response } = require("express");

var winstanceService = {
    getAllWinstances: getAllWinstances,
    getWinstanceById:getWinstanceById,
    addWinstance: addWinstance,
    updateWinstance:updateWinstance,
    deleteWinstance:deleteWinstance,
    getWinstanceByWinstanceName: getWinstanceByWinstanceName,
    getWinstancesByPage: getWinstancesByPage,
    getAllWinstancesCount: getAllWinstancesCount,
    getWinstancesByPageWithSort: getWinstancesByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchWinstances: searchWinstances,
    getWinstanceByName: getWinstanceByName,
    exists: exists
}

function addWinstance(winstanceData) {
    return new Promise(async(resolve,reject) => {
        try{
        var stepsfinal =[], subtasksfinal =[], wData ={};
        var user = currentContext.getCurrentContext();
        var workflowId = winstanceData.workflow;
        var workflowData = await workflowModel.getById(workflowId);
        let workflowinst = JSON.parse( JSON.stringify( workflowData ) );
        var steps = await wstepModel.search({workflow:workflowId})
        if(Array.isArray(steps) && steps.length){
            for(step of steps){
                var tasks = []
                tasks = await wtaskModel.search({wstep:step._id})
                console.log("tasks in step", tasks)
                if(Array.isArray(tasks) && tasks.length){
                    var tasksfinal = [];
                for(task of tasks){
                    var subtasks = await wsubtaskModel.search({wtask:task._id})
                    if(Array.isArray(subtasks) && subtasks.length){
                        for(subtask of subtasks){
                            let subtaskinst = JSON.parse( JSON.stringify( subtask ) );
                            subtaskData = {...subtaskinst, subtask_completed:false}
                            subtasksfinal.push(subtaskData)
                        }
                    }
                    let taskinst = JSON.parse( JSON.stringify( task ) );
                    taskData = {...taskinst, subtasks:subtasksfinal, task_completed:false}
                    tasksfinal.push(taskData)
                    }
                }
                let stepinst = JSON.parse( JSON.stringify( step ) );
                stepData = {...stepinst, tasks: tasksfinal, step_completed:false}
                console.log("step data", stepData)
                stepsfinal.push(stepData)
            }
        }
        data = {...workflowinst , steps: stepsfinal}
        wData.data = data
        wData.createdBy = user.email;
        wData.lastModifiedBy = user.email;
        wData.user = winstanceData.user
        wData.instanceInfo = winstanceData.instanceInfo
        var instanceData = winstanceModel.create(wData)
        resolve(instanceData)
      }catch(err){reject(err)}
      })
}

function updateWinstance(id,winstanceData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        winstanceData.lastModifiedBy = user.email;
        
        winstanceModel.updateById(id,winstanceData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteWinstance(id) {
    return new Promise((resolve,reject) => {
        winstanceModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllWinstances() {
    return new Promise((resolve,reject) => {
        winstanceModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWinstanceById(id) {
    return new Promise((resolve,reject) => {
        winstanceModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWinstanceByWinstanceName(winstanceName, tenant){
    return new Promise((resolve,reject) => {
        winstanceModel.searchOne({'winstanceName': winstanceName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllWinstancesCount() {
    return new Promise((resolve, reject) => {
        winstanceModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWinstancesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        winstanceModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWinstancesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        winstanceModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        winstanceModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchWinstances(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        winstanceModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWinstanceByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        winstanceModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function exists(project, name, next) {
    return new Promise(async(resolve,reject) => {
        try{

        query = { $and: [ { project: project }, { name: name} ] }
        data = await winstanceModel.search(query)
        isExist = Array.isArray(data) && data.length ? true : false 
        resolve({isExist})
        }catch(err){reject(err)}
    })
}



module.exports = winstanceService;

