angular.module('willsBlog', ['ngResource', 'ngRoute']);

angular.module('willsBlog').config(function($routeProvider, $locationProvider){
    $locationProvider.html5Mode(true);

    $routeProvider
    .when('/', { templateUrl: '/partials/main', controller: 'mainCtrl'});
});


angular.module('willsBlog').controller('mainCtrl', function($scope){
  $scope.myVar = 'sup';
});
