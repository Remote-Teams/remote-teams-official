var noteModel = require("../models/note.model");
var currentContext = require('../../common/currentContext');

var noteService = {
    getAllNotes: getAllNotes,
    getNoteById:getNoteById,
    addNote: addNote,
    updateNote:updateNote,
    deleteNote:deleteNote,
    getNoteByNoteName: getNoteByNoteName,
    getNotesByPage: getNotesByPage,
    getAllNotesCount: getAllNotesCount,
    getNotesByPageWithSort: getNotesByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchNotes: searchNotes,
    getNoteByName: getNoteByName,
    textSearch: textSearch
}

function addNote(noteData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        noteData.createdBy = user.email;
        noteData.lastModifiedBy = user.email;
        
        noteModel.create(noteData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateNote(id,noteData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        noteData.lastModifiedBy = user.email;
        
        noteModel.updateById(id,noteData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteNote(id) {
    return new Promise((resolve,reject) => {
        noteModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllNotes() {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        let query = {
            createdBy:user.email
        };
        noteModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getNoteById(id) {
    return new Promise((resolve,reject) => {
        noteModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getNoteByNoteName(noteName, tenant){
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        let query = {
            createdBy:user.email,
            'noteName': noteName
        };
        noteModel.searchOne(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getAllNotesCount() {
    return new Promise((resolve, reject) => {
        var user = currentContext.getCurrentContext();
        let query = {
            createdBy:user.email,
        };
        noteModel.countDocuments(query).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getNotesByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    var user = currentContext.getCurrentContext();
    let query = {
        createdBy:user.email,
    };

    return new Promise((resolve, reject) => {
        noteModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getNotesByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;
    var user = currentContext.getCurrentContext();
    let query = {
        createdBy:user.email,
    };
    return new Promise((resolve, reject) => {
        noteModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        noteModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function searchNotes(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    var user = currentContext.getCurrentContext();
    query.createdBy = user.email;
    return new Promise((resolve, reject) => {
        noteModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getNoteByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        noteModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

//text search service

function textSearch(text) {
    return new Promise((resolve, reject) => {
        noteModel.getTextSearchResult(text).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}


module.exports = noteService;

