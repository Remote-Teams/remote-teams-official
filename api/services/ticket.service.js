var ticketModel = require("../models/ticket.model");
var roleServices = require('./role.service');
var currentContext = require('../../common/currentContext');
var notificationClient = require('../../common/notificationClient');
var notificationServices = require('./notification.service');
var NoticationType = require('../../common/constants/NotificationType');
const _ = require('lodash');

var ticketService = {
    getAllTickets: getAllTickets,
    getTicketById:getTicketById,
    addTicket: addTicket,
    updateTicket:updateTicket,
    deleteTicket:deleteTicket,
    getTicketByTicketName: getTicketByTicketName,
    getTicketsByPage: getTicketsByPage,
    getAllTicketsCount: getAllTicketsCount,
    getTicketsByPageWithSort: getTicketsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchTickets: searchTickets,
    getTicketByProjectId: getTicketByProjectId,
    textSearch: textSearch,
    ticketSummary: ticketSummary,
    ticketSummaryTillDate: ticketSummaryTillDate,
    ticketSummaryThisMonth: ticketSummaryThisMonth,
    summaryReport: summaryReport,
    summaryTab: summaryTab
}

function addTicket(ticketData) {
    let attendeesUser = ticketData.assignedTo;
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        ticketData.createdBy = user.email;
        ticketData.lastModifiedBy = user.email;
        ticketData.raisedBy = user.userId;
        getAllTicketsCount().then((ticketCount) => {
            ticketData.name = 't-' + (parseInt(ticketCount) + 1);
            ticketModel.create(ticketData).then((data)=>{
                // Add a notification
                let payload = {
                    notification:data,
                    notificationType:NoticationType.TICKETS_UPDATE,
                    from:user.userId,
                    to: ticketData.assignedTo
                }
                notificationServices.addNotification(payload, user.workspaceId).then((ndata) => {
                    // create a notify client
                    notificationClient.notifyTicket(NoticationType.TICKETS_UPDATE, data, user.workspaceId, attendeesUser );
                    resolve(data);
                }).catch( err => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            })
        }).catch((err) => {
            reject(err);
        });
        
    })
   
}

function updateTicket(id,ticketData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        ticketData.lastModifiedBy = user.email;
        
        ticketModel.updateById(id,ticketData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteTicket(id) {
    return new Promise((resolve,reject) => {
        ticketModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllTickets() {
    return new Promise( async (resolve,reject) => {
        var user = currentContext.getCurrentContext();
        console.log( user );
        let all_roles = await roleServices.getAllRoles();
        console.log (  all_roles);  
        ticketModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTicketById(id) {
    return new Promise((resolve,reject) => {
        ticketModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTicketByTicketName(ticketName, tenant){
    return new Promise((resolve,reject) => {
        ticketModel.searchOne({'ticketName': ticketName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllTicketsCount() {
    return new Promise((resolve, reject) => {
        ticketModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTicketsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        ticketModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTicketsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        ticketModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        ticketModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchTickets(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        ticketModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTicketByProjectId(projectId, subject) {
    var query = {
        subject: subject,
        project: projectId
    }
    return new Promise((resolve,reject) => {
        ticketModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

//text search service

function textSearch(text) {
    return new Promise((resolve, reject) => {
        ticketModel.getTextSearchResult(text).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

// ticket summary function

function ticketSummary() {
    return new Promise(async(resolve, reject) => {
        try{
        let a =[], b=[], response=[];
            var data = await ticketModel.ticketSummary()
            if(Array.isArray(data) && data.length){
            for(ticket of data){
                a.push(ticket._id), b.push(ticket.percentage);
            }
        }
            response = [a,b];
            resolve(response);
        }catch(err){reject(err)}
    });
}


function ticketSummaryTillDate() {
    return new Promise(async(resolve, reject) => {
        try{
        let final = [], dataAcount, dataBcount;
        var dataA = await ticketModel.totalTicketsRaised()
        var dataB = await ticketModel.totalTicketsClosed()
        Array.isArray(dataA) && dataA.length ? dataAcount = dataA[0].count : dataAcount =0
        Array.isArray(dataB) && dataB.length ? dataBcount = dataB[0].count : dataBcount =0
        final = ["RAISED :", dataAcount, "CLOSED:", dataBcount];
            resolve(final);
            }
            catch(err){reject(err);}
        });
    }


function ticketSummaryThisMonth(startDate, endDate) {
    return new Promise(async(resolve, reject) => {
        try{
        let final = [], dataAcount, dataBcount;
        console.log(startDate)
        console.log(endDate)
        var dataA = await ticketModel.ticketsRaisedThisMonth(startDate, endDate)
        var dataB = await ticketModel.ticketsClosedThisMonth(startDate, endDate)
        Array.isArray(dataA) && dataA.length ? dataAcount = dataA[0].count : dataAcount = 0
        Array.isArray(dataB) && dataB.length ? dataBcount = dataB[0].count : dataBcount = 0
        final = ["RAISED :", dataAcount, "CLOSED:", dataBcount];
            resolve(final);
        }catch(err){reject(err);}
    });
}


function summaryReport() {
   
    return new Promise(async(resolve, reject) => {
        try{
       let ideal = ["ISSUE","EVENT","DEFECT","REQUEST_STATUS_UPDATE"], percent=[], final =[];
       var data = await ticketModel.summaryReport()
       for (label of ideal){
       var user =  _.find(data, { _id:label })
       user ?  percent.push(user.percentage) : percent.push(0)
            }
        final = [[ideal],[percent]]
            resolve(final);
    }catch(err){reject(err);}
    });
}

function summaryTab(from, to) {
    return new Promise((resolve, reject) => {
        ticketModel.summaryTab(from, to).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = ticketService;


// ADMIN SHOULD SEE ALL THE TICKET AND THEIR STATUS
// RESOURCE SHOULD SEE ONLY THEIR OWN TICKETS
// CLIENTS SHOULD ONLY SEE THEIR OWN TICKETS