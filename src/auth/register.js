'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const getToken = require('../lib/token').getToken;
const validate = require('../lib/validate');

module.exports = {
  configure: router => {
    passport.use('register', new LocalStrategy({
      usernameField: 'email',
      passReqToCallback: true
    }, function(req, email, password, done) {
      const findOrCreateUser = function() {
        User.findOne({
          'email': email
        }, function(error, foundUser) {
          if (error) {
            done(error, false, 'Authentication error.');
          } else if (foundUser) {
            done(null, false, 'This email is already in use.');
          } else {
            User.create({
              email: email,
              password: password,
              firstName: req.body.firstName,
              lastName: req.body.lastName
            }, function(error, savedUser) {
              if (error) {
                done(error, false, 'Authentication error.');
              } else {
                done(null, savedUser);
              }
            });
          }
        });
      };
      process.nextTick(findOrCreateUser);
    }));

    router.post('/register', validate('body', ['email', 'password',
      'firstName', 'lastName']), (req, res, next) => {
        passport.authenticate('register', (err, user, info) => {
          if (err) {
            next(err);
          } else if (!user) {
            res.status(401).send(info);
          } else {
            res.cookie('token', getToken(user), {
              maxAge: 3600000 * 24 * 7,
              httpOnly: false
            }).send();
          }
        })(req, res, next);
      });
  }
};