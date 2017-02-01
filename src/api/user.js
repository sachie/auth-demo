'use strict';

const passport = require('passport');

module.exports = {
  configure: router => {
    router.get('/user', passport.authenticate('jwt', {
      session: false
    }), (req, res) => {
      res.send({
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email
      });
    });
  }
};