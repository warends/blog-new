angular.module('willsBlog').controller('blogListCtrl', ['$scope', 'mvCachedPost', function($scope, mvCachedPost){
  $scope.posts = mvCachedPost.query();

  $scope.sortOptions= [
    {value: 'Title', text: 'Sort by Title'},
    {value: 'Published', text: 'Published Date'}];

  $scope.sortOrder = $scope.sortOptions[0].value;
}]);
