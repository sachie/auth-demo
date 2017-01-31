'use strict';

const loginModal = function($state, $uibModal, $rootScope) {
  return () => $uibModal
    .open({
      templateUrl: 'views/loginModalTemplate.html',
      controller: 'loginModalController',
      controllerAs: 'loginModalController'
    })
    .result
    .then((user) => {
      $rootScope.currentUser = user;
      $state.go('app.home');
    });
};

module.exports = {
  attach: app => app.service('loginModal', loginModal)
};