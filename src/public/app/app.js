'use strict';

const angular = require('angular');
const angularUiRouter = require('angular-ui-router');
const angularUiBootstrap = require('angular-ui-bootstrap');
const angularAnimate = require('angular-animate');
const angularCookies = require('angular-cookies');
const angularMd5 = require('angular-md5');

const routes = require('./configs/routes');
const authHeader = require('./configs/authHeader');
const mainController = require('./controllers/mainController');
const homeController = require('./controllers/homeController');
const authModalController = require('./controllers/authModalController');
const authModalService = require('./services/authModalService');
const loggedIn = require('./services/loggedIn');
const compareTo = require('./directives/compareTo');

const app = angular.module('authDemoApp', [angularUiRouter, angularUiBootstrap,
  angularAnimate, angularCookies, angularMd5]);

routes.attach(app);
authHeader.attach(app);

mainController.attach(app);
homeController.attach(app);
authModalController.attach(app);

authModalService.attach(app);
loggedIn.attach(app);

compareTo.attach(app);