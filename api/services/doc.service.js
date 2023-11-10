var docModel = require("../models/doc.model");
var taskModel = require("../models/task.model");
var currentContext = require('../../common/currentContext');
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
const { response } = require("express");

var docService = {
    getAllDocs: getAllDocs,
    getDocById:getDocById,
    addDoc: addDoc,
    updateDoc:updateDoc,
    deleteDoc:deleteDoc,
    getDocByDocName: getDocByDocName,
    getDocsByPage: getDocsByPage,
    getAllDocsCount: getAllDocsCount,
    getDocsByPageWithSort: getDocsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchDocs: searchDocs,
    getDocByName: getDocByName,
    exists: exists
}

function addDoc(docData) {
    return new Promise((resolve,reject) => {
        try{
        var user = currentContext.getCurrentContext();
        docData.createdBy = user.email;
        docData.lastModifiedBy = user.email;
        
        docModel.create(docData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    }catch(err){reject(err)}
    })
}

function updateDoc(id,docData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        docData.lastModifiedBy = user.email;
        
        docModel.updateById(id,docData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteDoc(id) {
    return new Promise((resolve,reject) => {
        docModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllDocs() {
    return new Promise((resolve,reject) => {
        docModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDocById(id) {
    return new Promise((resolve,reject) => {
        docModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDocByDocName(docName, tenant){
    return new Promise((resolve,reject) => {
        docModel.searchOne({'docName': docName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllDocsCount() {
    return new Promise((resolve, reject) => {
        docModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDocsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        docModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDocsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        docModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        docModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchDocs(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        docModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDocByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        docModel.search(query).then((data)=>{
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
        data = await docModel.search(query)
        isExist = Array.isArray(data) && data.length ? true : false 
        resolve({isExist})
        }catch(err){reject(err)}
    })
}




module.exports = docService;

