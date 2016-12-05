angular.module('willsBlog').controller('postDetailCtrl', ['$scope', 'mvCachedPost', 'mvPost', '$routeParams', function($scope, mvCachedPost, mvPost, $routeParams){

  window.scrollTo(0,0);

  // mvCachedPost.query().$promise.then(function(collection){
  //   collection.forEach(function(post){
  //     if(post._id === $routeParams.id){
  //       $scope.post = post;
  //     }
  //   });
  // });
  
   $scope.post = mvPost.get({ id: $routeParams.id });
}]);
