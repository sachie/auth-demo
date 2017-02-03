'use strict';

/**
 * Service to check if the user is logged in.
 */
const loggedIn = function($cookies) {
  return () => !!$cookies.get('token');
};

module.exports = {
  attach: app => app.service('loggedIn', loggedIn)
};