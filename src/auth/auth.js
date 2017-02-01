'use strict';

const passport = require('passport');
const express = require('express');

const User = require('../models/user');
const login = require('./login');
const register = require('./register');
const jwt = require('./jwt');

module.exports = {
  configure: app => {
    app.use(passport.initialize());

    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });

    const router = express.Router();
    login.configure(router);
    register.configure(router);
    jwt.configure();
    app.use('/auth', router);
  }
};