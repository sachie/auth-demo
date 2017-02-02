'use strict';

module.exports = (req, res, next) => {
  if (!req.session || !req.session.verified) {
    res.status(403).send({
      message: 'Your session has expired, please log in again.'
    });
  } else {
    next();
  }
};
