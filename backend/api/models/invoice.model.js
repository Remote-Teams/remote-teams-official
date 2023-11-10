const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const InvoiceType = require('../../common/constants/InvoiceType');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Invoices';

const invoiceSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  invoice_number:{
    type : String,
    required: true,
    unique:true,
    index:true
  },
  client:{
    type:String,
    ref:"Clients"
  },
  due_date:{
    type:Date,
    required:true
  },
  items:{
    type:[Object],
    required:true
  },
  notes:{
    type : String
  },
  email:{
    type: String
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
  datePaid:{
    type:Date
  },
  dateRaised:{
    type:Date
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(InvoiceType)
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

invoiceSchema.index({'$**': 'text'});

invoiceSchema.plugin(uniqueValidator);

invoiceSchema.statics = {


  getById: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id).populate('clientName');
  },
  search: function(query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate('clientName');
  },
  searchOne: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query).populate('clientName');
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
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options).populate('clientName');
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
    ).populate('clientName');
  },
  globalAggregatefunction: function ( query ){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate(query);
  },
  invoicesIssuedByMonths: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$group: {
          _id: {$month: "$createdAt"}, 
          monthlycount: {$sum: 1},
          monthlytotal:{$sum:"$total"} 
      }}
  ]);
  },
  paidInvoicesByMonths: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{"status":"PAID"}},
          {$group: {
              _id: {$month: "$createdAt"}, 
              monthlycount: {$sum: 1},
              monthlytotal:{$sum:"$total"} 
          }}
          
          ]);
  },
  invoiceCompleteSummary: function(fromDate, toDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{createdAt:{$gt:new Date(fromDate), $lt: new Date(toDate)}}},
      {$group:{_id:"", total:{$sum:"$total"}, count:{$sum:1},data:{$push:"$$ROOT"}}},
      {$unwind:"$data"},
      {$group:{_id:"$data.status", countbygroup:{$sum:1}, totalbygroup:{$sum:"$data.total"}, totalinvoicescreated:{$first: "$count"}, totalofall:{$first: "$total"}}},
      {$project:{countbygroup:"$countbygroup", totalbygroup:"$totalbygroup", totalinvoicescreated:"$totalinvoicescreated", totalofall:"$totalofall"}}
       
      ])
  },
  invoiceSummaryPercent:function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{"$group":{"_id":null,"count":{"$sum":1},"data":{"$push":"$$ROOT"}}},
    {"$unwind":"$data"},
    {"$group":{"_id":"$data.status","count":{"$sum":1},"total":{"$first":"$count"}}},
    {"$project":{"count":1,"status":1,"percentage":
    {"$multiply":[{"$divide":[100,"$total"]},"$count"]}}},
    {"$project":{"count":1, "status":1, "percentage":{$ceil:"$percentage"}}}
    ]);
  },
  revenueTillDate:function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
  {$match:{status:"PAID"}},
  {$group:{_id:"","totalofall":{$sum:"$total"}}},
  {$project:{_id:0,"totalamount":"$totalofall"}}
    ]);
  },
  revenueThisMonth:function(startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$match:{datePaid:{$gt:new Date(startDate), $lt: new Date(endDate)}}},
    {$match:{status:"PAID"}},
    {$group:{_id:"","totalofall":{$sum:"$total"}}},
    {$project:{_id:0,"totalamount":"$totalofall"}}]);
  },
  dueTillDate: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{$match:{status:"OVERDUE"}},
      {$group:{_id:"","totalofall":{$sum:"$total"}}},
      {$project:{_id:0,"totalamount":"$totalofall"}}
        ])
  },
  revenueByClient:function(clientId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{status:"PAID"}},
      {$match:{client:clientId}},
      {$group:{_id:"","totalofall":{$sum:"$total"}}}
      ]);
  },
  dueTimeRange: function(startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{$match:{$and:[{status:{$ne:"PAID"}},{status:{$ne:"DRAFT"}}]}},
    {$match:{createdAt:{$gt:new Date(startDate), $lt: new Date(endDate)}}},
   {$group:{_id:"","totalofall":{$sum:"$total"}}},
   {$project:{_id:0,"totalamount":"$totalofall"}}
    ]);
  },
  totalInvoiceAmount: function(startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{$match:{status:{$ne:"DRAFT"}}},
    {$match:{createdAt:{$gt:new Date(startDate), $lt: new Date(endDate)}}},
   {$group:{_id:"","totalofall":{$sum:"$total"}}},{$project:{_id:0,"totalamount":"$totalofall"}}])
  },
  summaryTab: function(from, to){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{createdAt:{$gt:new Date(from), $lt: new Date(to)}}},
      {$lookup:{from:"clients",localField:"client",foreignField:"_id",as:"clientdata"}} 
      ]);
  }
}

const Invoice = mongoose.model(modelName, invoiceSchema);

module.exports = Invoice;