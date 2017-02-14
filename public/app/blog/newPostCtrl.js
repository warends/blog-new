angular.module('willsBlog').controller('newPostCtrl', ['$scope', 'notifier', 'mvPost', '$location', function($scope, notifier, mvPost, $location){

  $scope.post = new mvPost();

  $scope.createNewPost = function(){
    $scope.post.$save(function(){
        notifier.notify('New Post Created');
        $location.path('/blog');
    });
  }

  $scope.post.gists = [];
  $scope.addGist = function(newGist){
    $scope.post.gists.push(newGist);
  }

  $scope.removeGist = function(newGist){
    $scope.post.gists.pop();
  }

  $scope.cancel = function(){
    $location.path('/blog');
  }

}]);
