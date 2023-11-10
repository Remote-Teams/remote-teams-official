require('./passport');

const api = require('./api-config');
const express = require("express");
const app = api.app;
const path  = require('path');
const logger = require('../config/winston')(__filename);
const Boom = require('boom')
const passport = require('passport');

var Multer = require("multer");
var Minio = require("minio");
var configResolve = require("../common/configResolver");
var minioConfig = configResolve.getConfig().minio;
var environmentConfig = configResolve.getConfig();
 
const tokenPareUtil = require('../common/tokenParserUtil')
const UserRoute = require('../api/routes/user.route');
const OrganizationRoute = require('../api/routes/organization.route');
const roleRoute = require('../api/routes/role.route');
const secureRoute = require('../api/routes/secure.route');
const graphRoute = require('../api/routes/graph.route');
const leaveRoute = require('../api/routes/leave.route');
const activityRoute = require('../api/routes/activity.route');
const noteRoute = require('../api/routes/note.route');
var vaultRoute = require('../api/routes/vault.route');
var emailRoute = require('../api/routes/email.route');
var worklogRoute = require('../api/routes/worklog.route');
var widgetRoute = require('../api/routes/widget.route');
var dashboardRoute = require('../api/routes/dashboard.route');
var emailTemplateRoute = require('../api/routes/emailTemplate.route');
var chatRoute = require('../api/routes/chat.route');
var notificationRoute = require('../api/routes/notification.route');
var calenderRoute = require('../api/routes/calender.route');
var memberdayoffRoute = require('../api/routes/memberdayoff.route');
var workinghourRoute = require('../api/routes/workinghour.route');
var projectRoute = require('../api/routes/project.route');
var clientRoute = require('../api/routes/client.route');
var expenseRoute = require('../api/routes/expense.route');
var invoiceRoute = require('../api/routes/invoice.route');
var expenseSubscriptionRoute = require('../api/routes/expenseSubscription.route');
var taskRoute = require('../api/routes/task.route');
var scrumRoute = require('../api/routes/scrum.route');
var todoRoute = require('../api/routes/todo.route');
var discussionRoute = require('../api/routes/discussion.route');
var ticketRoute = require('../api/routes/ticket.route');
var meetingRoute = require('../api/routes/meeting.routes');
var faqsRoute = require('../api/routes/faq.route');
var supportRoute = require('../api/routes/support.route');
var fileRoute = require('../api/routes/file.route');
var scheduleRoute = require('../api/routes/schedule.route');
var folderRoute = require('../api/routes/folder.route');
var proposalRoute = require('../api/routes/proposal.route');
var workboardRoute = require('../api/routes/workboard.route');
var pinRoute = require('../api/routes/pin.route')
var stripeRoute = require('../api/routes/stripe.route');
var pipelineRoute = require('../api/routes/pipeline.route')
var stageRoute = require('../api/routes/stage.route')
var workflowRoute = require('../api/routes/workflow.route')
var wstepRoute = require('../api/routes/wstep.route')
var wtaskRoute = require('../api/routes/wtask.route')
var wsubtaskRoute = require('../api/routes/wsubtask.route')
var winstanceRoute = require('../api/routes/winstance.route');
var fieldRoute = require('../api/routes/field.route');
var fvalueRoute = require('../api/routes/fvalue.route');
var docRoute = require('../api/routes/doc.route');
/*DECLARE ROUTES END*/

const router = express.Router();
app.use('/api', passport.authenticate('jwt', {session: false}), router);
UserRoute.init(router);
OrganizationRoute.init(router);
roleRoute.init(router);
secureRoute.init(router);
graphRoute.init(router);
leaveRoute.init(router);
activityRoute.init(router);
noteRoute.init(router);
vaultRoute.init(router);
emailRoute.init(router);
worklogRoute.init(router);
widgetRoute.init(router);
dashboardRoute.init(router);
emailTemplateRoute.init(router);
chatRoute.init(router);
notificationRoute.init(router);
calenderRoute.init(router);
memberdayoffRoute.init(router);
workinghourRoute.init(router);
projectRoute.init(router);
clientRoute.init(router);
expenseRoute.init(router);
invoiceRoute.init(router);
expenseSubscriptionRoute.init(router);
taskRoute.init(router);
scrumRoute.init(router);
todoRoute.init(router);
discussionRoute.init(router);
ticketRoute.init(router);
meetingRoute.init(router);
faqsRoute.init(router);
supportRoute.init(router);
fileRoute.init(router);
scheduleRoute.init(router);
folderRoute.init(router);
proposalRoute.init(router);
workboardRoute.init(router);
pinRoute.init(router);
stripeRoute.init(router);
pipelineRoute.init(router);
stageRoute.init(router);
workflowRoute.init(router);
wstepRoute.init(router);
wtaskRoute.init(router);
wsubtaskRoute.init(router);
winstanceRoute.init(router);
fieldRoute.init(router);
fvalueRoute.init(router);
docRoute.init(router);
/*INIT ROUTES END*/

const public = require('../api/routes/public.route');
app.use('/public', public);

//set static folder
app.use('/' ,express.static(path.join(__dirname.replace("config",""), 'public')));

// index route
app.get('/', (req,res) => {
    res.send('hello world');
});


app.all('*',(req,res, next) => {
    return next(Boom.notFound('Invalid Request'));
});

app.use((err, req, res, next) => {
    console.error("Error: " + err);
    return res.status(err.output != undefined ? err.output.statusCode : 500).json(err.output != undefined ? err.output.payload : { error : err.message });
})

const routerConfig = {
    app: app
}

module.exports = routerConfig;
