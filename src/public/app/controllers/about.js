'use strict';

const AboutController = function($scope) {
  $scope.title = 'About';
};

module.exports = {
  attach: app => app.controller('AboutController', AboutController)
};