'use strict';

const AuthModalController = function($scope) {
  $scope.cancel = $scope.$dismiss;
  $scope.switchToSignUp = ()=>{
    $scope.authState = 'signup';
  };
  $scope.switchToLogin = ()=>{
    $scope.authState = 'login';
  };
  $scope.submit = (email, password) => {
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
  attach: app => app.controller('AuthModalController', AuthModalController)
};