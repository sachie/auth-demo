'use strict';

const express = require('express');

const user = require('./user');

module.exports = {
  configure: app => {
    const router = express.Router();
    user.configure(router);
    app.use('/api', router);
  }
};