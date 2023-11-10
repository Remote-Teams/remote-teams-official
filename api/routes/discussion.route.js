const discussionService = require('../services/discussion.service');
const projectServices = require('../services/project.service');
var schema = require('../schemas/discussion.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');
var generator = require('../../common/idGenerator');
const redis = require('redis');
var configResolve = require("../../common/configResolver");
const redisHost = configResolve.getConfig().redisHost;
const client = redis.createClient({ host: redisHost, port: 6379 })


function init(router) {
  router.route('/discussions')
    .get(getAllDiscussions)
    .post(addDiscussion);
  router.route('/discussions/count')
    .get(getAllDiscussionsCount);
  router.route('/discussions/overview')
    .get(getAllDiscussionsOverview);
    router.route('/discussions/exist')
    .get(isExist);
  router.route(`/discussions/comments`)
    .post( createComments )
    .get( getAllComments )
  router.route(`/discussions/comments/:id`)
    .put( updateComment )
    .delete( deleteComment );
  router.route('/discussions/:id')
    .get(getDiscussionById)
    .delete(deleteDiscussion)
    .put(updateDiscussion);
  router.route('/discussions/search')
    .post(searchDiscussions);
  router.route('/discussions/search/text')
    .get(textSearch);
}

/**
 * Get all a discussions api
 * @route GET /api/discussions
 * @group discussions - Operations about discussions
 * @returns {object} 200 - An object of discussions info
 * @returns {Error}  default - Unexpected error
 */
function getAllDiscussions(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
   if (pageNo > 0 && !isNaN(pageNo) && pageSize > 0 && !isNaN(pageSize)) {
    if (sortBy != null || sortBy != undefined) {
      discussionService.getDiscussionsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      discussionService.getDiscussionsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    discussionService.getAllDiscussions().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
  }
}

/**
 * @typedef SearchCriteria
 * @property {string} pageSize.required
 * @property {string} pageNo.required 
 * @property {string} query.required 
 */
/**
 * Search discussions api
 * @route POST /api/discussions/search
 * @group discussions - Operations about discussions
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of discussions info
 * @returns {Error}  default - Unexpected error
 */
function searchDiscussions(req, res, next) {
  let searchCriteria = req.body;
  discussionService.searchDiscussions(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get discussions by id api
 * @route GET /api/discussions/:id
 * @group discussions - Operations about discussions
 * @returns {object} 200 - An object of discussions info
 * @returns {Error}  default - Unexpected error
 */
function getDiscussionById(req,res,next) {

  let discussionId = req.params.id;

  console.log("id"+ discussionId);
  var json_format = iValidator.json_schema(schema.getSchema,discussionId,"discussion");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  discussionService.getDiscussionById(discussionId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.DISCUSSION_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add discussions api
 * @route POST /api/discussions
 * @group discussions - Operations about discussions
 * @param {object} discussion.body.required - discussions details
 * @returns {object} 200 - An object of discussions info
 * @returns {Error}  default - Unexpected error
 */
async function addDiscussion(req,res, next) {
  try{
    // JSON VALIDATION'
    const discussionData = req.body;
    var json_format = iValidator.json_schema(schema.postSchema, discussionData, "discussion");
    if (json_format.valid == false) {
      return res.status(422).send(json_format.errorMessage);
    } else {
      // CHECK IF PROJECT EXISTS OR NOT
      let project = await projectServices.getProjectById( discussionData.project );
      if( project ){
        console.log("PASSED");
        // CHECK IF DISCUSSION SUBJECT IS UNIQUE
        let discussion = await discussionService.getDiscussionBySubject( discussionData.subject );
        if( discussion ){
          return next(errorMethods.sendBadRequest(errorCode.DISCUSSION_ALREADY_EXISTS));
        } else {
          // CREATE THE DISCUSSION
          let create_discussion = await discussionService.addDiscussion( discussionData );
          return res.json(create_discussion);
        }
      } else {
        return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
      }
    }
  } catch( err ){
    next(errorMethods.sendServerError(err));
  }
}

/**
 * update discussions by id api
 * @route PUT /api/discussions
 * @group discussions - Operations about discussions
 * @returns {object} 200 - An object of discussions info
 * @returns {Error}  default - Unexpected error
 */
function updateDiscussion(req,res, next) {
   var discussionData=req.body;
   var id = req.params.id;
   discussionService.getDiscussionById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.DISCUSSION_DOES_NOT_EXIST));
    }else{
      let activityData = {
        "entityType":"ACTIVITY",
        "activityType":"DISCUSSION UPDATED",
        "projectId":data.project
    };
      if( data.status !== projectData.status ){
        activityData.text = "Discussion "+ data.subject +" was changed from "+data.status+" to "+discussionData.status;
      } else {
        activityData.text = "Discussion "+ data.subject +" was updated";
      }
      discussionService.updateDiscussion(id,discussionData, activityData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete discussions by id api
 * @route DELETE /api/discussions/:id
 * @group discussions - Operations about discussions
 * @returns {object} 200 - An object of discussions info
 * @returns {Error}  default - Unexpected error
 */
function deleteDiscussion(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  discussionService.getDiscussionById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.DISCUSSION_DOES_NOT_EXIST));
    }else{
      discussionService.deleteDiscussion(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get discussions count api
 * @route GET /api/discussions/count
 * @group discussions - Operations about discussions
 * @returns {object} 200 - An object of discussions info
 * @returns {Error}  default - Unexpected error
 */
function getAllDiscussionsCount(req,res,next) {
  discussionService.getAllDiscussionsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.DISCUSSION_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of discussions api
 * @route GET /api/discussions/overview
 * @group discussions - Operations about discussions
 * @returns {object} 200 - An object of discussions info
 * @returns {Error}  default - Unexpected error
 */
function getAllDiscussionsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  discussionService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is discussions exist api
 * @route GET /api/discussions/exist
 * @group discussions - Operations about discussions
 * @param {string} discussionname.query.required - discussions name
 * @returns {object} 200 - An object of discussions info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let subject = req.query.subject;
  var json_format = iValidator.json_schema(schema.existSchema, subject, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  discussionService.getDiscussionBySubject(subject).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * @route POST /api/discussions/comments
 * @group COMMENTS - ADD NEW COMMENT
 */
async function createComments( req, res, next ){
  try{
    const body = req.body;
    var json_format = iValidator.json_schema(schema.commentPostSchema, body, "name");
    if (json_format.valid == false) {
      return res.status(422).send(json_format.errorMessage);
    } else {
      // CHECK IF SCRUM EXISTS 
      let discussion = await discussionService.getDiscussionById( body.discussion );
      if( discussion ){
        let add_comments = await discussionService.addCommentsToDisuccsion( body );
        return res.json( add_comments )
      } else {
        return next(errorMethods.sendBadRequest(errorCode.DISCUSSION_DOES_NOT_EXIST));
      }
    }
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  }
}

/**
 * @route GET /api/discussions/comments
 * @group COMMENTS - GET ALL COMMENTS WITH DISCUSSION ID
 */
async function getAllComments( req, res, next ){
  try{
    let id=req.query.discussionId;
    if( id === undefined ){
      return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
    } else {
      let all_comments = await discussionService.getAllCommentToDiscussion( id );
      return res.json( all_comments );
    }
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  }
}


/**
 * @route PUT /api/discussions/comments/:id
 * @group COMMENTS - UPDAETE COMMENTS WITH DISCUSSION ID
 */
async function updateComment( req, res, next ){
  try{
    let id = req.params.id;
    let body = req.body;
    if( id === undefined ){
      return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
    } else {
      var json_format = iValidator.json_schema(schema.commentPostSchema, body, "name");
      if (json_format.valid == false) {
        return res.status(422).send(json_format.errorMessage);
      } else {
        let update_Comment = await discussionService.updateCommenttoDiscussion( id, body );
        return res.json( update_Comment );
      }
    }
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  }
}

/**
 * @route DELETE /api/discussions/comments/:id
 * @group COMMENTS - DELETE COMMENTS WITH DISCUSSION ID
 */
async function deleteComment( req, res, next ){
  try{
    let id = req.params.id;
    if( id === undefined ){
      return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
    } else {
      let delete_comment = await discussionService.deleteCommenttoDiscussion( id );
      return res.json({ success:true });
    }
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  }
}

/*
textsearch
*/
function textSearch(req, res, next) {
  let text = req.query.text;
  discussionService.textSearch(text).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}



module.exports.init = init;