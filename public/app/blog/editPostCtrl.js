 angular.module('willsBlog').controller('editPostCtrl', ['$scope', 'notifier', 'mvPost', '$q', '$location', '$routeParams', function($scope, notifier, mvPost, $q, $location, $routeParams){

    $scope.updatePost = function(){
      console.log($scope.post._id);
      $scope.post.$update(function(){
        notifier.notify('Your post has been updated');
      }, function(reason){
        notifier.error(reason.data);
      });
    }

    $scope.post = mvPost.get({ id: $routeParams.id });

  // $scope.updatePost = function(){
  //   var postData = {
  //     title : $scope.post.title,
  //     categories : $scope.post.categories,
  //     headerImage : $scope.post.headerImage,
  //     excerpt : $scope.post.excerpt,
  //     body : $scope.post.body,
  //     author: $scope.post.author
  //   }
  //
  //   console.log(postData);
  //
  //   mvPost.updateCurrentPost(postData)
  //   .then(function(){
  //     notifier.notify('Your post has been updated');
  //   }, function(error){
  //     notifier.error(error);
  //   });
  //
  // };
  //
  // $scope.deletePost = function(){
  //   mvPost.deleteCurrentPost($scope.post);
  // };

}]);
