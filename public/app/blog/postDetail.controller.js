angular.module('blog.detail', []).controller('PostDetailController', ['$scope', 'CachedPostService', 'PostService', '$stateParams', 'Meta', 'NotifierService', 'CommentService', function($scope, CachedPostService, PostService, $stateParams, Meta, notifier, CommentService){

  CachedPostService.query().$promise.then(function(collection){
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
      'date': Date.now(),
      'firstName': $scope.comment.firstName,
      'lastName': $scope.comment.lastName,
    };
    var slug = $stateParams.slug;
    CommentService.postComment(comment, slug)
      .then(function(){
        $scope.post.comments.push(comment);
        $scope.comment.content= "";
        $scope.comment.firstName= "";
        $scope.comment.lastName= "";
      }, function(){
      });
  };

}]);
