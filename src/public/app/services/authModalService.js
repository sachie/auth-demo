'use strict';

/**
 * Service to open the authentication modal.
 */
const authModal = function($state, $uibModal) {
  return () => $uibModal
    .open({
      size: 'sm',
      templateUrl: 'views/authModal.html',
      controller: 'AuthModalController',
    })
    .result
    .catch(error => {
      if (error && error instanceof Error) {
        console.log(error);
      }
    });
};

module.exports = {
  attach: app => app.service('authModal', authModal)
};