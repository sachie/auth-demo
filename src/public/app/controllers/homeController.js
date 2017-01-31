'use strict';

const HomeController = function($scope) {
  $scope.title = 'Home';
};

module.exports = {
  attach: app => app.controller('HomeController', HomeController)
};