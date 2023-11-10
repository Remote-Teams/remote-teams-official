const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
var BillingType = require('../../common/constants/ExpenseSubscriptionBillingType');
const Status = require('../../common/constants/ExpenseSubscriptionType');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'ExpenseSubscriptions';

const expenseSubscriptionSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  name:{
    type: String,
    index: true
  },
  price:{
    type:Number
  },
  purpose: {
    type: String
  },
  billingType:{
    type: String,
    required: true,
    enum: Object.values(BillingType)
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(Status)
  },
  startingDate:{
    type :Date,
    required:true
  },
  lastBillingData:{
    type:Date,
    required:true
  },
  nextBillingDate:{
    type:Date,
    required:true
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

expenseSubscriptionSchema.index({'$**': 'text'});

expenseSubscriptionSchema.plugin(uniqueValidator);

expenseSubscriptionSchema.statics = {


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
  deleteById: function(id) {
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
    return this.db.useDb(context.workspaceId).model(modelName).count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  createEmptyCollection: function(){
    var context = currentContext.getCurrentContext();
    this.db.useDb(context.workspaceId).model(modelName).createCollection();
    this.db.useDb(context.workspaceId).model(modelName).createIndexes();
  },
  getTextSearchResult: function(text){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(
      {$text: {$search: text}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}
    );
  },
  globalAggregateFunction: function( query ){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate(query);
  },
  totalSubscription: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$group:{_id:"$status",total:{$sum:"$price"}}}])
  },
  subsTimeRange: function(startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$match:{createdAt:{$gt:new Date(startDate), $lt: new Date(endDate)}}},
    {$group:{_id:"$status",total:{$sum:"$price"}}}])
  }
}

const ExpenseSubscriptions = mongoose.model(modelName, expenseSubscriptionSchema);

module.exports = ExpenseSubscriptions;