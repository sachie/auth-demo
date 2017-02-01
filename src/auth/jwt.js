'use strict';

const passport = require('passport');
const Strategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const config = require('../configs/auth');
const User = require('../models/user');

module.exports = {
  configure: () => {
    var strategy = new Strategy({
      secretOrKey: config.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeader(),
      passReqToCallback: true
    }, function(req, payload, done) {
      User.findOne({
        _id: payload.id,
        email: payload.email
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