var memberdayoffModel = require("../models/memberdayoff.model");
var currentContext = require('../../common/currentContext');

var memberdayoffService = {
    getAllMemberdayoffs: getAllMemberdayoffs,
    getMemberdayoffById:getMemberdayoffById,
    addMemberdayoff: addMemberdayoff,
    updateMemberdayoff:updateMemberdayoff,
    deleteMemberdayoff:deleteMemberdayoff,
    getMemberdayoffByMemberdayoffName: getMemberdayoffByMemberdayoffName,
    getMemberdayoffsByPage: getMemberdayoffsByPage,
    getAllMemberdayoffsCount: getAllMemberdayoffsCount,
    getMemberdayoffsByPageWithSort: getMemberdayoffsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchMemberdayoffs: searchMemberdayoffs,
    getMemberdayoffByName: getMemberdayoffByName,
    addMemberDayOffBulk:addMemberDayOffBulk,
    updateMemberdayoffBulk:updateMemberdayoffBulk
}

function addMemberdayoff(memberdayoffData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        memberdayoffData.createdBy = user.email;
        memberdayoffData.lastModifiedBy = user.email;
        
        memberdayoffModel.create(memberdayoffData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateMemberdayoff(id,memberdayoffData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        memberdayoffData.lastModifiedBy = user.email;
        
        memberdayoffModel.updateById(id,memberdayoffData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteMemberdayoff(id) {
    return new Promise((resolve,reject) => {
        memberdayoffModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllMemberdayoffs() {
    return new Promise((resolve,reject) => {
        memberdayoffModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getMemberdayoffById(id) {
    return new Promise((resolve,reject) => {
        memberdayoffModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getMemberdayoffByMemberdayoffName(memberdayoffName, tenant){
    return new Promise((resolve,reject) => {
        memberdayoffModel.searchOne({'memberdayoffName': memberdayoffName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllMemberdayoffsCount() {
    return new Promise((resolve, reject) => {
        memberdayoffModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getMemberdayoffsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        memberdayoffModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getMemberdayoffsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        memberdayoffModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        memberdayoffModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchMemberdayoffs(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        memberdayoffModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getMemberdayoffByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        memberdayoffModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function addMemberDayOffBulk( data ){
    return new Promise((resolve, reject) => {
        let dayOffPromise = [];
        data.dayoffs.forEach((dayOff) => {
            dayOffPromise.push(addMemberdayoff(dayOff));
        });
        Promise.all(dayOffPromise).then((data) => {
            resolve({ "success": true })
        }).catch(err => {
            reject(err);
        })

    })
}

function updateMemberdayoffBulk( data ){
    return new Promise( (resolve, reject) => {
        let updatedayOffPromise = [];
        data.dayoffs.forEach(( dayOff ) => {
            updatedayOffPromise.push( updateMemberdayoff( dayOff._id, dayOff ) );
        });
        Promise.all( updatedayOffPromise ).then((data) => {
            resolve({ "success":true });
        }).catch(err => {
            reject(err);
        })
    })
}


module.exports = memberdayoffService;

