angular.module('willsBlog').controller('editPostCtrl', ['$scope', 'notifier', 'mvPost', '$q', '$location', function($scope, notifier, mvPost, $q, $location){

  $scope.post = mvPost.get({ _id: $routeParams.id });

  $scope.updatePost = function(){
    var newPostData = {
      title : $scope.post.title,
      categories : $scope.post.categories,
      headerImage : $scope.post.headerImage,
      excerpt : $scope.post.excerpt,
      body : $scope.post.body,
      author: $scope.post.author
    }

    mvPost.updateCurrentPost(newPostData)
      .then(function(){
        notifier.notify('Your post has been updated');
      }, function(response){
        notifier.error(response);
      });
  };

  $scope.cancel = function(){
    $location.path('/blog');
  };

}]);
