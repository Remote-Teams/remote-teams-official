var leaveModel = require("../models/leave.model");
var currentContext = require('../../common/currentContext');
var LeaveStatus = require('../../common/constants/LeaveStatus');
const LeaveType = require('../../common/constants/LeaveType');;
const NotificationType = require('../../common/constants/NotificationType');
const notificationClient = require('../../common/notificationClient');
const moment = require('moment');
const memberDayOffServices = require('./memberdayoff.service');

var leaveService = {
    getAllLeaves: getAllLeaves,
    getLeaveById: getLeaveById,
    addLeave: addLeave,
    updateLeave: updateLeave,
    deleteLeave: deleteLeave,
    getLeaveByLeaveName: getLeaveByLeaveName,
    getLeavesByPage: getLeavesByPage,
    getAllLeavesCount: getAllLeavesCount,
    getLeavesByPageWithSort: getLeavesByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    groupByKeyAndCountDocumentsFromTime: groupByKeyAndCountDocumentsFromTime,
    getAllLeavesWithinTimeframe: getAllLeavesWithinTimeframe,
    addHoliday: addHoliday,
    approveLeave: approveLeave,
    getAllApprovedLeavesByDate: getAllApprovedLeavesByDate,
    getAllHolodaysByDate: getAllHolodaysByDate,
    getAllApprovalPendingLeavesByDate: getAllApprovalPendingLeavesByDate,
    searchLeaves: searchLeaves,
    getCountOnLeave: getCountOnLeave,
    getAllOnLeaves: getAllOnLeaves,
    getCountApprovalPending: getCountApprovalPending,
    getAllApprovalPendingLeaves: getAllApprovalPendingLeaves,
    getCountUpcomingLeaves: getCountUpcomingLeaves,
    getUpcomingLeaves: getUpcomingLeaves,
    getAllUpcomingLeaves: getAllUpcomingLeaves,
    getAllLeavesTakenByDate: getAllLeavesTakenByDate,
    getAllHolidaysByDate: getAllHolidaysByDate,
    getTodayOnLeave:getTodayOnLeave,
    getCurrentMonthDayOffs:getCurrentMonthDayOffs,
    getAllLeaveHistory:getAllLeaveHistory,
    getAvailableLeaves:getAvailableLeaves,
    getAllOnLeavesToday:getAllOnLeavesToday,
    getAllHolidaysCount:getAllHolidaysCount,
    leaveComposition: leaveComposition,
    leavesApproval:leavesApproval,
    getAvailedLastMonthLeave:getAvailedLastMonthLeave,
    leaveBulkApproval:leaveBulkApproval,
    approveLeaveData:approveLeaveData,
    getDayHolidays: getDayHolidays,
    summaryTab: summaryTab
}

function addHoliday(leaveData) {
    return new Promise((resolve, reject) => {

        let leavePromise = [];
        leaveData.leaves.forEach((leave) => {
            leave.leaveStatus = LeaveStatus.APPROVED;
            leavePromise.push(addLeave(leave));
        });

        Promise.all(leavePromise).then((data) => {
            resolve({ "success": true })
        }).catch(err => {
            reject(err);
        })

    })

}

function addLeave(leaveData) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        leaveData.createdBy = user.email;
        if (leaveData.leaveStatus == undefined) {
            leaveData.leaveStatus = LeaveStatus.PENDING;
        }
        leaveData.lastModifiedBy = user.email;
        leaveData.user = user.userId;

        leaveModel.create(leaveData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function updateLeave(id, leaveData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        leaveData.lastModifiedBy = user.email;
        leaveData.fromDate = new Date(leaveData.fromDate).toDateString();
        leaveData.toDate = new Date(leaveData.toDate).toDateString();
        leaveData.user = user.userId;

        leaveModel.updateById(id, leaveData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteLeave(id) {
    return new Promise((resolve, reject) => {
        leaveModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllLeaves() {
    return new Promise((resolve, reject) => {
        leaveModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeaveById(id) {
    return new Promise((resolve, reject) => {
        leaveModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeaveByLeaveName(leaveName, tenant) {
    return new Promise((resolve, reject) => {
        leaveModel.searchOne({ 'leaveName': leaveName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllLeavesCount() {
    return new Promise((resolve, reject) => {
        leaveModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeavesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        leaveModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getLeavesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        leaveModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        leaveModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocumentsFromTime( key, year, month ){
    return new Promise( async (resolve, reject) => {
        try{
            month = month - 1;
            let aggregateQuery = [
                { $match : { "leaveType": { $ne : LeaveType.HOLIDAY }, "leaveStatus":"APPROVED"  } },
                { $facet: {
                    "fromlesstoequals":[
                        { $match : {
                            $and:[
                                { "fromDate": { $lt : new Date(moment().year(year).month(month).startOf('month')) } },
                                { $and : [
                                    { "toDate":{ $gte: new Date(moment().year(year).month(month).startOf('month')) } },
                                    { "toDate":{ $lte: new Date(moment().year(year).month(month).endOf('month')) } },
                                    ] 
                                }
                                ]
                        } },
                        { $addFields: {
                            "leaveforthismonth":{$divide : [{ $subtract:[ "$toDate" , new Date(moment().year(year).month(month).startOf('month'))] }, 86400000] }
                        } }
                    ],
                    "fromequalstogte":[
                        { $match: {
                            "$and":[
                                { $and : [
                                    { "fromDate":{ $gte: new Date(moment().year(year).month(month).startOf('month')) } },
                                    { "fromDate":{ $lte: new Date(moment().year(year).month(month).endOf('month')) } },
                                    ] 
                                },
                                { "toDate" : { $gt : new Date(moment().year(year).month(month).endOf('month')) } }
                            ]
                        } },
                        { $addFields: {
                            "leaveforthismonth": { $add : [ { $ceil :  { $divide : [{ $subtract:[ new Date(moment().year(year).month(month).endOf('month')) ,"$fromDate" ] }, 86400000] } } , 1 ] }
                        } }
                    ],
                    "fromgtetolte":[
                        { $match : {
                            "$and":[
                                { "fromDate":{ $gte: new Date(moment().year(year).month(month).startOf('month')) } },
                                { "toDate":{ $lte: new Date(moment().year(year).month(month).endOf('month')) } }
                            ]
                        } },
                        { $addFields: {
                            "leaveforthismonth": { $add : [ { $ceil : {$divide : [{ $subtract:[ "$toDate" , "$fromDate" ] }, 86400000] } } , 1 ] }
                        } }
                    ],
                    "fromltetogte":[
                        { $match : {
                            "$and":[
                                { "fromDate":{ $lt: new Date(moment().year(year).month(month).startOf('month')) } },
                                { "toDate":{ $gt: new Date(moment().year(year).month(month).endOf('month')) } } 
                            ]
                        } },
                        { $addFields: {
                            "leaveforthismonth": moment().year(year).month(month).daysInMonth()
                        } }
                    ]
                } },
                { $project:{ mainArray: { $concatArrays : ["$fromlesstoequals", "$fromequalstogte", "$fromgtetolte", "$fromltetogte"] } } },
                { $unwind : "$mainArray" },
                { $replaceRoot: { newRoot: "$mainArray" } },
                { $group : {
                    _id : "$leaveType",
                    count:{ $sum: "$leaveforthismonth" }
                }}
            ];
            let response = await leaveModel.globalAggregateFunction( aggregateQuery );
            resolve( response );
        } catch ( err ){
            reject( err );
        }
    })
}

function getAllLeavesWithinTimeframe(startDate, endDate) {
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$gte": new Date(startDate)
                }
            }, {
                "toDate": {
                    "$lte": new Date(endDate)
                }
            }
        ]
    };


    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function approveLeave(leavesBody) {
    let a =leavesBody.leavesItem;
    for(i in a){
    }
    let leaveId = a[i]._id;
   return new Promise((resolve, reject) => {
       var user = currentContext.getCurrentContext();
       leavesBody.lastModifiedBy = user.email;
       leavesBody.leaveStatus = LeaveStatus.APPROVED;
       let updateLeave = leaveModel.updateById(leaveId, leavesBody)
           //notificationClient.notify(NotificationType.LEAVE_APPROVED, data, user.workspaceId, user.userId);
           resolve(updateLeave);
       }).catch((err) => {
         //  reject(err);
   })
}

function getAllApprovedLeavesByDate(date) {
    var user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$lte": new Date(date).toDateString()
                }
            }, {
                "toDate": {
                    "$gte": new Date(date).toDateString()
                }
            }, {
                "leaveStatus": {
                    "$eq": LeaveStatus.APPROVED
                }
            }, {
                "leaveType": {
                    "$ne": LeaveType.HOLIDAY
                }
            }, {
                "createdBy": {
                    "$eq": user.email
                }
            }
        ]
    };


    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllLeavesTakenByDate(fromDate, toDate) {
    var user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$gte": new Date(fromDate).toDateString()
                }
            }, {
                "toDate": {
                    "$lte": new Date(toDate).toDateString()
                }
            }, {
                "leaveStatus": {
                    "$eq": LeaveStatus.APPROVED
                }
            }, {
                "leaveType": {
                    "$ne": LeaveType.HOLIDAY
                }
            }, {
                "createdBy": {
                    "$eq": user.email
                }
            }
        ]
    };


    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllHolodaysByDate(date) {
    var user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$lte": new Date(date).toDateString()
                }
            }, {
                "toDate": {
                    "$gte": new Date(date).toDateString()
                }
            }, {
                "leaveType": {
                    "$eq": LeaveType.HOLIDAY
                }
            }
        ]
    };


    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllHolidaysByDate(startDate, endDate) {
    var user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$gte": new Date(startDate).toDateString()
                }
            }, {
                "toDate": {
                    "$lte": new Date(endDate).toDateString()
                }
            }, {
                "leaveType": {
                    "$eq": LeaveType.HOLIDAY
                }
            }
        ]
    };


    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllApprovalPendingLeavesByDate(date) {
    var user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$lte": new Date(date).toDateString()
                }
            }, {
                "toDate": {
                    "$gte": new Date(date).toDateString()
                }
            }, {
                "leaveStatus": {
                    "$eq": LeaveStatus.PENDING
                }
            }, {
                "leaveType": {
                    "$ne": LeaveType.HOLIDAY
                }
            }
        ]
    };


    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function searchLeaves(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let  query = {};
    if( searchCriteria.query !== undefined ){
        searchCriteria.query;
    }
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        leaveModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCountOnLeave() {
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$eq": new Date().toDateString()
                }
            },
            {
                "leaveStatus": {
                    "$eq": LeaveStatus.APPROVED
                }
            }
        ]
    };

    return new Promise((resolve, reject) => {
        leaveModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllOnLeaves() {
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$eq": new Date().toDateString()
                }
            },
            {
                "leaveStatus": {
                    "$eq": LeaveStatus.APPROVED
                }
            }
        ]
    };

    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllOnLeavesToday(){
    return new Promise( async ( resolve, reject ) => {
        try{
            let query = {
                "$or":[
                    { "$and": [
                        { "fromDate":{ "$eq" :new Date().toDateString()  } },
                        { "leaveStatus": { "$eq": LeaveStatus.APPROVED } }
                        ] 
                    },
                    { "$and" : [
                        { "fromDate" : { "$lte" : moment().endOf('day').toISOString() } },
                        { "toDate" : { "$gte":  moment().startOf('day').toISOString() } },
                        { "leaveStatus": { "$eq": LeaveStatus.APPROVED } }
                    ]}
                ]
            };
            let today_on_leaves = await leaveModel.search(query);
            resolve(today_on_leaves);
        } catch ( err ){
            reject( err );
        }
    })
}

function getCountApprovalPending() {
    return new Promise((resolve, reject) => {
        leaveModel.countDocuments({ 'leaveStatus': 'PENDING' }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllApprovalPendingLeaves() {
    return new Promise((resolve, reject) => {
        leaveModel.search({ 'leaveStatus': 'PENDING' }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCountUpcomingLeaves() {
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$gt": new Date().toDateString()
                }
            },
            {
                "leaveStatus": {
                    "$eq": LeaveStatus.APPROVED
                }
            }
        ]
    };
    return new Promise((resolve, reject) => {
        leaveModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllUpcomingLeaves() {
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$gt": new Date().toDateString()
                }
            },
            {
                "leaveStatus": {
                    "$eq": LeaveStatus.APPROVED
                }
            }
        ]
    };
    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getUpcomingLeaves(startDate, endDate, type) {
    let user = currentContext.getCurrentContext();
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$gt": startDate.toDateString()
                }
            },
            {
                "toDate": {
                    "$lt": endDate
                }
            },
            {
                "leaveStatus": {
                    "$eq": LeaveStatus.APPROVED
                }
            },
            {
                "createdBy": {
                    "$eq": user.email
                }
            }
        ]
    };
    if (type != undefined) {
        query['$and'].push({
            "leaveType": type
        });
    } else {
        query['$and'].push({
            "leaveType": {
                "$ne": LeaveType.HOLIDAY
            }
        });
    }
    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function getTodayOnLeave(){
    var query = { 
        "$and" : [
            { "fromDate" : { $lte : moment().startOf('day').toISOString() } },
            {"toDate": { $gte : moment().startOf('day').toISOString() }},
            { "leaveType": { $ne : LeaveType.HOLIDAY } },
            { "leaveStatus": { $eq : LeaveStatus.APPROVED } }
        ]
    };
    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getCurrentMonthDayOffs(){
    return new Promise( async ( resolve, reject ) => {
        try{
            var user = currentContext.getCurrentContext();
            let query = {
                "$or":[
                    {
                        "$and":[
                            { "fromDate" : { $gte : moment().startOf('day').toISOString() } },
                            { "toDate": { $lte : moment().endOf('month').toISOString() }  },
                            { "leaveType" : "HOLIDAY" }
                        ]
                    },
                    {
                        "$and":[
                            { "user" : user.userId },
                            { "toDate" : { $gte : moment().startOf('day').toISOString() } },
                            { "toDate": { $lte : moment().endOf('month').toISOString() }  },
                            { "leaveStatus":"APPROVED"}
                        ]
                    }
                ]
            }
            let upcomingoffs = await leaveModel.search(query);
            resolve( upcomingoffs );
        } catch ( err ){
            reject(err);
        }
    })
}


function getAllLeaveHistory( body ){
    return new Promise( async ( resolve, reject ) => {
        try{
            var user = currentContext.getCurrentContext();
            let query =  {};
            if( body.query.id !== undefined && body.query.id !== "" ){
                query.user = body.query.id;
            } else {
                if( !user.isAdmin ){
                    query.user = user.userId;
                }
            }
            if( body.query.fromDate ){
                query.fromDate = { $gte : moment(body.query.fromDate).startOf('day').toISOString() }
            }
            if( body.query.toDate ){
                query.toDate = { $lte : moment(body.query.toDate).endOf('day').toISOString() }  
            }
            let allhistory = await leaveModel.search( query );
            resolve( allhistory );
        } catch ( err ){
            reject( err );
        }
    })
}

function getAvailableLeaves( id , type){
    return new Promise( async ( resolve, reject ) => {
        try{
            let query = {
                "user":id,
                "fromDate":{ $gte : moment().startOf('year').toISOString()  },
                "toDate":{ $lte : moment().endOf('year').toISOString() },
                "leaveStatus":"APPROVED"
            }
            // GET ALL MEMBERDAY OFFS FOR THAT TYPE
            let memberdayoffquery = {
                "pageSize":100,
                "pageNo":1,
                "query":{ 
                    "type":type
                }
            };
            let all_member_day_offs = await memberDayOffServices.searchMemberdayoffs(memberdayoffquery);
            let total_annual_leaves = all_member_day_offs.find( data => data.name === "Annual paid leaves" );
            let total_medical_leaves = all_member_day_offs.find( data => data.name === "Medical leave" );
            total_annual_leaves = total_annual_leaves ? total_annual_leaves : 0;
            total_medical_leaves = total_medical_leaves ? total_medical_leaves : 0;
            // total annual leaves
            query.leaveType = "PAID_LEAVE";
            let annual_leaves = await leaveModel.search(query);
            // total sick leaves
            query.leaveType = "SICK_LEAVE";
            let sick_leave = await leaveModel.search(query);
            let i = 0, all_annual_leaves=0;
            while( i < annual_leaves.length ){
                let fromDate = moment( annual_leaves[i].fromDate );
                let toDate = moment( annual_leaves[i].toDate );
                let diff_days = toDate.diff(fromDate, 'days') === 0 ? 1 : toDate.diff(fromDate, 'days');
                all_annual_leaves = all_annual_leaves + parseInt( diff_days );
                i++;
            };
            let j = 0, all_sick_leave = 0;
            while( j < sick_leave.length ){
                let fromDate = moment( sick_leave[j].fromDate );
                let toDate = moment( sick_leave[j].toDate );
                let diff_days = toDate.diff(fromDate, 'days') === 0 ? 1 : toDate.diff(fromDate, 'days');
                all_sick_leave = all_sick_leave + parseInt( diff_days );
                j++;
            };
            let available_data = {};
            available_data.annual_leave = Math.abs(total_annual_leaves - all_annual_leaves);
            available_data.sick_leave = Math.abs(total_medical_leaves - all_sick_leave);
            resolve( available_data );
        } catch ( err ){
            reject( err );
        }
    })
}
function getAllHolidaysCount() {
    return new Promise((resolve, reject) => {
        leaveModel.countDocuments({"leaveType":"HOLIDAY"}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

// function leaveComposition() {
//     return new Promise((resolve, reject) => {
//         let leaves = ["UNPAID_LEAVES", "PAID_LEAVES", "SICK_LEAVES", "ANNUAL_LEAVES"]
//         let a ={};
//         let key = "leaveType";
//         leaveModel.groupByKeyAndCountDocuments(key).then((data) => {
//             for (i in data)
//             {
//                 for(j in leaves){
//                     if (leaves[j] == data[i]._id){
//                         leaves.splice(j,1);
//                     }
//                 }
//             }
//             for(l in leaves){
//                 a = {"_id":leaves[l],"count":0}
//                 data.push(a);
//             }
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

function leaveComposition() {
    return new Promise((resolve, reject) => {
        leaveModel.leaveComposition().then((data) => {
             resolve(data);
        })
        }).catch((err) => {
            reject(err);
    });
}

function leavesApproval( leavesbody ){
    return new Promise( async ( resolve, reject ) => {
        try{
            var user = currentContext.getCurrentContext();
            leavesbody.lastModifiedBy = user.email;
            leavesbody.dateApprovedOrRejected = new Date().toISOString();
            let updateLeaves = await leaveModel.updateById( leavesbody._id, leavesbody );
            resolve( updateLeaves );
        } catch ( err ){
            console.log( err );
            reject( err )
        }
    })
}


    function getAvailedLastMonthLeave() {
    let day = moment(new Date().toISOString()).date();
    var last = moment().subtract(day, 'days').toISOString();
    var newDate = moment(last).add(1, 'days').toISOString();
    var month = moment(newDate).subtract(1, 'month').toISOString();
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$gt": month
                }
            },
            {
                "toDate": {
                    "$lte": last
                }
            },
            {
                "leaveStatus": {
                    "$eq": LeaveStatus.APPROVED
                }
            }
        ]
    };
    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}
function leaveBulkApproval( body_arr ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let all_promises = [];
            body_arr.forEach(element => {
                all_promises.push( leavesApproval( element ) );
            });
            Promise.all( all_promises )
            .then( data => { resolve( data ) } )
            .catch( err => reject( err ) );
        } catch ( err ){
            console.log( err );
            reject( err );
        }
    })
}  

function approveLeaveData(id, data) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        data.lastModifiedBy = user.email;
        data.leaveStatus = LeaveStatus.APPROVED;
        leaveModel.updateById(id, data).then((data1) => {
            notificationClient.notify(NotificationType.LEAVE_APPROVED, data, user.workspaceId, user.userId);
            resolve(data1);
        }).catch((err) => {
            reject(err);
        })
    })
}

function getDayHolidays(date) {
    var user = currentContext.getCurrentContext();
    //console.log("date is:",date);
    dateString = new Date(date).toISOString()
    console.log("date string is:",dateString)
    var query = {
        "$and": [
            {
                "fromDate": {
                    "$eq": dateString
                }
            }, {
                "toDate": {
                    "$eq": dateString
                }
            }
        ]


            
                // "fromDate": dateString
        
            
        
    };
    return new Promise((resolve, reject) => {
        leaveModel.search(query).then((data) => {
            console.log("the data is:",data)
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function summaryTab(from, to) {
    return new Promise((resolve, reject) => {
        leaveModel.summaryTab(from, to).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = leaveService;

