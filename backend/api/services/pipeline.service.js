var pipelineModel = require("../models/pipeline.model");
var currentContext = require('../../common/currentContext');

var pipelineService = {
    getAllPipelines: getAllPipelines,
    getPipelineById:getPipelineById,
    addPipeline: addPipeline,
    updatePipeline:updatePipeline,
    deletePipeline:deletePipeline,
    getPipelineByPipelineName: getPipelineByPipelineName,
    getPipelinesByPage: getPipelinesByPage,
    getAllPipelinesCount: getAllPipelinesCount,
    getPipelinesByPageWithSort: getPipelinesByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchPipelines: searchPipelines,
    getPipelineByName: getPipelineByName,
    exists: exists
}

function addPipeline(pipelineData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        pipelineData.bookingCreated = false
        pipelineData.dismissed = false
        pipelineData.createdBy = user.email;
        pipelineData.lastModifiedBy = user.email;
        
        pipelineModel.create(pipelineData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updatePipeline(id,pipelineData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        pipelineData.lastModifiedBy = user.email;
        
        pipelineModel.updateById(id,pipelineData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deletePipeline(id) {
    return new Promise((resolve,reject) => {
        pipelineModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllPipelines() {
    return new Promise((resolve,reject) => {
        pipelineModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPipelineById(id) {
    return new Promise((resolve,reject) => {
        pipelineModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPipelineByPipelineName(pipelineName, tenant){
    return new Promise((resolve,reject) => {
        pipelineModel.searchOne({'pipelineName': pipelineName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllPipelinesCount() {
    return new Promise((resolve, reject) => {
        pipelineModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPipelinesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        pipelineModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPipelinesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        pipelineModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        pipelineModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchPipelines(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        pipelineModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPipelineByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        pipelineModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function exists(user, task) {
    return new Promise(async(resolve,reject) => {
        try{
        query = { $and: [ { user: user }, { task: task} ] }
        data = await pipelineModel.search(query)
        isExist =  Array.isArray(data) && data.length ? true : false 
        resolve({isExist})
        }catch(err){reject(err)}
    })
}

module.exports = pipelineService;

