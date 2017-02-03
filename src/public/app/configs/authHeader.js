'use strict';

const authHeader = function($http, $cookies) {
  if ($cookies.get('token')) {
    $http.defaults.headers.common['X-API-TOKEN'] = $cookies.get('token');
  }
};

/**
 * Adds a default header with the session token, if it is available.
 * @type {Object}
 */
module.exports = {
  attach: (app) => app.run(authHeader)
};