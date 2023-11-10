var pinModel = require("../models/pin.model");
var currentContext = require('../../common/currentContext');

var pinService = {
    getAllPins: getAllPins,
    getPinById:getPinById,
    addPin: addPin,
    updatePin:updatePin,
    deletePin:deletePin,
    getPinByPinName: getPinByPinName,
    getPinsByPage: getPinsByPage,
    getAllPinsCount: getAllPinsCount,
    getPinsByPageWithSort: getPinsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchPins: searchPins,
    getPinByName: getPinByName,
    textSearch: textSearch
}

function addPin(pinData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        pinData.createdBy = user.email;
        pinData.lastModifiedBy = user.email;
        
        pinModel.create(pinData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updatePin(id,pinData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        pinData.lastModifiedBy = user.email;
        
        pinModel.updateById(id,pinData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deletePin(id) {
    return new Promise((resolve,reject) => {
        pinModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllPins() {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        let query = {
            createdBy:user.email
        };
        pinModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPinById(id) {
    return new Promise((resolve,reject) => {
        pinModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPinByPinName(pinName, tenant){
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        let query = {
            createdBy:user.email,
            'pinName': pinName
        };
        pinModel.searchOne(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllPinsCount() {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        let query = {
            createdBy:user.email,
        };
        pinModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPinsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    var user = currentContext.getCurrentContext();
    let query = {
        createdBy:user.email,
    };

    return new Promise((resolve, reject) => {
        pinModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPinsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;
    var user = currentContext.getCurrentContext();
    let query = {
        createdBy:user.email,
    };
    return new Promise((resolve, reject) => {
        pinModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        pinModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchPins(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    var user = currentContext.getCurrentContext();
    query.createdBy = user.email;
    return new Promise((resolve, reject) => {
        pinModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPinByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        pinModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

//text search service

function textSearch(text) {
    return new Promise((resolve, reject) => {
        pinModel.getTextSearchResult(text).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


module.exports = pinService;

