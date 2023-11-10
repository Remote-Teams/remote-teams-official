// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// var uuid = require('node-uuid');
// var currentContext = require('../../common/currentContext');
// var uniqueValidator = require('mongoose-unique-validator');
// var Status = require('../../common/constants/TaskStatus');

// var modelName = 'Sprints';

// const sprintSchema = new mongoose.Schema({
//   _id: { type: String, default: uuid.v1},
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//     index: true
//   },
//   module: {
//     type: String,
//     ref: 'Modules',
//     required:true
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
//   additionObjects:{
//     type:Object
//   },
//   completionDate:{
//     type:Date
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

// sprintSchema.index({'$**': 'text'});

// sprintSchema.plugin(uniqueValidator);

// sprintSchema.statics = {


//   getById: function(id) {
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).findById(id)
//     .populate({ 
//       path: 'module',
//       populate: {
//         path: 'project',
//         populate:{
//           path:'resources',
//           model:'Users'
//         },
//         populate:{
//           path:'client',
//           model:'Clients'
//         }
//       } 
//    });

//   },
//   search: function(query) {
//     var context = currentContext.getCurrentContext();
//     var conn = this.db.useDb(context.workspaceId).model(modelName);
//     return conn.find(query).populate({ 
//       path: 'module',
//       populate: {
//         path: 'project',
//         populate:{
//           path:'resources',
//           model:'Users'
//         },
//         populate:{
//           path:'client',
//           model:'Clients'
//         }
//       } 
//    });
//   },
//   searchOne: function(query) {
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).findOne(query)
//     .populate({ 
//       path: 'module',
//       populate: {
//         path: 'project',
//         populate:{
//           path:'resources',
//           model:'Users'
//         },
//         populate:{
//           path:'client',
//           model:'Clients'
//         }
//       } 
//    });
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
//     return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options)
//     .populate({ 
//       path: 'module',
//       populate: {
//         path: 'project',
//         populate:{
//           path:'resources',
//           model:'Users'
//         },
//         populate:{
//           path:'client',
//           model:'Clients'
//         }
//       } 
//    });
//   },
//   countDocuments: function (query) {
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).count(query);
//   },
//   createEmptyCollection: function(){
//     var context = currentContext.getCurrentContext();
//     this.db.useDb(context.workspaceId).model(modelName).createCollection();
//     this.db.useDb(context.workspaceId).model(modelName).createIndexes();
//   },
//   groupByKeyAndCountDocuments: function (key) {
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
//   },
//   globalAggregate: function( data ) {
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).aggregate( data );
//   },
//   getTextSearchResult: function(text){
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).find(
//       {$text: {$search: text}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}
//     );
//   },
//   globalAggregateFunction: function ( query ){
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).aggregate(query);
//   },
//   sprintChart : function(module){
//     var context = currentContext.getCurrentContext();
//     return this.db.useDb(context.workspaceId).model(modelName).aggregate([
//       { $match : { module : module } },
//       { $group : {"_id":"","labels":{ $push : "$name" },
//       "planned": { $push:{ $ceil :  { $divide : [ { $subtract: ["$endDate", "$startDate"] } , 86400000 ]  }  }},
//       "actual":{ $push: { $cond: {"if":  "$completionDate" ,
//       "then":{ $ceil : { $divide : [ { $subtract: ["$completionDate", "$startDate"] } , 86400000 ]  }},else:0}} }}},
//       {$project:{"_id":0}}])
//   }
// }

// const Sprint = mongoose.model(modelName, sprintSchema);

// module.exports = Sprint;