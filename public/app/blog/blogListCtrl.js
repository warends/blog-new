angular.module('willsBlog').controller('blogListCtrl', ['$scope', 'mvCachedPost', 'identity', function($scope, mvCachedPost, identity){
  $scope.posts = mvCachedPost.query();

  $scope.identity = identity;

  $scope.sortOptions= [
    {value: 'Title', text: 'Sort by Title'},
    {value: 'Published', text: 'Published Date'}];

  $scope.sortOrder = $scope.sortOptions[0].value;
}]);
