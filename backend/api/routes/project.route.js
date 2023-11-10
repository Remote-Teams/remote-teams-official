const projectService = require('../services/project.service');
var schema = require('../schemas/project.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');
var generator = require('../../common/idGenerator');
// const redis = require('redis');
// var configResolve = require("../../common/configResolver");
// const redisHost = configResolve.getConfig().redisHost;
// const client = redis.createClient({ host: redisHost, port: 6379 })
var moment = require('moment');

 
function init(router) {
  router.route('/projects')
    .get(getAllProjects)
    .post(addProject);
  router.route('/projects/count')
    .get(getAllProjectsCount);
  router.route('/projects/overview')
    .get(getAllProjectsOverview);
  router.route('/projects/exist')
    .get(isExist);
  router.route('/projects/projectData')
    .get(projData)
  router.route('/projects/costVariance/:id')
    .get(costVariance);
  router.route('/projects/estVsAct/:id')
    .get(estVsAct);
  router.route('/projects/projectHealth/:id')
    .get(projectHealth);
  router.route('/projects/modHealth/:id')
    .get(modHealth);
  router.route('/projects/sprHealth/:id')
    .get(sprHealth);
  router.route('/projects/planVsActHours/:id')
    .get(planVsActHours);
  router.route('/projects/countdown/:id')
    .get( getProjectCountDownById );
  router.route('/projects/compReport/:id')
    .get(compReport);
  router.route('/projects/utilizedHours/:id')
    .get(totalUtilizedHours);
  router.route('/projects/budgetSpent/:id')
    .get(budgetSpent);
  router.route('/projects/expbyproj/:id')
    .get(expOverviewByProj);
  router.route('/projects/:id')
    .get(getProjectById)
    .delete(deleteProject)
    .put(updateProject);
  router.route('/projects/search')
    .post(searchProjects);
  router.route('/projects/search/text')
    .get(textSearch);
  router.route('/projects/rates/:id')
    .get( getProjectRates );
}

/**
 * Get all a projects api
 * @route GET /api/projects
 * @group projects - Operations about projects
 * @returns {object} 200 - An object of projects info
 * @returns {Error}  default - Unexpected error
 */
function getAllProjects(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      projectService.getProjectsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      projectService.getProjectsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    projectService.getAllProjects().then((data) => {
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
 * Search projects api
 * @route POST /api/projects/search
 * @group projects - Operations about projects
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of projects info
 * @returns {Error}  default - Unexpected error
 */
function searchProjects(req, res, next) {
  let searchCriteria = req.body;
  projectService.searchProjects(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get projects by id api
 * @route GET /api/projects/:id
 * @group projects - Operations about projects
 * @returns {object} 200 - An object of projects info
 * @returns {Error}  default - Unexpected error
 */
function getProjectById(req,res,next) {

  let projectId = req.params.id;

  console.log("id"+ projectId);
  var json_format = iValidator.json_schema(schema.getSchema,projectId,"project");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  projectService.getProjectById(projectId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add projects api
 * @route POST /api/projects
 * @group projects - Operations about projects
 * @param {object} project.body.required - projects details
 * @returns {object} 200 - An object of projects info
 * @returns {Error}  default - Unexpected error
 */
function addProject(req,res, next) {
  var projectData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, projectData, "project");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   projectService.getProjectByProjectName(projectData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.PROJECT_ALREADY_EXIST));
    }else{
      projectService.addProject(projectData).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });

}

/**
 * update projects by id api
 * @route PUT /api/projects
 * @group projects - Operations about projects
 * @returns {object} 200 - An object of projects info
 * @returns {Error}  default - Unexpected error
 */
function updateProject(req,res, next) {
   var projectData=req.body;
   var id = req.params.id;
   projectService.getProjectById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
    }else{
      let activityData = {
        "entityType":"ACTIVITY",
        "activityType":"UPDATE",
        "projectId":id
    };
      if( data.status !== projectData.status ){
        activityData.text = "Project "+ data.name +" was changed from "+data.status+" to "+projectData.status;
      } else {
        activityData.text = "Project "+ data.name +" was updated";
      }
      projectService.updateProject(id,projectData, activityData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete projects by id api
 * @route DELETE /api/projects/:id
 * @group projects - Operations about projects
 * @returns {object} 200 - An object of projects info
 * @returns {Error}  default - Unexpected error
 */
function deleteProject(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  projectService.getProjectById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
    }else{
      projectService.deleteProject(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get projects count api
 * @route GET /api/projects/count
 * @group projects - Operations about projects
 * @returns {object} 200 - An object of projects info
 * @returns {Error}  default - Unexpected error
 */
function getAllProjectsCount(req,res,next) {
  projectService.getAllProjectsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of projects api
 * @route GET /api/projects/overview
 * @group projects - Operations about projects
 * @returns {object} 200 - An object of projects info
 * @returns {Error}  default - Unexpected error
 */
function getAllProjectsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  projectService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is projects exist api
 * @route GET /api/projects/exist
 * @group projects - Operations about projects
 * @param {string} projectname.query.required - projects name
 * @returns {object} 200 - An object of projects info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let projectId = req.query.projectId
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  projectService.getProjectByName(name).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/*
text search function
*/

function textSearch(req, res, next) {
  let text = req.query.text;
  projectService.textSearch(text).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function getProjectCountDownById( req, res, next ){
  let projectid = req.params.id;
  projectService.getProjectById( projectid ).then( data => {
    if(data == undefined || data.size == 0){
      return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
    } else {
      let endDate = moment( data.endDate ).endOf('day');
      let todayDate = moment().endOf('day').toISOString();
      let diffDays = moment.duration(endDate.diff(todayDate)).asDays();
      return res.json({ 
         "value":diffDays
      })
    }
  })
  .catch( err => {
    next(errorMethods.sendServerError(err));
  })
}

/**
 * GET RATES OF PROJECTS
 * @route PUT /api/projects/rates/:id
 */
function getProjectRates( req, res, next ){
  let rateType = req.query.type;
  let projectId = req.params.id;
  if( rateType === "AVG" || rateType === "TOTAL" ){
    projectService.getProjectById( projectId )
      .then( async  data => {
        if(data == undefined || data.length == 0){
          return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
        }else{
          try{
            let responseData = await projectService.getProjectRates( rateType, projectId );
            return res.json( responseData );
          } catch ( err ){
            next(errorMethods.sendServerError(err));
          }
        }    
      })
      .catch( err => {
        next(errorMethods.sendServerError(err));
      })
  } else {
    next( errorMethods.sendBadRequest( errorCode.MISSING_QUERY_PARAM ) );
  }
}

/**
 * cost variance on dashboard
 */
function costVariance(req, res, next) {
  let projectId = req.params.id;
  projectService.costVariance(projectId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/*
estimated Vs actual cost (weekly)
*/
function estVsAct(req, res, next) {
  let projectId = req.params.id;
  projectService.estVsAct(projectId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function planVsActHours(req, res, next) {
  let projectId = req.params.id;
  projectService.planVsActHours(projectId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function projectHealth(req,res,next){
  let projectId = req.params.id;
  projectService.projectHealth(projectId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function modHealth(req,res,next){
  let projectId = req.params.id;
  projectService.modHealth(projectId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function sprHealth(req,res,next){
  let projectId = req.params.id;
  projectService.sprHealth(projectId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function compReport(req,res,next){
  let projectId = req.params.id;
  projectService.compReport(projectId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function totalUtilizedHours(req,res,next){
  let projectId = req.params.id;
  projectService.utilizedHours(projectId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function budgetSpent(req,res,next){
  let projectId = req.params.id;
  projectService.budgetSpent(projectId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function expOverviewByProj(req,res,next){
  let projectId = req.params.id;
  projectService.expOverviewByProj(projectId).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function projData(req,res,next){
  projectService.projData().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;