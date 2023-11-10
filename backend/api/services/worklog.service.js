var worklogModel = require("../models/worklog.model");
var currentContext = require('../../common/currentContext');
const { costVariance } = require("./project.service");

var worklogService = {
    getAllWorklogs: getAllWorklogs,
    getWorklogById:getWorklogById,
    addWorklog: addWorklog,
    updateWorklog:updateWorklog,
    deleteWorklog:deleteWorklog,
    getWorklogByWorklogName: getWorklogByWorklogName,
    getWorklogsByPage: getWorklogsByPage,
    getAllWorklogsCount: getAllWorklogsCount,
    getWorklogsByPageWithSort: getWorklogsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    getTotalHours: getTotalHours,
    getWorklogByScheduleId: getWorklogByScheduleId,
    searchWorklogs: searchWorklogs,
    getHoursWithUserAndSchedule: getHoursWithUserAndSchedule,
    weekTS: weekTS
}

function addWorklog(worklogData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        worklogData.createdBy = user.email;
        worklogData.lastModifiedBy = user.email;
        
        worklogModel.create(worklogData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateWorklog(id,worklogData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        worklogData.lastModifiedBy = user.email;
        
        worklogModel.updateById(id,worklogData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteWorklog(id) {
    return new Promise((resolve,reject) => {
        worklogModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllWorklogs() {
    return new Promise((resolve,reject) => {
        worklogModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTotalHours(userId) {
    return new Promise((resolve,reject) => {
        worklogModel.getTotalHours(userId).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getHoursWithUserAndSchedule(userId, scheduleId) {
    return new Promise((resolve,reject) => {
        worklogModel.hoursWithUserAndSchedule(userId, scheduleId).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorklogById(id) {
    return new Promise((resolve,reject) => {
        worklogModel.getById(id).then((data)=>{
            console.log('im here')
            resolve(data);
        
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorklogByScheduleId(scheduleId){
    return new Promise((resolve,reject) => {
        worklogModel.worklogByScheduleId(scheduleId).then((data)=>{
        
            resolve(data);
        
        }).catch((err) => {
            reject(err);
        })
    });

}

function getWorklogByWorklogName(worklogName, tenant){
    return new Promise((resolve,reject) => {
        worklogModel.searchOne({'worklogName': worklogName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllWorklogsCount() {
    return new Promise((resolve, reject) => {
        worklogModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorklogsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        worklogModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getWorklogsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        worklogModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchWorklogs(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        worklogModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        worklogModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function weekTS(startDate, endDate, member) {
    return new Promise(async(resolve,reject) => {
      try{
        var response = [], reply = {}
        var data = await worklogModel.weekTS(startDate, endDate, member)
        response = Array.isArray(data) && data.length ? data : []
        reply = Array.isArray(response) && response.length ? response[0] : {}
        resolve(reply)
      }catch(err){reject(err)}
    });
}


module.exports = worklogService;

