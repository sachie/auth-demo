'use strict';

/**
 * Controller for the authentication modal.
 */
const AuthModalController = function($scope, $state, $http, $cookies) {
  $scope.cancel = $scope.$dismiss;

  $scope.switchToRegister = () => {
    $scope.authState = 'register';
  };
  $scope.switchToLogin = () => {
    $scope.authState = 'login';
  };
  $scope.switchToVerify = () => {
    $scope.authState = 'verify';
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
        $scope.sessionToken = response.data.token;
        if (response.data.authyResponse.success) {
          $scope.oneTouchCancelled = false;
          $scope.getOneTouchResult(response.data.authyResponse.approval_request.uuid);
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
        $scope.sessionToken = response.data.token;
        if (response.data.authyResponse.success) {
          $scope.oneTouchCancelled = false;
          $scope.getOneTouchResult(response.data.authyResponse.approval_request.uuid);
        } else {
          $scope.switchToVerify();
        }
      }, (error) => {
        $scope.registering = false;
        $scope.registerError = error.data;
      });
  };

  $scope.getOneTouchResult = oneTouchId => {
    $scope.awaitingOneTouchResult = true;
    $http.post('/auth/authy/status', {
      oneTouchId
    }, {
      headers: {
        'X-API-TOKEN': $scope.sessionToken
      }
    })
      .then((response) => {
        if ($scope.oneTouchCancelled) {
          $scope.awaitingOneTouchResult = false;
          $scope.clearErrors();
        } else if (response.data.status == 'approved') {
          $scope.awaitingOneTouchResult = false;
          $scope.saveSession();
          $state.reload();
          $scope.$close(null);
        } else if (response.data.status == 'denied') {
          $scope.awaitingOneTouchResult = false;
          $scope.oneTouchError = 'OneTouch login denied.';
        } else {
          setTimeout($scope.getOneTouchResult(oneTouchId), 2000);
        }
      }, (error) => {
        $scope.awaitingOneTouchResult = false;
        $scope.oneTouchError = error.data;
      });
  };

  $scope.sendCode = () => {
    if ($scope.authState !== 'verify') {
      $scope.switchToVerify();
    }
    $scope.oneTouchCancelled = true;
    $scope.sendingOneTimeCode = true;
    $scope.verifyError = false;
    $http.post('/auth/session/resend', {}, {
      headers: {
        'X-API-TOKEN': $scope.sessionToken
      }
    })
      .then(() => {
        $scope.sendingOneTimeCode = false;
      }, error => {
        $scope.verifyError = error.data;
        $scope.sendingOneTimeCode = false;
      });
  };

  $scope.verify = oneTimeCode => {
    $scope.verifying = true;
    $scope.verifyError = false;
    $http.post('/auth/session/verify', {
      oneTimeCode
    }, {
      headers: {
        'X-API-TOKEN': $scope.sessionToken
      }
    })
      .then(() => {
        $scope.verifying = false;
        $scope.saveSession();
        $state.reload();
        $scope.$close(null);
      }, error => {
        $scope.verifyError = error.data;
        $scope.verifying = false;
      });
  };

  $scope.saveSession = () => {
    $cookies.put('token', $scope.sessionToken);
    $http.defaults.headers.common['X-API-TOKEN'] = $scope.sessionToken;
  };
};

module.exports = {
  attach: app => app.controller('AuthModalController', AuthModalController)
};