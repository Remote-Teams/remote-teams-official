const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
var ExpenseType = require('../../common/constants/ExpenseType');
var ExpenseBillingType = require('../../common/constants/ExpenseBillingType');
const Status = require('../../common/constants/ExpenseStatus');
var uniqueValidator = require('mongoose-unique-validator');


var modelName = 'Expenses';

const expenseSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  expenseTitle:{
    type:String,
    required:true,
    index: true
  },
  expenseType:{
    type :String,
    required: true,
    enum: Object.values(ExpenseType) // PROJECT || MISCELLENOUS
  },
  BillingType:{
    type :String,
    required: true,
    enum: Object.values(ExpenseBillingType) // BILLABLE || UNBILLABLE
  },
  project:{
    type: String,
    ref:"Projects"
  },
  expenseItems:[{
    type :Object,
  }],
  notes:{
    type : String
  },
  subTotal:{
    type :Number
  },
  totalTax:{
    type:Number
  },
  total:{
    type:Number
  },
  documents:{
    type:[Object]
  },
  dateApprovedOrRejected:{
    type:Date
  },
  dateRaised:{
    type:Date
  },
  status:{
    type :String,
    required: true,
    enum: Object.values(Status)  // DRAFT || SENT || APPROVED || REJECTED
  },
  payee_name:{
    type:String,
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

expenseSchema.index({'$**': 'text'});
expenseSchema.plugin(uniqueValidator);

expenseSchema.statics = {

//have used populate here
  getById: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id).populate('project');
  },
  //entire query is built and passed to this function, it accepts query
  search: function(query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate('project');
  },
  //here also a mongodb query is built and sent
  searchOne: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query).populate('project');
  },
  //the id of the field as well as data to be updated is sent, options new means we return the new data created as response
  updateById: function(id, updateData) {
    var context = currentContext.getCurrentContext();
    var options = { new: true };
    return this.db.useDb(context.workspaceId).model(modelName).findOneAndUpdate({ _id: id }, { $set: updateData }, options);
  },
  deletebyId: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findByIdAndDelete(id);
  },
  // for the create function, new data is passed into the function
  create: function(data) {
    var context = currentContext.getCurrentContext();
    var entityModel = this.db.useDb(context.workspaceId).model(modelName);
    var entity = new entityModel(data);
    return entity.save();
  },
  getPaginatedResult: function (query, options) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options).populate('project');
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
  globalAggregate: function( data ) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate( data );
  },
  getTextSearchResult: function(text){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(
      {$text: {$search: text}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}
    );
  },
  globalAggregatefunction: function ( query ){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate( query );
  },
  yearlyExpenseReport: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([ 
      {$group: { _id: {$month: "$createdAt"}, monthlycount: {$sum: 1}, 
      monthlytotal:{$sum:"$total"} }} ]);
  },
  yearlyBillableExpenses: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"BillingType":"BILLABLE"}},
          {$group: {
              _id: {$month: "$createdAt"}, 
              monthlycount: {$sum: 1},
              monthlytotal:{$sum:"$total"} 
          }}
      ]);
  },
  yearlyMiscellaneousExpenses: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"expenseType":"MISCELLANEOUS"}},
          {$group: {
              _id: {$month: "$createdAt"}, 
              monthlycount: {$sum: 1},
              monthlytotal:{$sum:"$total"} 
          }}
      ]);
  },
  rough: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"expenseType":"MISCELLANEOUS"}}
      ]);
  },
  totalExpenseThisMonth: function (startDate, endDate) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$match:{createdAt:{$gt:new Date(startDate), $lt: new Date(endDate)}}},
    {$group:{_id:"","totalofall":{$sum:"$total"}}},
    {$project:{_id:0,"totalamount":"$totalofall"}}
      ]);
  },
  monthlyExpenseType: function (startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([  
  {$match:{createdAt:{$gt:new Date(startDate), $lt: new Date(endDate)}}},
  {$group:{_id:"$BillingType",total: {$sum:{$add:["$total"]}}}}]);
  },
  summaryTabDates: function (from, to){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {
          $match:{createdAt:{$gt:new Date(from), $lt: new Date(to)}} 
              }]);
  },
  summaryTabProject: function (from, to, project){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {
          $match:{createdAt:{$gt:new Date(from), $lt: new Date(to)}} 
              },
              {$match:{"project":project}}
      ]);
  },
  totalProjExp: function(projectId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$match:{"project":projectId}},
    {$group:{_id:"", total:{$sum:"$total"}}}
    ])
  },
  billProjExp: function(projectId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"project":projectId}},
      {$match:{"BillingType":"BILLABLE"}},
      {$group:{_id:"", total:{$sum:"$total"}}}
      ])
  },
  unbillProjExp: function(projectId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"project":projectId}},
      {$match:{"BillingType":"UNBILLABLE"}},
      {$group:{_id:"", total:{$sum:"$total"}}}
      ])
  },
  penReq: function(projectId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"project":projectId}},
      {$match:{"status":"SENT"}},
      {$group:{_id:"", count:{$sum:1}}}
      ])
  },
  billTimeRange: function(startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{createdAt:{$gt:new Date(startDate), $lt: new Date(endDate)}}},
      {$match:{"BillingType":"BILLABLE"}},
      {$group:{_id:"", total:{$sum:"$total"}}}
    ])
   } ,
  unbillTimeRange: function(startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{createdAt:{$gt:new Date(startDate), $lt: new Date(endDate)}}},
      {$match:{"BillingType":"UNBILLABLE"}},
      {$group:{_id:"", total:{$sum:"$total"}}}
    ])
   } ,
  miscTimeRange: function(startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{createdAt:{$gt:new Date(startDate), $lt: new Date(endDate)}}},
      {$match:{"expenseType":"MISCELLANEOUS"}},
      {$group:{_id:"", total:{$sum:"$total"}}}
    ])
   } 
}

const Expense = mongoose.model(modelName, expenseSchema);

module.exports = Expense;