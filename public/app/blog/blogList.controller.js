angular.module('blog.list', []).controller('BlogListController', ['$scope', 'CachedPostService', 'IdentityService', '$location', 'Meta',  function($scope, CachedPostService, identity, $location, Meta){

  Meta.setTitle('Blog');

  $scope.posts = CachedPostService.query();

  $scope.identity = identity;

  $scope.sortOptions= [
    {value: 'published', text: 'Published Date'},
    {value: 'title', text: 'Sort by Title'}
  ]

  $scope.sortOrder = $scope.sortOptions[0].value;
}]);
