const notificationService = require('../services/notification.service');
var schema = require('../schemas/notification.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorMethods = require('../../common/error-methods');
var accessResolver = require('../../common/accessResolver');
var currentContext = require('../../common/currentContext');
const NotificationType = require('../../common/constants/NotificationType');
const notificationClient = require('../../common/notificationClient');


function init(router) {
  router.route('/notifications')
    .get(getAllNotifications)
  router.route('/notifications/:id/read')
    .put(updateNotificationRead)
  router.route('/notifications/announcement')
    .post(createAnnouncement);
  router.route('/notifications/announcement')
    .get(getAnnouncement);

}

/**
 * Get all a Notifications api
 * @route GET /api/Notifications
 * @group Notifications - Operations about Notifications
 * @returns {object} 200 - An object of Notifications info
 * @returns {Error}  default - Unexpected error
 */
function getAllNotifications(req, res, next) {
  var pageNo = parseInt(req.query.pageNo);
  var pageSize = parseInt(req.query.pageSize);
  var sortBy = "createdAt";

  if (pageNo <= 0 || isNaN(pageNo) || pageSize <= 0 || isNaN(pageSize)) {
    errMsg = { "error": true, "message": "invalid page number or page Size." };
    res.send(errMsg);
  }

  notificationService.getNotificationsByPageWithSort(pageNo, pageSize, sortBy).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * update notes by id api
 * @route PUT /api/notification/:id
 * @group notes - Operations about notification
 * @returns {object} 200 - An object of notification info
 * @returns {Error}  default - Unexpected error
 */
function updateNotificationRead(req, res, next) {
  var id = req.params.id;
  notificationService.getNotificationById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.NOTIFICATION_NOT_EXIST));
    } else {
      data.isRead = true;
      notificationService.updateNotification(id, data).then((data) => {
        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });
}

async function createAnnouncement(req,res,next){

  var user = currentContext.getCurrentContext();
  var workspaceId = user.workspaceId;
  var userId = user.userId;
  var type = NotificationType.ANNOUNCEMENT
  //console.log(req.body.notification);

  // var payload = {
  //     'notification': req.body,
  //     'isRead': false,
  //     'from': userId,
  //     'notificationType': type
  // }
  let payload = {
    notification:req.body,
    notificationType:type,
    from:user.userId
}
  //the notificaion service has a function addnotification - it simply
  // calls the create function in the model, which needs the 4 values to be inside
  //a notification. 
  var data = await notificationService.addNotification(payload, workspaceId);
  //below we have called notifyall function in notification client, this function simply
  //sends announcement to all, and requires three values, we have passed those.
  await notificationClient.notifyAll(type, payload, workspaceId);
  res.json(data);
}


function getAnnouncement(req, res, next) {
  notificationService.getAnnouncement().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

module.exports.init = init;