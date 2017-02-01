'use strict';

const AuthModalController = function($scope, $state, $http, $cookies) {
  $scope.cancel = $scope.$dismiss;
  $scope.loginError = false;
  $scope.loggingIn = false;
  $scope.registerError = false;
  $scope.registering = false;
  $scope.switchToRegister = () => {
    $scope.authState = 'register';
  };
  $scope.switchToLogin = () => {
    $scope.authState = 'login';
  };
  $scope.login = (email, password) => {
    $scope.loggingIn = true;
    $scope.loginError = false;
    $http.post('/auth/login', {
      email,
      password
    })
      .then(() => {
        $scope.loggingIn = false;
        $scope.postLogin();
        $state.reload();
        $scope.$close(null);
      }, (error) => {
        $scope.loggingIn = false;
        $scope.loginError = error.data;
      });
  };
  $scope.register = (email, password, firstName, lastName) => {
    $scope.registering = true;
    $scope.registerError = false;
    $http.post('/auth/register', {
      email,
      password,
      firstName,
      lastName
    })
      .then(() => {
        $scope.registering = false;
        $scope.postLogin();
        $state.reload();
        $scope.$close(null);
      }, (error) => {
        $scope.registering = false;
        $scope.registerError = error.data;
      });
  };
  $scope.postLogin = () => {
    if ($cookies.get('token')) {
      $http.defaults.headers.common.Authorization = 'JWT ' +
          $cookies.get('token');
    }
  };
};

module.exports = {
  attach: app => app.controller('AuthModalController', AuthModalController)
};