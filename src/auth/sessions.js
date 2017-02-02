'use strict';

const Session = require('../models/session');
const validate = require('../middleware/validate');
const oneTouch = require('../lib/oneTouch');

module.exports = {
  configure: router => {
    router
      .post('/authy/status', validate('body', ['oneTouchId', 'token']), (req, res) => {
        oneTouch.checkStatus(req.body.oneTouchId, (error, authyResponse) => {
          if (error) {
            return res.status(500).send('There was an error while checking your status.');
          }
          const status = authyResponse.body.approval_request.status;
          if (status === 'approved') {
            Session.findOneAndUpdate({
              token: req.body.token
            }, {
              verified: true
            }, {}, (error) => {
              if (error) {
                res.status(500).send('Error updating session, please try again.');
              }
              res.send({
                status: status
              });
            });
          } else {
            res.send({
              status: status
            });
          }
        });
      });

    router.post('/session/verify', (req, res) => {
      var oneTimeCode = req.body.code;

      if (!req.session || !req.user) {
        return res.status(404).send('No valid session found for this token.');
      }

      req.user.verifyAuthyToken(oneTimeCode, error => {
        if (error) {
          return res.status(401).send('Invalid confirmation code.');
        }

        req.session.confirmed = true;
        req.session.save(error => {
          if (error) {
            return res.status(500).send('There was an error validating your session.');
          }
          res.send({
            token: req.session.token
          });
        });
      });
    });

    router.post('/session/resend', (req, res) => {
      if (!req.user) {
        return res.status(404).send('No user found for this session, please log in again.');
      }

      req.user.sendAuthyToken(() => {
        if (!req.user) {
          return res.status(500).send('No user found for this session, please log in again.');
        }
        res.status(200).send();
      });
    });
  }
};