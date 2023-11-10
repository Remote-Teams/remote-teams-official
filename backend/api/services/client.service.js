var clientModel = require("../models/client.model");
var projectModel = require("../models/project.model");
var ticketModel = require("../models/ticket.model");
var invoiceModel = require("../models/invoice.model")
var currentContext = require('../../common/currentContext');
var projectServices = require('./project.service');
const { IdentityStore } = require("aws-sdk");

var clientService = {
    getAllClients: getAllClients,
    getClientById:getClientById,
    addClient: addClient,
    updateClient:updateClient,
    deleteClient:deleteClient,
    getClientsByPage: getClientsByPage,
    getAllClientsCount: getAllClientsCount,
    getClientsByPageWithSort: getClientsByPageWithSort,
    groupByKeyAndCountDocuments: groupByKeyAndCountDocuments,
    searchClients: searchClients,
    getClientByName:getClientByName,
    getPaginatedResultWithProjects:getPaginatedResultWithProjects,
    textSearch: textSearch,
    summaryTab: summaryTab
}

function addClient(clientData) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        clientData.createdBy = user.email;
        clientData.lastModifiedBy = user.email;
        clientData.onBoardingDate = new Date().toISOString();
     clientModel.create(clientData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
   
}

function updateClient(id,clientData,callback) {
    return new Promise((resolve,reject) => {
        var user = currentContext.getCurrentContext();
        clientData.lastModifiedBy = user.email;
        
        clientModel.updateById(id,clientData).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    })
     
}

function deleteClient(id) {
    return new Promise((resolve,reject) => {
        clientModel.deletebyId(id).then((data)=>{
            resolve({'success':true});
        }).catch((err) => {
            reject(err);
        })
    })
}

function getAllClients() {
    return new Promise((resolve,reject) => {
        clientModel.search({}).then(async(data)=>{
            let i = 0; 
            let results = JSON.parse( JSON.stringify( data ) );
            while( i< results.length ){
                let projects = await projectServices.getProjectByClientName( results[i].name );
                results[i].projects = projects;
                i++;
            }
            resolve(results);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getClientById(id) {
    return new Promise((resolve,reject) => {
        clientModel.getById(id).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

// function getProjectsByClientName(clientName, tenant){
//     return new Promise((resolve,reject) => {
//         clientModel.getProjectsByClientName({'name': clientName}).then((data)=>{
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }


// function getClientByClientame(clientName, tenant){
//     return new Promise((resolve,reject) => {
//         clientModel.searchOne({'name': clientName}).then((data)=>{
//             resolve(data);
//         }).catch((err) => {
//             reject(err);
//         })
//     });
// }

function getAllClientsCount() {
    return new Promise((resolve, reject) => {
        clientModel.countDocuments({}).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getClientsByPage(pageNo, pageSize) {
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;

    return new Promise(async (resolve, reject) => {
        try{
            let query = [{
                $lookup:{
                    from: "projects",
                    localField: "_id",
                    foreignField: "client",
                    as: "projects"
                }
            },
            { $skip : options.skip },
            { $limit : options.limit },
            ];
            let data = await clientModel.getPaginatedResultWithProjects( query );
            resolve(data );
        } catch ( err ){
            reject( err )
        }
        // clientModel.getPaginatedResult({}, options).then(async (data) => {
        //     let i = 0; 
        //     let results = JSON.parse( JSON.stringify( data ) );
        //     while( i< results.length ){
        //         let projects = await projectServices.getProjectByClientName( results[i].name );
        //         results[i].projects = projects;
        //         i++;
        //     }
        //     resolve(results);
        // }).catch((err) => {
        //     reject(err);
        // })
    });
}

function getClientsByPageWithSort(pageNo, pageSize, sortBy) {
    const options = {};
    const sortTemp = {};
    sortTemp[sortBy] = 1;
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    options.sort = sortTemp;

    return new Promise( async (resolve, reject) => {
        try{
            let query = [{
                $lookup:{
                    from: "projects",
                    localField: "_id",
                    foreignField: "client",
                    as: "projects"
                }
            },
            { $skip : options.skip },
            { $limit : options.limit },
            { $sort : sortTemp}
            ];
            let data = await clientModel.getPaginatedResultWithProjects( query );
            resolve(data );
        } catch ( err ){
            reject( err )
        }
        // clientModel.getPaginatedResult({}, options).then(async(data) => {
        //     let i = 0; 
        //     let results = JSON.parse( JSON.stringify( data ) );
        //     while( i< results.length ){
        //         let projects = await projectServices.getProjectByClientName( results[i].name );
        //         results[i].projects = projects;
        //         i++;
        //     }
        //     resolve(results);
        // }).catch((err) => {
        //     reject(err);
        // })
    });
}

function groupByKeyAndCountDocuments(key) {
    return new Promise((resolve,reject) => {
        clientModel.groupByKeyAndCountDocuments(key).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

//we are passing pagesize, page no and query, all of these things in the search criteria from the routes to the service
// at the service level, we can break it down and play with these values, the skip and limit are sent as options to the model's function 
//called getpaginatedresult

function searchClients(searchCriteria) {
    let pageSize = searchCriteria.pageSize;
    let pageNo = searchCriteria.pageNo;
    let query = searchCriteria.query;
    const options = {};
    options.skip = pageSize * (pageNo - 1);
    options.limit = pageSize;
    return new Promise((resolve, reject) => {
        clientModel.getPaginatedResult(query, options).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getClientByName(name) {
    var query = {
        name: name
    }
    return new Promise((resolve,reject) => {
        clientModel.search(query).then((data)=>{
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function getPaginatedResultWithProjects( sear ){
    return new Promise( async ( resolve, reject ) => {
        try{
            let query = [
                {
                    $lookup:{
                        from: "projects",
                        localField: "_id",
                        foreignField: "client",
                        as: "projects"
                    }
                },
                { $skip : 1 },
                { $limit : 5 }
            ];
        let data = await clientModel.getPaginatedResultWithProjects( query );
        resolve(data );
        } catch ( err ){
            reject( err );
        }
    } )
}

function textSearch(text) {
    return new Promise((resolve, reject) => {
        clientModel.getTextSearchResult(text).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject(err);
        })
    });
}

function summaryTab() {
    return new Promise(async(resolve, reject) => {
       try{
        var openTickets=[], data=[], allClients, structure ={};
            allClients = await getAllClients();
            if(Array.isArray(allClients) && allClients.length){
            for (client of allClients){
                id = client._id, clientName = client.name, status = client.status, onboard = client.onBoardingDate
            projects = await projectModel.countDocuments({"client":id})
            ticket = await ticketModel.countByClient(id)
            openTicket = await ticketModel.openByClient(id) 
            clientRevenue = await invoiceModel.revenueByClient(id)
            Array.isArray(ticket) && ticket.length ? ticketsRaised = ticket[0].count : ticketsRaised = 0
            Array.isArray(openTicket) && openTicket.length ? openTickets = openTicket[0].count : openTickets = 0
            Array.isArray(clientRevenue) && clientRevenue.length ? revenue = clientRevenue[0].totalofall : revenue = 0
            }
            structure ={clientName, status,onboard,projects,ticketsRaised,openTickets,revenue};
            data.push(structure);  
            resolve(data)
                    }
            else{
                    resolve([]);
                 }
        }catch(err){reject(err)}
    });
}

module.exports = clientService;

