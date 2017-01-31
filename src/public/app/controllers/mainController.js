'use strict';

const MainController = function($scope, authModal) {
  $scope.login = authModal;
};

module.exports = {
  attach: app => app.controller('MainController', MainController)
};