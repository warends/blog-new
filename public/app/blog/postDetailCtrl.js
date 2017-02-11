angular.module('willsBlog').controller('postDetailCtrl', ['$scope', 'mvCachedPost', 'mvPost', '$stateParams', 'Meta', 'notifier', 'CommentService', function($scope, mvCachedPost, mvPost, $stateParams, Meta, notifier, CommentService){

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

  $scope.submitComment = function(){
    var comment = {
      'content': $scope.comment.content,
      'firstName': $scope.comment.firstName,
      'lastName': $scope.comment.lastName,
    };

    var slug = $stateParams.slug;
    CommentService.postComment(comment, slug)
      .then(function(){
        $scope.commentForm.$setPristine();
      }, function(){
        //console.log('error');
      });
  };

}]);
