var userModel = require("../models/user.model");
var taskModel = require("../models/task.model");
var projectModel = require("../models/project.model");
var stageModel = require("../models/stage.model");
var scheduleModel = require("../models/schedule.model");
var worklogModel = require("..//models/worklog.model");
var activityModel = require("../models/activity.model");
var stageService = require('./stage.service');
var expService = require('./expense.service');
var taskService = require('./task.service');
var currentContext = require('../../common/currentContext');
var activityService = require('./activity.service');
const notificationClient = require('../../common/notificationClient');
const NotificationType = require('../../common/constants/NotificationType');
var notificationServices = require('./notification.service');
var defaultStages = require('../../config/defaultStages.json');
const TaskPriority = require('../../common/constants/TaskPriority');
var moment = require('moment');
const _ = require('lodash');

const { sample, reject } = require("lodash");
const expenseService = require("./expense.service");
const { response } = require("express");
const { datafusion } = require("googleapis/build/src/apis/datafusion");
const { Console } = require("winston/lib/winston/transports");
const { months } = require("moment");
const { STAGE_COMPLETED_CANT_DELETE } = require("../../common/error-code");


var projectService = {
    getAllProjects: getAllProjects,
    getProjectById:getProjectById,
    addProject: addProject,
    updateProject:updateProject,
    deleteProject:deleteProject,
    getProjectByProjectName: getProjectByProjectName,
    getProjectsByPage: getProjectsByPage,
    getAllProjectsCount: getAllProjectsCount,
    getProjectsByPageWithSort: getProjectsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchProjects: searchProjects,
    getProjectByName: getProjectByName,
    getProjectByClientName:getProjectByClientName,
    textSearch: textSearch,
    getProjectRates: getProjectRates,
    costVariance: costVariance,
    estVsAct: estVsAct,
    planVsActHours: planVsActHours,
    projectHealth: projectHealth,
    compReport: compReport,
    budgetSpent: budgetSpent,
    utilizedHours: utilizedHours,
    expOverviewByProj: expOverviewByProj,
    projData: projData
}

function addProject(projectData) {
    let attendeesUser = projectData.resources;
    return new Promise(async(resolve,reject) => {
        try{
        var user = currentContext.getCurrentContext();
        projectData.createdBy = user.email;
        projectData.lastModifiedBy = user.email;
        var data = await projectModel.create(projectData)
            let activityData = {
                "entityType":"TIMELINE",
                "activityType":"CREATE",
                "data":data,
                "user":user.userId,
                "projectId":data._id,
                "text":"Project "+ data.name +" was created"
            };
            await activityService.addActivity( activityData );
            let payload = {
                notification:data,
                notificationType:NotificationType.PROJECT_CREATED,
                from:user.userId,
                to: attendeesUser[0]
            }
            await notificationServices.addNotification(payload, user.workspaceId)
            await notificationClient.notifyProject(NotificationType.PROJECT_CREATED, data, user.workspaceId, user.userId,attendeesUser);
            for(stage of defaultStages.defaultStages){
                stageService.addStage({
                    'name': stage.name,
                    'position': stage.position,
                    'project':data._id
                })
            }
            resolve(data);
        }catch(err){reject(err)}
    })
   
}

function updateProject(id,projectData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        projectData.lastModifiedBy = user.email;
        
        projectModel.updateById(id,projectData).then((data)=>{
            let activityData = {
                "entityType":"ACTIVITY",
                "activityType":"UPDATED",
                "data":data,
                "user":user.userId,
                "projectId":data._id,
                "text":"Project "+ data.name +" was updated"
            };
            activityService.addActivity( activityData );
            // if (projectData.status = "COMPLETED"){
            //     let timeline = activityModel.search({$and:[{"projectId":id},{"data.status":"COMPLETED"}]})
            //     if(Array.isArray(timeline) && timeline.length){ 
            //     }else{
            //         activityData = {
            //             "entityType":"TIMELINE",
            //             "activityType":"COMPLETED",
            //             "data":data,
            //             "user":user.userId,
            //             "projectId":data._id,
            //             "text":"Project "+ data.name +" was Completed"
            //         };
            //         activityService.addActivity( activityData );
            //     }
            // }
            callback.data = data;
            callback.user = user.userId;
            activityService.addActivity( callback );
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteProject(id) {
    return new Promise((resolve,reject) => {
        projectModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllProjects() {
    return new Promise((resolve,reject) => {
        projectModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getProjectById(id) {
    return new Promise(async(resolve,reject) => {
        try{
        var priorities = {'LOW':0,'NORMAL':0,'IMPORTANT':0,'CRITICAL':0}, final =[], toPush={}, resourcesData=[];
        var data = await projectModel.getById(id)
        var projectData = data
        resources = data.resources
        if(Array.isArray(resources) && resources.length){
            for(resource of resources){
                tasksPriority = await taskModel.tasksPriorityByUserAndProject(resource._id, id)
                if(Array.isArray(tasksPriority) && tasksPriority.length){
                    for (const [key, value] of Object.entries(priorities)) {
                        prio = _.find(tasksPriority, { _id:key });
                        priorities[key] = prio ? prio.count : 0
                      }
                }
                userHoursSpent = await worklogModel.hoursByUserAndProject(resource._id, id)
                userHours = (Array.isArray(userHoursSpent) && userHoursSpent.length) ? userHoursSpent[0].total : 0
                //logic for efficiency
                var averageAssigned = await scheduleModel.assignedHoursOfUserOnProject(resource._id, id);
                var averageRecorded = await worklogModel.recordedHoursOfUserOnProject(resource._id, id);
                avgAssigned = Array.isArray(averageAssigned) && averageAssigned.length ?  averageAssigned[0].avgHoursAssignedToUser : 0; 
                avgRecorded = Array.isArray(averageRecorded) && averageRecorded.length ?  averageRecorded[0].avgHoursRecordedByUserForProject : 0; 
                efficiencypercent = avgAssigned && avgRecorded ?  (avgAssigned/avgRecorded)*100 : 0
                resc = JSON.parse( JSON.stringify( resource ) );
                tempResc = {...resc, userHours, ...priorities, efficiencypercent}
                resourcesData.push(tempResc)
                //TEST THIS CODE ON MONDAY WITH DIFF VALUES
            }
            }
            tempProjData = JSON.parse( JSON.stringify( data ) )
        projectData = {...tempProjData,resourcesData}
            resolve(projectData);
    }catch(err){reject(err)}
    });
}

function getProjectByProjectName(projectName, tenant){
    return new Promise((resolve,reject) => {
        projectModel.searchOne({'projectName': projectName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllProjectsCount() {
    return new Promise((resolve, reject) => {
        projectModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getProjectsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise(async(resolve, reject) => {
        try{
       let response = [];
            let projects = await projectModel.getPaginatedResult({}, options);
            for (i in projects){
                //let tasks = await taskService.getOpenTasksOfProj(projects[i]._id);
                let projs = JSON.parse( JSON.stringify( projects[i] ) );
                //projs = projects[i]._doc;
               // final = {...projs, 'openTaskCount': tasks.length};
                response.push(projs);
           }
        resolve(response);
    }catch(err){reject(err)}
    });
}


function getProjectsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        projectModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        projectModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchProjects(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise(async(resolve, reject) => {
        try{
        var response = [], openTaskCount, closedTaskCount, totalTaskCount; 
        var projects = await projectModel.getPaginatedResult(query, options)
            for (i in projects){
                openTaskCount = 0, closedTaskCount = 0, totalTaskCount =0;
                let compStage = await stageModel.search({$and:[{project:projects[i]._id},{"name":"COMPLETED"}]})
                let openTasks = (Array.isArray(compStage) && compStage.length) ? await taskModel.search({$and:[{project:projects[i]._id},{stage:{$ne:compStage[0]._id}}]}) : []
                let closedTasks = await taskModel.search({stage:compStage[0]._id});
                let allProjTasks = await taskModel.search({project:projects[i]._id})
                totalTaskCount = allProjTasks.length, openTaskCount =openTasks.length, closedTaskCount = closedTasks.length;
                let projs = JSON.parse( JSON.stringify( projects[i] ) );
                final = {...projs, openTaskCount, closedTaskCount, totalTaskCount};
                response.push(final);
            }
            resolve(response);
    }catch(err){reject(err)}
    });
}

function projData() {
    return new Promise(async(resolve, reject) => {
        try{
        var response = [], openTaskCount, closedTaskCount, totalTaskCount; 
        var projects = await projectModel.search({})
            for (i in projects){
                id = projects[i]._id
                openTaskCount = 0, closedTaskCount = 0, totalTaskCount =0;
                let compStage = await stageModel.search({$and:[{project:id},{"name":"COMPLETED"}]})
                let openTasks = (Array.isArray(compStage) && compStage.length) ? await taskModel.search({$and:[{project:id},{stage:{$ne:compStage[0]._id}}]}) : []
                let closedTasks = await taskModel.search({stage:compStage[0]._id});
                let allProjTasks = await taskModel.search({project:id})
                totalTaskCount = allProjTasks.length, openTaskCount =openTasks.length, closedTaskCount = closedTasks.length;
                let projs = JSON.parse( JSON.stringify( projects[i] ) );
                final = {projectId:id, openTaskCount, closedTaskCount, totalTaskCount};
                response.push(final);
            }
            resolve(response);
    }catch(err){reject(err)}
    });
}

function getProjectByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        projectModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getProjectByClientName( name ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let projects = await projectModel.search({ clientName: name });
            resolve( projects );
        } catch ( err ){
            reject( err );
        }
    }) 
}  

//text search service

function textSearch(text) {
    return new Promise((resolve, reject) => {
        projectModel.getTextSearchResult(text).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

/**
 * 
 * COST VARIANCE FOR DASHBOARD
 */

//This API returns the number cost actually incurred in the duration of the project as opposed to the estimated cost
//We need to send data over a period of 12 months and arrange monthly data as this is a chart with entire year's data

function costVariance(projectId) {
        return new Promise(async(resolve, reject) => {
            try{
                var actualDataArray=[], plannedCost = [], response =[]
                var actualData = await worklogModel.costVariance(projectId)
                var projectData = await projectModel.getById(projectId)
                if(projectData){
                startMonth = moment(projectData.startDate).month(), endMonth = moment(projectData.endDate).month();
                var plannedMonthlyCost =  projectData.estimatedCTC / (endMonth - startMonth)
                i= 1
                while(i<13){
                    if(Array.isArray(actualData) && actualData.length){
                    actualCost = _.find(actualData, { _id:i });
                    actualCost ? actualDataArray.push(actualCost.monthlyCostForProjectWork) : actualDataArray.push(0);
                    }else{actualDataArray.push(0)}
                    (i >= startMonth && i <= endMonth) ? plannedCost.push(plannedMonthlyCost) : plannedCost.push(0);
                    i++
                }
                response = [plannedCost, actualDataArray]
                resolve(response)
            }else{resolve([[],[]])}
            }catch(err){reject(err)}
        })
    }      

/**
 * 
 * ESTIMATED VS ACTUAL COST FOR PROJECT PLANNING
 */

//from the data of the project, we can get the estimated cost of the project and the stat date and end date
//the difference between the start date and end date will give us the weeks for which the project will last
//we will divide the cost by weeks to get the per week estimated cost
//we will find the year of week of the first week and get a number and similarly for the end week
//we will run a loop between start week and end week and create an array of actual cost matching those weeks
//we will push 0 in places where no value is present, for estimated cost, the weekly estimated cost will be pushed in all places
//the week difference needs to be +ve and round number
//if worklog data is not present, we just need to put zero in all places for actual cost 


function estVsAct(projectId){
    return new Promise(async(resolve, reject) => {
        try{
            let weeks =[], actualCost =[], estimatedCost =[], response = []
            var projectData = await projectModel.getById(projectId)
            var worklogData = await worklogModel.getActualCost(projectId)
            if(projectData){
            i=1, startWeek = moment(projectData.startDate).week(), endWeek = moment(projectData.endDate).week(), plannedCost = projectData.estimatedCTC;
            plannedWeeklyCost = Math.round(plannedCost / (endWeek-startWeek))
            while(startWeek < endWeek){
                if(Array.isArray(worklogData) && worklogData.length){
                   work = _.find(worklogData, { _id:startWeek })
                   work ? actualCost.push(work.weeklyCostForProjectWork) : actualCost.push(0)
                }else{ actualCost.push(0)}
                estimatedCost.push(plannedWeeklyCost), weeks.push(i), i++, startWeek++
            }
            response = [weeks, actualCost, estimatedCost]
            resolve(response)
            }else{resolve([])}
        }catch(err){reject(err)}

    })
}


/**
 * 
 * PLANNED VS ACTUAL HOURS FOR PROJECT PLANNING
 */

 function planVsActHours(projectId){
    return new Promise(async(resolve, reject) => {
        try{
            let weeks =[], actualHours =[], estimatedHours =[], response = []
            var projectData = await projectModel.getById(projectId)
            var worklogData = await worklogModel.getActualHours(projectId)
            if(projectData){
            i=1, startWeek = moment(projectData.startDate).week(), endWeek = moment(projectData.endDate).week(), plannedHours = projectData.estimatedHours;
            plannedWeeklyHours = Math.round(plannedHours / (endWeek-startWeek))
            while(startWeek < endWeek){
                if(Array.isArray(worklogData) && worklogData.length){
                   work = _.find(worklogData, { _id:startWeek })
                   work ? actualHours.push(work.hoursPerWeek) : actualHours.push(0)
                }else{ actualHours.push(0)}
                estimatedHours.push(plannedWeeklyHours), weeks.push(i), i++, startWeek++
            }
            response = [weeks, actualHours, estimatedHours]
            resolve(response)
            }else{resolve([])}
        }catch(err){reject(err)}

    })
}

/**
 * 
 * PROJECT HEALTH FUNCTION 
 */
function projectHealth(projectId){
    return new Promise(async(resolve, reject) => {
            var data = await taskModel.onScheduleIndicator(projectId)
            if(Array.isArray(data) && data.length){
                let health;
                let percent = data[0].onschedulepercentage
                if(percent<0)
                {health = "very critical"}
                if(percent>0&&percent<=10)
                {health = "critical"}
                if(percent>10&&percent<=20)
                {health = "poor"}
                if(percent>20&&percent<=40)
                {health = "needs intervention"}
                if(percent>40&&percent<=60)
                {health = "below average"}
                if(percent>60&&percent<=70)
                {health = "average"}
                if(percent>70&&percent<=85)
                {health = "above average"}
                if(percent>85&&percent<=95)
                {health = "good"}
                if(percent>95&&percent<=100)
                {health = "on track"}
                if(percent>100&&percent<=120)
                {health="slightly ahead"}
                if(percent>120&&percent<=150)
                {health="ahead schedule"}
                if(percent>150)
                {health="excellent"}
                resolve(health);
            }
           else{
            resolve([]);
           }
    });

}

function getProjectRates( type, projectId ){
    return new Promise( async ( resolve, reject ) => {
        let final=[];
        try{
            let rateQuery = { $sum:"$resourceinProject.contract.ctc" }
            if( type === "AVG" ){
                rateQuery = { $avg:"$resourceinProject.contract.ctc" }
            }
            let response = await projectModel.projectRates(projectId, rateQuery );
            final = Array.isArray(response) && response.length ? response[0].rate : []
            resolve( final);
        } catch ( err ){
            reject( err );
        }
    })
}

// completion report in project status report
function compReport(projectId) {
    return new Promise(async(resolve, reject) => {
        try{
            var totalTasks = 0, completedTasks = 0, compPercent = 0;
            var compStage = await stageModel.search({$and:[{project:projectId},{"name":"COMPLETED"}]})
            var allProjTasks = await taskModel.search({project:projectId})
            totalTasks = allProjTasks.length
            var compTasks = (Array.isArray(compStage) && compStage.length) ? await taskModel.search({stage:compStage[0]._id}) : []
            console.log(allProjTasks)
            console.log(compStage)
            console.log(compTasks)
            if(Array.isArray(compTasks) && compTasks.length){
            completedTasks = compTasks.length, compPercent = (completedTasks/totalTasks)*100
            }
            final = ["completedPercentage :",compPercent,"tasksCompleted :", completedTasks, "tasksAssigned :",totalTasks];
            resolve(final);

            // var taskPercent = await taskService.getTaskPercentByProjectId(projectId)
            // var compPercent =0, compCount =0, total=0;
            // if(Array.isArray(taskPercent) && taskPercent.length){
            // var comp =  _.find(taskPercent, { _id:"COMPLETED" })
            // comp ? (compPercent = comp.percentage, compCount = comp.count, total = comp.total) : 0    
            // final = ["completedPercentage :",compPercent,"tasksCompleted :", compCount, "tasksAssigned :",total];
            // resolve(final);
            // }
            // else{
            // resolve([]);
            // }
        }catch(err){reject(err)}
    });
}


function budgetSpent(projectId) {
    return new Promise(async(resolve, reject) => {
        var estCost, spentBudget, final = [];
        try{
        var data = await worklogModel.hoursAndCost(projectId)
        var dataA = await projectModel.getById(projectId)
        spentBudget = Array.isArray(data) && data.length ? data[0].costForProject : []
        estCost = dataA ? dataA.estimatedCTC : []
        final = [["estimated budget", "spent budget :"], [estCost, spentBudget]]
                resolve(final);
        }catch(err){reject(err);}
    });
}


function utilizedHours(projectId) {
    return new Promise(async(resolve, reject) => {
        var estHours, utilHours, final = [];
        try{
        var worklogData = await worklogModel.hoursAndCost(projectId)
        var projectData = await projectModel.getById(projectId)
        console.log(worklogData)
        utilHours = Array.isArray(worklogData) && worklogData.length ? worklogData[0].totalHours : []
        estHours = projectData ? projectData.estimatedHours : []
        console.log(estHours)
        final = [["planned hours", "utilized hours"],[estHours, utilHours]]
        resolve(final);
        }catch(err){reject(err);}
    });
}

function expOverviewByProj(projectId) {
    return new Promise(async(resolve, reject) => {
        try{
        let totalExp, billExp, unbillExp, penReq
            
            totalExp = await expenseService.totalProjExp(projectId)
            Project_Expense = Array.isArray(totalExp) && totalExp.length ? totalExp[0].total : 0;
        
           
            billExp = await expenseService.billProjExp(projectId)
            Billed_Expense = Array.isArray(billExp) && billExp.length ? billExp[0].total : 0

            unbillExp = await expenseService.unbillProjExp(projectId)
            Unbilled_Expense = Array.isArray(unbillExp) && unbillExp.length ? unbillExp[0].total : 0;
            
           
            penReq = await expenseService.penReq(projectId)
            Pending_Requests = Array.isArray(penReq) && penReq.length ? penReq[0].count : 0;
            
            
            let response = {Project_Expense, Billed_Expense, Unbilled_Expense, Pending_Requests}
           
            resolve(response);
        }catch(err){reject(err)}
    });
}

module.exports = projectService;

