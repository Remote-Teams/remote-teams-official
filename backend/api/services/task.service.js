var taskModel = require("../models/task.model");
var worklogModel = require("../models/worklog.model");
var scheduleModel = require("../models/schedule.model");
var projectModel = require("../models/project.model");
var stageModel = require("../models/stage.model");
var projectService = require('./project.service');
var pipelineService = require('./pipeline.service');
var pipelineModel = require("../models/pipeline.model");
var currentContext = require('../../common/currentContext');
var activityService = require('./activity.service');
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var moment = require('moment');
const { UPCOMING } = require("../../common/constants/TaskStatus");
const _ = require('lodash');
const { count } = require("../models/task.model");
const { identity } = require("lodash");
const { parseAsync } = require("yargs");

var taskService = {
    getAllTasks: getAllTasks,
    getTaskById:getTaskById,
    addTask: addTask,
    updateTask:updateTask,
    deleteTask:deleteTask,
    getTaskByTaskName: getTaskByTaskName,
    getTasksByPage: getTasksByPage,
    getAllTasksCount: getAllTasksCount,
    getTasksByPageWithSort: getTasksByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    getTaskDeadlineByDate:getTaskDeadlineByDate,
    searchTasks: searchTasks,
    getTaskByName: getTaskByName,
    textSearch: textSearch,
    getTaskOverviewByProjectId:getTaskOverviewByProjectId,
    getTaskScheduleIndicator:getTaskScheduleIndicator,
    projectTaskStatusReport:projectTaskStatusReport,
    getTaskPercentByProjectId: getTaskPercentByProjectId,
    projectTaskCompletionStatus: projectTaskCompletionStatus,
    totalTasksThisMonth: totalTasksThisMonth,
    tasksCountByProject: tasksCountByProject,
    tasksGrouping:tasksGrouping,
    tasksProgress: tasksProgress,
    taskWeeks: taskWeeks,
    getOpenTasksOfProj: getOpenTasksOfProj,
    summaryTab: summaryTab,
    priorityDist: priorityDist,
    impPerProj: impPerProj,
    hrsLog, hrsLog,
    exists: exists
}

function addTask(taskData, next) {
    return new Promise(async(resolve,reject) => {
        try{
        var user = currentContext.getCurrentContext();
        taskData.createdBy = user.email;
        taskData.lastModifiedBy = user.email;     
        var data = await taskModel.create(taskData)
            let activityData = {
                "entityType":"TIMELINE",
                "activityType":"CREATE",
                "data":data,
                "user":user.userId,
                "projectId":data.project,
                "text":"Task "+ data.name +" was created"
            };
        await activityService.addActivity( activityData );
        members = taskData.members_left
            if (Array.isArray(members) && members.length){
             for(user of members){
                var exists = await pipelineService.exists(user, taskData.name)
                if(exists.isExist == false){
                 await pipelineService.addPipeline({
                     'user':user,
                     'task':data._id,
                     'bookedBy':taskData.bookedBy
                     })
                 }
             }
            }
        resolve(data);
        }catch(err){reject(err)}
    })
}

function updateTask(id,taskData) {
    return new Promise(async(resolve,reject) => {
        try{
        var user = currentContext.getCurrentContext();
        taskData.lastModifiedBy = user.email;
        var data = await taskModel.updateById(id,taskData)
        let activityData = {
            "entityType":"TIMELINE",
            "activityType":"UPDATE",
            "data":data,
            "user":user.userId,
            "projectId":data.project,
            "text":"Task "+ data.name +" was updated"
        };
    await activityService.addActivity( activityData );
            resolve(data);
    }catch(err){reject(err)} 
    })
     
}

function deleteTask(id) {
    return new Promise(async(resolve,reject) => {
        try{
        var data = await taskModel.deletebyId(id)
        var pipelines = await pipelineModel.search({"task":id})
        for (pipeline of pipelines){
            console.log(pipeline._id)
           var deleted = await pipelineModel.deletebyId(pipeline._id)
        }
            resolve({'success':true});
        }catch(err){reject(err)}
    })
}

function getAllTasks() {
    return new Promise((resolve,reject) => {
        taskModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTaskById(id) {
    return new Promise((resolve,reject) => {
        taskModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTaskByTaskName(taskName, tenant){
    return new Promise((resolve,reject) => {
        taskModel.searchOne({'taskName': taskName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllTasksCount() {
    return new Promise((resolve, reject) => {
        taskModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTasksByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        taskModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTasksByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        taskModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        taskModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchTasks(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        taskModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTaskByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        taskModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

//text search service

function textSearch(text) {
    return new Promise((resolve, reject) => {
        taskModel.getTextSearchResult(text).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTaskDeadlineByDate( date ){
    return new Promise( async ( resolve, reject ) => {
        try{
            var query = {
                "endDate": { "$eq" : new Date(date).toISOString() }
            };
            let get_all_deadline = await taskModel.search(query);
            resolve( get_all_deadline );
        } catch ( err ){
            reject( err );
        }
    } )
}

function getTaskOverviewByProjectId( projectId ){
    return new Promise( async ( resolve, reject ) => {
        let id = [], percent = [], count = [], response = [];
        try{
            let taskData = await taskModel.taskOverviewByProjectId(projectId);
            for (task of taskData){
                id.push(task._id), percent.push(task.percentage), count.push(task.count);
            }
            response=[id,percent, count]
            resolve( response )
        } catch ( err ){
            reject( err ); 
        }
    })
}


function getTaskScheduleIndicator( projectId ){
    return new Promise((resolve, reject) => {
        taskModel.onScheduleIndicator(projectId).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


//just helps the project tas status report function, doesn't have routes of its own
function getTaskPercentByProjectId(projectId){

    return new Promise((resolve, reject) => {
        taskModel.getTaskPercentByProjectId(projectId).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

//This function returns an array that contains 2 arrays, one of project names and other of percentage of completed tasks in that project
//we call a model function and get grouped data of different statuses of tasks along with their count and percentages and this is used.

// this will function the same but get the info from stages instead
function projectTaskStatusReport() {
         return new Promise(async(resolve, reject) => {
            try{
                let projArray = [], percent = [];
                let projects = await projectModel.search({});
                for(project of projects){
                    var percentage =0;
                    let stage = await stageModel.search({$and:[{project:project._id},{name:"COMPLETED"}]})
                    console.log(stage)
                    allProjTasks = await taskModel.search({project:project._id})
                    totalTasks = allProjTasks.length
                    if(Array.isArray(stage) && stage.length){
                        let tasks = await taskModel.search({stage:stage[0]._id})
                        noOfTasks = Array.isArray(tasks) && tasks.length ? tasks.length : 0
                        percentage = noOfTasks ? (noOfTasks/totalTasks)*100 : 0
                    }
                    percent.push(percentage)
                    projArray.push(project.name)
                }
                resolve([projArray, percent])
            }catch(err){reject(err)}
            })
         }

//This API returns 5 arrays, one has names of all the projects in the system right now and the other four have the various
//percentages of tasks by status, we return 0 if a project doesn't have a particular type of status task or has no task data
function projectTaskCompletionStatus() {
    return new Promise(async(resolve, reject) => {
        try{
            let labels = [], Low = [], Normal = [], Important = [], Critical = [];
            projects = await projectModel.search({});
            if(Array.isArray(projects) && projects.length){
            for (project of projects){
                labels.push(project.name)
                percentData = await getTaskPercentByProjectId(project._id)
                if(Array.isArray(percentData) && percentData.length){
                comp = _.find(percentData, {_id:"LOW" })
                comp ? Low.push(comp.percentage) : Low.push(0)
                upcom = _.find(percentData, {_id:"NORMAL" })
                upcom ? Normal.push(upcom.percentage) : Normal.push(0)
                pend = _.find(percentData, {_id:"IMPORTANT" })
                pend ? Important.push(pend.percentage) : Important.push(0)
                ongo = _.find(percentData, {_id:"CRITICAL"})
                ongo ? Critical.push(ongoing.percentage) : Critical.push(0)
                }else{
                Low.push(0), Normal.push(0), Important.push(0), Critical.push(0)
                }
            }
            response = {labels,Low, Normal, Important, Critical}
            resolve(response)
        }else{
            resolve([])
            }
        }catch(err){reject(err)}
    });
}

//this API returns the weeks and the tasks completed within those weeks. We call the aggregate function, taskCompletionByWeeks
//then we run a loop between startweek and end week or the total duration of the project
function taskWeeks(projectId){
    return new Promise(async(resolve, reject) => {
        try{
        let weeks = [], weekData =[], final = [weeks, weekData];
        let i=0;
        projectData = await projectModel.getById(projectId);
        startWeek = moment(projectData.startDate).isoWeek();
        endWeek = moment(projectData.endDate).isoWeek();
        data = await taskModel.taskCompletionByWeeks(projectId);
        if(Array.isArray(data) && data.length){
            while(startWeek < endWeek+1){
            compData =  _.find(data, {week:startWeek })
            compData ? weekData.push(compData.count) : weekData.push(0)
            weeks.push(i+1), i++, startWeek ++
            }
        }
          resolve(final);
    }catch(err){reject(err)}
    });
}

// total tasks function

function totalTasksThisMonth(startDate, endDate){
    return new Promise((resolve, reject) => {
        taskModel.totalTasksThisMonth(startDate, endDate).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });

}

function tasksGrouping(projectId){
    return new Promise((resolve, reject) => {
        taskModel.tasksGrouping(projectId).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });

}

function tasksProgress(projectId){
    return new Promise(async(resolve, reject) => {

        try{
           let i=0, weeks = [], weekData =[], expected =[],final = [weeks, weekData, expected];
           var project = await projectModel.getById(projectId)
           var tasks = await taskModel.search({"project":projectId})
           totalTasks = Array.isArray(tasks) && tasks.length ? tasks.length : 0;
           var data = await taskModel.taskCompletionByWeeks(projectId);
           if(project!==null && project!==undefined){
            startWeek = moment(project.startDate).isoWeek();
            endWeek = moment(project.endDate).isoWeek();
            var diff = Math.abs(endWeek - startWeek);
            tasksPerWeek = Math.ceil(totalTasks/diff);
        }else{
            var diff = 0
        }
        if(Array.isArray(data) && data.length){
            while(startWeek < endWeek+1){
            compData =  _.find(data, {week:startWeek })
            compData ? weekData.push(compData.count) : weekData.push(0)
            weeks.push(i+1), i++, startWeek ++, expected.push(tasksPerWeek);
            }
        }
            resolve(final);
        }catch(err){reject(err)}
    });
}

function getOpenTasksOfProj(projectId){
        return new Promise((resolve, reject) => {
            taskModel.search({"project":projectId, "status":{$ne:"COMPLETED"}}).then((data) => {
                resolve(data);
            }).catch((err) => {
                reject(err);
            })
        });
}


function summaryTab(){
    var allTasks =[], data =[], final=[];
    return new Promise(async(resolve, reject) => {
        try{
        allTasks = await getAllTasks();
        if(Array.isArray(allTasks) && allTasks.length)
        {
            for(task of allTasks){
                taskname = task.name, status = task.status, startdate = task.startDate, enddate = task.endDate
                user = await scheduleModel.totalUsersOnTask(task._id)
                plhour = await scheduleModel.plannedHoursByTask(task._id)
                acthour = await worklogModel.actualHoursByTask(task._id)
               Array.isArray(user) && user.length ? assignedto = user[0].count : assignedto = 0;
               (Array.isArray(plhour) && plhour.length) ? plannedhours = plhour[0].total : plannedhours = 0;
               (Array.isArray(acthour) && acthour.length) ? actualhours = acthour[0].total : actualhours = 0;
               data.push({taskname, startdate, enddate, status, assignedto, plannedhours, actualhours})
               final.push(data)
            }
        }
        resolve(final);
    }catch(err){reject(err)}
    });
}

//gets data of all projects count from model function and get list of all projects in backend, then matches them
//and creates an object with project data and it's count and sends this data in an array and then to front end
function tasksCountByProject(){
    return new Promise(async(resolve, reject) => {
        try{
            var response = []
            var projects = await projectModel.search({});
            var projCount = await taskModel.tasksCountByProject();
            if(Array.isArray(projects) && projects.length){
                for(project of projects){
                if(Array.isArray(projCount) && projCount.length){
                data = _.find(projCount, {id:project._id })
                console.log("project count",projCount)
                console.log("data", data)
                structure =  data ? {"project":project, "count": data.count} : {"project":project,"count":0};
                response.push(structure)
                    }else{
                    structure = {"project":project,"count":0}
                    }
                }   
                resolve(response)
            }else{resolve([])}
        }catch(err){reject(err)}
    });

}

function exists(project, taskName) {
    return new Promise(async(resolve,reject) => {
        try{
        query = { $and: [ { project: project }, { name: taskName} ] }
        data = await taskModel.search(query)
        isExist =  Array.isArray(data) && data.length ? true : false 
        resolve({isExist})
        }catch(err){reject(err)}
    })
}

function priorityDist(){
    return new Promise(async(resolve, reject) => {
        try{
        lowPercent = 0, normalPercent =0, criticalPercent =0, impPercent =0;
        totalCount = await taskModel.countDocuments({})
        low = await taskModel.countDocuments({priority:"LOW"})
        normal = await taskModel.countDocuments({priority:"NORMAL"})
        critical = await taskModel.countDocuments({priority:"CRITICAL"})
        important = await taskModel.countDocuments({priority:"IMPORTANT"})
        lowPercent = low ? (low/totalCount)*100 :0
        normalPercent = normal ? (normal/totalCount)*100 :0
        criticalPercent = critical ? (critical/totalCount)*100 :0
        impPercent = important ? (important/totalCount)*100 :0
        data = {lowPercent, normalPercent, criticalPercent, impPercent}
        resolve(data)
        }catch(err){reject(err)}
    });
}

function impPerProj(){
    return new Promise(async(resolve, reject) => {
     try{
        let final =[], lowPercent = 0, normalPercent =0, criticalPercent =0, impPercent =0;
        allProj = await projectModel.search({})
        if(Array.isArray(allProj) && allProj.length){
        for(proj of allProj){
        totalCount = await taskModel.countDocuments({project: proj._id})
        low = await taskModel.countDocuments({$and:[{project: proj._id},{priority:"LOW"}]})
        normal = await taskModel.countDocuments({$and:[{project: proj._id},{priority:"NORMAL"}]})
        critical = await taskModel.countDocuments({$and:[{project: proj._id},{priority:"CRITICAL"}]})
        important = await taskModel.countDocuments({$and:[{project: proj._id},{priority:"IMPORTANT"}]})
        lowPercent = low ? (low/totalCount)*100 :0
        normalPercent = normal ? (normal/totalCount)*100 :0
        criticalPercent = critical ? (critical/totalCount)*100 :0
        impPercent = important ? (important/totalCount)*100 :0
        data = {project:proj.name, lowPercent, normalPercent, criticalPercent, impPercent}
        final.push(data)
        }
        resolve(final)
    }
    else{
        resolve([])
    }
     }catch(err){reject(err)}
    });
}

function hrsLog(){
    return new Promise(async(resolve, reject) => {
      try{
        var final=[], totalHours, project, data={};
      var allTasks = await taskModel.search({})
      if(Array.isArray(allTasks) && allTasks.length){
        for(task of allTasks){
            hoursData = await worklogModel.totalHoursOnTask(task._id)
            totalHours = (Array.isArray(hoursData) && hoursData.length) ? hoursData[0].total : 0
            projectName = task.project ? task.project.name : "noname"
            data = {taskName: task.name, projectName, totalHours}
            final.push(data)
        }
        resolve(final)
      }
      }catch(err){reject(err)}
    });
}

module.exports = taskService;

