 angular.module('willsBlog').controller('editPostCtrl', ['$scope', 'notifier', 'mvPost', '$q', '$location', '$routeParams', function($scope, notifier, mvPost, $q, $location, $routeParams){

    $scope.post = mvPost.get({ id: $routeParams.id });

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
          $scope.post.$update( { id: $scope.post._id }, function(){
            notifier.notify('Your post has been updated');
          }, function(reason){
            notifier.error(reason.data);
          });
      }

      $scope.deletePost = function(){
        $scope.post.$delete({ id: $scope.post._id }, function() {
          notifier.notify('Deleted from server');
          $location.path('/blog');
        });
      }

}]);
