var invoiceModel = require("../models/invoice.model");
var currentContext = require('../../common/currentContext');
// const fs = require("fs");
// const PDFDocument = require("pdfkit");
// const mailer = require("./../../common/aws_mailer");
var moment = require('moment');
const _ = require('lodash');
const { response } = require("express");
const { resolveContent } = require("nodemailer/lib/shared");
const { reject } = require("lodash");


var invoiceService = {
    getAllInvoices: getAllInvoices,
    getInvoiceById: getInvoiceById,
    addInvoice: addInvoice,
    updateInvoice: updateInvoice,
    deleteInvoice: deleteInvoice,
    getInvoiceByInvoiceId: getInvoiceByInvoiceId,
    getInvoicesByPage: getInvoicesByPage,
    getAllInvoicesCount: getAllInvoicesCount,
    getInvoicesByPageWithSort: getInvoicesByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchInvoices: searchInvoices,
    textSearch: textSearch,
    invoiceSummary: invoiceSummary,
    invoiceSummaryForReports:invoiceSummaryForReports,
    invoiceSummaryForReportsWithTimeFrame:invoiceSummaryForReportsWithTimeFrame,
    invoiceSummaryForReportsWithClient:invoiceSummaryForReportsWithClient,
    invoiceSummaryForReportsWithClient:invoiceSummaryForReportsWithClient,
    invoicesIssuedByMonths: invoicesIssuedByMonths,
    paidInvoicesByMonths: paidInvoicesByMonths,
    invoiceCompleteSummary: invoiceCompleteSummary,
    invoiceSummaryPercent: invoiceSummaryPercent,
    revenueTillDate: revenueTillDate,
    revenueThisMonth: revenueThisMonth,
    dueTillDate: dueTillDate,
    summaryTab: summaryTab,
    invDist: invDist,
    invoicesTable: invoicesTable
}


function addInvoice(invoiceData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        invoiceData.createdBy = user.email;
        invoiceData.lastModifiedBy = user.email;
        if( invoiceData.status === "SENT" ){
            invoiceData.dateRaised = new Date().toISOString();
        }
        invoiceModel.create(invoiceData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}


function updateInvoice(id, invoiceData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        invoiceData.lastModifiedBy = user.email;
        if( invoiceData.status === "SENT" ){
            invoiceData.dateRaised = new Date().toISOString();
        }
        invoiceModel.updateById(id, invoiceData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteInvoice(id) {
    return new Promise((resolve, reject) => {
        invoiceModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllInvoices() {
    return new Promise((resolve, reject) => {
        invoiceModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getInvoiceById(id) {
    return new Promise((resolve, reject) => {
        invoiceModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getInvoiceByInvoiceId(invoice_number, tenant) {
    return new Promise((resolve, reject) => {
        invoiceModel.searchOne({ 'invoice_number': invoice_number }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllInvoicesCount(query) {
    return new Promise((resolve, reject) => {
        invoiceModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getInvoicesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        invoiceModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getInvoicesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        invoiceModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        invoiceModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchInvoices(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        invoiceModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

//text search service

function textSearch(text) {
    return new Promise((resolve, reject) => {
        invoiceModel.getTextSearchResult(text).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function invoiceSummary(){
    return new Promise( async( resolve, reject ) => {
        try{
            let aggregateQuery = [
                {$group:{_id:null,count:{$sum:1},"data":{$push:"$$ROOT"}}},
                {$unwind:"$data"},
                {$group:{_id:"$data.status",count:{"$sum":1},total:{"$first":"$count"}}},
                {$project:{count:1,"status":1,"percentage":{$multiply:[{"$divide":[100,"$total"]},"$count"]}}}            
            ];
            let response = await invoiceModel.globalAggregatefunction( aggregateQuery );
            resolve( response );
        } catch ( err ){
            reject( err );
        }
    })
}

function invoiceSummaryForReports(){
    return new Promise( async( resolve, reject ) => {
        try{
            let aggregateQuery = [
                { $facet: { 
                    "totalAmtArray":[ { $match: {  status : { $ne : "DRAFT" } } }],
                    "totalPaidArray":[ { $match: {  status : "PAID" } } ]
                 }},
                 { $project:{
                    "totalPaidAmt":{ $sum:{ $map:{ input:"$totalPaidArray", as:"padin", in:"$$padin.total" } } },
                    "totalInvAmt":{ $sum: { $map:{ input:"$totalAmtArray", as:"padin", in:"$$padin.total" } } }
                }}     
            ];
            let response = await invoiceModel.globalAggregatefunction( aggregateQuery );
            resolve( response );
        } catch ( err ){
            reject( err );
        }
    })
}

function invoiceSummaryForReportsWithTimeFrame( fromDate, toDate ){
    fromDate = moment(fromDate).startOf('day').toISOString();
    toDate =  moment(toDate).endOf('day').toISOString();
    return new Promise( async( resolve, reject ) => {
        try{
            let aggregateQuery = [
                { $facet: { 
                    "totalAmtArray":[ { $match: {  status : { $ne : "DRAFT" }, createdAt: { $gte:new Date(fromDate), $lte: new Date(toDate) } } }],
                    "totalPaidArray":[ { $match: {  status : "PAID", createdAt:{$gte:new Date(fromDate), $lte: new Date(toDate)} }  } ]
                 }},
                 { $project:{
                    "totalPaidAmt":{ $sum:{ $map:{ input:"$totalPaidArray", as:"padin", in:"$$padin.total" } } },
                    "totalInvAmt":{ $sum: { $map:{ input:"$totalAmtArray", as:"padin", in:"$$padin.total" } } }
                }}     
            ];
            let response = await invoiceModel.globalAggregatefunction( aggregateQuery );
            resolve( response );
        } catch ( err ){
            reject( err );
        }
    })   
}

function invoiceSummaryForReportsWithClient( clientid ){
    return new Promise( async( resolve, reject ) => {
        try{
            let aggregateQuery = [
                { $facet: { 
                    "totalAmtArray":[ { $match: {  status : { $ne : "DRAFT" }, "client": clientid } },],
                    "totalPaidArray":[ { $match: {  status : "PAID", "client": clientid } } ]
                 }},
                 { $project:{
                     "totalPaidAmt":{
                           $sum:{
                               $map:{
                                   input:"$totalPaidArray",
                                   as:"padin",
                                   in:"$$padin.total"
                                   }
                               }
                         },
                                            "totalInvAmt":{
                           $sum:{
                               $map:{
                                   input:"$totalAmtArray",
                                   as:"padin",
                                   in:"$$padin.total"
                                   }
                               }
                         }
                     }}      
            ];
            let response = await invoiceModel.globalAggregatefunction( aggregateQuery );
            resolve( response );
        } catch ( err ){
            reject( err );
        }
    })
}

// invoices issued by months
function invoicesIssuedByMonths() {
    return new Promise(async(resolve, reject) => {
        try{
            var response = [];
            var data = await invoiceModel.invoicesIssuedByMonths()
            for(i=0;i<13;i++){
            var invoice =  _.find(data, { _id:i })
            invoice ? rough = invoice.monthlytotal : rough=0  
            response[i-1] = rough
            }
            resolve(response);
            }catch(err){reject(err)}
        });
    }

// paid invoices by months

function paidInvoicesByMonths() {
    return new Promise(async(resolve, reject) => {
        try{
        var response = [];
        var data = await invoiceModel.paidInvoicesByMonths()
        for(i=0;i<13;i++){
        var invoice =  _.find(data, { _id:i })
        invoice ? rough = invoice.monthlytotal : rough=0  
        response[i-1] = rough
        }
        resolve(response);
        }catch(err){reject(err)}
    });
}

function invoiceSummaryPercent(){
    return new Promise(async(resolve, reject) => {
            try{
            let id = [], percentages =[];
            let ideal = ["OPEN", "OVERDUE", "PAID", "DRAFT", "SENT"]
            var invoices = await invoiceModel.invoiceSummaryPercent()
            for(status of ideal){
            var invoice =  _.find(invoices, { _id:status })
            invoice ? percent = invoice.percentage : percent = 0
             percentages.push(percent)
        }
            var response =[ideal,percentages]
            resolve(response);
        }catch(err){reject(err)}
    });
}

// complete invoice summary
function invoiceCompleteSummary(startDate, endDate) {
    return new Promise((resolve, reject) => {
        invoiceModel.invoiceCompleteSummary(startDate, endDate).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

// revenue till date

function revenueTillDate() {
    return new Promise((resolve, reject) => {
        invoiceModel.revenueTillDate().then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

//revenue this month

function revenueThisMonth(startDate, endDate) {
    return new Promise((resolve, reject) => {
        invoiceModel.revenueThisMonth(startDate, endDate).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


function dueTillDate() {
    return new Promise((resolve, reject) => {
        invoiceModel.dueTillDate().then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function summaryTab(from, to) {
    return new Promise((resolve, reject) => {
        invoiceModel.summaryTab(from, to).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function invDist() {
    return new Promise(async(resolve, reject) => {
        try{
        let response = []
        let ideal = ["OPEN", "OVERDUE", "PAID", "DRAFT", "SENT"]
        var data = await invoiceModel.invoiceSummaryPercent()
        for(status of ideal){
            var invoice =  _.find(data, { _id:status })
            invoice ? (count = invoice.count, percentage = invoice.percentage) : (count = 0, percentage = 0)
            console.log(count)
            var structure = {"_id": status, count, percentage}
            response.push(structure) 
        }
        resolve(response)
    }catch(err){reject(err)}
    });
}

function invoicesTable(fromDate, toDate) {
    return new Promise(async(resolve, reject) => {
        try{
       var totalAmount = await invoiceModel.totalInvoiceAmount(fromDate, toDate)
       var paidInv = await invoiceModel.revenueThisMonth(fromDate, toDate)
       var dueInv = await invoiceModel.dueTimeRange(fromDate, toDate)
       console.log(totalAmount, paidInv, dueInv)
       var count = await invoiceModel.countDocuments({createdAt:{$gt:new Date(fromDate), $lt: new Date(toDate)}})
       var amount = Array.isArray(totalAmount) && totalAmount.length ? totalAmount[0].totalamount : 0
       var paid = Array.isArray(paidInv) && paidInv.length ? paidInv[0].totalamount : 0
       var due = Array.isArray(dueInv) && dueInv.length ? dueInv[0].totalamount : 0
       var response = {amount, paid, due, count}
       resolve(response)
    }catch(err){reject(err)}
    });
}

module.exports = invoiceService;

