'use strict';

const angular = require('angular');
const angularUiRouter = require('angular-ui-router');
const angularUiBootstrap = require('angular-ui-bootstrap');

const routes = require('./configs/routes');
const mainController = require('./controllers/mainController');
const homeController = require('./controllers/homeController');
const aboutController = require('./controllers/aboutController');
const authModalController = require('./controllers/authModalController');
const authModalService = require('./services/authModalService');
const compareTo = require('./directives/compareTo');

const app = angular.module('authDemoApp', [angularUiRouter, angularUiBootstrap]);

routes.attach(app);

mainController.attach(app);
homeController.attach(app);
aboutController.attach(app);

authModalService.attach(app);
authModalController.attach(app);

compareTo.attach(app);