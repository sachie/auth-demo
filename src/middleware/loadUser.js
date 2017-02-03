'use strict';

const Session = require('../models/session');
const User = require('../models/user');

/**
 * Middleware to load the user for each request.
 * @type {Object}
 */
module.exports = {
  configure: app => {
    app.use((request, response, next) => {
      var token = request.get('X-API-TOKEN');
      if (!token) {
        return next();
      }
      Session.findOne({
        token: token
      }, (err, doc) => {
        if (err || !doc) {
          return next();
        }
        request.session = doc;
        User.findById(doc.userId, (err, doc) => {
          if (doc && !err) {
            request.user = doc;
          }
          return next();
        });
      });
    });
  }
};