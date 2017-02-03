'use strict';

const User = require('../models/user');
const validate = require('../middleware/validate');

/**
 * Registers the login and logout routes.
 * @type {Object}
 */
module.exports = {
  configure: (router) => {
    router
      .post('/login', validate('body', ['email', 'password']), (req, res) => {
        const email = req.body.email;
        const candidatePassword = req.body.password;
        User.findOne({
          email: email
        }, function(error, user) {
          if (error || !user) {
            return res.status(403).send('Incorrect email or password.');
          }
          user.comparePassword(candidatePassword, (error, isMatch) => {
            if (error || !isMatch) {
              return res.status(403).send('Incorrect email or password.');
            }
            return user.createSession((error, session, authyResponse) => {
              if (error) {
                res.status(500).send('Error while logging in, please try again.');
              } else {
                res.send({
                  token: session.token,
                  authyResponse: authyResponse
                });
              }
            });
          });
        });
      });

    router.post('/logout', (req, res) => {
      req.session.remove(err => {
        if (err) {
          res.status(500).send('There was a problem logging you out, please try again.');
        } else {
          res.send();
        }
      });
    });
  }
};