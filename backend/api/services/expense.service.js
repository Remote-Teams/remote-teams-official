var expenseModel = require("../models/expense.model");
var subscriptionModel = require("../models/expenseSubscription.model");
var currentContext = require('../../common/currentContext');
var moment = require('moment');
var activityService = require('./activity.service');
const _ = require('lodash');
const { response } = require("express");

var expenseService = {
    getAllExpenses: getAllExpenses,
    getExpenseById:getExpenseById,
    addExpense: addExpense,
    updateExpense:updateExpense,
    deleteExpense:deleteExpense,
    // getExpensesByProjectName: getExpensesByProjectName,
    getExpensesByPage: getExpensesByPage,
    getAllExpensesCount: getAllExpensesCount,
    getExpensesByPageWithSort: getExpensesByPageWithSort,
    getExpensesWithinTimeFrame:getExpensesWithinTimeFrame,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchExpenses: searchExpenses,
    getExpenseByName: getExpenseByName,
    expenseApproval:expenseApproval,
    expenseBulkApproval:expenseBulkApproval,
    textSearch: textSearch,
    getExpenseSummaryForReports:getExpenseSummaryForReports,
    yearlyExpenseReport: yearlyExpenseReport,
    yearlyBillableExpenses: yearlyBillableExpenses,
    yearlyMiscellaneousExpenses: yearlyMiscellaneousExpenses,
    totalExpenseThisMonth: totalExpenseThisMonth,
    monthlyExpenseType: monthlyExpenseType,
    rough: rough,
    summaryTab: summaryTab,
    totalProjExp: totalProjExp,
    billProjExp: billProjExp,
    unbillProjExp: unbillProjExp,
    penReq: penReq,
    expensesTable: expensesTable
}

function addExpense(expenseData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        expenseData.createdBy = user.email;
        expenseData.lastModifiedBy = user.email;
        if( expenseData.status === "SENT" ){
            expenseData.dateRaised = new Date().toISOString();
        }
        expenseModel.create(expenseData).then((data)=>{
            if( expenseData.project !== undefined &&  expenseData.project !== "" ){
                let activityData = {
                    "entityType":"ACTIVITY",
                    "activityType":"CREATE",
                    "data":data,
                    "user":user.userId,
                    "projectId":data.project,
                    "text":"Expense "+ data.expenseTitle +" was created"
                };
                activityService.addActivity( activityData );
            }
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateExpense(id,expenseData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        expenseData.lastModifiedBy = user.email;
        if( expenseData.status === "SENT" ){
            expenseData.dateRaised = new Date().toISOString();
        }
        expenseModel.updateById(id,expenseData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteExpense(id) {
    return new Promise((resolve,reject) => {
        expenseModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllExpenses() {
    return new Promise((resolve,reject) => {
        expenseModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getExpenseById(id) {
    return new Promise((resolve,reject) => {
        expenseModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

// function getExpensesByProjectName(projectName, tenant){
//     return new Promise((resolve,reject) => {
//         expenseModel.searchOne({'projectName': projectName}).then((data)=>{
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

function getAllExpensesCount() {
    return new Promise((resolve, reject) => {
        expenseModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getExpensesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        expenseModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getExpensesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        expenseModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        expenseModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchExpenses(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        expenseModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getExpenseByName(name) {
    var query = {
        expenseTitle: name
    }
    return new Promise((resolve,reject) => {
        expenseModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function expenseApproval( expensebody ){
    return new Promise( async ( resolve, reject ) => {
        try{
            var user = currentContext.getCurrentContext();
            expensebody.lastModifiedBy = user.email;
            expensebody.dateApprovedOrRejected = new Date().toISOString();
            let updateExpense = await expenseModel.updateById( expensebody._id, expensebody );
            resolve( updateExpense );
        } catch ( err ){
            console.log( err );
            reject( err );
        }
    })
}

function expenseBulkApproval( body_arr ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let all_promises = [];
            body_arr.forEach(element => {
                all_promises.push( expenseApproval( element ) );
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


function textSearch(text) {
    return new Promise((resolve, reject) => {
        expenseModel.getTextSearchResult(text).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getExpensesWithinTimeFrame( fromDate, toDate ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let query = {
                "$or":[
                    { "$and":[ { dateApprovedOrRejected: { "$gte" : fromDate } }, { dateApprovedOrRejected : { "$lte": toDate } }] },
                    { "$and":[ { dateRaised: { "$gte" : fromDate } }, { dateRaised : { "$lte": toDate } }] },
                    { "$and":[ { createdBy: { "$gte" : fromDate } }, { createdBy : { "$lte": toDate } }] },
                ]
            };
            let all_expenses = await expenseModel.search(query);
            resolve( all_expenses );
        } catch ( err ){
            reject( err );
        }
    })
}


function getExpenseSummaryForReports( fromDate, toDate ){
    let dateQuery = {};
    return new Promise( async( resolve, reject ) => {
        try{
            let aggregateQuery = [
                { $facet: { 
                    "totalBillable":[ { $match: {  status : { $ne : "DRAFT" }, BillingType:"BILLABLE" } }],
                    "totalNonBillable":[ { $match: {  status : { $ne : "DRAFT" }, BillingType:"UNBILLABLE" } }],
                    "totalAmtArray":[ { $match: {  status : { $ne : "DRAFT" } } }],
                    "totalPaidArray":[ { $match: {  status : "APPROVED" } } ]
                 }},
                 { $project:{
                    "totalPaidAmt":{ $sum:{ $map:{ input:"$totalPaidArray", as:"padin", in:"$$padin.total" } } },
                    "totalInvAmt":{ $sum: { $map:{ input:"$totalAmtArray", as:"padin", in:"$$padin.total" } } },
                    "totalBillableAmt":{ $sum: { $map:{ input:"$totalBillable", as:"padin", in:"$$padin.total" } } },
                    "totalNonBillableAmt":{ $sum: { $map:{ input:"$totalNonBillable", as:"padin", in:"$$padin.total" } } },
                }}      
            ];
            if( fromDate !== undefined && toDate !== undefined ){
                fromDate = moment(fromDate).startOf('day').toISOString();
                toDate =  moment(toDate).endOf('day').toISOString();
                aggregateQuery = [
                    { $facet: { 
                        "totalBillable":[ { $match: {  status : { $ne : "DRAFT" }, BillingType:"BILLABLE", createdAt: { $gte:new Date(fromDate), $lte: new Date(toDate) } } }],
                        "totalNonBillable":[ { $match: {  status : { $ne : "DRAFT" }, BillingType:"UNBILLABLE", createdAt: { $gte:new Date(fromDate), $lte: new Date(toDate) } } }],
                        "totalAmtArray":[ { $match: {  status : { $ne : "DRAFT" } , createdAt: { $gte:new Date(fromDate), $lte: new Date(toDate) }} }],
                        "totalPaidArray":[ { $match: {  status : "APPROVED", createdAt: { $gte:new Date(fromDate), $lte: new Date(toDate) } } } ]
                     }},
                     { $project:{
                        "totalPaidAmt":{ $sum:{ $map:{ input:"$totalPaidArray", as:"padin", in:"$$padin.total" } } },
                        "totalInvAmt":{ $sum: { $map:{ input:"$totalAmtArray", as:"padin", in:"$$padin.total" } } },
                        "totalBillableAmt":{ $sum: { $map:{ input:"$totalBillable", as:"padin", in:"$$padin.total" } } },
                        "totalNonBillableAmt":{ $sum: { $map:{ input:"$totalNonBillable", as:"padin", in:"$$padin.total" } } },
                    }}   
                ]
            }
            let response = await expenseModel.globalAggregatefunction( aggregateQuery );
            resolve( response );
        } catch ( err ){
            reject( err );
        }
    }) 
}

function yearlyExpenseReport() {
    return new Promise(async(resolve, reject) => {
            try{
            let response=[];
            var data = await expenseModel.yearlyExpenseReport()
            for(i=0;i<13;i++){
                var expense =  _.find(data, { _id:i })
                expense ? rough = expense.monthlytotal : rough=0  
                response[i-1] = rough
            }
            resolve(response);
        }catch(err){reject(err)}
    });
}

function yearlyBillableExpenses() {
    return new Promise(async(resolve, reject) => {
        try{
            let response=[];
            var data = await expenseModel.yearlyBillableExpenses()
            for(i=0;i<13;i++){
                var expense =  _.find(data, { _id:i })
                expense ? rough = expense.monthlytotal : rough=0  
                response[i-1] = rough
            }
            resolve(response);
        }catch(err){reject(err)}
    });
}

function yearlyMiscellaneousExpenses() {
    return new Promise(async(resolve, reject) => {
        try{
            let response=[];
            var data = await expenseModel.yearlyMiscellaneousExpenses()
            for(i=0;i<13;i++){
                var expense =  _.find(data, { _id:i })
                expense ? rough = expense.monthlytotal : rough=0  
                response[i-1] = rough
            }
            resolve(response);
        }catch(err){reject(err)}
    });
}

function rough() {
    return new Promise((resolve, reject) => {
        expenseModel.rough().then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}
    
//total expenses this month

function totalExpenseThisMonth(startDate, endDate){
    return new Promise((resolve, reject) => {
        expenseModel.totalExpenseThisMonth(startDate, endDate).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function monthlyExpenseType(startDate, endDate){
    return new Promise((resolve, reject) => {
        expenseModel.monthlyExpenseType(startDate, endDate).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function summaryTab(from, to, project){
    return new Promise((resolve, reject) => {
        if(project == null){
        expenseModel.summaryTabDates(from, to).then((data) => {
            resolve(data);
        })
    }
        else{
        expenseModel.summaryTabProject(from, to, project).then((dataA)=>{
            resolve(dataA);
        })}
        }).catch((err) => {
            reject(err);
        });
}

function totalProjExp(projectId){
    return new Promise((resolve, reject) =>{
        expenseModel.totalProjExp(projectId).then((data)=>{
            resolve(data);
        })
    })
}

function billProjExp(projectId){
    return new Promise((resolve, reject) =>{
        expenseModel.billProjExp(projectId).then((data)=>{
            resolve(data);
        })
    })
}

function unbillProjExp(projectId){
    return new Promise((resolve, reject) =>{
        expenseModel.unbillProjExp(projectId).then((data)=>{
            resolve(data);
        })
    })
}

function penReq(projectId){
    return new Promise((resolve, reject) =>{
        expenseModel.penReq(projectId).then((data)=>{
            resolve(data);
        })
    })
}

function expensesTable(fromDate, toDate) {
    return new Promise(async(resolve, reject) => {
    try{
    bill =  await expenseModel.billTimeRange(fromDate, toDate)
    unbill = await expenseModel.unbillTimeRange(fromDate, toDate)
    misc = await expenseModel.miscTimeRange(fromDate, toDate)
    totalSubs = await subscriptionModel.subsTimeRange(fromDate, toDate)
    console.log(bill, unbill, misc, totalSubs)
    var billed = Array.isArray(bill) && bill.length ? bill[0].total : 0
    var unbilled = Array.isArray(unbill) && unbill.length ? unbill[0].total : 0
    var misc = Array.isArray(misc) && misc.length ? misc[0].total : 0
    var subscription = Array.isArray(totalSubs) && totalSubs.length ? totalSubs[0].total : 0
    var response = {billed, unbilled, misc, subscription}
    resolve(response)
    }catch(err){reject(err)}
    });
}

module.exports = expenseService;

