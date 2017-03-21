angular.module('willsBlog', ['users', 'ngResource', 'ngSanitize', 'ui.router', 'duScroll', 'gist', 'ngScrollReveal']);

angular.module('willsBlog').config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider){

    var routeRoleChecks = {
      admin: function(AuthFactory){
          return AuthFactory.authorizeCurrentUserForRoute('admin');
      },
      user: function(AuthFactory){
          return AuthFactory.authorizeAutheticatedUserForRoute();
      }
    }

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);

    $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/partials/main/main',
      controller: 'MainController'
    })
    .state('account', {
      url: '/account',
      templateUrl: '/partials/login/login',
      controller: 'LoginController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: '/partials/login/signup',
      controller: 'SignupController'
    })
    .state('posts', {
      url: '/posts',
      templateUrl: '/partials/blog/blog-list',
      controller: 'BlogListController'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: '/partials/admin/profile',
      controller: 'ProfileController',
      resolve: {
        routeRoleCheck: ['AuthFactory', function(AuthFactory){
            return AuthFactory.authorizeAutheticatedUserForRoute();
        }
      ]}
    })
    .state('postDetail', {
      url: '/posts/:slug',
      templateUrl: '/partials/blog/post-detail',
      controller: 'PostDetailController'
    })
    .state('newPost', {
      url: '/admin/new-post',
      templateUrl: '/partials/blog/new-post',
      controller: 'NewPostController',
      resolve: {
        routeRoleCheck: ['AuthFactory', function(AuthFactory){
            return AuthFactory.authorizeCurrentUserForRoute('admin');
        }
      ]}
    })
    .state('editPost', {
      url: '/admin/:slug/edit',
      templateUrl: '/partials/blog/edit-post',
      controller: 'EditPostController',
      resolve: {
        routeRoleCheck: ['AuthFactory', function(AuthFactory){
            return AuthFactory.authorizeCurrentUserForRoute('admin');
        }
      ]}
    })
    .state('users', {
      url: '/admin/users',
      templateUrl: '/partials/admin/users-list',
      controller: 'UserListController',
      resolve: {
        routeRoleCheck: ['AuthFactory', function(AuthFactory){
            return AuthFactory.authorizeCurrentUserForRoute('admin');
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
