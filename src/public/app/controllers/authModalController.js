'use strict';

const AuthModalController = function($scope, $state, $http, $cookies) {
  $scope.cancel = $scope.$dismiss;

  $scope.switchToRegister = () => {
    $scope.authState = 'register';
  };
  $scope.switchToLogin = () => {
    $scope.authState = 'login';
  };
  $scope.switchToVerify = () => {
    // $scope.authState = 'verify';
  };

  $scope.clearErrors = () => {
    $scope.loginError = false;
    $scope.registerError = false;
    $scope.oneTouchError = false;
  };

  $scope.login = (email, password) => {
    $scope.loggingIn = true;
    $scope.clearErrors();
    $http.post('/auth/login', {
      email,
      password
    })
      .then((response) => {
        $scope.loggingIn = false;
        if (response.data.authyResponse.success) {
          $scope.oneTouchCancelled = false;
          $scope.getOneTouchResult(
              response.data.authyResponse.approval_request.uuid,
              response.data.token);
        } else {
          $scope.switchToVerify();
        }
      }, (error) => {
        $scope.loggingIn = false;
        $scope.loginError = error.data;
      });
  };

  $scope.register = (email, password, fullName, countryCode, phone) => {
    $scope.registering = true;
    $scope.clearErrors();
    $http.post('/auth/register', {
      fullName,
      countryCode,
      phone,
      email,
      password
    })
      .then((response) => {
        $scope.registering = false;
        if (response.data.authyResponse.success) {
          $scope.oneTouchCancelled = false;
          $scope.getOneTouchResult(
              response.data.authyResponse.approval_request.uuid,
              response.data.token);
        } else {
          $scope.switchToVerify();
        }
      }, (error) => {
        $scope.registering = false;
        $scope.registerError = error.data;
      });
  };

  $scope.getOneTouchResult = (oneTouchId, sessionToken) => {
    $scope.awaitingOneTouchResult = true;
    $http.post('/auth/authy/status', {
      oneTouchId,
      token: sessionToken
    })
      .then((response) => {
        if ($scope.oneTouchCancelled) {
          $scope.awaitingOneTouchResult = false;
          $scope.clearErrors();
        } else if (response.data.status == 'approved') {
          $scope.awaitingOneTouchResult = false;
          $scope.saveSession(sessionToken);
          $state.reload();
          $scope.$close(null);
        } else if (response.data.status == 'denied') {
          $scope.awaitingOneTouchResult = false;
          $scope.oneTouchError = 'OneTouch login denied.';
        } else {
          setTimeout($scope.getOneTouchResult(oneTouchId, sessionToken), 3000);
        }
      }, (error) => {
        $scope.awaitingOneTouchResult = false;
        $scope.oneTouchError = error.data;
      });
  };

  $scope.cancelOneTouch = () => {
    $scope.oneTouchCancelled = true;
  };

  $scope.saveSession = sessionToken => {
    $cookies.put('token', sessionToken);
    $http.defaults.headers.common['X-API-TOKEN'] = sessionToken;
  };
};

module.exports = {
  attach: app => app.controller('AuthModalController', AuthModalController)
};