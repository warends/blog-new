angular.module('post.new', []).controller('NewPostController', ['$scope', 'NotifierService', 'PostService', '$location', function($scope, notifier, PostService, $location){

  $scope.post = new PostService();

  $scope.createNewPost = function(){
    $scope.post.$save(function(){
        notifier.notify('New Post Created');
        $location.path('/posts');
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
