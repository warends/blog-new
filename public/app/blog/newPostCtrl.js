angular.module('willsBlog').controller('newPostCtrl', ['$scope', 'notifier', 'mvPost', '$location', function($scope, notifier, mvPost, $location){

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
