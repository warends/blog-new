angular.module('willsBlog').controller('blogListCtrl', ['$scope', 'mvCachedPost', 'identity', '$location', 'Meta',  function($scope, mvCachedPost, identity, $location, Meta){

  Meta.setTitle('Blog');

  $scope.posts = mvCachedPost.query();

  $scope.identity = identity;

  $scope.sortOptions= [
    {value: 'published', text: 'Published Date'},
    {value: 'title', text: 'Sort by Title'}
  ]

  $scope.sortOrder = $scope.sortOptions[0].value;
}]);
