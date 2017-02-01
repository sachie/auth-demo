'use strict';

const authHeader = function($http, $cookies) {
  if ($cookies.get('token')) {
    $http.defaults.headers.common.Authorization = 'JWT ' +
        $cookies.get('token');
  }
};

module.exports = {
  attach: (app) => app.run(authHeader)
};