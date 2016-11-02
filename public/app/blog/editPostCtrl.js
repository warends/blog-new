 angular.module('willsBlog').controller('editPostCtrl', ['$scope', 'notifier', 'mvPost', 'mvSavePost', '$q', '$location', '$routeParams', function($scope, notifier, mvPost, mvSavePost, $q, $location, $routeParams){

  $scope.post = mvPost.get({ slug: $routeParams.slug });

  $scope.updatePost = function(){
    var postData = {
      title : $scope.post.title,
      categories : $scope.post.categories,
      headerImage : $scope.post.headerImage,
      excerpt : $scope.post.excerpt,
      body : $scope.post.body,
      author: $scope.post.author
    }

    console.log(postData);

    mvPost.updateCurrentPost(postData).then(function(){
      notifier.notify('Your post has been updated');
    }, function(error){
      notifier.error(error);
    });

  };

  $scope.cancel = function(){
    $location.path('/blog');
  };

  $scope.deletePost = function(){
    mvPost.deleteCurrentPost($scope.post);
  };

}]);
