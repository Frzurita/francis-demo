// CSS dependecies
require('../css/app.css');

window.moment = require('moment');
window.$ = window.jQuery = require('jquery');
require('slimscroll');
require('pace');
require('angular');
require('satellizer');
require('oclazyload');
require('angular-translate');
require('angular-ui-router');
require('ng-idle');
require('angular-animate');
require('angular-aria');
require('angular-messages');
require('angular-material');

var app = angular.module('demoApp', [
    'ui.router',                    // Routing
    'oc.lazyLoad',                  // ocLazyLoad
    'pascalprecht.translate',       // Angular Translate
    'ngIdle',                    // Image Crop
    'satellizer',
    'ngMaterial',
    'ngMessages'
]);

var routes = require('./config.js');
routes(app);

var controllers = require('./controllers.js');
controllers(app);

var directives = require('./directives.js');
directives(app);