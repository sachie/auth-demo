'use strict';

const loginModalController = function($scope) {
  this.cancel = $scope.$dismiss;
  this.submit = (email, password) => {
    Promise.resolve().then(user => {
      user = {
        email,
        password
      };
      $scope.$close(user);
    });
  };
};

module.exports = {
  attach: app => app.controller('loginModalController', loginModalController)
};