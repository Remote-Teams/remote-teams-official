const todoService = require('../services/todo.service');
var schema = require('../schemas/todo.validation.schema.json')
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
  router.route('/todos')
    .get(getAllTodos)
    .post(addTodo);
  router.route('/todos/count')
    .get(getAllTodosCount);
  router.route('/todos/overview')
    .get(getAllTodosOverview);
  router.route('/todos/exist')
    .get(isExist);
  router.route('/todos/:id')
    .get(getTodoById)
    .delete(deleteTodo)
    .put(updateTodo);
  router.route('/todos/search')
    .post(searchTodos);
}

/**
 * Get all a todos api
 * @route GET /api/todos
 * @group todos - Operations about todos
 * @returns {object} 200 - An object of todos info
 * @returns {Error}  default - Unexpected error
 */
function getAllTodos(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
 if (pageNo > 0 && pageSize > 0 && !isNaN(pageSize)) {
    if (sortBy != null || sortBy != undefined) {
      todoService.getTodosByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      todoService.getTodosByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    todoService.getAllTodos().then((data) => {
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
 * Search todos api
 * @route POST /api/todos/search
 * @group todos - Operations about todos
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of todos info
 * @returns {Error}  default - Unexpected error
 */
function searchTodos(req, res, next) {
  let searchCriteria = req.body;
  todoService.searchTodos(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get todos by id api
 * @route GET /api/todos/:id
 * @group todos - Operations about todos
 * @returns {object} 200 - An object of todos info
 * @returns {Error}  default - Unexpected error
 */
function getTodoById(req,res,next) {

  let todoId = req.params.id;

  console.log("id"+ todoId);
  var json_format = iValidator.json_schema(schema.getSchema,todoId,"todo");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  todoService.getTodoById(todoId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * add todos api
 * @route POST /api/todos
 * @group todos - Operations about todos
 * @param {object} todo.body.required - todos details
 * @returns {object} 200 - An object of todos info
 * @returns {Error}  default - Unexpected error
 */
function addTodo(req,res, next) {
  var todoData=req.body;
  
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, todoData, "todo");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   todoService.getTodoByTodoName(todoData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.PROJECT_ALREADY_EXIST));
    }else{
      todoService.addTodo(todoData).then((data) => {
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
 * update todos by id api
 * @route PUT /api/todos
 * @group todos - Operations about todos
 * @returns {object} 200 - An object of todos info
 * @returns {Error}  default - Unexpected error
 */
function updateTodo(req,res, next) {
   var todoData=req.body;
   var id = req.params.id;
   todoService.getTodoById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
    }else{
      todoService.updateTodo(id,todoData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete todos by id api
 * @route DELETE /api/todos/:id
 * @group todos - Operations about todos
 * @returns {object} 200 - An object of todos info
 * @returns {Error}  default - Unexpected error
 */
function deleteTodo(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  todoService.getTodoById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
    }else{
      todoService.deleteTodo(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get todos count api
 * @route GET /api/todos/count
 * @group todos - Operations about todos
 * @returns {object} 200 - An object of todos info
 * @returns {Error}  default - Unexpected error
 */
function getAllTodosCount(req,res,next) {
  todoService.getAllTodosCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.PROJECT_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of todos api
 * @route GET /api/todos/overview
 * @group todos - Operations about todos
 * @returns {object} 200 - An object of todos info
 * @returns {Error}  default - Unexpected error
 */
function getAllTodosOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  todoService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Is todos exist api
 * @route GET /api/todos/exist
 * @group todos - Operations about todos
 * @param {string} todoname.query.required - todos name
 * @returns {object} 200 - An object of todos info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next){
  let name = req.query.name;
  let todoId = req.query.todoId
  console.log("name" + name);
  var json_format = iValidator.json_schema(schema.existSchema, name, "name");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  todoService.getTodoByName(name).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({'isExist': true});
    } else {
      res.json({'isExist': false});
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;