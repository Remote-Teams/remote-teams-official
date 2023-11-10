var supportModel = require("../models/support.model");
var currentContext = require('../../common/currentContext');

var supportServices = {
    getAllSupport: getAllSupport,
    getSupportById: getSupportById,
    addSupport: addSupport,
    updateSupport: updateSupport,
    deleteSupport: deleteSupport,
    getSupportByName: getSupportByName,
    getSupportByPage: getSupportByPage,
    getAllSupportCount: getAllSupportCount,
    getSupportByPageWithSort: getSupportByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchSupport: searchSupport,
    textSearch: textSearch,
    getSupportWithinTimeFrame:getSupportWithinTimeFrame
}

function addSupport(supportData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        supportData.entityId = user.userId;
        supportData.status = "NEW";
        supportData.createdBy = user.email;
        supportData.lastModifiedBy = user.email;
        
        supportModel.create(supportData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}
function updateSupport(id, supportData, callback) {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        supportData.lastModifiedBy = user.email;

        supportModel.updateById(id, supportData).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })

}

function deleteSupport(id) {
    return new Promise((resolve, reject) => {
        supportModel.deletebyId(id).then((data) => {
            resolve({ 'success': true });
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllSupport() {
    return new Promise((resolve, reject) => {
        supportModel.search({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getSupportById(id) {
    return new Promise((resolve, reject) => {
        supportModel.getById(id).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getSupportByName(faqName, tenant) {
    return new Promise((resolve, reject) => {
        supportModel.searchOne({ 'faqName': faqName }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllSupportCount(query) {
    return new Promise((resolve, reject) => {
        supportModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getSupportByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        supportModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getSupportByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        supportModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve, reject) => {
        supportModel.groupByKeyAndCountDocuments(key).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchSupport(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        supportModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}



function textSearch(text) {
    return new Promise((resolve, reject) => {
        supportModel.getTextSearchResult(text).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getSupportWithinTimeFrame( fromDate, toDate ,count){
    return new Promise( async ( resolve, reject ) => {
        try{
            let aggeregateQuery = [
                { "$match" : { "createdAt" : { "$gt" : new Date(fromDate), "$lt": new Date(toDate) } } }
            ];
            if( count || count === "true" ){
                aggeregateQuery.push({ "$group" : { _id : "", count: { "$sum" : 1 } } });
            }
            let all_support = await supportModel.globalAggregateFunction(aggeregateQuery);
            resolve( all_support );
        } catch ( err ){
            reject( err );
        }
    })
}



module.exports = supportServices;

