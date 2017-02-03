'use strict';

var request = require('request');
var querystring = require('querystring');

var config = require('../configs');

var authy = require('authy')(config.authyKey);

/**
 * Helper methods to call the authy One Touch APIs.
 * @type {Object}
 */
module.exports = {

  /**
   * Creates a One Touch request for the user.
   * @param  {*}   id       The user's ID.
   * @param  {*}   details  Extra details for the request.
   * @param  {Function} callback Callback function.
   */
  requestApproval: (id, details, callback) => {
    authy._request('post', '/onetouch/json/users/' + querystring.escape(id) +
      '/approval_requests', {
        'details[Email Address]': details.email,
        'message': details.message
      }, callback);
  },

  /**
   * Checks the status of a One Touch request.
   * @param  {*}   id       The One Touch request ID.
   * @param  {Function} callback Callback function.
   */
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