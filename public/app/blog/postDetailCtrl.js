angular.module('willsBlog').controller('postDetailCtrl', ['$scope', 'mvCachedPost', '$routeParams', function($scope, mvCachedPost, $routeParams){

  window.scrollTo(0,0);

  const nav = angular.element('.navbar-brand');
  nav.show();

  mvCachedPost.query().$promise.then(function(collection){
    collection.forEach(function(post){
      if(post.slug === $routeParams.slug){
        $scope.post = post;
      }
    });
  });
  // $scope.post = mvPost.get({ _id: $routeParams.id });
}]);
