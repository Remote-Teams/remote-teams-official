var scrumNotesModel = require("../models/scrumNotes.model");
var currentContext = require('../../common/currentContext');


var scrumNotesService = {
    getAllScrumNotesByScrumId:getAllScrumNotesByScrumId,
    createScrumNotesByScrumId:createScrumNotesByScrumId,
    updateScrumNotes:updateScrumNotes,
    deleteScrumNotes:deleteScrumNotes,
}


function createScrumNotesByScrumId( scrumNotesData ){
    return new Promise( async ( resolve, reject ) => {
        try{
            var user = currentContext.getCurrentContext();
            scrumNotesData.createdBy = user.email;
            scrumNotesData.lastModifiedBy = user.email;
            let create_notes = await scrumNotesModel.create( scrumNotesData );
            resolve( create_notes );
        } catch ( err ){
            reject( err );
        } 
    })
}

function getAllScrumNotesByScrumId( query ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let notes = await scrumNotesModel.search( query );
            resolve( notes );
        } catch ( err ){
            reject( err );
        } 
    })
}

function updateScrumNotes( id , data){
    return new Promise( async ( resolve, reject ) => {
        try{
            var user = currentContext.getCurrentContext();
            data.lastModifiedBy = user.email;
            console.log( data, id );
            let update_notes = await scrumNotesModel.updateById( id, data );
            console.log( update_notes );
            resolve( update_notes );  
        } catch ( err ){
            reject( err );
        } 
    })
}

function deleteScrumNotes( id ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let delete_notes = await scrumNotesModel.deletebyId(id);
            resolve( delete_notes );
        } catch ( err ){
            reject( err );
        } 
    })
}


module.exports = scrumNotesService;