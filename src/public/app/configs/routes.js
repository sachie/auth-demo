'use strict';

const routeConfig = function($stateProvider, $urlRouterProvider,
    $locationProvider) {
  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'views/main.html',
      controller: 'MainController'
    })
    .state('app.home', {
      url: '/',
      templateUrl: 'views/home.html'
    })
    .state('app.about', {
      url: '/about',
      templateUrl: 'views/about.html'
    });
  $urlRouterProvider.otherwise('/');
  if (window.history && window.history.pushState) {
    $locationProvider.html5Mode(true);
  }
};

module.exports = {
  attach: (app) => app.config(routeConfig)
};