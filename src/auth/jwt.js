'use strict';

const passport = require('passport');
const passportJwt = require('passport-jwt').Strategy;

const config = require('../configs/auth');
const User = require('../models/user');

const Strategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

module.exports = {
  configure: () => {
    var strategy = new Strategy({
      secretOrKey: config.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeader()
    }, function(payload, done) {
      User.findOne({
        'email': payload.email,
        'token': payload
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(new Error('User not found'), null);
        }
        return done(null, user);
      });
    });
    passport.use(strategy);
  }
};