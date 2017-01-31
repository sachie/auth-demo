'use strict';

const angular = require('angular');
const angularUiRouter = require('angular-ui-router');
const angularUiBootstrap = require('angular-ui-bootstrap');
const routes = require('./configs/routes');
const main = require('./controllers/main');
const home = require('./controllers/home');
const about = require('./controllers/about');
const loginModal = require('./controllers/loginModal');
const loginModalService = require('./services/loginModalService');

var app = angular.module('authDemoApp', [angularUiRouter, angularUiBootstrap]);

routes.attach(app);

loginModalService.attach(app);

loginModal.attach(app);

main.attach(app);
home.attach(app);
about.attach(app);