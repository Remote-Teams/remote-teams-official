var discussionModel = require("../models/discussion.model");
var discussionCommentModel = require('../models/discussionComment.model');
var userModel = require('../models/user.model');
var currentContext = require('../../common/currentContext');
var activityService = require('./activity.service');

var discussionService = {
    getAllDiscussions: getAllDiscussions,
    getDiscussionById:getDiscussionById,
    addDiscussion: addDiscussion,
    updateDiscussion:updateDiscussion,
    deleteDiscussion:deleteDiscussion,
    getDiscussionsByPage: getDiscussionsByPage,
    getAllDiscussionsCount: getAllDiscussionsCount,
    getDiscussionsByPageWithSort: getDiscussionsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchDiscussions: searchDiscussions,
    getDiscussionBySubject: getDiscussionBySubject,
    addCommentsToDisuccsion:addCommentsToDisuccsion,
    updateCommenttoDiscussion:updateCommenttoDiscussion,
    deleteCommenttoDiscussion:deleteCommenttoDiscussion,
    getAllCommentToDiscussion:getAllCommentToDiscussion,
    getCommentWithID:getCommentWithID,
    textSearch:textSearch
}

function addDiscussion(discussionData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        discussionData.createdBy = user.email;
        discussionData.lastModifiedBy = user.email;
        discussionModel.create(discussionData).then((data)=>{
            let activityData = {
                "entityType":"ACTIVITY",
                "activityType":"CREATE",
                "data":data,
                "user":user.userId,
                "projectId":data.project,
                "text":"Discussion on "+ data.subject +" was created"
            };
            activityService.addActivity( activityData );
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateDiscussion(id,discussionData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        discussionData.lastModifiedBy = user.email;
        
        discussionModel.updateById(id,discussionData).then((data)=>{
            callback.data = data;
            callback.user = user.userId;
            activityService.addActivity( callback );
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteDiscussion(id) {
    return new Promise((resolve,reject) => {
        discussionModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllDiscussions() {
    return new Promise(async(resolve,reject) => {
        try{
        var response = [];
        let query = [
            { "$lookup":{
                from:"discussioncomments",
                localField:"_id",
                foreignField:"discussion",
                as:"comments"
                }
            },
        ];
        var data = await discussionModel.globalAggregate(query)
        if(Array.isArray(data) && data.length){
            for(unit of data){
                user = await userModel.search({email:unit.createdBy});
                let unitFinal = JSON.parse( JSON.stringify( unit ) );
                let userFinal = JSON.parse( JSON.stringify( user ) );
                let commentCount = await discussionCommentModel.countDocuments({discussion:unit._id})
                unitData = {...unitFinal, userData:userFinal, commentCount}
                response.push(unitData)
            }
        }
        resolve(response)
    }catch(err){reject(err);}
    });
}

function getDiscussionById(id) {
    return new Promise(async(resolve,reject) => {
        try{
        var data = await discussionModel.getById(id)
        user = await userModel.search({email:data.createdBy});
                let unitFinal = JSON.parse( JSON.stringify( data ) );
                let userFinal = JSON.parse( JSON.stringify( user ) );
                let commentCount = await discussionCommentModel.countDocuments({discussion:unit._id})
                unitData = {...unitFinal, userData:userFinal, commentCount}
            resolve(unitData)
        }catch(err){reject(err)}
    });
}


function getAllDiscussionsCount() {
    return new Promise((resolve, reject) => {
        discussionModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getDiscussionsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise(async(resolve,reject) => {
        try{
        var response = [];
        let query = [
            { "$lookup":{
                from:"discussioncomments",
                localField:"_id",
                foreignField:"discussion",
                as:"comments"
                }
            },
            { $skip : options.skip },
            { $limit : options.limit },
        ];
         var data = await discussionModel.globalAggregate(query)
         if(Array.isArray(data) && data.length){
            for(unit of data){
                user = await userModel.search({email:unit.createdBy});
                let unitFinal = JSON.parse( JSON.stringify( unit ) );
                let userFinal = JSON.parse( JSON.stringify( user ) );
                let commentCount = await discussionCommentModel.countDocuments({discussion:unit._id})
                unitData = {...unitFinal, userData:userFinal, commentCount}
                response.push(unitData)
            }
        }
        resolve(response)

    }catch(err){reject(err);}
    });

}

function getDiscussionsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise(async(resolve,reject) => {
        try{
        var response = [];
        let query = [
            { "$lookup":{
                from:"discussioncomments",
                localField:"_id",
                foreignField:"discussion",
                as:"comments"
                }
            },
            { $skip : options.skip },
            { $limit : options.limit },
            { $sort : sortTemp}
        ];
         var data = await discussionModel.globalAggregate(query)
         if(Array.isArray(data) && data.length){
            for(unit of data){
                user = await userModel.search({email:unit.createdBy});
                let unitFinal = JSON.parse( JSON.stringify( unit ) );
                let userFinal = JSON.parse( JSON.stringify( user ) );
                let commentCount = await discussionCommentModel.countDocuments({discussion:unit._id})
                unitData = {...unitFinal, userData:userFinal, commentCount}
                response.push(unitData)
            }
        }
        resolve(response)

    }catch(err){reject(err);}
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        discussionModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchDiscussions(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise(async(resolve, reject) => {
        try{
            var response = [];
        var data = await discussionModel.getPaginatedResult(query, options)
        if(Array.isArray(data) && data.length){
            for(unit of data){
                user = await userModel.search({email:unit.createdBy});
                let unitFinal = JSON.parse( JSON.stringify( unit ) );
                let userFinal = JSON.parse( JSON.stringify( user ) );
                let commentCount = await discussionCommentModel.countDocuments({discussion:unit._id})
                unitData = {...unitFinal, userData:userFinal, commentCount}
                response.push(unitData)
            }
        }
        resolve(response)
    }catch(err){reject(err);}
    });
}

function getDiscussionBySubject(subject) {
    var query = {
        subject: subject
    }
    return new Promise((resolve,reject) => {
        discussionModel.searchOne(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function addCommentsToDisuccsion( commentData ){
    return new Promise( async ( resolve, reject ) => {
        try{
            var user = currentContext.getCurrentContext();
            commentData.createdBy = user.email;
            commentData.lastModifiedBy = user.email;
            let create_comment = await discussionCommentModel.create( commentData);
            resolve( create_comment );
        } catch( err ){
            reject( err );
        }
    })
}

function updateCommenttoDiscussion( id, commentData ){
    return new Promise( async ( resolve, reject ) => {
        try{
            var user = currentContext.getCurrentContext();
            commentData.lastModifiedBy = user.email;
            let update_comment = await discussionCommentModel.updateById( id, commentData);
            resolve( update_comment );
        } catch( err ){
            reject( err );
        }
    })
}

function deleteCommenttoDiscussion( id ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let update_comment = await discussionCommentModel.deletebyId( id );
            resolve( update_comment );
        } catch( err ){
            reject( err );
        }
    })
}

function getAllCommentToDiscussion( discussionID ){
    return new Promise( async ( resolve, reject ) => {
        try{
            var response = [];
            let query = {
                discussion:discussionID
            }
            let data = await discussionCommentModel.search( query );
            if(Array.isArray(data) && data.length){
                for(unit of data){
                    user = await userModel.search({email:unit.createdBy});
                    let unitFinal = JSON.parse( JSON.stringify( unit ) );
                    let userFinal = JSON.parse( JSON.stringify( user ) );
                    unitData = {...unitFinal, userData:userFinal}
                    response.push(unitData)
                }
            }
            resolve(response)
        }catch(err){reject(err);}
        });
}

function getCommentWithID( id ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let comments = await discussionCommentModel.searchOne( id );
            resolve( comments );
        } catch( err ){
            reject( err );
        }
    })
}

function textSearch(text) {
    return new Promise((resolve, reject) => {
        discussionModel.getTextSearchResult(text).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


module.exports = discussionService;

