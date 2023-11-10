var scrumModel = require("../models/scrum.model");
var currentContext = require('../../common/currentContext');
var moment = require('moment');
var activityService = require('./activity.service');

var scrumService = {
    getAllScrums: getAllScrums,
    getScrumById:getScrumById,
    addScrum: addScrum,
    updateScrum:updateScrum,
    deleteScrum:deleteScrum,
    getScrumByScrumName: getScrumByScrumName,
    getScrumsByPage: getScrumsByPage,
    getAllScrumsCount: getAllScrumsCount,
    getScrumsByPageWithSort: getScrumsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    getScrumByDate:getScrumByDate,
    searchScrums: searchScrums,
    getScrumByName: getScrumByName,
    getScrumByQuery:getScrumByQuery,
    textSearch: textSearch
}

function addScrum(scrumData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        scrumData.createdBy = user.email;
        scrumData.lastModifiedBy = user.email;
        scrumData.organizer = user.userId;
        
        scrumModel.create(scrumData).then((data)=>{
            let activityData = {
                "entityType":"ACTIVITY",
                "activityType":"CREATE",
                "data":data,
                "user":user.userId,
                "projectId":data.project,
                "text":"Scrum "+ data.name +" was created"
            };
            activityService.addActivity( activityData );
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateScrum(id,scrumData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        scrumData.lastModifiedBy = user.email;
        
        scrumModel.updateById(id,scrumData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteScrum(id) {
    return new Promise((resolve,reject) => {
        scrumModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllScrums() {
    return new Promise((resolve,reject) => {
        scrumModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getScrumById(id) {
    return new Promise((resolve,reject) => {
        scrumModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getScrumByScrumName(scrumName, tenant){
    return new Promise((resolve,reject) => {
        scrumModel.searchOne({'scrumName': scrumName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllScrumsCount() {
    return new Promise((resolve, reject) => {
        scrumModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getScrumsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        scrumModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getScrumsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        scrumModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        scrumModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchScrums(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        scrumModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getScrumByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        scrumModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getScrumByQuery(query){
    return new Promise( (resolve, reject) => {
        scrumModel.searchOne(query)
            .then( data => resolve( data ) )
            .catch( err => reject( errr ) );
    } )
}

//text search service

function textSearch(text) {
    return new Promise((resolve, reject) => {
        scrumModel.getTextSearchResult(text).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getScrumByDate(date){
    console.log( date );
    var user = currentContext.getCurrentContext();
    var query = {
        "$and":[
            {
                "$or":[
                    { 
                        $and:[
                            { "fromDate": { "$lte" :  moment(date).endOf('day').toISOString() } } ,
                            { "toDate": { "$gte" :  moment(date).startOf('day').toISOString() } } ,
                            { "daily_scrum": false }
                        ]
                    },
                    {
                        $and:[
                            { "fromDate": { "$lte" :  moment(date).endOf('day').toISOString() } } , 
                            { "daily_scrum": true }
                        ]
                    }
                ]
            },
            {
                "$or":[
                    { "attendees" : { "$eq" : user.userId } },
                    { "organizer": { "$eq": user.userId } }
                ]
            }
        ]
    };

    return new Promise((resolve, reject) => {
        scrumModel.search(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

module.exports = scrumService;

