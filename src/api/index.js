'use strict';

const express = require('express');

const user = require('./user');

/**
 * Registers the API endpoints with the app.
 * @type {Object}
 */
module.exports = {
  configure: app => {
    const router = express.Router();
    user.configure(router);
    app.use('/api', router);
  }
};