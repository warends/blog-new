 angular.module('willsBlog').controller('editPostCtrl', ['$scope', 'notifier', 'mvPost', '$q', '$location', '$stateParams', function($scope, notifier, mvPost, $q, $location, $stateParams){

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
          notifier.notify('Your post has been updated');
          $location.path('/blog');
        }, function(reason){
          notifier.error(reason.data);
        });
    }

    $scope.deletePost = function(){
      $scope.post.$delete({ slug: $scope.post.slug }, function() {
        notifier.notify('Deleted from server');
        $location.path('/blog');
      });
    }

}]);
