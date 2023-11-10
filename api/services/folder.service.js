var folderModel = require("../models/folder.model");
var fileModel = require("../models/file.model");
var currentContext = require('../../common/currentContext');
var activityService = require('../services/activity.service');
const { response } = require("express");
const { file } = require("googleapis/build/src/apis/file");

var folderService = {
    getAllFolders: getAllFolders,
    getFolderById:getFolderById,
    addFolder: addFolder,
    updateFolder:updateFolder,
    deleteFolder:deleteFolder,
    getFolderByFolderName: getFolderByFolderName,
    getFoldersByPage: getFoldersByPage,
    getAllFoldersCount: getAllFoldersCount,
    getFoldersByPageWithSort: getFoldersByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchFolders: searchFolders,
    vaultOverview: vaultOverview

}

function addFolder(folderData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        folderData.createdBy = user.email;
        folderData.lastModifiedBy = user.email;
        folderModel.create(folderData).then((data)=>{
        resolve(data);
           }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateFolder(id,folderData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        folderData.lastModifiedBy = user.email;
        folderModel.updateById(id,folderData).then((data)=>{
        resolve(data);
         }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteFolder(id) {
    return new Promise((resolve,reject) => {
        folderModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllFolders(entityId, entityType) {
    return new Promise((resolve,reject) => {
        folderModel.search({
            'entityId': entityId,
            'entityType': entityType
        }).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFolderById(id) {
    return new Promise((resolve,reject) => {
        folderModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFolderByFolderName(folderName, tenant){
    return new Promise((resolve,reject) => {
        folderModel.searchOne({'folderName': folderName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllFoldersCount() {
    return new Promise((resolve, reject) => {
        folderModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFoldersByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        folderModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getFoldersByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        folderModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        folderModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchFolders(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    console.log(query);
    return new Promise(async(resolve, reject) => {
        try{
        var response = [];
        var folderData = await folderModel.getPaginatedResult(query, options)
        if(Array.isArray(folderData) && folderData.length){
        for(folder of folderData)
        {    
        var filesCount = await fileModel.countDocuments({folderId:folder._id})
        folderInfo = JSON.parse(JSON.stringify(folder));
        fData = {...folderInfo,filesCount}
        response.push(fData)
        }   
    }
        resolve(response);
    }catch(err){reject(err)}
    });
}

function vaultOverview() {
    return new Promise(async(resolve,reject) => {
        try{
        var totalFolders = await folderModel.countDocuments({})
        var totalFiles = await fileModel.countDocuments({})
        var files = await fileModel.search({})
        var fileGB = 0;
        if(Array.isArray(files) && files.length){
        for(filer of files){
            fileSize = filer.size ? filer.size : 0
            fileGB = fileGB + fileSize;
            }
        }
        var response = {totalFolders, totalFiles, fileGB }
        resolve(response)
        }catch(err){reject(err)}
    });
}

module.exports = folderService;

