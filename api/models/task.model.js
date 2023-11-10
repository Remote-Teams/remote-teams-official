const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const TaskPriority = require('../../common/constants/TaskPriority');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Tasks';

const taskSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1 },
  name:{
    type: String,
    required: true,
    index: true
  },
  project: {
    type: String,
    ref: 'Projects',
    required: true
  },
  assignees:[{
    type: String,
    ref:'Users'
  }
  ],
  stage:{
    type: String,
    ref:'Stages',
    required: true
  },
  startDate: {
    type: Date,
    required:true
  },
  endDate:{
    type: Date,
    required:true
  },
  emoji:{
    type:String
  },
  additionObjects:{
    type:Object
  },
  completionDate:{
    type:Date
  },
  priority: {
    type: String,
    required: true,
    enum: Object.values(TaskPriority)
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

taskSchema.index({'$**': 'text'});

taskSchema.plugin(uniqueValidator);

taskSchema.statics = {


  getById: function (id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id)
    .populate({ 
          path:'project',
          populate:{
            path:'resources',
            model:'Users'
          },
          populate:{
            path:'client',
            model:'Clients'
          }
   }).populate('stage').populate('assignees');
  },
  search: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(query)
    .populate({ 
          path:'project',
          populate:{
            path:'resources',
            model:'Users'
          },
          populate:{
            path:'client',
            model:'Clients'
          }
   }).populate('stage').populate('assignees');
  
  },
  searchOne: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query)
    .populate({ 
          path:'project',
          populate:{
            path:'resources',
            model:'Users'
          },
          populate:{
            path:'client',
            model:'Clients'
          }
   }).populate('stage').populate('assignees');
   
  },
  updateById: function (id, updateData) {
    var context = currentContext.getCurrentContext();
    var options = { new: true };
    return this.db.useDb(context.workspaceId).model(modelName).findOneAndUpdate({ _id: id }, { $set: updateData }, options);
  },
  deletebyId: function (id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findByIdAndDelete(id);
  },
  create: function (data) {
    var context = currentContext.getCurrentContext();
    var entityModel = this.db.useDb(context.workspaceId).model(modelName);
    var entity = new entityModel(data);
    return entity.save();
  },
  getPaginatedResult: function (query, options) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options)
    .populate({ 
          path:'project',
          populate:{
            path:'resources',
            model:'Users'
          },
          populate:{
            path:'client',
            model:'Clients'
          }
   }).populate('stage').populate('assignees');
  },
  countDocuments: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  getTextSearchResult: function(text){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(
      {$text: {$search: text}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}
    );
  },
  globalAggregationFunction: function( query ){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate(query);
  },
  createEmptyCollection: function(){
    var context = currentContext.getCurrentContext();
    this.db.useDb(context.workspaceId).model(modelName).createCollection();
    this.db.useDb(context.workspaceId).model(modelName).createIndexes();
  },
  
  //NEW FUNCTION FOR TASK PERCENT W/O sprints&modules
  //**has dependency on status - 1 -- DONE & TESTED

  getTaskPercentByProjectId: function(projectId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"projects",localField:"project",foreignField:"_id",as:"project"}},
      {$unwind:{path:"$project",preserveNullAndEmptyArrays:true}},
      {$match:{"project._id":projectId}},
      {$group:{_id:null, count:{$sum:1}, data:{$push:"$$ROOT"}}},
      {$unwind:"$data"},
      {$group:{_id:"$data.priority", count:{"$sum":1},total:{$first:"$count"}, data:{$push:"$$ROOT"}}},
      {$project:{count:1,"priority":1,"data":{$arrayElemAt:["$data.data",0]},"total":1,"percentage":{$multiply:[{$divide:[100,"$total"]},"$count"]}}},
      {$project:{"status":1,"percentage":1, "count":1, "total":1,"project":"$data.project.name"}}]);
  },

//NEW FUNC FOR OSI, W/O sprints and moduless
//**has dependency on status  - 2 - DONE, managed with stage
onScheduleIndicator: function(projectId){
  var context = currentContext.getCurrentContext();
  return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$lookup:{from:"projects",localField:"project",foreignField:"_id",as:"projectofmodule"}},
    {$unwind:{path:"$projectofmodule",preserveNullAndEmptyArrays:true}},
    {$match:{"projectofmodule._id": projectId} },
    {$addFields : {timebetween : {$subtract: [ "$projectofmodule.endDate", "$projectofmodule.startDate" ]},timepassed : {$subtract:["$$NOW", "$projectofmodule.startDate"]}}},
    {$addFields:{daysbetween:{$divide:["$timebetween", 8.64e+7]}, dayspassed:{$divide:["$timepassed", 8.64e+7]}}},
    {$group:{"_id":"", count:{"$sum":1}, data:{"$push":"$$ROOT"}, daysbetween: {$first:"$daysbetween"}, dayspassed: {$first: "$dayspassed"}}},
    {$addFields : {tasksperday : {$divide:["$count", "$daysbetween"]}}},
    {$addFields:{tasksshouldtillnow:{$multiply:["$tasksperday","$dayspassed"]}}},
    {$unwind: "$data"},{$addFields:{stage: "$data.stage"}},
    {$group:{"_id":"",totalcompletedtasks:{"$sum":1}, tasksdata:{"$push":"$$ROOT"}, tasksshouldtillnow:{$first:"$tasksshouldtillnow"}}},
    {$addFields:{onschedule: {$divide:["$totalcompletedtasks", "$tasksshouldtillnow"]}}},
    {$addFields:{onscheduleindicatorpercentage:{$multiply:["$onschedule", 100]}}},
    {$project:{onschedulepercentage:"$onscheduleindicatorpercentage"}}]);
},

//NEW FUNCTION FOR TASK COMPLETION BY WEEKS W/O sprints & modules
//**has dependency on status  - 3 DONE, managed with stage

taskCompletionByWeeks: function(projectId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$lookup:{from:"projects",localField:"project",foreignField:"_id",as:"project"}},
      {$unwind:{path:"$project",preserveNullAndEmptyArrays:true}},
      {$match:{"project._id":projectId}},
      {$group:{_id:{$week:"$completionDate"}, count:{$sum:1} }},
      {$sort:{_id:1}},{$project:{"week":"$_id", count:1,_id:0}}])
},
  totalTasksThisMonth: function(startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$match:{createdAt:{$gt:new Date(startDate), $lt: new Date(endDate)}}},
    {$group:{_id:"","count":{$sum:1}}}
    ])
  },

    //NEW FUNC FOR TASK COUNT W/O sprints&modules
    tasksCountByProject: function(){
      var context = currentContext.getCurrentContext();
      return this.db.useDb(context.workspaceId).model(modelName).aggregate([
        {$lookup:{from:"projects",localField:"project",foreignField:"_id",as:"project"}},
        {$unwind:{path:"$project"}},
        {$group:{_id:"$project",count:{$sum:1}}},
        {$addFields:{"project":"$_id", "id":"$_id._id"}}, {$project:{_id:0}}
        ]);
        },

//NEW FUNC FOR TASK GROUPING W/O sprints&modules
//**has dependency on status  - 4 - DONE

tasksGrouping: function(projectId){
  var context = currentContext.getCurrentContext();
  return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$lookup:{from:"projects",localField:"project",foreignField:"_id",as:"project"}},
    {$unwind:{path:"$project",preserveNullAndEmptyArrays:true}},
    {$match:{"project._id":projectId}},
    {$group:{_id:"$priority", count:{$sum:1} }}
    ]);

},

//**has dependency on status  - 5 - function not required anymore
  // openTaskCount: function (id) {
  //   var context = currentContext.getCurrentContext();
  //   return this.db.useDb(context.workspaceId).model(modelName).aggregate([{
  //   $match: {$or: [{"project":id}, {"status":"ONGOING"},{"status": "PENDING"}]}},
  // {$group: {_id: "",count: {$sum: 1}}}]);
  // },


//NEW FUNC FOR TASK OVERVIEW W/O sprints&modules
//**has dependency on status  - 6  - DONE

taskOverviewByProjectId: function(projectId){
  var context = currentContext.getCurrentContext();
  return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$lookup:{from:"projects",localField:"project",foreignField:"_id",as:"project"}},
    { $unwind:{path:"$project",preserveNullAndEmptyArrays:true}},
    { $match:{"project._id":projectId} }, { $group: { _id: null, myCount: { $sum: 1 }, data:{$push:"$$ROOT"}  } },
    { $unwind :"$data" }, { $group: { _id:"$data.priority", count:{"$sum":1}, total:{$first:"$myCount"} } },
    { $addFields: { percentage:{$multiply:[{$divide:[100,"$total"]},"$count"]} }}
    ])
},
tasksPriorityByUserAndProject: function(resourceId, projectId){
  var context = currentContext.getCurrentContext();
  return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$lookup:{from:"projects",localField:"project",foreignField:"_id",as:"project"}},
    {$unwind:{path:"$project",preserveNullAndEmptyArrays:true}},
    {$match:{"project._id":projectId}},{$unwind:{path:"$assignees",preserveNullAndEmptyArrays:true}},
    {$match:{"assignees":resourceId}},{$group:{_id:"$priority", count:{$sum:1} }}
    ]);
},
}

const Task = mongoose.model(modelName, taskSchema);

module.exports = Task;