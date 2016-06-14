angular.module('willsBlog', ['ngResource', 'ngRoute']);

angular.module('willsBlog').config(function($routeProvider, $locationProvider){
    $locationProvider.html5Mode(true);

    $routeProvider
    .when('/', {
      templateUrl: '/partials/main/main',
      controller: 'mainCtrl'})
    .when('/login', {
      templateUrl: '/partials/login/login',
      controller: 'loginCtrl'});
});
