angular.module('willsBlog', ['users', 'blog', 'ngResource', 'ngSanitize', 'ui.router', 'duScroll', 'gist', 'ngScrollReveal']);

angular.module('willsBlog').config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function($locationProvider, $stateProvider, $urlRouterProvider){

    var routeRoleChecks = {
      admin: function(AuthService){
          return AuthService.authorizeCurrentUserForRoute('admin');
      },
      user: function(AuthService){
          return AuthService.authorizeAutheticatedUserForRoute();
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
        routeRoleCheck: ['AuthService', function(AuthService){
            return AuthService.authorizeAutheticatedUserForRoute();
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
        routeRoleCheck: ['AuthService', function(AuthService){
            return AuthService.authorizeCurrentUserForRoute('admin');
        }
      ]}
    })
    .state('editPost', {
      url: '/admin/:slug/edit',
      templateUrl: '/partials/blog/edit-post',
      controller: 'EditPostController',
      resolve: {
        routeRoleCheck: ['AuthService', function(AuthService){
            return AuthService.authorizeCurrentUserForRoute('admin');
        }
      ]}
    })
    .state('users', {
      url: '/admin/users',
      templateUrl: '/partials/admin/users-list',
      controller: 'UserListController',
      resolve: {
        routeRoleCheck: ['AuthService', function(AuthService){
            return AuthService.authorizeCurrentUserForRoute('admin');
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
