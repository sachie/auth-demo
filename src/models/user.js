'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uuid = require('node-uuid');

const config = require('../configs');
const oneTouch = require('../lib/oneTouch');

const authy = require('authy')(config.authyKey);

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  countryCode: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  authyId: String,
  authyStatus: {
    type: String,
    default: 'unverified'
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.pre('save', function(next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (error, salt) => {
      if (error) {
        return next(error);
      }
      bcrypt.hash(user.password, salt, (error, hash) => {
        if (error) {
          return next(error);
        }
        user.password = hash;
        if (!user.authyId) {
          authy.register_user(user.email, user.phone, user.countryCode,
              (error, response) => {
                if (error) {
                  return next(error);
                }
                user.authyId = response.user.id;
                next();
              });
        } else {
          next();
        }
      });
    });
  }
});

UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, callback);
};

UserSchema.methods.createSession = function(callback) {
  const user = this;
  user.authyStatus = 'unverified';
  user.save();

  oneTouch.requestApproval(user.authyId, {
    message: 'Request to Login to Auth Demo app.',
    email: user.email
  }, (error, authyResponse) => {
    if (error) {
      callback(error);
    } else {
      const Session = require('./session.js');
      Session.create({
        userId: user._id,
        token: uuid.v1()
      }, (error, session) => {
        callback(error, session, authyResponse);
      });
    }
  });
};

UserSchema.methods.sendAuthyToken = function (cb){
  var user = this;
  authy.request_sms(user.authyId, (err) => {
    cb.call(user, err);
  });
};

UserSchema.methods.verifyAuthyToken = function (otp, cb){
  var user = this;
  authy.verify(user.authyId, otp, (err, response) => {
    cb.call(user, err, response);
  });
};

module.exports = mongoose.model('User', UserSchema);