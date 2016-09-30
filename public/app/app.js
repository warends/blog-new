var willsBlog = angular.module('willsBlog', ['ngResource', ,'ngAnimate', 'ngRoute','ngSanitize', 'ui.bootstrap']);

willsBlog.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

  var routeRoleChecks = {
    admin: {auth: function(mvAuth){
        return mvAuth.authorizeCurrentUserForRoute('admin');
    }},
    user: {auth: function(mvAuth){
        return mvAuth.authorizeAutheticatedUserForRoute();
    }}
  }

    $locationProvider.html5Mode(true);

    $routeProvider
    .when('/', {
      templateUrl: '/partials/main/main',
      controller: 'mainCtrl'
    })
    .when('/account', {
      templateUrl: '/partials/login/login',
      controller: 'loginCtrl'
    })
    .when('/signup', {
      templateUrl: '/partials/login/signup',
      controller: 'signupCtrl'
    })
    .when('/blog', {
      templateUrl: '/partials/blog/blog-list',
      controller: 'blogListCtrl'
    })
    .when('/admin/new-post', {
      templateUrl: '/partials/blog/new-post',
      controller: 'newPostCtrl',
      resolve: routeRoleChecks.admin
    })
    .when('/profile', {
      templateUrl: '/partials/admin/profile',
      controller: 'profileCtrl',
      resolve: routeRoleChecks.user
    })
    .when('/posts/:slug', {
      templateUrl: '/partials/blog/post-detail',
      controller: 'postDetailCtrl'
    })
    .when('/edit/posts/:slug', {
      templateUrl: '/partials/blog/edit-post',
      controller: 'editPostCtrl',
      resolve: routeRoleChecks.admin
    })
    .when('/admin/users', {
      templateUrl: '/partials/admin/users-list',
      controller: 'userListCtrl',
      resolve: routeRoleChecks.admin
    });

}]);//end config

willsBlog.run(function($rootScope, $location, $anchorScroll, $routeParams){

  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
      if(rejection === 'not authorized') {
        $location.path('/');
      }
  });

});
