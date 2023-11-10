var stageModel = require("../models/stage.model");
var taskModel = require("../models/task.model");
var currentContext = require('../../common/currentContext');
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
const { response } = require("express");

var stageService = {
    getAllStages: getAllStages,
    getStageById:getStageById,
    addStage: addStage,
    updateStage:updateStage,
    deleteStage:deleteStage,
    getStageByStageName: getStageByStageName,
    getStagesByPage: getStagesByPage,
    getAllStagesCount: getAllStagesCount,
    getStagesByPageWithSort: getStagesByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchStages: searchStages,
    getStageByName: getStageByName,
    kanban: kanban,
    exists: exists
}

function addStage(stageData) {
    return new Promise((resolve,reject) => {
        try{
        var user = currentContext.getCurrentContext();
        stageData.createdBy = user.email;
        stageData.lastModifiedBy = user.email;
        
        stageModel.create(stageData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    }catch(err){reject(err)}
    })
}

function updateStage(id,stageData,next) {
    return new Promise(async(resolve,reject) => {
        try{
        var user = currentContext.getCurrentContext();
        stageData.lastModifiedBy = user.email;
            stage = await stageModel.getById(id)
        if(stage.name == "COMPLETED"){
            next(errorMethods.sendBadRequest(errorCode.STAGE_COMPLETED_CANT_EDIT))
        }else{
            stageName = await stageModel.search({$and:[{"name":stageData.name},{"project":stageData.project}]})
            if(Array.isArray(stageName) && stageName.length){
            next(errorMethods.sendBadRequest(errorCode.STAGE_ALREADY_EXISTS_FOR_PROJECT))
            }else{
                var data = stageModel.updateById(id,stageData)
                resolve(data)
            }
        }
        }catch(err){reject(err)}
    })  
}

function deleteStage(id, next) {
    return new Promise(async(resolve,reject) => {
        try{
            var stages = await stageModel.search({})
            if(stages.length > 1){
                stage = await stageModel.getById(id)
                tasks = await taskModel.search({"stage":id})
                if(Array.isArray(tasks) && tasks.length){
                next(errorMethods.sendBadRequest(errorCode.STAGE_HAS_TASKS_CANT_DELETE))
                }else{
                if(stage.name == "COMPLETED"){
                next(errorMethods.sendBadRequest(errorCode.STAGE_COMPLETED_CANT_DELETE))
                }else{
                await stageModel.deletebyId(id)
                resolve({'success':true})
                }
            }
            } 
            else{next(errorMethods.sendBadRequest(errorCode.STAGE_CANT_BE_ZERO))}
        }catch(err){reject(err)}
    })
}

function getAllStages() {
    return new Promise((resolve,reject) => {
        stageModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getStageById(id) {
    return new Promise((resolve,reject) => {
        stageModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getStageByStageName(stageName, tenant){
    return new Promise((resolve,reject) => {
        stageModel.searchOne({'stageName': stageName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllStagesCount() {
    return new Promise((resolve, reject) => {
        stageModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getStagesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        stageModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getStagesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        stageModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        stageModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchStages(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        stageModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getStageByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        stageModel.search(query).then((data)=>{
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
        data = await stageModel.search(query)
        isExist = Array.isArray(data) && data.length ? true : false 
        resolve({isExist})
        }catch(err){reject(err)}
    })
}

function kanban(projectId) {
    return new Promise(async(resolve,reject) => {
        try{
            var response = []
            console.log(projectId)
            var stages = await stageModel.search({"project":projectId})
            for(stage of stages){
                var tasks = await taskModel.search({"stage":stage._id})
                let stageData = JSON.parse(JSON.stringify(stage));
                var data = {...stageData, tasks}
                response.push(data)
            }
            resolve(response)
        }catch(err){reject(err)}
    })
}



module.exports = stageService;

