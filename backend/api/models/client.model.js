const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const Status = require('../../common/constants/ClientStatus');
var uniqueValidator = require('mongoose-unique-validator');


var modelName = 'Clients';

const clientSchema = new mongoose.Schema({
    _id: { type: String, default: uuid.v1},
    name: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(Status)
    },
    coverImg:{
      type:String,
    },
    defaultEmail:{
      type: String
    },
     website:{
        type: String
     },
     location:{
      type: String
     },
     addresses:{
      type: Object
     },
    contract:{
      type:Object
    },
     documents:{
        type: [Object]
     },
     primaryContactPerson: {
         type: Object
     },
     secondaryContactPerson:{
        type: [Object]
     },
     onBoardingDate:{
       type: Date
     },
     createdBy:{
      type: String,
      required: true
    },
    lastModifiedBy:{
      type: String,
      required: true
    },
  }, { timestamps: true });

  clientSchema.index({'$**': 'text'});
  
  clientSchema.plugin(uniqueValidator);
  
  clientSchema.statics = {
  getById: function(id) {
      var context = currentContext.getCurrentContext();
      return this.db.useDb(context.workspaceId).model(modelName).findById(id);
    },
    search: function(query) {
      var context = currentContext.getCurrentContext();
      var conn = this.db.useDb(context.workspaceId).model(modelName);
      return conn.find(query);
    },
    searchOne: function(query) {
      var context = currentContext.getCurrentContext();
      return this.db.useDb(context.workspaceId).model(modelName).findOne(query);
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
      return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options);
    },
    countDocuments: function (query) {
      var context = currentContext.getCurrentContext();
      return this.db.useDb(context.workspaceId).model(modelName).estimatedDocumentCount(query);
    },
    groupByKeyAndCountDocuments: function (key) {
      var context = currentContext.getCurrentContext();
      return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
    },
    getPaginatedResultWithProjects: function (query, options) {
      var context = currentContext.getCurrentContext();
      return this.db.useDb(context.workspaceId).model(modelName).aggregate(query);
    },
    getTextSearchResult: function(text){
      var context = currentContext.getCurrentContext();
      return this.db.useDb(context.workspaceId).model(modelName).find(
        {$text: {$search: text}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}
      );
    }
  }
  
  const Client = mongoose.model(modelName, clientSchema);
  
  module.exports = Client;
