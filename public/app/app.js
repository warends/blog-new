angular.module('willsBlog', ['ngResource', 'ngAnimate', 'ngSanitize', 'ui.router']);

angular.module('willsBlog').config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider){

    var routeRoleChecks = {
      admin: function(mvAuth){
          return mvAuth.authorizeCurrentUserForRoute('admin');
      },
      user: function(mvAuth){
          return mvAuth.authorizeAutheticatedUserForRoute();
      }
    }

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);

    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/partials/main/main',
      controller: 'mainCtrl'
    })
    .state('account', {
      url: '/account',
      templateUrl: '/partials/login/login',
      controller: 'loginCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: '/partials/login/signup',
      controller: 'signupCtrl'
    })
    .state('posts', {
      url: '/posts',
      templateUrl: '/partials/blog/blog-list',
      controller: 'blogListCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: '/partials/admin/profile',
      controller: 'profileCtrl',
      resolve: {
        routeRoleCheck: ['mvAuth', function(mvAuth){
            return mvAuth.authorizeAutheticatedUserForRoute();
        }
      ]}
    })
    .state('postDetail', { //view single post
      url: '/posts/:slug',
      templateUrl: '/partials/blog/post-detail',
      controller: 'postDetailCtrl'
    })
    .state('newPost', {  //adding a new post
      url: '/admin/new-post',
      templateUrl: '/partials/blog/new-post',
      controller: 'newPostCtrl',
      resolve: {
        routeRoleCheck: ['mvAuth', function(mvAuth){
            return mvAuth.authorizeCurrentUserForRoute('admin');
        }
      ]}
    })
    .state('editPost', {  //edit post
      url: '/admin/:slug/edit',
      templateUrl: '/partials/blog/edit-post',
      controller: 'editPostCtrl',
      resolve: {
        routeRoleCheck: ['mvAuth', function(mvAuth){
            return mvAuth.authorizeCurrentUserForRoute('admin');
        }
      ]}
    })
    .state('users', {
      url: '/admin/users',
      templateUrl: '/partials/admin/users-list',
      controller: 'userListCtrl',
      resolve: {
        routeRoleCheck: ['mvAuth', function(mvAuth){
            return mvAuth.authorizeCurrentUserForRoute('admin');
        }
      ]}
    });

}]);//end config


angular.module('willsBlog').run(['$rootScope', '$location', '$anchorScroll', function($rootScope, $location, $anchorScroll){

  $anchorScroll.yOffset = 60;

  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
      if(rejection === 'not authorized') {
        $location.path('/');
      }
  });

  $rootScope.$on("$stateChangeSuccess", function (event, currentRoute, previousRoute) {
    window.scrollTo(0, 0);
  });

}]);
