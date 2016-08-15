angular.module('willsBlog').controller('postDetailCtrl', function($scope, mvCachedPost, $routeParams){
  mvCachedPost.query().$promise.then(function(collection){
    collection.forEach(function(post){
      if(post._id === $routeParams.id){
        $scope.post = post;
      }
    });
  });
  // $scope.post = mvPost.get({ _id: $routeParams.id });
});
