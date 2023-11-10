const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const Status = require('../../common/constants/ProjectStatus');
var uniqueValidator = require('mongoose-unique-validator');

var configResolve = require("../../common/configResolver");
var {redisHost, redisPort} = configResolve.getConfig();
var modelName = 'Projects';


const projectSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  client:{
    type: String,
    ref: 'Clients'
  },
  logo: {
    type: String
  },
  startDate: {
    type: Date
  },
  endDate:{
    type: Date
  },
  estimatedCTC:{
    type: Number
  },
  estimatedHours: {
    type: Number
  },
  description:{
    type: String
  },
  resources:[{
    type: String,
    ref:'Users'
  }
  ],
  tags:[{
    type: String
  }],
  status: {
    type: String,
    required: true,
    enum: Object.values(Status)
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

projectSchema.index({'$**': 'text'});

projectSchema.plugin(uniqueValidator);

projectSchema.statics = {


  getById: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id).populate('resources').populate('client');
  },
  search: function(query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate('resources').populate('client');
  },
  searchOne: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query).populate('resources').populate('client');
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
  getPaginatedResult: function (query, options) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options).populate('resources').populate('client');
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
  createEmptyCollection: function(){
    var context = currentContext.getCurrentContext();
    this.db.useDb(context.workspaceId).model(modelName).createCollection();
    this.db.useDb(context.workspaceId).model(modelName).createIndexes();
  },
  globalAggregateFunction: function( query ){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate(query);
  },
  projectsOfResource: function( resource ){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$unwind:{path:"$resources", preserveNullAndEmptyArrays:true}},
      {$match:{"resources":resource}}
      ])
  },
  projectRates : function(projectId, rateQuery){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      { $match : { "_id":projectId } },{ $unwind : "$resources" },
      { $lookup: {from : "users", localField:"resources", foreignField:"_id", as:"resourceinProject"}},
      { $unwind:"$resourceinProject" },{ $group:{_id:"$_id",resources:{ $push:"$resourceinProject" },rate: rateQuery}}
    ])
  }
}

const Project = mongoose.model(modelName, projectSchema);

module.exports = Project;