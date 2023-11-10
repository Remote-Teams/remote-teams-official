const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uuid = require('node-uuid');
var uniqueValidator = require('mongoose-unique-validator');
var currentContext = require('../../common/currentContext');
const Status = require('../../common/constants/Status');
const MemberType = require('../../common/constants/MemberDayOffType');


var modelName = 'Users';

const userSchema = new mongoose.Schema({
  _id: { type: String, default: uuid.v1},
  email: {
      type: String,
      required: true,
      unique: true,
      index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  firstName:{
    type: String,
    required: true
  },
  lastName:{
    type: String
  },
  profileImage:{
    type: String
  },
  additionalInfo:{
    type:Object
  },
  memberType:{
    type: String,
    required: true,
    enum: Object.values(MemberType),
    default:"FULLTIME"
  },
  phone: {
      type: String
  },
  location: {
      type: String,
  },
  timezone: {
      type: String,
  },
  jobTitle:{
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(Status)
  },
  dateOfJoining: {
    type: Date
  },
  contract:{
    start_date:{
      type:Date
    },
    end_date:{
      type:Date
    },
    working_hrs_from:{
      type:Date,
      // required:true
    },
    working_hrs_to:{
      type:Date,
      // required:true
    },
    ctc:{
      type:Number
    },
    attachments:{
      type:[String]
    }
  },
  role:{
    type: String,
    ref: 'Roles',
    required: true
  },
  password:{
    type: String,
    required: true,
    minlength:5
  },
  loggedOff:{
    type: Date
  },
  demo:{
    type: Boolean
  },
  onboarded:{
    type: Boolean
  },
  createdBy:{
    type: String,
    required: true
  },
  lastModifiedBy:{
    type: String,
    required: true
  }
}, { timestamps: true });

userSchema.index({'$**': 'text'});

userSchema.plugin(uniqueValidator);

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Password hash middleware.
 */
userSchema.pre('findOneAndUpdate', function findOneAndUpdate(next) {
  const user = this;
  if (user._update.$set.password == undefined) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user._update.$set.password , salt, null, (err, hash) => {
      if (err) { return next(err); }
      user._update.$set.password  = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
 }

userSchema.statics = {

  getById: function(id) {
      var context = currentContext.getCurrentContext();
      return this.db.useDb(context.workspaceId).model(modelName).findById(id).populate('role');
  },
  search: function(query) {
      var context = currentContext.getCurrentContext();
      var conn = this.db.useDb(context.workspaceId).model(modelName);
      return conn.find(query).populate('role');
  },
  searchOne: function(query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findOne(query).populate('role');
  },
  comparePassword : async function(oldPassword, newPassword, cb){
    var context = currentContext.getCurrentContext();
    var isMatch = bcrypt.compare(oldPassword, newPassword, (err, isMatch) => {
      cb(err, isMatch);
    });
  return isMatch;
  },
  updateById: function(id, updateData) {
      var context = currentContext.getCurrentContext();
      var options = {new:true};
      return this.db.useDb(context.workspaceId).model(modelName).findOneAndUpdate({ _id: id}, {$set: updateData}, options);
  },
  deletebyId: function(id) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).findByIdAndDelete(id);
  },
  getPaginatedResult: function (query, options) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(query, null, options).populate('role');
  },
  countDocuments: function (query) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).count(query);
  },
  groupByKeyAndCountDocuments: function (key) {
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([{ $group: { _id: '$' + key, count: { $sum: 1 } } }]);
  },
  create: function(data) {
     var context = currentContext.getCurrentContext();
     var entityModel = this.db.useDb(context.workspaceId).model(modelName);
     var entity = new entityModel(data);
     return entity.save();
  },
  getTextSearchResult: function(text){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).find(
      {$text: {$search: text}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}
    ).populate('role');
  },
  createEmptyCollection: function(){
    var context = currentContext.getCurrentContext();
    this.db.useDb(context.workspaceId).model(modelName).createCollection();
    this.db.useDb(context.workspaceId).model(modelName).createIndexes();
  },
  globalAggregateFunction:function( query ){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate(query);
  },
  userDistPercent:function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$group:{_id:null, count:{$sum:1}, data:{$push:"$$ROOT"}}},
      {$unwind:"$data"},
      {$addFields:{ctc:"$data.contract.ctc"}},
      {$group:{_id:"$data.memberType", count:{"$sum":1},total:{$first:"$count"}, cost:{$sum:"$ctc"} }},
      {$project:{count:1,"status":1, "cost":1,"percentage":{$multiply:[{$divide:[100,"$total"]},"$count"]}}}
      ]);
  },
  memAvgHours: function(){
    var context = currentContext.getCurrentContext();
    return this.db.useDb(context.workspaceId).model(modelName).aggregate([
      {$addFields:{"time":{$subtract:["$contract.working_hrs_to","$contract.working_hrs_from"]}}},
      {$addFields:{"time":{$divide:["$time",3.6e+6]}}},
      {$group:{_id:"$memberType", avgHours:{$avg:"$time"}, count:{$sum:1} }},
      {$addFields:{"typeHoursAvail":{$multiply:["$count","$avgHours"]}}},
      {$addFields:{"typeMonHours":{$multiply:["$typeHoursAvail",22]}}}
      ]);
    }
}

const User = mongoose.model(modelName, userSchema);

module.exports = User;
