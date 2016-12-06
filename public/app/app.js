angular.module('willsBlog', ['ngResource','ngAnimate','ngRoute','ngSanitize']);

angular.module('willsBlog').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

  var routeRoleChecks = {
    admin: function(mvAuth){
        return mvAuth.authorizeCurrentUserForRoute('admin');
    },
    user: function(mvAuth){
        return mvAuth.authorizeAutheticatedUserForRoute();
    }
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
    .when('/profile', {
      templateUrl: '/partials/admin/profile',
      controller: 'profileCtrl',
      resolve: routeRoleChecks.user
    })
    .when('/posts/:id', { //view single post
      templateUrl: '/partials/blog/post-detail',
      controller: 'postDetailCtrl'
    })
    .when('/admin/new-post', {  //adding a new post
      templateUrl: '/partials/blog/new-post',
      controller: 'newPostCtrl',
      resolve: routeRoleChecks.admin
    })
    .when('/admin/:id/edit', {  //edit post
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


angular.module('willsBlog').run(['$rootScope', '$location', '$routeParams', function($rootScope, $location, $routeParams){

  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
      if(rejection === 'not authorized') {
        $location.path('/');
      }
  });

}]);
