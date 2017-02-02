'use strict';

var Qs = require('qs');

var config = require('../configs');

function sortObject(object) {
  var sortedObj = {};
  var keys = Object.keys(object).sort();

  for (var index in keys) {
    var key = keys[index];
    if (typeof object[key] == 'object' && !(object[key] instanceof Array) &&
        object[key] != null) {
      sortedObj[key] = sortObject(object[key]);
    } else {
      sortedObj[key] = object[key];
    }
  }
  return sortedObj;
}

module.exports = function(request, response, next) {
  var key = config.authyApiKey;
  var url = request.protocol + '://' + request.get('host') + request.originalUrl;
  var params = Qs.stringify(sortObject(request.body));
  params = params.replace(/%20/g, '+');
  var nonce = request.get('X-Authy-Signature-Nonce');

  var message = nonce + '|' + request.method + '|' + url + '|' + params;

  var theirs = (request.get('X-Authy-Signature')).trim();
  var mine = crypto.createHmac('sha256', key).update(message).digest('base64');
  if (theirs != mine) {
    response.status(401).send({
      status: 401,
      message: 'This request is unsigned.'
    });
  } else {
    next();
  }
};
