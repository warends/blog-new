 angular.module('willsBlog').controller('editPostCtrl', [ '$scope','notifier','mvPost','$q','$location','$stateParams','$http','identity','CommentService', function($scope, notifier, mvPost, $q, $location, $stateParams, $http, identity, CommentService){

    $scope.identity = identity;

    $scope.post = mvPost.get({ slug: $stateParams.slug });

    $scope.post.data = {
        _id: $scope.post._id,
        title : $scope.post.title,
        slug: $scope.post.slug,
        categories : $scope.post.categories,
        headerImage : $scope.post.headerImage,
        excerpt : $scope.post.excerpt,
        body : $scope.post.body,
        author: $scope.post.author
    }

    $scope.updatePost = function(){
        $scope.post.$update( { slug: $scope.post.slug }, function(){
          notifier.notify('Post has been updated');
          $location.path('/posts');
        }, function(message){
          notifier.error(message.data);
        });
    }

    $scope.deletePost = function(){
      $scope.post.$delete(function() {
        notifier.notify('Post has been deleted');
        $location.path('/posts');
      });
    }

    $scope.deleteComment = function(comment){
      var slug = $stateParams.slug;
      CommentService.deleteComment(comment, slug);
    }

    $scope.cancel = function(){
      $location.path('/posts');
    }

}]);
