'use strict';

const loggedIn = function($cookies) {
  return () => !!$cookies.get('token');
};

module.exports = {
  attach: app => app.service('loggedIn', loggedIn)
};