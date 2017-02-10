angular.module('willsBlog').controller('postDetailCtrl', ['$scope', 'mvCachedPost', 'mvPost', '$stateParams', 'Meta',  function($scope, mvCachedPost, mvPost, $stateParams, Meta){

  window.scrollTo(0,0);

  mvCachedPost.query().$promise.then(function(collection){
    collection.forEach(function(post){
      if(post.slug === $stateParams.slug){
        $scope.post = post;
        var title = $scope.post.title,
            desc = $scope.post.excerpt;
        Meta.setTitle(title);
        Meta.setDesc(desc);
      }
    });
  });


}]);
