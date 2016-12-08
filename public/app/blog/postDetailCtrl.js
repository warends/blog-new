angular.module('willsBlog').controller('postDetailCtrl', ['$scope', 'mvCachedPost', 'mvPost', '$routeParams', 'Meta',  function($scope, mvCachedPost, mvPost, $routeParams, Meta){

  window.scrollTo(0,0);

  // mvCachedPost.query().$promise.then(function(collection){
  //   collection.forEach(function(post){
  //     if(post._id === $routeParams.id){
  //       $scope.post = post;
  //     }
  //   });
  // });

   $scope.post = mvPost.get({ slug: $routeParams.slug }, function(){
     var title = $scope.post.title;
     var desc = $scope.post.excerpt;
     Meta.setTitle(title);
     Meta.setDesc(desc);
   });

}]);
