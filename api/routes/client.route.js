const clientService = require('../services/client.service');
var schema = require('../schemas/client.validation.schema.json')
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
  router.route('/clients')
    .get(getAllClients)
    .post(addClient);
  router.route('/clients/summaryTab')
    .get(summaryTab);
  router.route('/clients/count')
    .get(getAllClientsCount);
  router.route('/clients/overview')
    .get(getAllClientsOverview);
  router.route('/clients/exist')
    .get(clientDoesExist);
  router.route('/clients/search')
    .post(searchClients);
  router.route('/clients/:id')
    .get(getClientById)
    .delete(deleteClient)
    .put(updateClient);
  router.route('/clients/search/text')
    .get(textSearch);
}

/**
 * Get all clients api
 * @route GET /api/clients
 * @group clients - Operations about clients
 * @returns {object} 200 - An object of clients info
 * @returns {Error}  default - Unexpected error
 */
function getAllClients(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = req.query.sortBy;
  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }
  else if (pageNo > 0) {
    if (sortBy != null || sortBy != undefined) {
      console.log("Sotirng")
      clientService.getClientsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    } else {
      console.log("paging")
      clientService.getClientsByPage(pageNo, pageSize).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
    }
  } else {
    console.log("elo")
    clientService.getAllClients().then((data) => {
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
 * Search clients api
 * @route POST /api/clients/search
 * @group clients - Operations about projects
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of projects info
 * @returns {Error}  default - Unexpected error
 */
function searchClients(req, res, next) {
  console.log("Asd");
  let searchCriteria = req.body;
  clientService.searchClients(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * esexist clients api
 * @route GET /api/clients/exist
 * @group clients - Operations about clients
 * @returns {object} 200 - An object of projects info
 * @returns {Error}  default - Unexpected error
 */

function clientDoesExist(req, res, next) {
  let clientName = req.query.name;
  console.log(clientName);
    clientService.getClientByName(clientName).then((data) => {
    res.json(data)
  }).catch((err) => {
    console.log( err );
    next(errorMethods.sendServerError(err))
  })
}


/**
 * Get clients by id api
 * @route GET /api/clients/:id
 * @group clients - Operations about clients
 * @returns {object} 200 - An object of clients info
 * @returns {Error}  default - Unexpected error
 */
function getClientById(req,res,next) {
  let clientId = req.params.id;
  var json_format = iValidator.json_schema(schema.getSchema,clientId,"client");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  clientService.getClientById(clientId).then((data) => {
      if(data == undefined || data.size == 0){
        return next(errorMethods.sendBadRequest(errorCode.CLIENT_DOES_NOT_EXIST));
      }
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * addclients api
 * @route POST /api/clients
 * @group projects - Operations about projects
 * @param {object} project.body.required - projects details
 * @returns {object} 200 - An object of projects info
 * @returns {Error}  default - Unexpected error
 */
function addClient(req,res, next) {
  var clientData=req.body;
  
  //Validating the input entity
   var json_format = iValidator.json_schema(schema.postSchema, clientData, "client");
   if (json_format.valid == false) {
     return res.status(422).send(json_format.errorMessage);
   }
   clientService.getClientByName(clientData.name).then((data)=>{
    if(data != undefined && data.length > 0){
      return next(errorMethods.sendBadRequest(errorCode.CLIENT_ALREADY_EXISTS));
    }else
    {
      
      clientService.addClient(clientData).then((data) => {
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
 * update clients by id api
 * @route PUT /api/clients
 * @group clients - Operations about clients
 * @returns {object} 200 - An object of clients info
 * @returns {Error}  default - Unexpected error
 */
function updateClient(req,res, next) {
   var clientData=req.body;
   var id = req.params.id;
   clientService.getClientById(id).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.CLIENT_DOES_NOT_EXIST));
    }else{
      clientService.updateClient(id,clientData).then((data)=>{
        res.json(data);
      }).catch((err)=>{
      next(errorMethods.sendServerError(err));
     });
    }
  });
}

/**
 * delete clients by id api
 * @route DELETE /api/clients/:id
 * @group clients - Operations about clients
 * @returns {object} 200 - An object of clients info
 * @returns {Error}  default - Unexpected error
 */
function deleteClient(req,res, next) {
  var delId = req.params.id;
  if (!delId) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
  }
  clientService.getClientById(delId).then((data)=>{
    if(data == undefined || data.length == 0){
      return next(errorMethods.sendBadRequest(errorCode.CLIENT_DOES_NOT_EXIST));
    }else{
      clientService.deleteClient(delId).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

/**
 * Get clients count api
 * @route GET /api/clients/count
 * @group clients - Operations about clients
 * @returns {object} 200 - An object of clients info
 * @returns {Error}  default - Unexpected error
 */
function getAllClientsCount(req,res,next) {
  clientService.getAllClientsCount().then((data) => {
      if(data == undefined){
        return next(errorMethods.sendBadRequest(errorCode.CLIENT_DOES_NOT_EXIST));
      }
      res.send({ 'count': data });
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
}

/**
 * get overview of clients api
 * @route GET /api/clients/overview
 * @group projects - Operations about projects
 * @returns {object} 200 - An object of projects info
 * @returns {Error}  default - Unexpected error
 */
function getAllClientsOverview(req, res, next) {
  let overviewKey = req.query.key;
  if (!overviewKey) {
    return next(errorMethods.sendBadRequest(errorCode.MISSING_QUERY_PARAM));
  }
  clientService.groupByKeyAndCountDocuments(overviewKey).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/*
text search function
*/

function textSearch(req, res, next) {
  let text = req.query.text;
  clientService.textSearch(text).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function summaryTab(req, res, next) {
  clientService.summaryTab().then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * get projects by client name
 * what should be the route this should be available at? shubham please help
 * 
 * @param {string} projectname.query.required - projects name
 * @returns {object} 200 - An object of projects info
 * @returns {Error}  default - Unexpected error
 */

// function getProjectsByClientName(req, res, next) {

//     let clientName = req.body.name
//     client.Service.getProjectsByClientName(clientName).then((data) => {
//       res.json(data)
//     }).catch((err) => {
//       next(errorMethods.sendServerError(err))
//     })
//   }



/*possible routes required - 

1. get projects by clientName

*/

module.exports.init = init;
