'use strict';

const validate = require('../middleware/validate');
const oneTouch = require('../lib/oneTouch');

/**
 * Registers routes for managing login sessions.
 * @type {Object}
 */
module.exports = {
  configure: router => {

    /**
     * Route for checking status of a One Touch request.
     */
    router
      .post('/authy/status', validate('body', ['oneTouchId']), (req, res) => {
        if (!req.session || !req.user) {
          return res.status(404).send('No valid session found for this token.');
        }
        oneTouch.checkStatus(req.body.oneTouchId, (error, authyResponse) => {
          if (error) {
            return res.status(500).send('There was an error while checking your status.');
          }
          const status = authyResponse.body.approval_request.status;
          if (status === 'approved') {
            req.session.verified = true;
            req.session.save((error) => {
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

    /**
     * Route for submitting a verification code.
     */
    router
      .post('/session/verify', validate('body', ['oneTimeCode']), (req, res) => {
        if (!req.session || !req.user) {
          return res.status(404).send('No valid session found for this token.');
        }
        req.user.verifyAuthyToken(req.body.oneTimeCode, error => {
          if (error) {
            return res.status(401).send('Invalid confirmation code.');
          }
          req.session.verified = true;
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

    /**
     * Route for resending a verification code.
     */
    router
      .post('/session/resend', (req, res) => {
        if (!req.user) {
          return res.status(404).send('No user found for this session, please log in again.');
        }
        req.user.sendAuthyToken(() => {
          res.status(200).send();
        });
      });
  }
};