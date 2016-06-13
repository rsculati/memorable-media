'use strict';

/**
 * @ngdoc overview
 * @name memorableAppApp
 * @description
 * # memorableAppApp
 *
 * Main module of the application.
 */
angular
  .module('memorableAppApp', [
    'ngRoute'
  ])
  //, $locationProvider
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/list.html',
        controller: 'ListCtrl',
        controllerAs: 'list'
      })
      .when('/detail/:param1', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/blog/16-best-montreal-cocktail-bars-spring-summer-2016', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/blog/11-best-montreal-terasse-summer-2016', {
        templateUrl: 'views/blog.html'
        // controller: 'AboutCtrl',
        // controllerAs: 'about'
      })
      .when('/blog/16-best-montreal-brunches-summer-2016', {
        templateUrl: 'views/brunch.html'
        // controller: 'AboutCtrl',
        // controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });

      // enable HTML5 mode as hashbang-type URLs will not work with mod_rewrite redirection
      $locationProvider.html5Mode(true).hashPrefix('!');

  });
