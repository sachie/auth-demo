'use strict';

/**
 * Root app controller.
 */
const MainController = function($scope, $state, $cookies, $http, $rootScope,
    authModal, loggedIn) {
  $scope.loggedIn = loggedIn;
  $scope.login = authModal;

  $scope.logout = () => {
    $http.post('/auth/logout');
    $cookies.remove('token');
    $rootScope.user = null;
    $state.reload();
  };

  const getProfile = () => {
    $rootScope.loadingUser = true;
    $http.get('/api/user')
      .then(response => {
        $rootScope.loadingUser = false;
        $rootScope.user = response.data;
      }, (error) => {
        $rootScope.loadingUser = false;
        console.log(error.data);
      });
  };

  if (!$rootScope.user && loggedIn()) {
    getProfile();
  }
};

module.exports = {
  attach: app => app.controller('MainController', MainController)
};