'use strict';

const authHeader = function($http, $cookies) {
  if ($cookies.get('token')) {
    $http.defaults.headers.common['X-API-TOKEN'] = $cookies.get('token');
  }
};

module.exports = {
  attach: (app) => app.run(authHeader)
};