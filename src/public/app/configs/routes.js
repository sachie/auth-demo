'use strict';

const routeConfig = function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      abstract: true,
      templateUrl: 'views/main.html',
      controller: 'MainController'
    })
    .state('app.home', {
      url: '/',
      templateUrl: 'views/home.html',
      controller: 'HomeController'
    })
    .state('app.about', {
      url: '/about',
      templateUrl: 'views/about.html',
      controller: 'AboutController'
    });
  $urlRouterProvider.otherwise('/');
};

module.exports = {
  attach: (app) => app.config(routeConfig)
};