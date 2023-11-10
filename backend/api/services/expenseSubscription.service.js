var expenseSubscriptionModel = require("../models/expenseSubscription.model");
var currentContext = require('../../common/currentContext');
var BillingType = require('../../common/constants/ExpenseSubscriptionBillingType');
var moment = require('moment');
const _ = require('lodash');

var expenseSubscriptionService = {
    getAllExpenseSubscriptions: getAllExpenseSubscriptions,
    getExpenseSubscriptionById: getExpenseSubscriptionById,
    addExpenseSubscription: addExpenseSubscription,
    updateExpenseSubscription: updateExpenseSubscription,
    deleteExpenseSubscription: deleteExpenseSubscription,
    // getExpenseSubscriptionByExpenseSubscriptionName: getExpenseSubscriptionByExpenseSubscriptionName,
    getExpenseSubscriptionsByPage: getExpenseSubscriptionsByPage,
    getAllExpenseSubscriptionsCount: getAllExpenseSubscriptionsCount,
    getExpenseSubscriptionsByPageWithSort: getExpenseSubscriptionsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchExpenseSubscriptions: searchExpenseSubscriptions,
    textSearch: textSearch,
    getSubscriptionOverviewWithCost:getSubscriptionOverviewWithCost,
    totalSubscription: totalSubscription
    }


function addExpenseSubscription(expenseSubscriptionData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        expenseSubscriptionData.createdBy = user.email;
        expenseSubscriptionData.lastModifiedBy = user.email;
        if( expenseSubscriptionData.billingType === BillingType.MONTHLY ){
            expenseSubscriptionData.lastBillingData = moment(expenseSubscriptionData.startingDate).toISOString();
            expenseSubscriptionData.nextBillingDate = moment(expenseSubscriptionData.startingDate).add(30, 'days').toISOString();
        } else if( expenseSubscriptionData.billingType === BillingType.YEARLY ){
            expenseSubscriptionData.lastBillingData = moment(expenseSubscriptionData.startingDate).toISOString();
            expenseSubscriptionData.nextBillingDate = moment(expenseSubscriptionData.startingDate).add(365, 'days').toISOString();
        } else {

        }
        
        expenseSubscriptionModel.create(expenseSubscriptionData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}


function updateExpenseSubscription(id, expenseSubscriptionData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        expenseSubscriptionData.lastModifiedBy = user.email;
        // if( expenseSubscriptionData.billingType === BillingType.MONTHLY ){
        //     expenseSubscriptionData.lastBillingData = moment().toISOString();
        //     expenseSubscriptionData.nextBillingDate = moment().add(30, 'days').toISOString();
        // } else if( expenseSubscriptionData.billingType === BillingType.YEARLY ){
        //     expenseSubscriptionData.lastBillingData = moment().toISOString();
        //     expenseSubscriptionData.nextBillingDate = moment().add(365, 'days').toISOString();
        // } else {

        // }
        expenseSubscriptionModel.updateById(id, expenseSubscriptionData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteExpenseSubscription(id) {
    return new Promise((resolve, reject) => {
        expenseSubscriptionModel.deleteById(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllExpenseSubscriptions() {
    return new Promise((resolve, reject) => {
        expenseSubscriptionModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getExpenseSubscriptionById(id) {
    return new Promise((resolve, reject) => {
        expenseSubscriptionModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

// function getExpenseSubscriptionByExpenseSubscriptionName(expenseSubscriptionName, tenant) {
//     return new Promise((resolve, reject) => {
//         invoiceModel.searchOne({ 'invoiceName': invoiceName }).then((data) => {
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

function getAllExpenseSubscriptionsCount(query) {
    return new Promise((resolve, reject) => {
        expenseSubscriptionModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getExpenseSubscriptionsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        expenseSubscriptionModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getExpenseSubscriptionsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        expenseSubscriptionModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        expenseSubscriptionModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchExpenseSubscriptions(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        expenseSubscriptionModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}



function textSearch(text) {
    return new Promise((resolve, reject) => {
        expenseSubscriptionModel.getTextSearchResult(text).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getSubscriptionOverviewWithCost(){
    return new Promise( async ( resolve, reject ) => {
        try{
            let aggregateQuery = [
                { $group:{ 
                    _id : "$status",
                    totalAmt:{ $sum : "$price" },
                    count:{ $sum : 1 }
                }}
            ];
            let response = await expenseSubscriptionModel.globalAggregateFunction( aggregateQuery );
            resolve( response );
        } catch( err ){
            reject( err );   
        }
    })
}

function totalSubscription(){
    return new Promise(async(resolve, reject) => {
        try{
            var data = await expenseSubscriptionModel.totalSubscription()
            Array.isArray(data) && data.length ? (rough = _.find(data, { _id:"ACTIVE" }), (rough ? resolve(rough.total): resolve(0))) : resolve(0) 
            }catch(err){reject(err)}
    });
}

module.exports = expenseSubscriptionService;

