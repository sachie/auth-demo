'use strict';

const mongoose = require('mongoose');

var SessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  token: {
    type: String,
    required: true,
    unique: true
  }
});

/**
 * The Session model.
 * @type {[type]}
 */
module.exports = mongoose.model('Session', SessionSchema);