angular.module('willsBlog', ['ngResource', 'ngRoute']);

angular.module('willsBlog').config(function($routeProvider, $locationProvider){
    $locationProvider.html5Mode(true);

    $routeProvider
    .when('/', {
      templateUrl: '/partials/main/main',
      controller: 'mainCtrl'})
    .when('/account', {
      templateUrl: '/partials/login/login',
      controller: 'loginCtrl'})
    .when('/admin/users', {
      templateUrl: '/partials/admin/users-list',
      controller: 'userListCtrl',
      resolve: {
          auth: function(mvAuth){
            return mvAuth.authorizeCurrentUserForRoute('admin')
          }
        }
    });

});//end config

angular.module('willsBlog').run(function($rootScope, $location){
  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
      if(rejection === 'not authorized') {
        $location.path('/');
      }
  });
});
