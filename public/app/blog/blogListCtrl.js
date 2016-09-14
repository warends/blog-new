angular.module('willsBlog').controller('blogListCtrl', ['$scope', 'mvCachedPost', 'identity', '$location', function($scope, mvCachedPost, identity, $location){
  $scope.posts = mvCachedPost.query();
  console.log($scope.posts);

  $scope.identity = identity;

  $scope.sortOptions= [
    {value: 'title', text: 'Sort by Title'},
    {value: 'published', text: 'Published Date'}];

  $scope.sortOrder = $scope.sortOptions[0].value;
}]);
