const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
// const Priority = require('../../common/constants/Priority');
// const TicketType = require('../../common/constants/TicketType');
var uniqueValidator = require('mongoose-unique-validator');
const ScheduleType = require('../../common/constants/ScheduleType');

var modelName = 'Schedules';

const scheduleSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  groupId:{
    type:String,
    required:true
  },
  bookingName:{
    type:String,
    required:true
  },
  assignedTo:{
    type:String,
    ref:'Users',
    required:true
  },
  task:{
    type:String,
    ref:'Tasks' 
  },
  fromDate:{
    type:Date,
    required:true
  },
  toDate:{
    type:Date,
    required:true
  },
  fromTime:{
    type:Date,
    required:true
  },
  toTime:{
    type:Date,
    required:true
  },
  taskColor:{
    required:true,
    type:String
  },
  emoji:{
    type:String
  },
  bookedBy:{
    type:String,
    ref:'Users',
    //required:true
  },
  type:{
      type: String,
      required: true,
      enum: Object.values(ScheduleType)
  },
  createdBy: {
    type: String,
    required: true
  },
  lastModifiedBy: {
    type: String,
    required: true
  }
}, { timestamps: true });

scheduleSchema.plugin(uniqueValidator);

scheduleSchema.statics = {


  getById: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id)
    .populate({ 
      path:'task',
      populate:{
        path:'project',
        model:'Projects'
      }
});
  },
  search: function(query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate({ 
      path:'task',
      populate:{
        path:'project',
        model:'Projects'
      }
});
  },
  searchOne: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query).populate({ 
      path:'task',
      populate:{
        path:'project',
        model:'Projects'
      }
});
  },
  updateById: function(id, updateData) {
    var context = currentContext.getCurrentContext();
    var options = { new: true };
    return this.db.useDb(context.workspaceId).model(modelName).findOneAndUpdate({ _id: id }, { $set: updateData }, options);
  },
  deletebyId: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findByIdAndDelete(id);
  },
  deleteByGroupId: function ( group_id ){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).deleteMany({ groupId: group_id });
  },
  create: function(data) {
    var context = currentContext.getCurrentContext();
    var entityModel = this.db.useDb(context.workspaceId).model(modelName);
    var entity = new entityModel(data);
    return entity.save();
  },
  createEmptyCollection: function(){
    var context = currentContext.getCurrentContext();
    this.db.useDb(context.workspaceId).model(modelName).createCollection();
    this.db.useDb(context.workspaceId).model(modelName).createIndexes();
  },
  getPaginatedResult: function (query, options) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options)
    .populate({ 
      path:'task',
      populate:{
        path:'project',
        model:'Projects'
      }
});
  },
  countDocuments: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  globalAggregateFunction : function ( query ){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate(query);
  },
 
//NEW FUNC FOR schedulebyres W/O SPRINTS&MODULES

scheduleByRes: function(){
  var context = currentContext.getCurrentContext();
  return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$lookup:{from:"users",localField:"assignedTo",foreignField:"_id",as:"resources"}},
    {$lookup:{from:"projects",localField:"project",foreignField:"_id",as:"project"}},
    {$lookup:{from:"tasks",localField:"task",foreignField:"_id",as:"task"}},
    {$group:{_id:"$resources", data:{$push:"$$ROOT"}}},
    {$project:{"data.resources":0}}
    ]);
},

collaborators: function(taskId){
  var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"task":taskId}},
      {$lookup:{from:"users",localField:"assignedTo",foreignField:"_id",as:"resource"}},
      {$project:{"resource": 1, "_id":0}},
      {$group:{"_id":"$resource"}}]);
},

  //NEW FUNC FOR TODAY'S TASKS W/O sprints&modules

  getTodaysTasks: function(todaysDate, userId){
  var context = currentContext.getCurrentContext();
  return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$lookup:{from: "tasks", localField:"task", foreignField:"_id", as:"taskdata"}},
    {$lookup:{from: "projects", localField:"project", foreignField:"_id", as:"projectdata"}},
    {$match:{"assignedTo":userId}},
    {$addFields:{"toDayOfYear":{$dayOfYear:"$toDate"},"fromDayOfYear":{$dayOfYear:"$fromDate"}}},
    {$project:{"task":0, "project":0}},
    {$match:{$and:[{"fromDayOfYear":{$eq:todaysDate}}, {"toDayOfYear":{$eq:todaysDate}}]}},
    {$project:{"fromDayOfYear":0, "toDayOfYear":0}}
    ]);

},

  plannedHoursByTask: function(taskId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"task":taskId}},
      {$addFields:{"difference":{$subtract:["$toTime","$fromTime"]}}},
      {$addFields:{"time":{$divide:["$difference",3.6e+6]}}},
      {$group:{_id:"",total:{$sum:"$time"}}}
      ])
  },
  totalUsersOnTask: function(taskId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$match:{"task":taskId}},
    {$group:{_id:"$assignedTo"}},
    {$group:{_id:"",count:{$sum:1}}} ]);
      },
  scheduledUserHours : function(userId, from, to){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{assignedTo: userId}},
      {$match:{$and:[{"fromDate":{$gte:new Date(from)}}, {"toDate":{$lte:new Date(to)}}]}},
      {$addFields:{milli:{$subtract:["$toTime","$fromTime"]}}},
      {$addFields:{hours:{$divide:["$milli",3.6e+6]}}},
      {$group:{_id:"$assignedTo", totalHours:{$sum:"$hours"}}}
      ])
  },
  //**has dependency on status - 7 - DONE
  assignedHoursOfUserOnTasks: function(userId, from, to){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{assignedTo: userId}},
      {$match:{$and:[{"fromDate":{$gte:new Date(from)}}, {"toDate":{$lte:new Date(to)}}]}},
      {$addFields:{milli:{$subtract:["$toTime","$fromTime"]}}},
      {$addFields:{hours:{$divide:["$milli",3.6e+6]}}},
      {$lookup:{from:"tasks",localField:"task",foreignField:"_id",as:"taskdata"}},
      {$unwind:"$taskdata"},
      {$group:{_id:"$assignedTo", totalHours:{$sum:"$hours"}}}
      ])
  },

  assignedHoursOfUserOnProject: function(resourceId, projectId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{assignedTo: resourceId}},
      {$addFields:{milli:{$subtract:["$toTime","$fromTime"]}}},
      {$addFields:{hours:{$divide:["$milli",3.6e+6]}}},
      {$lookup:{from:"tasks",localField:"task",foreignField:"_id",as:"taskdata"}},
      {$unwind:"$taskdata"},
      {$lookup:{from:"projects",localField:"taskdata.project",foreignField:"_id",as:"projectdata"}},
      {$unwind:"$projectdata"},{$match:{"projectdata._id": projectId}},
      {$group:{_id:"$taskdata._id",hoursAssignedToUser:{$sum:"$hours"}}},
      {$group:{_id:"",total:{$sum:"$hoursAssignedToUser"},count:{$sum:1} }},
      {$addFields:{avgHoursAssignedToUser:{$divide:["$total","$count"]}}},
      {$project:{"avgHoursAssignedToUser":1,"_id":0}}
      ])
  },
  
  //NEW FUNC FOR TODAY TIMESHEET W/O SPRINTS AND MODULES

  getTodayTimesheet: function(todaysDate, member){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$facet:{"data":[
      {$addFields:{"fromDay":{$dayOfYear:"$fromDate"}}},
      {$match:{"fromDay":todaysDate}},
      {$addFields:{"toDayOfYear":{$dayOfYear:"$toDate"},"fromDayOfYear":{$dayOfYear:"$fromDate"}}},
      {$match:{$and:[{"fromDayOfYear":{$eq:todaysDate}}, {"toDayOfYear":{$eq:todaysDate}}]}},
      {$match:{"assignedTo":member}},
      {$lookup:{from:"tasks",localField:"task",foreignField:"_id",as:"taskofschedule"}},
      {$unwind:{path:"$taskofschedule",preserveNullAndEmptyArrays:true}},
      {$lookup:{from:"projects",localField:"taskofschedule.project",foreignField:"_id",as:"projectofmodule"}},
      {$addFields:{"taskName":"$taskofschedule.name","tasksubtractdays":{$subtract:["$$NOW","$taskofschedule.endDate"]},"projectName":{$arrayElemAt:["$projectofmodule.name",0]},"plannedhours":{$subtract:["$toTime","$fromTime"]}}},
      {$addFields:{"plannedHours":{$divide:["$plannedhours",3.6e+6]}, "taskdeadline":{$divide:["$tasksubtractdays",8.64e+7]}}},
      {$project:{"plannedhours":0,"taskofschedule":0, "projectofmodule":0, "project":0,"task":0, "tasksubtractdays":0}},
      {$group:{_id:"$groupId","scheduleId":{$first:"$_id"},"groupId":{$first:"$groupId"},"bookingName":{$first:"$bookingName"}, "fromTime":{$first:"$fromTime"},"toTime":{$first:"$toTime"},"taskName":{$first:"$taskName"},"projectName":{$first:"$projectName"},"plannedHours":{$first:"$plannedHours"},"taskdeadline":{$first:"$taskdeadline"}, endDate:{$min:"$fromDate"}, startDate:{$max:"$toDate"}}},
      {$addFields:{"totalassignedhours":{$subtract:["$startDate","$endDate"]}}},
      {$addFields:{"assignedhours":{$divide:["$totalassignedhours",3.6e+6]}}},
      {$project:{"_id":0, "totalassignedhours":0}}],
      "dates":[{$group:{_id:"$groupId", endDate:{$min:"$fromDate"}, startDate:{$max:"$toDate"}}},
      {$addFields:{"totalassignedhours":{$subtract:["$startDate","$endDate"]}}},
      {$addFields:{"assignedhours":{$divide:["$totalassignedhours",3.6e+6]}}},{$project:{"totalassignedhours":0}}]}}]);
  },

//NEW FUNC FOR NEWTIMESHEET W/O SPRINTS AND MODULES

getNewTodayTimesheet: function(todaysDate, member){
  var context = currentContext.getCurrentContext();
  var date = parseInt(todaysDate);
  return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$addFields:{"toDayOfYear":{$dayOfYear:"$toDate"},"fromDayOfYear":{$dayOfYear:"$fromDate"}}},
    {$match:{"fromDayOfYear":date}},
    {$match:{"assignedTo":member}},
    {$lookup:{from:"tasks",localField:"task",foreignField:"_id",as:"taskofschedule"}},
    {$unwind:{path:"$taskofschedule",preserveNullAndEmptyArrays:true}},
    {$lookup:{from:"projects",localField:"taskofschedule.project",foreignField:"_id",as:"projectofmodule"}},
    {$addFields:{"taskName":"$taskofschedule.name","tasksubtractdays":{$subtract:["$$NOW","$taskofschedule.endDate"]},"projectName":{$arrayElemAt:["$projectofmodule.name",0]},"plannedhours":{$subtract:["$toTime","$fromTime"]}}},
    {$addFields:{"plannedHours":{$divide:["$plannedhours",3.6e+6]}, "taskdeadline":{$divide:["$tasksubtractdays",8.64e+7]}}},
    {$project:{"plannedhours":0,"taskofschedule":0,"projectofmodule":0, "project":0, "task":0, "tasksubtractdays":0}},
    {$group:{_id:"$groupId","scheduleId":{$first:"$_id"},"groupId":{$first:"$groupId"},"bookingName":{$first:"$bookingName"}, "fromTime":{$first:"$fromTime"},"toTime":{$first:"$toTime"},"taskName":{$first:"$taskName"},"projectName":{$first:"$projectName"},"plannedHours":{$first:"$plannedHours"},"taskdeadline":{$first:"$taskdeadline"}, endDate:{$min:"$fromDate"}, startDate:{$max:"$toDate"}}},
    {$addFields:{"totalassignedhours":{$subtract:["$startDate","$endDate"]}}},
    {$addFields:{"assignedhours":{$divide:["$totalassignedhours",3.6e+6]}}},
    {$project:{"_id":0, "totalassignedhours":0}}
    ]);
},

//NEW TIMESHEET RANGE FUNC W/O SPRINTS AND MODULES

timesheetWithRange: function(date){
  var context = currentContext.getCurrentContext();
  return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$lookup:{from:"tasks",localField:"task",foreignField:"_id",as:"taskofschedule"}},
    {$unwind:{path:"$taskofschedule",preserveNullAndEmptyArrays:true}},
    {$lookup:{from:"projects",localField:"taskofschedule.project",foreignField:"_id",as:"projectofmodule"}},
    {$addFields:{"taskName":"$taskofschedule.name","projectName":{$arrayElemAt:["$projectofmodule.name",0]}}},
    {$project:{"plannedhours":0,"taskofschedule":0, "projectofmodule":0, "project":0,"task":0}},
    {$group:{_id:"$groupId","groupId":{$first:"$groupId"},"bookingName":{$first:"$bookingName"}, "fromTime":{$first:"$fromTime"},"toTime":{$first:"$toTime"},"taskName":{$first:"$taskName"},"projectName":{$first:"$projectName"},startDate:{$max:"$toDate"}, endDate:{$min:"$fromDate"} }},
    {$match:{startDate:{$lte: new Date(date)}}}])
},

  scheduleByGroup:function(groupId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"groupId":groupId}},
      {$addFields:{"date":"$fromDate","plannedhours":{$subtract:["$toTime","$fromTime"]}}},
      {$addFields:{"plannedHours":{$divide:["$plannedhours",3.6e+6]}}},
      {$project:{"date":1, "plannedHours":1}},{$sort:{date:1}}]);
    },
  getGroupsInRange: function(startDate, endDate, member){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{fromDate:{$gte:new Date(startDate), $lte: new Date(endDate)}}},
      {$match:{"assignedTo":member}},
      {$group:{_id:"$groupId", "fromDate":{$first:"$fromDate"}}},
      {$project:{"groupId":"$_id"}},
      {$project:{"_id":0}}
      ])
    },
  groupBucket: function(group,startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"groupId":group}},
      {$addFields:{"date":"$fromDate","plannedhours":{$subtract:["$toTime","$fromTime"]}}},
      {$addFields:{"plannedHours":{$divide:["$plannedhours",3.6e+6]}}},
      {$project:{"date":1, "plannedHours":1, "groupId":1}},
      {$bucket:{groupBy:"$date",boundaries:[new Date(startDate), new Date(endDate)],default: "Other",output:{"data": {$push:{"date":"$date","plannedHours":"$plannedHours","scheduleId":"$_id","groupId":"$groupId"}}}}},
      {$sort:{date:1}}])
  },

//NEW FUNC FOR GETGROUP DATA W/O SPRINTS & MODULES
    getGroupData: function(group){
      var context = currentContext.getCurrentContext();
      return this.db.useDb(context.workspaceId).model(modelName).aggregate([
        {$match:{"groupId":group}},
        {$lookup:{from:"tasks",localField:"task",foreignField:"_id",as:"taskofschedule"}},
        {$unwind:{path:"$taskofschedule",preserveNullAndEmptyArrays:true}},
        {$lookup:{from:"projects",localField:"taskofschedule.project",foreignField:"_id",as:"projectofmodule"}},
        {$addFields:{"taskName":"$taskofschedule.name","projectName":{$arrayElemAt:["$projectofmodule.name",0]}}},
        {$project:{"plannedhours":0,"taskofschedule":0, "projectofmodule":0, "project":0,"task":0}},
        {$group:{_id:"$groupId","groupId":{$first:"$groupId"},"bookingName":{$first:"$bookingName"}, "fromTime":{$first:"$fromTime"},"toTime":{$first:"$toTime"},"taskName":{$first:"$taskName"},"projectName":{$first:"$projectName"},startDate:{$max:"$toDate"}, endDate:{$min:"$fromDate"} }}
        ])
      },

  //NEW FUNC FOR GROUPBYRESOURCE W/O SPRINTS&MODULES
//**has dependency on status - 8
  taskGroupByResource: function(resource){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"assignedTo":resource}},
      {$lookup:{from:"tasks",localField:"task",foreignField:"_id",as:"taskofschedule"}},
            {$unwind:{path:"$taskofschedule", preserveNullAndEmptyArrays:true}},
            {$lookup:{from:"projects",localField:"taskofschedule.project",foreignField:"_id",as:"projectofmodule"}},
            {$unwind:{path:"$projectofmodule",preserveNullAndEmptyArrays:true}},
            {$group:{_id:"$taskofschedule.priority", count:{$sum:1} }}
      ])
  }

}

const Schedule = mongoose.model(modelName, scheduleSchema);

module.exports = Schedule;