// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// var uuid = require('node-uuid');
// var currentContext = require('../../common/currentContext');
// var uniqueValidator = require('mongoose-unique-validator');
// var Status = require('../../common/constants/TaskStatus');

// var modelName = 'Modules';

// const moduleSchema = new mongoose.Schema({
//   _id: { type: String, default: uuid.v1},
//   name: {
//     type: String,
//     required: true,
//     // unique: true,
//     index: true
//   },
//   project: {
//     type: String,
//     ref: 'Projects',
//     required:true
//   },
//   startDate: {
//        type: Date,
//        required:true
//   },
//   endDate:{
//     type: Date,
//     required:true
//   },
//   completionDate:{
//     type:Date
//   },
//   additionObjects:{
//     type:Object
//   },
//   status:{
//     type: String,
//     required: true,
//     enum: Object.values(Status),
//     default:Status.UPCOMING
//   },
//   createdBy:{
//     type: String,
//     required: true
//   },
//   lastModifiedBy:{
//     type: String,
//     required: true
//   }
// }, { timestamps: true });

// moduleSchema.index({'$**': 'text'});

// moduleSchema.plugin(uniqueValidator);

// moduleSchema.statics = {


//   getById: function(id) {
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).findById(id).populate('project');
//   },
//   search: function(query) {
//     var context = currentContext.getCurrentContext();
//     var conn = this.db.useDb(context.workspaceId).model(modelName);
//     return conn.find(query).populate('project');
//   },
//   searchOne: function(query) {
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).findOne(query).populate('project');
//   },
//   updateById: function(id, updateData) {
//     var context = currentContext.getCurrentContext();
//     var options = { new: true };
//     return this.db.useDb(context.workspaceId).model(modelName).findOneAndUpdate({ _id: id }, { $set: updateData }, options);
//   },
//   deletebyId: function(id) {
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).findByIdAndDelete(id);
//   },
//   create: function(data) {
//     var context = currentContext.getCurrentContext();
//     var entityModel = this.db.useDb(context.workspaceId).model(modelName);
//     var entity = new entityModel(data);
//     return entity.save();
//   },
//   getPaginatedResult: function (query, options) {
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options).populate('project');
//   },
//   countDocuments: function (query) {
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).count(query);
//   },
//   groupByKeyAndCountDocuments: function (key) {
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
//   },
//   globalAggregate: function( data ) {
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).aggregate( data );
//   },
//   createEmptyCollection: function(){
//     var context = currentContext.getCurrentContext();
//     this.db.useDb(context.workspaceId).model(modelName).createCollection();
//     this.db.useDb(context.workspaceId).model(modelName).createIndexes();
//   },
//   getTextSearchResult: function(text){
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).find(
//       {$text: {$search: text}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}
//     )
//   },
//   globalAggregateFunction: function ( query ){
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).aggregate(query);
//   },
//   ganttView : function (projectId){
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).aggregate([
//       { $match : { project : projectId } },{ $lookup: { from:"sprints", localField:"_id", foreignField:"module", as:"sprints" } },
//       { $unwind: { path:"$sprints", preserveNullAndEmptyArrays:true } },{ $addFields:{ sprintId:{ $ifNull:[ "$sprints._id", "" ] } } },
//       { $lookup: { from:"tasks", localField:"sprintId", foreignField:"sprint", as:"tasks" } }, { $addFields:{ "sprints.tasks":"$tasks" } },
//       { $group:{_id:"$_id","status" : { $first:"$status" }, "name" : { $first:"$name" }, "project" : { $first:"$project" },
//       "startDate" : { $first:"$startDate" },"endDate" : { $first:"$endDate" }, "createdBy" : { $first:"$createdBy" }, "lastModifiedBy" : { $first:"$lastModifiedBy" },
//       "createdAt" : { $first:"$createdAt" },"updatedAt" : { $first:"$updatedAt" }, sprints:{ $push: "$sprints"  }}}])
//   }
// }

// const Module = mongoose.model(modelName, moduleSchema);

// module.exports = Module;