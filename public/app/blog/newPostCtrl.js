angular.module('willsBlog').controller('newPostCtrl', ['$scope', 'notifier', 'mvPost', '$q', '$location', function($scope, notifier, mvPost, $q, $location){

  // var newPostData = {
  //     title : $scope.title,
  //     slug: $scope.slug,
  //     categories: $scope.categories,
  //     headerImage : $scope.headerImage,
  //     excerpt : $scope.excerpt,
  //     body : $scope.body,
  //     author: $scope.author,
  //     postedDate : new Date()
  //   };

  $scope.post = new mvPost();

  $scope.createNewPost = function(){
    $scope.post.$save(function(){
        notifier.notify('New Post Created');
        $location.path('/blog');
    });
  }

  $scope.cancel = function(){
    $location.path('/blog');
  };

}]);
