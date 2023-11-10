const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const WorklogCategory = require('../../common/constants/WorklogCategory');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Worklogs';

const worklogSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  name:{
    type: String,
    required: true
  },
  description:{
    type: String
  },
  schedule: {
    type: String,
    ref: 'Schedules'
  },
  task:{
    type: String,
    ref: 'Tasks',
  },
  user: {
    type: String,
    ref: 'Users',
    required: true,
    index: true
  },
  hours:{
    type: Number,
    required: true
  },
  date:{
    type:Date
  },
  fromTime:{
    type:Date
  },
  toTime:{
    type:Date
  },
  category:{
    type: String,
    required: true,
    enum: Object.values(WorklogCategory)
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

worklogSchema.plugin(uniqueValidator);

worklogSchema.statics = {


  getById: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id).populate({path:'task',populate:{path:'project', model:'Projects'}}).populate('schedule');
  },
  search: function(query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate({path:'task',populate:{path:'project', model:'Projects'}}).populate('schedule');
  },
  searchOne: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query).populate({path:'task',populate:{path:'project', model:'Projects'}}).populate('schedule');
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
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options).populate({path:'task',populate:{path:'project', model:'Projects'}}).populate('schedule');
  },
  countDocuments: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  getTotalHours : function (userId) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"user":userId}},
      {$group:{"_id":"$schedule", "totalhours":{$sum:"$hours"}}}
      ]);
    },
  worklogByScheduleId: function(scheduleId){
      var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne({"schedule":scheduleId})
    },
  hoursWithUserAndSchedule: function(userId, scheduleId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"user":userId}},
      {$group:{"_id":"$schedule", "totalhours":{$sum:"$hours"}}},
      {$match:{"_id":scheduleId}}
      ]);
  },

//**NEW FUNC FOR COST VARIANCE W/O SPRINTS AND MODULES */

costVariance: function(projectId){
  var context = currentContext.getCurrentContext();
  return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$lookup:{from:"users", localField:"user", foreignField:"_id", as:"userdata"}},
    {$lookup:{from:"schedules", localField:"schedule", foreignField:"_id", as:"scheduleofworklog"}},
    {$unwind:{path:"$scheduleofworklog",preserveNullAndEmptyArrays:true}},
    {$lookup:{from:"tasks", localField:"scheduleofworklog.task", foreignField:"_id", as:"taskofschedule"}},
    {$unwind:{path:"$taskofschedule", preserveNullAndEmptyArrays:true}},
    {$lookup:{from:"projects", localField:"taskofschedule.project", foreignField:"_id", as:"project"}},
    {$unwind:{path:"$project", preserveNullAndEmptyArrays:true}},
    {$match:{"project._id":projectId}},
    {$addFields:{"rough":"$userdata.contract.ctc"}},
    {$addFields:{"userHourlyRate":{$arrayElemAt:["$rough",0]}}},
    {$addFields:{"costForWork":{$multiply:["$userHourlyRate","$hours"]}}},
    {$group:{_id:{$month:"$createdAt"}, data:{$push:"$$ROOT"}, count:{$sum:1},monthlyCostForProjectWork:{$sum:"$costForWork"}}},
    {$project:{_id:1, "monthlyCostForProjectWork":1, "month":{$switch:{branches:[
    {case:{$eq:["$_id",1]}, then:"jan"}, {case:{$eq:["$_id",2]}, then:"feb"}, {case:{$eq:["$_id",3]}, then:"mar"}, {case:{$eq:["$_id",4]}, then:"apr"},
    {case:{$eq:["$_id",5]}, then:"may"}, {case:{$eq:["$_id",6]}, then:"jun"}, {case:{$eq:["$_id",7]}, then:"jul"}, {case:{$eq:["$_id",8]}, then:"aug"},
    {case:{$eq:["$_id",9]}, then:"sep"}, {case:{$eq:["$_id",10]}, then:"oct"}, {case:{$eq:["$_id",11]}, then:"nov"}, {case:{$eq:["$_id",12]}, then:"dec"}]}}}},
    {$sort:{_id:1}}
    ]);
},

//NEW FUNC FOR ACTUAL COST W/O SPRINTS AND MODULES

getActualCost: function(projectId){
  var context = currentContext.getCurrentContext();
  return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$lookup:{from:"users", localField:"user", foreignField:"_id", as:"userdata"}},
    {$lookup:{from:"schedules", localField:"schedule", foreignField:"_id", as:"scheduleofworklog"}},
    {$unwind:{path:"$scheduleofworklog",preserveNullAndEmptyArrays:true}},
    {$lookup:{from:"tasks", localField:"scheduleofworklog.task", foreignField:"_id", as:"taskofschedule"}},
    {$unwind:{path:"$taskofschedule", preserveNullAndEmptyArrays:true}},
    {$lookup:{from:"projects", localField:"taskofschedule.project", foreignField:"_id", as:"project"}},
    {$unwind:{path:"$project", preserveNullAndEmptyArrays:true}},
    {$match:{"project._id":projectId}},
    {$addFields:{"rough":"$userdata.contract.ctc"}},
    {$addFields:{"userHourlyRate":{$arrayElemAt:["$rough",0]}}},
    {$addFields:{"costForWork":{$multiply:["$userHourlyRate","$hours"]}}},
    {$group:{_id:{$week:"$createdAt"}, data:{$push:"$$ROOT"}, count:{$sum:1},weeklyCostForProjectWork:{$sum:"$costForWork"}}}
    ]);
},

  //NEW FUNC FOR ACTUAL HOURS W/O SPRINTS AND MODULES

  getActualHours: function(projectId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"users", localField:"user", foreignField:"_id", as:"userdata"}},
      {$lookup:{from:"schedules", localField:"schedule", foreignField:"_id", as:"scheduleofworklog"}},
      {$unwind:{path:"$scheduleofworklog",preserveNullAndEmptyArrays:true}},
      {$lookup:{from:"tasks", localField:"scheduleofworklog.task", foreignField:"_id", as:"taskofschedule"}},
      {$unwind:{path:"$taskofschedule", preserveNullAndEmptyArrays:true}},
      {$lookup:{from:"projects", localField:"taskofschedule.project", foreignField:"_id", as:"project"}},
      {$unwind:{path:"$project", preserveNullAndEmptyArrays:true}},
      {$match:{"project._id":projectId}},
      {$group:{_id:{$week:"$createdAt"}, data:{$push:"$$ROOT"}, count:{$sum:1}, hoursPerWeek:{$sum:"$hours"} }}
      ]);
  },

  //NEW FUNC FOR hours&cost W/O SPRINTS AND MODULES
  hoursAndCost: function(projectId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"users", localField:"user", foreignField:"_id", as:"userdata"}},
      {$lookup:{from:"schedules", localField:"schedule", foreignField:"_id", as:"scheduleofworklog"}},
      {$unwind:{path:"$scheduleofworklog",preserveNullAndEmptyArrays:true}},
      {$lookup:{from:"tasks", localField:"scheduleofworklog.task", foreignField:"_id", as:"taskofschedule"}},
      {$unwind:{path:"$taskofschedule", preserveNullAndEmptyArrays:true}},
      {$lookup:{from:"projects", localField:"taskofschedule.project", foreignField:"_id", as:"project"}},
      {$unwind:{path:"$project", preserveNullAndEmptyArrays:true}},
      {$match:{"project._id":projectId}},
      {$addFields:{"rough":"$userdata.contract.ctc"}},
      {$addFields:{"userHourlyRate":{$arrayElemAt:["$rough",0]}}},
      {$addFields:{"costForWork":{$multiply:["$userHourlyRate","$hours"]}}},
      {$group:{_id:"", data:{$push:"$$ROOT"}, count:{$sum:1},costForProject:{$sum:"$costForWork"}, totalHours:{$sum:"$hours"}}}
      ]);

  },

  hoursByMemberType: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"users",localField:"user", foreignField:"_id",as:"userdata"}},
      {$group:{_id:"$userdata.memberType", hours:{$sum:"$hours"}}},
      {$addFields:{"type":{$arrayElemAt:["$_id",0]}}},
      {$project:{_id:0}}
        ])
  },
  memMonthHours: function(from, to){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"users",localField:"user", foreignField:"_id",as:"userdata"}},
     {$match:{createdAt:{$gt:new Date(from), $lt:new Date(to)}}},
      {$group:{_id:"$userdata.memberType", hours:{$sum:"$hours"}}},
      {$addFields:{type:{$arrayElemAt:["$_id",0]}}},
      {$project:{_id:0}}
        ])
  },
  hoursByUser: function(userId, from,to){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"users",localField:"user", foreignField:"_id",as:"userdata"}},
      {$match:{createdAt:{$gt:new Date(from), $lt:new Date(to)}}},
      {$match:{user:userId}},
      {$group:{_id:"", hours:{$sum:"$hours"}}}
        ])
  },
 actualHoursByTask: function(taskId){
  var context = currentContext.getCurrentContext();
  return this.db.useDb(context.workspaceId).model(modelName).aggregate([
  {$lookup:{from:"schedules",localField:"schedule",foreignField:"_id",as:"scheduledata"}},
  {$unwind:"$scheduledata"},
  {$lookup:{from:"tasks",localField:"scheduledata.task",foreignField:"_id",as:"taskdata"}},
  {$match:{"taskdata._id":taskId}},
  {$group:{_id:"",total:{$sum:"$hours"}}}]);
      },

  //THIS FUNC HAS BEEN CHANGED SLIGHTLY TO REMOVE DEPENDENCE ON TASK STATUS
  
  recordedHoursOfUserOnTask: function(userId, from, to){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$match:{"user":userId}},{$match:{createdAt:{$gt:new Date(from), $lt: new Date(to)}}},
    {$lookup:{from:"schedules",localField:"schedule",foreignField:"_id",as:"scheduledata"}},
    {$unwind:"$scheduledata"},
    {$lookup:{from:"tasks",localField:"scheduledata.task",foreignField:"_id",as:"taskdata"}},
    {$unwind:"$taskdata"},{$group:{_id:"$taskdata._id",hoursRecordedByUserForTask:{$sum:"$hours"}}},
    {$group:{_id:"",total:{$sum:"$hoursRecordedByUserForTask"},count:{$sum:1} }},
    {$addFields:{avgHoursRecordedByUserForTasks:{$divide:["$total","$count"]}}},
    {$project:{"avgHoursRecordedByUserForTasks":1,"_id":0}}
    ])
  },
  recordedHoursOfUserOnProject: function(resourceId, projectId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"user":resourceId}},
      {$lookup:{from:"tasks",localField:"task",foreignField:"_id",as:"taskdata"}},
      {$unwind:"$taskdata"},
      {$match:{"taskdata.project":projectId}},
      {$lookup:{from:"projects",localField:"taskdata.project",foreignField:"_id",as:"projectdata"}},
      {$unwind:"$projectdata"},
      {$group:{_id:"$taskdata._id",hoursRecordedByUserForProject:{$sum:"$hours"}}},
      {$group:{_id:"",total:{$sum:"$hoursRecordedByUserForProject"},count:{$sum:1} }},
      {$addFields:{avgHoursRecordedByUserForProject:{$divide:["$total","$count"]}}},
      {$project:{"avgHoursRecordedByUserForProject":1,"_id":0}}
      ])
  },
  recordedHoursOfGroup:function(groupId){
    var context = currentContext.getCurrentContext();
  return this.db.useDb(context.workspaceId).model(modelName).aggregate([
  {$lookup:{from: "schedules",localField: "schedule",foreignField: "_id",as: "scheduleofworklog"}},
  {$unwind:{path:"$scheduleofworklog", preserveNullAndEmptyArrays: true}},
  {$group:{_id:"$scheduleofworklog.groupId", count:{$sum:1}, recordedhours:{$sum:"$hours"}}},
  {$match:{"_id":groupId}},{$project:{"_id":0,"count":0}}
    ]);
  },
  totalHoursOnTask:function(taskId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$match:{"task" : taskId}},{$group:{_id:"$task", total:{$sum:"$hours"}}}]);
  },
  weekTS: function(startDate, endDate, member){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"user" : member}},
      {$lookup:{from: "schedules", localField:"schedule", foreignField:"_id", as:"scheduledata"}},
      {$lookup:{from:"tasks", localField:"task", foreignField:"_id", as:"taskdata"}},
      {$unwind:{path:"$taskdata", preserveNullAndEmptyArrays:true}},
      {$lookup:{from:"projects", localField:"taskdata.project", foreignField:"_id", as:"projectdata"}},
      {$unwind:{path:"$project", preserveNullAndEmptyArrays:true}},
      {$sort:{fromTime:1}},
      {$bucket:{groupBy:"$date",boundaries:[new Date(startDate),new Date(endDate)],default: "Other", output:{"date":{$first:"$date"},"data": {$push:{"name":"$name","user":"$user","fromTime":"$fromTime","toTime":"$toTime","hours":"$hours","scheduledata":"$scheduledata","taskdata":"$taskdata","projectdata":"$projectdata","category":"$category","date":"$date","_id":"$_id"}}}}},
      {$match:{$and:[{"date":{$lte:new Date(endDate)}}, {"date":{$gte:new Date(startDate)}}]}},
      {$project:{_id:0, date:0}}
      ])
  },
  hoursByUserAndProject:function(resourceId, projectId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"user" : resourceId}},
      {$lookup:{from: "tasks", localField:"task", foreignField:"_id", as:"taskdata"}},
      {$unwind:{path:"$taskdata", preserveNullAndEmptyArrays:true}},
      {$lookup:{from: "projects", localField:"taskdata.project", foreignField:"_id", as:"projectdata"}},
      {$unwind:{path:"$projectdata", preserveNullAndEmptyArrays:true}},
      {$match:{"projectdata._id" : projectId}},{$group:{_id:"$task", total:{$sum:"$hours"}}}
      ]);
  }
}

const Worklog = mongoose.model(modelName, worklogSchema);

module.exports = Worklog;
