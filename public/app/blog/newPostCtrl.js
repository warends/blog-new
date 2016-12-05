angular.module('willsBlog').controller('newPostCtrl', ['$scope', 'notifier', 'mvPost', '$q', '$location', function($scope, notifier, mvPost, $q, $location){

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
