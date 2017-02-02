'use strict';

const User = require('../models/user');
const validate = require('../middleware/validate');

module.exports = {
  configure: router => {
    router.post('/register', validate('body', ['email', 'password', 'fullName',
      'countryCode', 'phone']), (req, res) => {
        User.findOne({
          email: req.body.email
        }, (err, foundUser) => {
          if (foundUser) {
            res.status(401).send('Email is already in use.');
          } else {
            User.create({
              fullName: req.body.fullName,
              email: req.body.email,
              phone: req.body.phone,
              countryCode: req.body.countryCode,
              password: req.body.password
            }, (err, user) => {
              if (err) {
                res.status(500).send('Error saving new user, please try again.');
              } else {
                user.createSession((err, session, authyResponse) => {
                  if (err) {
                    res.status(500).send('Your user was created but we could ' +
                        'not log you in, please log in again.');
                  } else {
                    res.send({
                      token: session.token,
                      authyResponse: authyResponse
                    });
                  }
                });
              }
            });
          }
        });
      });
  }
};