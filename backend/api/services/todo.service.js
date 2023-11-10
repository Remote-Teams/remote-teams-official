var todoModel = require("../models/todo.model");
var currentContext = require('../../common/currentContext');

var todoService = {
    getAllTodos: getAllTodos,
    getTodoById:getTodoById,
    addTodo: addTodo,
    updateTodo:updateTodo,
    deleteTodo:deleteTodo,
    getTodoByTodoName: getTodoByTodoName,
    getTodosByPage: getTodosByPage,
    getAllTodosCount: getAllTodosCount,
    getTodosByPageWithSort: getTodosByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchTodos: searchTodos,
    getTodoByName: getTodoByName
}

function addTodo(todoData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        todoData.createdBy = user.email;
        todoData.lastModifiedBy = user.email;
        
        todoModel.create(todoData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateTodo(id,todoData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        todoData.lastModifiedBy = user.email;
        
        todoModel.updateById(id,todoData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteTodo(id) {
    return new Promise((resolve,reject) => {
        todoModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllTodos() {
    return new Promise((resolve,reject) => {
        todoModel.search({}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTodoById(id) {
    return new Promise((resolve,reject) => {
        todoModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTodoByTodoName(todoName, tenant){
    return new Promise((resolve,reject) => {
        todoModel.searchOne({'todoName': todoName}).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllTodosCount() {
    return new Promise((resolve, reject) => {
        todoModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTodosByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise((resolve, reject) => {
        todoModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTodosByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise((resolve, reject) => {
        todoModel.getPaginatedResult({}, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        todoModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchTodos(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        todoModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getTodoByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        todoModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


module.exports = todoService;

