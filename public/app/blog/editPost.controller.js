 angular.module('blog.edit', []).controller('EditPostController', [ '$scope', '$location', '$stateParams', 'NotifierService', 'PostService', 'IdentityService', 'CommentService', 'Meta', function($scope, $location, $stateParams, notifier, PostService, identity, CommentService, Meta){

   Meta.setTitle('Edit Post');

    $scope.identity = identity;

    $scope.post = PostService.get({ slug: $stateParams.slug }, function(){
      //$scope.gistList = $scope.post.gists;
    });

    $scope.addGist = function(newGist){
      $scope.post.gists.push(newGist);
    };

    $scope.removeGist = function(){
      $scope.post.gists.pop();
    };

    $scope.post.data = {
        _id: $scope.post._id,
        title : $scope.post.title,
        slug: $scope.post.slug,
        categories : $scope.post.categories,
        excerpt : $scope.post.excerpt,
        body : $scope.post.body,
        author: $scope.post.author,
        postedDate: Date.now(),
        gists: $scope.post.gists
    };

    $scope.updatePost = function(){
        $scope.post.$update( { slug: $scope.post.slug }, function(){
          notifier.notify('Post has been updated');
          $location.path('/posts');
        }, function(message){
          notifier.error(message.data);
        });
    };

    $scope.deletePost = function(){
      $scope.post.$delete(function() {
        notifier.notify('Post has been deleted');
        $location.path('/posts');
      });
    };

    $scope.deleteComment = function(comment){
      var slug = $stateParams.slug;
      CommentService.deleteComment(comment, slug)
        .then(function(){
          $scope.post.comments.pop();
        }, function(){

        });
    };

    $scope.cancel = function(){
      $location.path('/posts');
    };

}]);
