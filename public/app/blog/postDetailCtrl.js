angular.module('willsBlog').controller('postDetailCtrl', ['$scope', 'mvCachedPost', 'mvPost', '$stateParams', 'Meta',  function($scope, mvCachedPost, mvPost, $stateParams, Meta){

  // mvCachedPost.query().$promise.then(function(collection){
  //   collection.forEach(function(post){
  //     if(post._id === $stateParams.id){
  //       $scope.post = post;
  //     }
  //   });
  // });

   $scope.post = mvPost.get({ slug: $stateParams.slug }, function(){
     var title = $scope.post.title;
     var desc = $scope.post.excerpt;
     Meta.setTitle(title);
     Meta.setDesc(desc);
   });

}]);
