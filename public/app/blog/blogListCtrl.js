angular.module('willsBlog').controller('blogListCtrl', ['$scope', 'mvCachedPost', 'identity', '$location', 'Meta',  function($scope, mvCachedPost, identity, $location, Meta){

  window.scrollTo(0,0);

  Meta.setTitle('Blog');

  $scope.posts = mvCachedPost.query();

  $scope.identity = identity;

  $scope.sortOptions= [
    {value: 'title', text: 'Sort by Title'},
    {value: 'published', text: 'Published Date'}];

  $scope.sortOrder = $scope.sortOptions[0].value;
}]);
