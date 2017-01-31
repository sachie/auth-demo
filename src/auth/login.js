'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const jwt = require('simple-jwt');

const config = require('../configs/auth');
const User = require('../models/user');

const isValidPassword = function(user, password) {
  return bcrypt.compareSync(password, user.password);
};

module.exports = {
  configure: () => {
    passport.use('login', new LocalStrategy({
      usernameField: 'email',
      passReqToCallback: true
    }, function(req, email, password, done) {
      User.findOne({
        'email': email
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, req.flash('message', 'User Not found.'));
        }
        if (!isValidPassword(user, password)) {
          return done(null, false, req.flash('message', 'Invalid Password'));
        }
        var payload = {
          email: user.email
        };
        var token = jwt.encode(payload, config.jwtSecret);
        user.token = token;
        user.save(function(err) {
          if (err) {
            return done(err);
          }
          return done(null, user);
        });
      });
    }));
  }
};