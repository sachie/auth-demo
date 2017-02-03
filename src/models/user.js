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

/**
 * Hashes the password and creates an authy user.
 */
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

/**
 * Compares the user's hashed password against the submitted password.
 */
UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, callback);
};

/**
 * Creates a session for the user and sends a One Touch or
 * One Time Code request.
 */
UserSchema.methods.createSession = function(callback) {
  const user = this;
  oneTouch.requestApproval(user.authyId, {
    message: 'Request to Login to Auth Demo app.',
    email: user.email
  }, (error, response) => {
    if (error && error.error_code !== '60051') {
      return callback(error);
    }
    if (error && !response) {
      response = {
        success: false
      };
    }
    const Session = require('./session.js');
    Session.create({
      userId: user._id,
      token: uuid.v1()
    }, (error, session) => {
      if (error) {
        callback(error, session, response);
      } else if (!response.success) {
        user.sendAuthyToken((error) => {
          callback(error, session, response);
        });
      } else {
        callback(null, session, response);
      }
    });
  });
};

/**
 * Sends a One Time Code request.
 */
UserSchema.methods.sendAuthyToken = function(callback) {
  const user = this;
  authy.request_sms(user.authyId, error => {
    callback(error);
  });
};

/**
 * Verifies a submitted code with authy.
 */
UserSchema.methods.verifyAuthyToken = function (oneTimeCode, callback){
  const user = this;
  authy.verify(user.authyId, oneTimeCode, (error, response) => {
    callback(error, response);
  });
};

/**
 * The User model.
 * @type {[type]}
 */
module.exports = mongoose.model('User', UserSchema);