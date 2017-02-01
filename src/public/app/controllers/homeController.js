'use strict';

const HomeController = function($scope, $http, loggedIn) {};

module.exports = {
  attach: app => app.controller('HomeController', HomeController)
};