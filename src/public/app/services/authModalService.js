'use strict';

const authModal = function($state, $uibModal, $rootScope) {
  return () => $uibModal
    .open({
      size: 'sm',
      templateUrl: 'views/authModalTemplate.html',
      controller: 'AuthModalController',
    })
    .result
    .then((user) => {
      $rootScope.currentUser = user;
      $state.go('app.home');
    })
    .catch(error => {
      if (error && error instanceof Error) {
        console.log(error);
      }
    });
};

module.exports = {
  attach: app => app.service('authModal', authModal)
};