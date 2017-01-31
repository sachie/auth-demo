'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

const User = require('../models/user');

const createHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

module.exports = {
  configure: () => {
    passport.use('signup', new LocalStrategy({
      usernameField: 'email',
      passReqToCallback: true
    }, function(req, email, password, done) {
      const findOrCreateUser = function() {
        User.findOne({
          'email': email
        }, function(err, user) {
          if (err) {
            return done(err);
          }
          if (user) {
            return done(null, false, req.flash('message',
                'User Already Exists'));
          } else {
            var newUser = new User();
            newUser.email = email;
            newUser.password = createHash(password);
            newUser.firstName = req.param('firstName');
            newUser.lastName = req.param('lastName');
            newUser.save(function(err) {
              if (err) {
                return done(err);
              }
              return done(null, newUser);
            });
          }
        });
      };
      process.nextTick(findOrCreateUser);
    }));
  }
};