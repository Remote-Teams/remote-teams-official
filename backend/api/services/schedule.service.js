var scheduleModel = require("../models/schedule.model");
var worklogService = require("./worklog.service")
var worklogModel = require("../models/worklog.model")
var meetingModel = require("../models/meeting.model");
var currentContext = require('../../common/currentContext');
var moment = require('moment');
const userService = require("./user.service");
const { reject } = require("lodash");
const { resolve } = require("app-root-path");
const _ = require('lodash');
const { rough } = require("./expense.service");
const { schedule } = require("node-cron");
var leaveModel = require("../models/leave.model");
const { leavesApproval } = require("./leave.service");
const WorklogCategory = require("../../common/constants/WorklogCategory");

var scheduleService = {
    getAllSchedules: getAllSchedules,
    getScheduleById:getScheduleById,
    addSchedule: addSchedule,
    addBulkSchedule:addBulkSchedule,
    deleteBulkSchedule:deleteBulkSchedule,
    updateSchedule:updateSchedule,
    deleteSchedule:deleteSchedule,
    getScheduleByScheduleName: getScheduleByScheduleName,
    getSchedulesByPage: getSchedulesByPage,
    getAllSchedulesCount: getAllSchedulesCount,
    getSchedulesByPageWithSort: getSchedulesByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchSchedules: searchSchedules,
    getScheduleByName: getScheduleByName,
    getTaskAndGroup:getTaskAndGroup,
    getTaskByProjectAndResource:getTaskByProjectAndResource,
    getScheduleWithDateFilters:getScheduleWithDateFilters,
    scheduleByRes: scheduleByRes,
    collaborators: collaborators,
    getTodaysTasks: getTodaysTasks,
    getTodayTimesheet: getTodayTimesheet,
    timesheetWithRange: timesheetWithRange,
    calendar: calendar
}

function addSchedule(scheduleData) {
    return new Promise(async(resolve,reject) => {
        try{
        var user = currentContext.getCurrentContext();
        scheduleData.createdBy = user.email;
        scheduleData.lastModifiedBy = user.email;
        
        var data = await scheduleModel.create(scheduleData)
        var date1 = moment(data.toTime)
        var date2 = moment(data.fromTime)
        var hours = (date1.diff(date2))/3.6e+6
        var worklogData = {
            name: data.bookingName,
            schedule: data._id,
            task: data.task,
            user: data.assignedTo,
            fromTime:data.fromTime,
            toTime: data.toTime,
            date: data.fromDate,
            hours: hours,
            
        }
        if(data.type == "GENERAL"){
            worklogData.category = WorklogCategory.GENERAL;
        }else if(data.type == "PROJECT"){
            worklogData.category = WorklogCategory.PROJECT;
        }
        var worklog = await worklogService.addWorklog(worklogData)
            resolve(data);
        }catch(err){reject(err)}
    })
   
}

function addBulkSchedule( scheduleBody ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let promiseArr = [];
            let datarray = scheduleBody.data;
            datarray.forEach(element => {
                promiseArr.push( addSchedule(element) );
            });
            Promise.all( promiseArr )
                .then( data => {
                    resolve( data )
                })
                .catch( err => {
                    reject( err );
                })
        } catch ( err ){
            reject( err );
        }
    })
}

function deleteBulkSchedule( group_id ){
    return new Promise( async ( resolve, reject ) => {
        try{
           var schedules = await scheduleModel.search({"groupId":group_id})
            let response = await scheduleModel.deleteByGroupId( group_id );
            for (s of schedules){
                var worklogs = await worklogModel.search({"schedule":s._id})
                for (worklog of worklogs){
                    var deleted = await worklogModel.deletebyId(worklog._id)
                 }
            }
            resolve( response );
        } catch ( err ){
            reject( err );
        }
    })
}

function updateSchedule(id,scheduleData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        scheduleData.lastModifiedBy = user.email;
        
        scheduleModel.updateById(id,scheduleData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteSchedule(id) {
    return new Promise(async(resolve,reject) => {
        try{
        var data = await scheduleModel.deletebyId(id)
        var worklogs = await worklogModel.search({"schedule":id})
        for (worklog of worklogs){
           var deleted = await worklogModel.deletebyId(worklog._id)
        }
            resolve({'success':true});
        }catch(err){reject(err)}
    })
}

function getAllSchedules() {
    return new Promise((resolve,reject) => {
        scheduleModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

/**
 * 
 * We get today's tasks to be done using this function, we first get todays schedules from schedule model using date and user's id
 * then we loop over the data received and call worklogdata with the schedule's id to get data like hours, status and id of the worklog
 * we also call a function in worklogservice to get the total hours that the user has worked on this particular task
 * we combine all the data and push them into the response and send it to the front end
 */

function getTodaysTasks(todaysDate, userId){
    return new Promise(async(resolve, reject) => {
        try{
        var response = [];
        data = await scheduleModel.getTodaysTasks(todaysDate, userId)
        for(schedule of data){
            worklogData = await worklogService.getWorklogByScheduleId(schedule._id)
            userHours = await worklogService.getHoursWithUserAndSchedule(userId, schedule._id)
            hours =0, status =0, worklogId = 0, totalhours =0
            worklogData ? (hours = worklogData.hours,status =worklogData.status,worklogId = worklogData._id) : 0
            Array.isArray(userHours) && userHours.length ? (totalhours = userHours[0].totalhours) : 0
            response.push({...schedule, hours, status, worklogId, totalhours})
        }
    resolve(response);
    }catch(err){reject(err)}
        });
}

// trying out the entire tasks api

function newGetTodaysTasks(todaysDate, userId){
    return new Promise((resolve, reject) => {
        scheduleModel.getTodaysTasks(todaysDate, userId).then((data) => {
        for(i in data){
            console.log(data.schedule);
        }
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });

}


function getScheduleById(id) {
    return new Promise((resolve,reject) => {
        scheduleModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getScheduleByScheduleName(scheduleName, tenant){
    return new Promise((resolve,reject) => {
        scheduleModel.searchOne({'scheduleName': scheduleName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllSchedulesCount() {
    return new Promise((resolve, reject) => {
        scheduleModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getSchedulesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        scheduleModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getSchedulesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        scheduleModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        scheduleModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchSchedules(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        scheduleModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getScheduleByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        scheduleModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTaskAndGroup(userId){
    return new Promise( async ( resolve, reject ) => {
        try{
            let aggregateQuery = [
                { "$match" : { "assignedTo":userId } },
                { $group : { _id:"$task" } },
                { $lookup:{ from: "tasks", localField: "_id", foreignField: "_id", as: "tasks" } },
                { $unwind : "$tasks" },
                { $group: {
                    _id:'$tasks.status',
                    count:{ $sum:1 },
                    tasks:{ $push:"$tasks" }
                }}
            ];
            let results = await scheduleModel.globalAggregateFunction( aggregateQuery );
            resolve( results );
        } catch ( err ){
            reject( err );
        }
    }).catch((err) => {
        reject(err);
    });
}

function getTaskByProjectAndResource( projectId, resourceId ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let aggregateQuery = [
                { "$match" : { "assignedTo": resourceId } },
                { $group : { _id:"$task" } },
                { $lookup:{ from: "tasks", localField: "_id", foreignField: "_id", as: "tasks" } },
                { $unwind : "$tasks" },
                { $match : { "tasks.project" : projectId } },
                { $group : { _id:"$tasks.status", count:{ $sum:1 } } },
            ];
            let results = await scheduleModel.globalAggregateFunction( aggregateQuery );
            resolve( results );
        } catch ( err ){
            reject( err );
        }
    }).catch((err) => {
        reject(err);
    });
}


function getScheduleWithDateFilters(  fromDate, toDate, userId ){
    var query = {
        "fromDate":{ "$gte": moment( fromDate ).startOf('day').toISOString() },
        "toDate":{ "$lte" :  moment( toDate ).endOf('day').toISOString() },
        "assignedTo":userId
    }
    return new Promise((resolve,reject) => {
        scheduleModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function scheduleByRes() {
    return new Promise(async(resolve, reject) => {
        try{
            var userData = await userService.getAllUser()
            var scheduleData = await scheduleModel.scheduleByRes()
            let response = [], newArray = [];
            let reso = userData;
            for (i in scheduleData)
        {
            for (j in reso)
            {
                if (scheduleData[i]._id[0]._id == reso[j]._id)
                {
                    reso.splice(j,1);
                }
            }
        }
      for (l in reso){
      newArray.push({_id:[reso[l]], scheduleData:[]});}
        for (r in newArray){
            scheduleData.push(newArray[r]);
        }
        if(scheduleData == []){
        for(z in b){
       testArray = {_id:[b[z]], scheduleData:[]}
       response.push(testArray);}
       resolve(response);
    }
       else{resolve(scheduleData);
    }
   }catch(err){reject(err)}

}).catch((err) => {
    reject(err);
});
}

function collaborators(taskId) {
    return new Promise((resolve, reject) => {
        scheduleModel.collaborators(taskId).then((data) => {
        resolve(data);
           }).catch((err) => {
            reject(err);
        })
    });
}

/**
 * This function returns today's work for the user, you pass today's date and userId to it.
 * today's work or timesheet is a combination of the work that the user has been scheduled for and how many hours he has put into that
 *  work in the past, so we first get the schedule from schedule model, then we get the data of the worklog attached to that schedule
 * from the worklog model and then we get the recorded hours till now on this schedule/task and then combine and send to front end.
 */

function getTodayTimesheet(todaysDate, member){
    return new Promise(async(resolve, reject) => {
        try{
        var worklog, hours, groupId= 0, scheduleId =0, status="NOTSTARTED", hours ="0", _id="0"
        var dataA = await scheduleModel.getNewTodayTimesheet(todaysDate, member);
        Array.isArray(dataA) && dataA.length ? {groupId, scheduleId} = dataA[0] : 0
        worklog = await worklogModel.searchOne({"schedule":scheduleId});
        worklog ? {status, hours, _id} = worklog : 0
        recordedHours = await worklogModel.recordedHoursOfGroup(groupId);
        Array.isArray(dataA) && dataA.length ? result = {...dataA[0], "actualhours":hours,"worklogId":_id,...recordedHours[0]} : result=[]
        resolve(result);
            }
        catch(err){reject(err)}
    }).catch((err) => {
        reject(err);
    });
}

/**
 * We pass a time range and then we get the timesheet of the user for that time range, it is similar to the function above in the sense 
 * that is also a timesheet, we also pass the user's id to this function
 * we first get the schedule groups data, then we loop over it and call group bucket function passing the groupid
 * the group bucket function sends the scheudles belonging to that group within the dfined dates and sometimes it also returns some
 * 'other' buckets which need to be ignored, the info that we recieve in 'data' field is then looped over and we attach some fields to the
 * worklog data like actual hours and worklog id, all this data is then pushed into an array called data
 * now we get the other data belonging to the schedule group like bookingname, taskname etc. and we will in those details in our result object
 * finally the result object, containing the data array is then passed over to the front end.
 */

function timesheetWithRange(startDate, endDate, member){
    return new Promise(async(resolve, reject) => {
        try{
        var data= [], result = [];
        var groupData = await scheduleModel.getGroupsInRange(startDate, endDate, member);
        for(group of groupData){
            var bucket = await scheduleModel.groupBucket(group.groupId,startDate, endDate);
            for(buck of bucket){
                if(buck._id !== "Other"){
                    for (bu of buck.data){
                        var actualHours =0, worklogId =0
                        worklogData = await worklogModel.searchOne({'schedule':bu.scheduleId})
                        worklogData ? (actualHours = worklogData.hours, worklogId = worklogData._id) : 0
                        data.push({...bu, actualHours, worklogId})
                    }
                }
            }
        complete = await scheduleModel.getGroupData(group.groupId)
        completed = complete[0]
        result.push({ "_id": group.groupId, "bookingName":completed.bookingName, "taskName":completed.taskName,
                   "projectName":completed.projectName, "fromDate":completed.startDate, "toDate":completed.endDate,
                   "fromtime":completed.fromTime, "totime":completed.toTime, data
                })
            }

            resolve(result)
        }catch(err){reject(err)}
    });
}

function calendar(startDate, endDate, member) {
    return new Promise(async(resolve, reject) => {
        try{
            var scheduleData=[], meetingData = [], offData = [];
            scheduleQuery = {$and:[{"fromTime":{$lte:new Date(endDate)}},{"fromTime":{$gte:new Date(startDate)}},{"assignedTo":member}]}
            meetingQuery = {$and:[{"meetingTimeFrom":{$lte:new Date(endDate)}},{"meetingTimeFrom":{$gte:new Date(startDate)}}, {"attendees": { $elemMatch: { $eq: member } }}]}
            leaveQuery = {$and:[{"fromDate":{$lte:new Date(endDate)}},{"fromDate":{$gte:new Date(startDate)}}, {"user":member}]}
        var schData = await scheduleModel.search(scheduleQuery)
        
        if(Array.isArray(schData) && schData.length){
        for(sch of schData){
            schedules = JSON.parse(JSON.stringify( sch ) )
            schObject = {...schedules, CATEGORY:"SCHEDULE"}
            scheduleData.push(schObject)
        }
    }
        var meetData = await meetingModel.search(meetingQuery)
        if(Array.isArray(meetData) && meetData.length){
        for (meet of meetData){
            meeting = JSON.parse(JSON.stringify( meet ) )
            meet = {...meeting, CATEGORY:"MEETING"}
            meetingData.push(meet)
        }
    }
        var dayOffData = await leaveModel.search(leaveQuery)
        if(Array.isArray(dayOffData) && dayOffData.length){
        for(dayOff of dayOffData){
           
            today = moment(dayOff.fromData);
            fromTime = moment(today.set({hour:10, minute:0, second:0})).format();
            toTime = moment(today.set({hour:19, minute:0, second:0})).format()
            offDay = JSON.parse(JSON.stringify( dayOff ) )
            leave = {...offDay, CATEGORY:"DAYOFF", fromTime, toTime}
           offData.push(leave)
        }
    }
        var response = scheduleData.concat(meetingData, offData)
        resolve(response)
        }catch(err){reject(err)}
    });
}

module.exports = scheduleService;

