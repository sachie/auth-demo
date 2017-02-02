'use strict';

const express = require('express');

const login = require('./login');
const register = require('./register');
const sessions = require('./sessions');

module.exports = {
  configure: app => {
    const router = express.Router();
    login.configure(router);
    register.configure(router);
    sessions.configure(router);
    app.use('/auth', router);
  }
};