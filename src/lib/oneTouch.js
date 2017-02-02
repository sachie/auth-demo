'use strict';

var request = require('request');
var querystring = require('querystring');

var config = require('../configs');

var authy = require('authy')(config.authyKey);

module.exports = {
  requestApproval: (id, details, callback) => {
    authy._request('post', '/onetouch/json/users/' + querystring.escape(id) +
      '/approval_requests', {
        'details[Email Address]': details.email,
        'message': details.message
      }, callback);
  },
  checkStatus: (id, callback) => {
    var options = {
      url: 'https://api.authy.com/onetouch/json/approval_requests/' +
          querystring.escape(id),
      form: {
        'api_key': config.authyKey
      },
      qs: {
        'api_key': config.authyKey
      },
      json: true,
      jar: false,
      strictSSL: true
    };
    request.get(options, callback);
  }
};