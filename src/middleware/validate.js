'use strict';

module.exports = (location, keys) => (req, res, next) => {
  let message = '';
  let count = 1;
  keys.forEach(key => {
    if (!(key in req[location])) {
      message += `${count}. ${location} ` +
          `is missing the required attribute "${key}".\n`;
      count++;
    }
  });
  if (message !== '') {
    return res.status(400).send(`Errors in request:\n${message}`);
  }
  next();
};
