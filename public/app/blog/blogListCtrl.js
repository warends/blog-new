angular.module('willsBlog').controller('blogListCtrl', ['$scope', 'mvCachedPost', 'identity', '$location', function($scope, mvCachedPost, identity, $location){

  window.scrollTo(0,0);

  $scope.posts = mvCachedPost.query();

  $scope.identity = identity;

  $scope.sortOptions= [
    {value: 'title', text: 'Sort by Title'},
    {value: 'published', text: 'Published Date'}];

  $scope.sortOrder = $scope.sortOptions[0].value;
}]);
