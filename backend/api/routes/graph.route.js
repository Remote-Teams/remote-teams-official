var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
const moment = require('moment');
const graphService = require('../services/graph.service');
const ViewType = require('../../common/constants/ViewType'); 
var graphSchema = require('../schemas/graph.validation.schema.json');
var iValidator = require('../../common/iValidator');
var generator = require('../../common/idGenerator');
const redis = require('redis');
var configResolve = require("../../common/configResolver");
const redisHost = configResolve.getConfig().redisHost;
const client = redis.createClient({ host: redisHost, port: 6379 })

function init(router) {
    router.route('/graph/email')
        .get(getEmailCountByTimestamp);
}

/******************************************
 * @DESC - DATE FILTER
 ******************************************/


/**
 * Get email by timestamp api
 * @route GET /api/graph/email
 * @group email - Operations about email
 * @returns {object} 200 - An object of email info
 * @returns {Error}  default - Unexpected error
 */
function getEmailCountByTimestamp(req, res, next) {
    let startOfWeek = moment().startOf('isoWeek');
    let endOfWeek = moment().endOf('isoWeek');

    graphService.getEmailCountByTimestamp(startOfWeek, endOfWeek).then((data)=>{
        res.json(data);
    }).catch((err)=>{
        console.log(err);
        next(errorMethods.sendServerError("Error while getting email"));
    });
    
}


module.exports.init = init;
