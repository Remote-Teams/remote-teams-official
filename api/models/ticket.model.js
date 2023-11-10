const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var currentContext = require('../../common/currentContext');
const Priority = require('../../common/constants/Priority');
const TicketType = require('../../common/constants/TicketType');
const TicketStatus = require('../../common/constants/TicketStatus');
var uniqueValidator = require('mongoose-unique-validator');

var modelName = 'Tickets';

const ticketSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  subject: {
    type: String,
    required: true,
    index: true
  },
  assignedTo:{
    type: String,
    ref: 'Users'
  },
  project:{
    type: String,
    ref: 'Projects'
  },
  priority:{
    type: String,
    required: true,
    enum: Object.values(Priority)
  },
  type: {
    type: String,
    required:true,
    enum: Object.values(TicketType)
  },
  description: {
      type: String
  },
  attachments:[{
    type: Object
  }],
  raisedBy:{
    type: String,
    ref: 'Users',
    required:true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(TicketStatus)
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

ticketSchema.index({'$**': 'text'});

ticketSchema.plugin(uniqueValidator);

ticketSchema.statics = {


  getById: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findById(id)
    .populate('assignedTo').populate('raisedBy').populate('project');
  },
  search: function(query) {
    var context = currentContext.getCurrentContext();
    var conn = this.db.useDb(context.workspaceId).model(modelName);
    return conn.find(query).populate('assignedTo').populate('raisedBy').populate('project');
  },
  searchOne: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query)
    .populate('assignedTo').populate('raisedBy').populate('project');
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
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options)
    .populate('assignedTo').populate('raisedBy').populate('project');
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
  ticketSummary: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {"$group":{"_id":null,"count":{"$sum":1},"data":{"$push":"$$ROOT"}}},
      {"$unwind":"$data"},
      {"$group":{"_id":"$data.status","count":{"$sum":1},"total":{"$first":"$count"}}},
      {"$project":{"count":1, "status":1, "percentage":{"$multiply":[{"$divide":[100,"$total"]},"$count"]}}}
          ]);
  },
  totalTicketsRaised: function (){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$group:{_id:"",count:{$sum:1}}}]);
    },
  totalTicketsClosed: function (){
      var context = currentContext.getCurrentContext();
      return this.db.useDb(context.workspaceId).model(modelName).aggregate([
        {$match:{"status":"CLOSED"}},
        {$group:{_id:"",count:{$sum:1}}}]);
      },
  ticketsRaisedThisMonth: function (startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{createdAt:{$gt:new Date(startDate), $lt: new Date(endDate)}}},
      {$group:{_id:"",count:{$sum:1}}}])
  },
  ticketsClosedThisMonth: function(startDate, endDate){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([ {
      $match:{createdAt:{$gt:new Date(startDate), $lt: new Date(endDate)}}}, 
      {$match:{"status":"CLOSED"}}, { $group:{ _id:"", count:{$sum:1}}}]);
  },
  summaryTab:function(from, to){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$match:{createdAt:{$gt:new Date(from), $lt: new Date(to)}}},
      {$lookup:{from:"projects",localField:"project",foreignField:"_id",as:"projectdata"}},
      {$lookup:{from:"users",localField:"assignedTo",foreignField:"_id",as:"assigndata"}},
      {$lookup:{from:"users",localField:"raisedBy",foreignField:"_id",as:"raisedata"}}
    ]);
  },
  countByClient: function(clientId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$lookup:{from:"projects",localField:"project",foreignField:"_id",as:"projectdata"}},
    {$unwind:"$projectdata"},
    {$lookup:{from:"clients",localField:"projectdata.client",foreignField:"_id",as:"clientdata"}},
    {$match:{"clientdata._id":clientId}},{$group:{_id:"",count:{$sum:1}}}]);
  },
  openByClient: function(clientId){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
    {$lookup:{from:"projects",localField:"project",foreignField:"_id",as:"projectdata"}},
    {$unwind:"$projectdata"},
    {$lookup:{from:"clients",localField:"projectdata.client",foreignField:"_id",as:"clientdata"}},
    {$match:{"clientdata._id":clientId}},
    {$match:{"status":{$ne:"CLOSED"}}},{$group:{_id:"",count:{$sum:1}}}]);
  },
  summaryReport: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$group:{_id:null, count:{$sum:1}, data:{$push:"$$ROOT"}}},
      {$unwind:"$data"},{$group:{_id:"$data.type", count:{"$sum":1},total:{$first:"$count"}}},
      {$project:{count:1,"status":1,"percentage":{$multiply:[{$divide:[100,"$total"]},"$count"]}}}]) 
  }
}

const Ticket = mongoose.model(modelName, ticketSchema);

module.exports = Ticket;