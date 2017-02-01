'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
const getToken = require('../lib/token').getToken;
const validate = require('../lib/validate');

module.exports = {
  configure: router => {
    passport.use('login', new LocalStrategy({
      usernameField: 'email',
      passReqToCallback: true
    }, (req, email, password, done) => {
      User.findOne({
        'email': email
      }, (error, user) => {
        if (error) {
          done(error, false, 'Authentication error.');
        } else if (!user) {
          done(null, false, 'Incorrect username or password.');
        } else {
          user.comparePassword(password, function(error, isMatch) {
            if (error) {
              done(error);
            } else if (!isMatch) {
              done(null, false, 'Incorrect username or password.');
            } else {
              done(null, user);
            }
          });
        }
      });
    }));

    router.post('/login', validate('body', ['email', 'password']),
        (req, res, next) => {
          passport.authenticate('login', (err, user, info) => {
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