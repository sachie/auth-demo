'use strict';

const loginRequired = require('../middleware/loginRequired');

/**
 * Registers the route for fetching current user.
 * @type {Object}
 */
module.exports = {
  configure: router => {
    router.get('/user', loginRequired, (req, res) => {
      res.send({
        id: req.user._id,
        fullName: req.user.fullName,
        countryCode: req.user.countryCode,
        phone: req.user.phone,
        email: req.user.email
      });
    });
  }
};