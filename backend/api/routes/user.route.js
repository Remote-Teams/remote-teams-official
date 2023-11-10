const userService = require('../services/user.service');
var schema = require('../schemas/user.validation.schema.json')
var iValidator = require('../../common/iValidator');
var errorCode = require('../../common/error-code');
var logger = require('../../config/winston')(__filename);
var errorCode = require('../../common/error-code');
var errorMethods = require('../../common/error-methods');
var userAuthCodeService = require('../services/userAuthCode.service');
var emailTemplateService = require('../../common/emailTemplateService');
var uuid = require('node-uuid');
var configResolve = require("../../common/configResolver");
var mailer = require('../../common/aws_mailer');
var currentContext = require('../../common/currentContext');
const Status = require('../../common/constants/Status');
var plans = require('../../config/plans.json').plans;
var organizationService = require('../services/organization.service');
const roleService = require('../services/role.service');
const helper = require("../../common/helper");
const userDetailService = require('../services/userDetails.service');
const commonEmailTemplateService = require('../../common/emailTemplateService');
const { reject } = require('lodash');
const { resolve } = require('app-root-path');


function init(router) {
  router.route('/users')
    .get(getAllUsers)
    .post(addUser);
  router.route('/users/status/:status')
    .get(getAllUsersByStatus);
  router.route('/users/count')
    .get(getAllUsersCount);
  router.route('/users/overview')
    .get(getAllUsersOverview);
  router.route('/users/invite')
    .post(inviteUsers);
  router.route('/users/inviteMail')
    .post(inviteMail);
  router.route('/users/inviteLinks')
    .get(inviteLinks);
  router.route('/users/comparePassword')
    .post(comparePassword);
  router.route('/users/logout/:id')
    .put(captureLogoutTime);
  router.route('/users/archive')
    .post(archiveUsers);
  router.route('/users/exist')
    .get(isExist);
  router.route('/users/userDistribution')
    .get(userDistPercent);
  router.route('/users/resourceSummary')
    .get(resourceSummary);
  router.route('/users/avgUtilRate')
    .get(avgUtilRate);
  router.route('/users/summaryTab')
    .get(summaryTab);
  router.route('/users/changePassword')
    .post(changePassword);
  router.route('/users/userdetails/:id')
    .get(getUserDetailsById);
  router.route('/users/performance/:id')
    .get(getUserPerformanceById);
  router.route('/users/memberTypeCost')
    .get( getMonthlyMemberTypeCost );
  router.route('/users/:id')
    .get(getUserById)
    .delete(deleteUser)
    .put(updateUser);
  router.route('/users/search')
    .post(searchUsers);
  router.route('/users/search/text')
    .get(textSearch);
  router.route('/users/activity/:id')
    .get(getActivityByUserId);
  router.route('/users/role/category/:category')
    .get(getUsersByRoleCategory);
  router.route('/users/reports/timesheet')
    .get( getUserTimeSheetForReports )

}

/**
 * Invite a user in workspace api
 * @route POST /api/users/invite
 * @group users - Operations about user
 * @param {object} userData.body.required - user details
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
// function inviteUsers(req, res, next) {
//   logger.info("In inviteUsers route");
//   var inviteUsers = req.body;
//   var inviteUserPromises = [];

//   let currentUser = currentContext.getCurrentContext();
//   let workspaceId = currentUser.workspaceId;

//   organizationService.getOrganizationByWorkspaceId(workspaceId)
//     .then((organizationData) => {
//       // console.log( organizationData );
//       // var currentPlan;
//       // plans.forEach(p => {
//       //   if (p.label == organizationData.billingType) {
//       //     currentPlan = p;
//       //   }
//       // });
//       userService.getAllUsersCount().then((userCount) => {
//         // let totalUser = userCount + inviteUsers.recipients.length;
//         // if (totalUser <= currentPlan.maxUsers) {
//           processInviteUsers(inviteUsers, workspaceId, inviteUserPromises, res, next);
//         // } else {
//         //   next(errorMethods.sendBadRequest(errorCode.LIMIT_EXCEEDED));
//         // }
//       });
//     });


// }



async function inviteUsers(req, res, next) {
  logger.info("In inviteUsers route");
  var inviteUsers = req.body;
  var inviteUserPromises = [];

  let currentUser = currentContext.getCurrentContext();
  let workspaceId = currentUser.workspaceId;

  organizationData = await organizationService.getOrganizationByWorkspaceId(workspaceId)
    
      // console.log( organizationData );
      // var currentPlan;
      // plans.forEach(p => {
      //   if (p.label == organizationData.billingType) {
      //     currentPlan = p;
      //   }
      // });
    userCount = await userService.getAllUsersCount()
        // let totalUser = userCount + inviteUsers.recipients.length;
        // if (totalUser <= currentPlan.maxUsers) {
    await processInviteUsers(inviteUsers, workspaceId, res, next);
        // } else {
        //   next(errorMethods.sendBadRequest(errorCode.LIMIT_EXCEEDED));
        // }
      
  


}

// function processInviteUsers(inviteUsers, workspaceId, inviteUserPromises, res, next) {
//   inviteUsers.recipients.forEach(user => {
//     var promise = new Promise((resolve, reject) => {
//       var today =new Date()
//       var userData = {
//         "email": user.email,
//         "firstName": user.firstName,
//         "lastName": user.lastName,
//         "status": "INVITED",
//         "password": "xgEjX5CLQgWFd4YV",
//         "memberType":user.memberType,
//         "role": user.role,
//         "phone": user.phone,
//         "contract":user.contract ? user.contract : {
//           attachments: [] ,ctc: 500,
//             end_date: today,
//             start_date: "2021-08-09T06:19:35.570Z",
//             working_hrs_from: "2021-08-09T10:00:00.570Z",
//             working_hrs_to: "2021-08-09T18:00:00.570Z"
//         },
//         "additionalInfo":user.additionalInfo ? user.additionalInfo : {
//           dateOfBirth: "1990-08-12T06:19:35.570Z", country_code: "+1"
//         },
//         "location": user.location,
//         "timezone": user.timezone,
//         "profileImage": user.profileImage,
//         "dateOfJoining": user.dateOfJoining,
//         "jobTitle": user.jobTitle
//       };
//       //default image
//       if (userData.profileImage == undefined) {
//         userData.profileImage = configResolve.getConfig().defaultUserFileUrlPath;
//       }
//       userService.addUser(userData).then((data) => {
//         var authCode = {};
//         authCode.email = userData.email;
//         authCode.type = 'invite';
//         authCode.workspaceId = workspaceId;
//         authCode.authCode = uuid.v1();
//         userAuthCodeService.addUserAuthCode(authCode).then((result) => {
//           //need to add subdomain url.
//           const workspaceURL = configResolve.getConfig().protocol + currentContext.getCurrentContext().workspaceId + "." + configResolve.getConfig().server_domain;
//           var inviteURL = workspaceURL + "/join/" + authCode.authCode;
//           var messageBody = emailTemplateService.getInviteUserTemplate(userData.email, currentContext.getCurrentContext().workspaceId, inviteURL);
//           var subject = "You are invited to join a "+ configResolve.getConfig().app_name +" workspace";
//           //join
//           let htmlTempalate = commonEmailTemplateService.getInviteUserTemplate(currentContext.getCurrentContext().workspaceId, workspaceURL, inviteURL);
//           mailer.mail(userData.email, subject, messageBody, htmlTempalate);
//           resolve(true);
//         });
//       }).catch((err) => {
//         console.error("Error: " + JSON.stringify(err));
//         reject(err);
//       });
//     });
//     inviteUserPromises.push(promise);
//   });
//   Promise.all(inviteUserPromises).then((response) => {
//     // res.json({ "success": response.success, "message": "Invitation sent!" });
//     console.log()
//     res.send(userData);
//   }).catch((err) => {
//     if (err == errorCode.USER_ALREADY_EXIST) {
//       next(errorMethods.sendBadRequest(err));
//     }
//     else {
//       next(errorMethods.sendServerError(err));
//     }
//   });
// }


function processInviteUsers(inviteUsers, workspaceId, res, next) {
  var promise = new Promise(async(resolve, reject) => {
try{
  
  for(user of inviteUsers.recipients){
    var today =new Date()
    var userData = {
            "email": user.email,
            "firstName": user.firstName,
            "lastName": user.lastName,
            "status": "INVITED",
            "password": "xgEjX5CLQgWFd4YV",
            "memberType":user.memberType,
            "role": user.role,
            "phone": user.phone,
            "contract":user.contract ? user.contract : {
              attachments: [] ,ctc: 500,
                end_date: today,
                start_date: "2021-08-09T06:19:35.570Z",
                working_hrs_from: "2021-08-09T10:00:00.570Z",
                working_hrs_to: "2021-08-09T18:00:00.570Z"
            },
            "additionalInfo":user.additionalInfo ? user.additionalInfo : {
              dateOfBirth: "1990-08-12T06:19:35.570Z", country_code: "+1"
            },
            "location": user.location,
            "timezone": user.timezone,
            "profileImage": user.profileImage,
            "dateOfJoining": user.dateOfJoining,
            "jobTitle": user.jobTitle
          };
          
          //default image
          if (userData.profileImage == undefined) {
            userData.profileImage = configResolve.getConfig().defaultUserFileUrlPath;
          }
          console.log("Reached Here 1")
          var data = await userService.addUser(userData)

          var authCode = {};
        authCode.email = userData.email;
        authCode.type = 'invite';
        authCode.workspaceId = workspaceId;
        authCode.authCode = uuid.v1();
        console.log("Reached Here 2")
        result = await userAuthCodeService.addUserAuthCode(authCode)
        
          //need to add subdomain url.
          const workspaceURL = configResolve.getConfig().protocol + currentContext.getCurrentContext().workspaceId + "." + configResolve.getConfig().server_domain;
          var inviteURL = workspaceURL + "/join/" + authCode.authCode;
          var messageBody = emailTemplateService.getInviteUserTemplate(userData.email, currentContext.getCurrentContext().workspaceId, inviteURL);
          var subject = "You are invited to join a "+ configResolve.getConfig().app_name +" workspace";
          //join
          
          let htmlTempalate = commonEmailTemplateService.getInviteUserTemplate(currentContext.getCurrentContext().workspaceId, workspaceURL, inviteURL);
          mailer.mail(userData.email, subject, messageBody, htmlTempalate);
          res.send(data)
  }
}catch(err){
  
  if (err == errorCode.USER_ALREADY_EXIST) {
    next(errorMethods.sendBadRequest(err));
  }
  else {
   next(errorMethods.sendServerError(err));
  }
}
})
  // inviteUsers.recipients.forEach(user => {
  //   var promise = new Promise((resolve, reject) => {
  //     var today =new Date()
  //     var userData = {
  //       "email": user.email,
  //       "firstName": user.firstName,
  //       "lastName": user.lastName,
  //       "status": "INVITED",
  //       "password": "xgEjX5CLQgWFd4YV",
  //       "memberType":user.memberType,
  //       "role": user.role,
  //       "phone": user.phone,
  //       "contract":user.contract ? user.contract : {
  //         attachments: [] ,ctc: 500,
  //           end_date: today,
  //           start_date: "2021-08-09T06:19:35.570Z",
  //           working_hrs_from: "2021-08-09T10:00:00.570Z",
  //           working_hrs_to: "2021-08-09T18:00:00.570Z"
  //       },
  //       "additionalInfo":user.additionalInfo ? user.additionalInfo : {
  //         dateOfBirth: "1990-08-12T06:19:35.570Z", country_code: "+1"
  //       },
  //       "location": user.location,
  //       "timezone": user.timezone,
  //       "profileImage": user.profileImage,
  //       "dateOfJoining": user.dateOfJoining,
  //       "jobTitle": user.jobTitle
  //     };
  //     //default image
  //     if (userData.profileImage == undefined) {
  //       userData.profileImage = configResolve.getConfig().defaultUserFileUrlPath;
  //     }
  //     userService.addUser(userData).then((data) => {
  //       var authCode = {};
  //       authCode.email = userData.email;
  //       authCode.type = 'invite';
  //       authCode.workspaceId = workspaceId;
  //       authCode.authCode = uuid.v1();
  //       userAuthCodeService.addUserAuthCode(authCode).then((result) => {
  //         //need to add subdomain url.
  //         const workspaceURL = configResolve.getConfig().protocol + currentContext.getCurrentContext().workspaceId + "." + configResolve.getConfig().server_domain;
  //         var inviteURL = workspaceURL + "/join/" + authCode.authCode;
  //         var messageBody = emailTemplateService.getInviteUserTemplate(userData.email, currentContext.getCurrentContext().workspaceId, inviteURL);
  //         var subject = "You are invited to join a "+ configResolve.getConfig().app_name +" workspace";
  //         //join
  //         let htmlTempalate = commonEmailTemplateService.getInviteUserTemplate(currentContext.getCurrentContext().workspaceId, workspaceURL, inviteURL);
  //         mailer.mail(userData.email, subject, messageBody, htmlTempalate);
  //         resolve(true);
  //       });
  //     }).catch((err) => {
  //       console.error("Error: " + JSON.stringify(err));
  //       reject(err);
  //     });
  //   });
  //   inviteUserPromises.push(promise);
  // });
  // Promise.all(inviteUserPromises).then((response) => {
  //   // res.json({ "success": response.success, "message": "Invitation sent!" });
  //   console.log()
  //   res.send(userData);
  // }).catch((err) => {
  //   if (err == errorCode.USER_ALREADY_EXIST) {
  //     next(errorMethods.sendBadRequest(err));
  //   }
  //   else {
  //     next(errorMethods.sendServerError(err));
  //   }
  // });
}

async function inviteMail(req, res, next) {
  try{
  var email = req.body.email
  logger.info("In invite emailing route");
  const workspaceURL = configResolve.getConfig().protocol + currentContext.getCurrentContext().workspaceId + "." + configResolve.getConfig().server_domain;
  var authCode = await userAuthCodeService.search({"email":email}) 
  var user = await userService.searchUsers({"email":email})
  if(user.status == "ACTIVE"){
    res.send("User has already activated their account, try using forgot password")
  }else{
  var inviteURL = workspaceURL + "/join/" + authCode[0].authCode;
  var messageBody = await emailTemplateService.getInviteUserTemplate(email, currentContext.getCurrentContext().workspaceId, inviteURL);
  var subject = "You are invited to join a "+ configResolve.getConfig().app_name +" workspace";
  let htmlTempalate = await commonEmailTemplateService.getInviteUserTemplate(currentContext.getCurrentContext().workspaceId, workspaceURL, inviteURL);
  mailer.mail(email, subject, messageBody, htmlTempalate);
  res.send("ok")
  }
}catch(err){next(errorMethods.sendServerError(err))}
}

async function inviteLinks(req, res, next) {
  try{
    var links =[];
    const workspaceURL = configResolve.getConfig().protocol + currentContext.getCurrentContext().workspaceId + "." + configResolve.getConfig().server_domain;
    var users = await userService.searchUsers({})
    for(user of users){
      if(user.status == "ACTIVE"){
        var inviteURL = "user is already ACTIVATED"
        var tempData = {"userId":user._id, "link":inviteURL}
        links.push(tempData)
      }else{
    var authCode = await userAuthCodeService.search({"email":user.email})
    var code  = Array.isArray(authCode) && authCode.length ? authCode[0].authCode : 'user is already ACTIVATED'
    var inviteURL = workspaceURL + "/join/" + code;
    var tempData = {"userId":user._id, "link":inviteURL}
    links.push(tempData)
      }
    }
  res.send(links)
  }catch(err){next(errorMethods.sendServerError(err))}
  }


  function comparePassword(req, res, next) {
    newPass = req.body.password
    email = req.body.email
    workspace = req.body.workspace
    userService.comparePassword(newPass, email, workspace, next).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }

  async function changePassword(req, res, next) {
    try{
    newPass = req.body.password
    email = req.body.email
    var userData = await userService.getUserByEmail(email)
    if (userData == undefined || userData.length == 0) {
    next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
    }
    userData.password = newPass
    var updatedUser = await userService.updateUser(userData._id, userData)
      res.send(updatedUser);
    }catch(err){
      next(errorMethods.sendServerError(err));
    }
  }

/**
 * archiveUsers a user in workspace api
 * @route POST /api/users/archive
 * @group users - Operations about user
 * @param {object} userData.body.required - user details
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function archiveUsers(req, res, next) {
  logger.info("In archiveUsers route");
  var archiveUsers = req.body;
  userService.archiveUser(archiveUsers).then((data) => {
    res.json({ "success": true, "message": "User archived!" });
  }).catch((err) => {
    next(errorMethods.sendServerError(errorCode.INTERNAL_SERVER_ERROR));
  });
}

/**
 * Get all a user api
 * @route GET /api/users
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getAllUsers(req, res, next) {
  userService.getAllUser().then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get all a user api
 * @route GET /api/users/status/:status
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getAllUsersByStatus(req, res, next) {
  logger.info("In get all user route");
  let status = req.params.status;
  getEmployeeRole().then((employeeRole) => {
    let query = {
      pageNo: 1,
      pageSize: 1000000,
      query: {
        '$and': [{
          'status': status
        }, {
          role: {
            '$eq': employeeRole._id
          }
        }
        ]
      }
    };
    userService.searchUsers(query).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

async function getEmployeeRole() {
  return await roleService.getRoleByRoleName('Resource');
}


/**
 * Get users by role category api
 * @route GET /api/users/role/category/:category
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getUsersByRoleCategory(req, res, next) {
  logger.info("In get all user by role category route");
  let category = req.params.category;
  userService.getUsersByRoleCategory(category).then((data) => {
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get users count api
 * @route GET /api/users/count
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getAllUsersCount(req, res, next) {
  let key = req.query.key;
  let value = req.query.value;
  var query = {};
  if (key != undefined && value != undefined) {
    query[key] = value;
  }

  userService.getAllUsersCount(query).then((data) => {
    if (data == undefined) {
      return next(errorMethods.sendBadRequest(errorCode.TICKET_NOT_EXIST));
    }
    res.send({ 'count': data });
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * @typedef SearchCriteria
 * @property {string} pageSize.required
 * @property {string} pageNo.required 
 * @property {string} query.required 
 */
/**
 * Search users api
 * @route POST /api/users/search
 * @group users - Operations about user
 * @param {SearchCriteria.model} searchCriteria.body.required - SearchCriteria
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function searchUsers(req, res, next) {
  let searchCriteria = req.body;
  userService.searchUsers(searchCriteria).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get users by id api
 * @route GET /api/users/:id
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getUserById(req, res, next) {

  let userId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema, userId, "user");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  userService.getUserById(userId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get users by id api
 * @route GET /api/users/userdetails/:id
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getUserDetailsById(req, res, next) {

  let userId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema, userId, "user");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  userDetailService.getUserDetailsById(userId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Get users by id api
 * @route GET /api/users/performance/:id
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getUserPerformanceById(req, res, next) {

  let userId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema, userId, "user");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  userDetailService.getUserPerformanceById(userId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}




/**
 * Get actvity by usersid api
 * @route GET /api/users/:id
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getActivityByUserId(req, res, next) {

  let userId = req.params.id;

  var json_format = iValidator.json_schema(schema.getSchema, userId, "user");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  userService.getActivityByUserId(userId).then((data) => {
    if (data == undefined || data.size == 0) {
      return next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
    }
    res.send(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}


/**
 * add user api
 * @route POST /api/users
 * @group users - Operations about user
 * @param {object} userData.body.required - user details
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function addUser(req, res, next) {
  var userData = req.body;
  //added check for demo
  userData.demo = false;

  //Validating the input entity
  var json_format = iValidator.json_schema(schema.postSchema, userData, "user");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  userService.addUser(userData).then((data) => {
    res.json(data);
  }).catch((err) => {
    if (err === errorCode.USER_ALREADY_EXIST) {
      return next(errorMethods.sendBadRequest(errorCode.USER_ALREADY_EXIST));
    } else {
      next(errorMethods.sendServerError(err));
    }
  });

}


/**
 * update users by id api
 * @route PUT /api/users
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function updateUser(req, res, next) {
  var userData = req.body;
  var id = req.params.id;
  userService.getUserById(id).then((data) => {
    if (data == undefined || data.length == 0) {
      return next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
    } else {
      userService.updateUser(id, userData).then((data) => {

        res.json(data);
      }).catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    }
  });

}

/**
 * Delete users by id api
 * @route DELETE /api/users/:id
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
async function deleteUser(req, res, next) {
  try{
    var deleteId = req.params.id;
    if( !deleteId ){
      return next(errorMethods.sendBadRequest(errorCode.MISSING_ID))
    } else {
      let userData = await userService.getUserById( deleteId );
      if( userData ){
        let archiveUser = await userService.deleteUser( deleteId, userData );
        return res.json("OK");
      } else {
        return next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
      }
    }
  } catch ( err ){
    next(errorMethods.sendServerError(err));
  }
}

/**
 * get overview of users api
 * @route GET /api/users/overview
 * @group users - Operations about user
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function getAllUsersOverview(req, res, next) {
  let key = req.query.key;
  if( key === undefined ){
    userService.getAllUsersOverview().then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  } else {
    userService.groupByKeyAndCountDocuments(key).then((data) => {
      res.send(data);
    }).catch((err) => {
      next(errorMethods.sendServerError(err));
    });
  }
}

/**
 * Is user exist api
 * @route GET /api/users/exist
 * @group users - Operations about user
 * @param {string} username.query.required - user name
 * @returns {object} 200 - An object of user info
 * @returns {Error}  default - Unexpected error
 */
function isExist(req, res, next) {
  let email = req.query.email;
  var json_format = iValidator.json_schema(schema.existSchema, email, "email");
  if (json_format.valid == false) {
    return res.status(422).send(json_format.errorMessage);
  }
  userService.getEntityByEmail(email).then((data) => {
    if (data != undefined && data.length > 0) {
      res.json({ 'isExist': true });
    } else {
      res.json({ 'isExist': false });
    }
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * Search users api
 * @route GET /api/users/search/text
 * @group users - Operations about users
 * @returns {object} 200 - An object of users info
 * @returns {Error}  default - Unexpected error
 */
function textSearch(req, res, next) {
  let text = req.query.text;
  let status = req.query.status;
  userService.textSearch(text, status).then((data) => {
    res.json(data);
  }).catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

function captureLogoutTime( req, res, next ){
  var user_id = req.params.id;
  userService.getUserById( user_id ).then( userData => {
    if( userData ){
      console.log( userData );
      let userUpdateData = JSON.parse(JSON.stringify( userData ) );
      userUpdateData.loggedOff = new Date();
      userService.updateUser( user_id, userUpdateData ).then( data => {
        return res.json("OK");
      })
      .catch((err) => {
        next(errorMethods.sendServerError(err));
      });
    } else {
      next(errorMethods.sendBadRequest(errorCode.USER_NOT_EXIST));
    }
  })
  .catch((err) => {
    next(errorMethods.sendServerError(err));
  });
}

/**
 * GET MONTHLY COST BY MEMBERTYPE
 * @route GET /api/users/memberTypeCost
 */
function getMonthlyMemberTypeCost( req, res, next ){
  userService.getMonthlyCostByMemberType()
    .then( data => { return res.json( data ) })
    .catch( err => next(errorMethods.sendServerError(err)) ) 
}


function getUserTimeSheetForReports( req, res, next ){
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  userService.getTimeSheetForReports( fromDate, toDate )
    .then( data => { return res.json( data ) })
    .catch( err => next(errorMethods.sendServerError(err)) ) 
}

function userDistPercent( req, res, next ){
  userService.userDistPercent()
    .then( data => { return res.json( data ) })
    .catch( err => next(errorMethods.sendServerError(err)) ) 
}

function distCount( req, res, next ){
  userService.distCount()
    .then( data => { return res.json( data ) })
    .catch( err => next(errorMethods.sendServerError(err)) ) 
}


function resourceSummary( req, res, next ){
  userService.resourceSummary()
    .then( data => { return res.json( data ) })
    .catch( err => next(errorMethods.sendServerError(err)) ) 
}

function avgUtilRate( req, res, next ){
  let from = req.query.from;
  let to = req.query.to;
  userService.avgUtilRate(from,to)
    .then( data => { return res.json( data ) })
    .catch( err => next(errorMethods.sendServerError(err)) ) 
}

function summaryTab( req, res, next ){
  let from = req.query.from;
  let to = req.query.to;
  userService.summaryTab(from, to)
  .then( data => { return res.json( data ) })
  .catch( err => next(errorMethods.sendServerError(err)) ) 
 }

module.exports.init = init;
