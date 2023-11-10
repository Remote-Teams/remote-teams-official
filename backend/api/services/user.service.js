var userModel = require("../models/user.model");
var worklogModel = require("../models/worklog.model");
var scheduleModel = require("../models/schedule.model");
var projectModel = require("../models/project.model");
var currentContext = require('../../common/currentContext');
var Status = require('../../common/constants/Status');
const roleService = require('../services/role.service');
const errorCode = require('../../common/error-code');
const _ = require('lodash');
const leaveService = require('../services/leave.service');
const activityService = require('../services/activity.service');
const helper = require("../../common/helper");
const { response } = require("express");
const { use } = require("passport");
const { count } = require("../models/user.model");
var errorMethods = require('../../common/error-methods');
var errorMethods = require('../../common/error-methods');

var userService = {
    getAllUser: getAllUser,
    getUserById: getUserById,
    addUser: addUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getUserByEmail: getUserByEmail,
    addDefaultUser: addDefaultUser,
    searchUsers: searchUsers,
    comparePassword: comparePassword,
    getAllUsersCount: getAllUsersCount,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    getUsersByRoleCategory: getUsersByRoleCategory,
    getEntityByEmail: getEntityByEmail,
    textSearch: textSearch,
    getUserByRole: getUserByRole,
    getAllUsersOverview: getAllUsersOverview,
    archiveUser: archiveUser,
    getActivityByUserId: getActivityByUserId,
    getUserOverviewByStatus: getUserOverviewByStatus,
    getMonthlyCostByMemberType:getMonthlyCostByMemberType,
    getTimeSheetForReports:getTimeSheetForReports,
    userDistPercent: userDistPercent,
    resourceSummary: resourceSummary,
    avgUtilRate: avgUtilRate,
    summaryTab: summaryTab ,
    getUsersSimply: getUsersSimply
}

function addUser(userData) {
    return new Promise((resolve, reject) => {
        userService.getUserByEmail(userData.email).then((data) => {
            if (data) {
                return reject(errorCode.USER_ALREADY_EXIST);
            } else {
                var user = currentContext.getCurrentContext();
                userData.createdBy = user.email;
                userData.lastModifiedBy = user.email;
                var today =new Date()
                console.log("REACHED HERE")
                contract = {
                    attachments: [] ,ctc: 500,
                      end_date: "",
                      start_date: today,
                      working_hrs_from: "2021-08-09T10:00:00.570Z",
                      working_hrs_to: "2021-08-09T18:00:00.570Z"
                  }
                additionalInfo = {
                    dateOfBirth: "1990-08-12T06:19:35.570Z", country_code: "+1"
                  }
                  newData = userData
                  userData = {...newData, contract, additionalInfo}
                if (userData.name == undefined) {
                    userData.name = userData.firstName + " " + userData.lastName;
                }
                if(userData.profileImage != undefined){
                    userData.profileImage = helper.getPathFromImage(userData.profileImage, user.workspaceId);
                }
                //add default role
                if (userData.role == undefined) {
                    console.log("INside");
                    roleService.getDefaultRole().then((result) => {
                        if (result == undefined || result == null) {
                            reject({ "message": "role was: " + null });
                        } else {
                            userData.role = result._id;
                            createRole(userData, resolve, reject);
                        }
                    }).catch( err => console.log( err ) );
                } else {
                    createRole(userData, resolve, reject);
                }
            }
        })
        .catch( err => {
            console.log( err );
        })
    })
}

function createRole(userData, resolve, reject) {
    userModel.create(userData).then((data) => {
        resolve(data);
    }).catch((err) => {
        reject(err);
    });
}

function addDefaultUser(userData) {
    return new Promise((resolve, reject) => {
        
        if (userData.firstName == undefined) {
            userData.firstName = "Admin";
        }
        if (userData.lastName == undefined) {
            userData.lastName = "Admin";
        }
      
        userData.name = userData.firstName + " " + userData.lastName;
        userData.status = Status.ACTIVE;
        userData.dateOfJoining = new Date().toISOString();
        addUser(userData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        });
    });
}


function updateUser(id, userData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        userData.lastModifiedBy = user.email;
        userData.name = userData.firstName + " " + userData.lastName;
        if(userData.profileImage != undefined){
            userData.profileImage = helper.getPathFromImage(userData.profileImage, user.workspaceId);
        }
        userModel.updateById(id, userData).then((data) => {
            getUserById(id).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteUser(id, userData) {
    return new Promise( async ( resolve, reject ) => {
        try{
            userData.status = Status.ARCHIVE;
            let updateUserData = await updateUser(id, userData);
            resolve( updateUserData );
        } catch ( err ){
            reject( err );
        }
    })
}

function comparePassword(password, email, workspaceId, next) {
    return new Promise(async( resolve, reject ) => {
        try{
            var user = await userModel.searchOne({"email": email.toLowerCase()})
            if(user){
                var isMatch = await userModel.comparePassword(password, user.password, (err, isMatch) => {
                    if (err) { next(errorMethods.sendBadRequest(errorCode.INVALID_EMAIL_OR_PASSWORD)); }
                    if (!isMatch) {
                        next(errorMethods.sendBadRequest(errorCode.PASSWORD_DOES_NOT_MATCH))
                    }
                    resolve(isMatch)
                  });
            }else{
                next(errorMethods.sendBadRequest(errorCode.USER_WITH_EMAIL_DOES_NOT_EXIST))
            }
        } catch ( err ){
            reject( err );
        }
    })
}

function getAllUser() {
    var response=[], transit={}, rough=[], projectNames=[];
    return new Promise(async(resolve, reject) => {
        try{
        var context = currentContext.getCurrentContext();
           data = await userModel.search({});
           for(i in data){
               data[i].profileImage = helper.resolveImagePath(data[i].profileImage, context.workspaceId);
               resource = data[i]._id;
               projects = await projectModel.projectsOfResource(resource);
               for(j in projects){
                   projectNames[j] = projects[j].name;
               }
               tasks = await scheduleModel.taskGroupByResource(resource);
               transit = {projects:projectNames, taskGroup:tasks}
               rough = data[i]._doc;
               final = {...rough,...transit}
               response.push(final);
           }
           resolve(response)
        }catch(err){reject(err)}
    });
}

function searchUsers(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        var context = currentContext.getCurrentContext();
        userModel.getPaginatedResult(query, options).then((data) => {
            data.map(u=>{
                if(u != undefined){
                    u.profileImage = helper.resolveImagePath(u.profileImage, context.workspaceId);
                }
            });
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getUserById(id) {
    return new Promise(async(resolve, reject) => {
        try{
            var response;
        var context = currentContext.getCurrentContext();
        var data = await userModel.getById(id)
            var projects = await projectModel.projectsOfResource(id);
            let result = JSON.parse(JSON.stringify(data));
            if(result != undefined){
                profileImage = helper.resolveImagePath(data.profileImage, context.workspaceId);
                response = {...result, profileImage, projects}
            }
            resolve(response);
        }catch(err){reject(err)}
    });
}


function getActivityByUserId(id){
    return new Promise((resolve, reject) => {
        userModel.getById(id).then((data) => {
            if(data == undefined || data.size == 0){
                return reject(errorCode.USER_NOT_EXIST);
            }else{
                let searchCriteria = {};
                searchCriteria.pageNo = 1;
                searchCriteria.pageSize = 100000000000;
                searchCriteria.query = {
                    createdBy: data.email
                };
                activityService.searchActivities(searchCriteria).then((activityData)=>{
                    resolve(activityData);
                }).catch((err)=>{
                    reject(err);
                })
            }
        }).catch((err) => {
            reject(err);
        })
    });
}

function getUserByEmail(email, tenant) {
    return new Promise((resolve, reject) => {
        var context = currentContext.getCurrentContext();
        userModel.searchOne({ 'email': email }).then((data) => {
            let result = data;
            if(result != undefined){
                result.profileImage = helper.resolveImagePath(data.profileImage, context.workspaceId);
            }
            resolve(result);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getUserByRole(role) {
    return new Promise((resolve, reject) => {
        var context = currentContext.getCurrentContext();
        userModel.searchOne({ 'role': role }).then((data) => {
            let result = data;
            if(result != undefined){
                result.profileImage = helper.resolveImagePath(data.profileImage, context.workspaceId);
            }
            resolve(result);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllUsersCount(query) {
    return new Promise((resolve, reject) => {
        userModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        userModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getUsersByRoleCategory(category) {
    return new Promise((resolve, reject) => {
        var context = currentContext.getCurrentContext();
        const roleSearchCriteria = {
            pageSize: 100000,
            pageNo: 1,
            query: { 'category': category }
        }
        roleService.searchRoles(roleSearchCriteria).then((roleData) => {
            const roleIds = roleData.map(x => x._id);
            const userSearchCriteria = {
                pageSize: 100000,
                pageNo: 1,
                query: { 'role': roleIds }
            }
            searchUsers(userSearchCriteria).then((userData) => {
                userData.map(u=>{
                    if(u != undefined){
                        u.profileImage = helper.resolveImagePath(u.profileImage, context.workspaceId);
                    }
                });
                resolve(userData);
            }).catch((err) => {
                reject(err);
            });
        }).catch((err) => {
            reject(err);
        });
    });
}

function getEntityByEmail(email) {
    var query = {
        email: email
    }
    return new Promise((resolve, reject) => {
        var context = currentContext.getCurrentContext();
        userModel.search(query).then((data) => {
            data.map(u=>{
                if(u != undefined){
                    u.profileImage = helper.resolveImagePath(u.profileImage, context.workspaceId);
                }
            });
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function textSearch(text, status) {
    return new Promise((resolve, reject) => {
        var context = currentContext.getCurrentContext();
        userModel.getTextSearchResult(text).then((data) => {
            if (!_.isEmpty(status)) {
                data = _.filter(data, ['status', status]);
            }
            data.map(u=>{
                if(u != undefined){
                    u.profileImage = helper.resolveImagePath(u.profileImage, context.workspaceId);
                }
            });
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllUsersOverview(){
    return new Promise(async(resolve, reject)=>{
        try{
            var promises =[]
            var data = await Promise.all([
                getAllUsersCount(), leaveService.getCountOnLeave(), leaveService.getCountApprovalPending(), leaveService.getCountUpcomingLeaves()
            ])
            var result = {allMembers:data[0], onLeave: data[1], approvalPending: data[2], upcomingLeaves: data[3]}
            resolve(result)
        }catch(err){reject(err)}
    })
}

function getUserOverviewByStatus(){
    return new Promise(async(resolve, reject) => {
        try {
    var data = await Promise.all([getAllUsersCount({}),getAllUsersCount({'status':'ACTIVE'}),getAllUsersCount({'status':'INACTIVE'})])
    var result = {'total': data[0],'active': data[1],'inactive': data[2]}
    resolve(result);   
        } catch(err){
            reject(err);
        }
    }).catch((err) => {
        console.log(err);
        reject(err);
    });
}


function archiveUser(usersInput) {
    return new Promise((resolve, reject) => {
        var archiveUsersPromises = [];
        usersInput.users.forEach(user => {
            archiveUsersPromises.push(archiveUsers(user));
        });
        Promise.all(archiveUsersPromises).then((response) => {
            resolve(response);
        }).catch((err) => {
            reject(err);
        });
    });
}

function archiveUsers(user) {
    return new Promise((resolve, reject) => {
        userService.getUserByEmail(user).then((userData) => {
            userData.status = Status.ARCHIVE;
            userService.updateUser(userData._id, userData).then((data) => {
                resolve(data);
            }).catch((err) => {
                //console.log("Email:" + user + ", err:" + err);
                reject(err);
            });
        }).catch((err) => {
            //console.log("Email:" + user + ", err:" + err);
            reject(err);
        });
    });
}

function getMonthlyCostByMemberType(){
    return new Promise( async ( resolve, reject ) => {
        try{
            let aggregateQuery = [
                { $match: { status : "ACTIVE", memberType: { "$ne" : "CLIENT" } }},
                { $group : { _id : "$memberType", totalhourlycost:{$sum : "$contract.ctc" } }},
                { $project: {
                    _id:1,
                    totalhourlycost:1,
                    totalmonthyconst:{ $multiply: [ "$totalhourlycost", 170 ] }
                    }}
            ];
            let response = await userModel.globalAggregateFunction( aggregateQuery );
            resolve( response );
        } catch( err ){
            reject( err );
        }
    })
}

function getTimeSheetForReports( fromDate, toDate ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let aggregateQuery = [
                { $match : { $and : [{ "memberType":{ $ne : "ADMIN" } },{ "memberType":{ $ne : "CLIENT" } }] } },
                { $addFields:{ "workingHours": { $divide : [ { $subtract: ["$contract.working_hrs_from", "$contract.working_hrs_to"] } , 3600000 ]  } }}
            ];
            let response = await userModel.globalAggregateFunction( aggregateQuery );
            resolve( response );
        } catch( err ){
            reject( err );
        }
    }) 
}


function userDistPercent() {
    return new Promise(async(resolve, reject) => {
        try{
        let percent = [], count=[], final = [];
        let ideal = ['FREELANCER','CONTRACTUAL','FULLTIME']
            var userData = await userModel.userDistPercent()
            ideal.forEach(item =>{
              var user =  _.find(userData, { _id:item })
              user ? percent.push(user.percentage) && count.push(user.count) : percent.push(0) && count.push(0)
            })
            final = [ideal, percent, count];
            resolve(final);
        }catch(err){reject(err)}
    });
}


function resourceSummary() {
    return new Promise(async(resolve, reject) => {
        try{
        let response=[];
        let ideal = ['FREELANCER','CONTRACTUAL','FULLTIME'];
            var userData = await userModel.userDistPercent()
            var workData = await worklogModel.hoursByMemberType()
                ideal.forEach(item => {
               var cost =0, percentage =0, hours =0, count = 0, user={}
               var user = _.find(userData, { _id:item });
               var work = _.find(workData,{type:item})
            user ? {count, cost, percentage} = user  : 0,0,0
            work? hours = work.hours : 0
               structure = {"_id":item,count,cost,percentage,"hoursWorked":hours}
               response.push(structure)
            })
            resolve(response)
        }catch(err){reject(err)}
    });
}

function avgUtilRate(from, to) {
    return new Promise(async(resolve, reject) => {
        try{
        let response =[];
        let ideal = ['FREELANCER','CONTRACTUAL','FULLTIME'];
            var data = await userModel.memAvgHours()
            var dataA = await worklogModel.memMonthHours(from, to)
            for(type of ideal){
                var user = _.find(data, {_id: type})
                var worklog = _.find(dataA, {type: type})
                user ? availableHours = user.typeMonHours : availableHours = 0
                worklog ? utilizedHours = worklog.hours : utilizedHours = 0
                user && worklog  ? utilizationPercent= (worklog.hours/user.typeMonHours)*100 : utilizationPercent =0
                structure = {type,availableHours,utilizedHours,utilizationPercent}
                response.push(structure)
          }
resolve(response);
        }catch(err){reject(err)}
    });
}

/**
 *  USER SUMAMRY TAB * We return a summary of the user to the front end
 *  1. costperhour value is the same as the one in user contract
 *  2. hrs available is calculated from the user's contract based on number of hours he's avilable per day
 *  3. number of hours that the user has been scheduled for in the past, are fetched from hours scheduled in schedule model
 *  4. utilization percent is how well we have uilized the employee, so it is hrs he has put in divided by hrs he was availble for 
 *  5. to calculate the user's efficiency, we need to find how much time he was given for the tasks he has completed and divided by how many hours he gave to it.
 * 
 */


//efficiency is avg hours assigned / avg hours recorded * 100
//utilization percent is total hours assigned for user / hours user is available for * 100
//if user has a contract, and in the contract there is from and to working hrs, then hrs available is their subtraction multiplied by wokring days in a month, 
//if the contract contains ctc, then we can also get the cost per hour as that's the cost per hour of user

function summaryTab(from, to) {
    return new Promise(async(resolve, reject) => {
        try{
       let struct = {}, rough=[], costperhour = 0;
            var users = await getAllUser();
            for(user of users){
                userid = user._id, membername = user.firstName, membertype = user.memberType;
                var averageAssigned = await scheduleModel.assignedHoursOfUserOnTasks(userid, from, to);
                var averageRecorded = await worklogModel.recordedHoursOfUserOnTask(userid, from, to);
                var hoursByUser = await scheduleModel.scheduledUserHours(userid,from,to)
                hoursscheduled = Array.isArray(hoursByUser) && hoursByUser.length ? hoursByUser[0].totalHours : 0;
                avgAssigned = Array.isArray(averageAssigned) && averageAssigned.length ?  averageAssigned[0].totalHours : 0; 
                avgRecorded = Array.isArray(averageRecorded) && averageRecorded.length ?  averageRecorded[0].avgHoursRecordedByUserForTasks : 0; 
                avgAssigned && avgRecorded ? efficiencypercent = (avgAssigned/avgRecorded)*100 : efficiencypercent = 0
                user.contract ?((user.contract.working_hrs_to&&user.contract.working_hrs_from) ? hrsavailable = ((user.contract.working_hrs_to-user.contract.working_hrs_from)/3.6e+6)*22 : hrsavailable =0, user.contract.ctc ? costperhour = user.contract.ctc : costperhour = 0) : (hrsavailable =0, costperhour =0);
                (hoursscheduled && hrsavailable) ? utilizedpercent = (hoursscheduled/(hrsavailable))*100 : utilizedpercent = 0;
                struct = {userid,membername,membertype,costperhour, hrsavailable, hoursscheduled, utilizedpercent, efficiencypercent}
                rough.push(struct);
                }
            resolve(rough);
        }catch(err){reject(err)}
    });
}

function getUsersSimply(){
    return new Promise(async(resolve, reject) => {
        try{
        var data = await userModel.search({});
        resolve(data)
        }catch(err){reject(err)}
    })
}

module.exports = userService;
