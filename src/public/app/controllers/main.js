'use strict';

const MainController = function($scope, loginModal) {
  $scope.title = 'Main';
  $scope.login = loginModal;
};

module.exports = {
  attach: app => app.controller('MainController', MainController)
};