'use strict';

const jwt = require('jwt-simple');
const moment = require('moment');

const config = require('../configs/auth');

module.exports = {
  getToken: user => jwt.encode({
    id: user._id,
    email: user.email,
    created: moment().valueOf()
  }, config.jwtSecret)
};