angular.module('willsBlog').controller('newPostCtrl', ['$scope', 'notifier', 'mvPost', '$q', '$location', function($scope, notifier, mvPost, $q, $location){

    $scope.createNewPost = function(){

      var newPostData = {
        title : $scope.title,
        categories: $scope.categories,
        headerImage : $scope.headerImage,
        excerpt : $scope.excerpt,
        body : $scope.body,
        author: $scope.author,
        postedDate : new Date()
      };

      //  var newPost = new mvPost(newPostData);
      //  var deferred = $q.defer();

       mvPost.createPost(newPostData)
        .then(function(){
          notifier.notify('New Post Created');
          $location.path('/blog');
        }, function(reason){
          notifier.error(reason);
        });

    };

  $scope.cancel = function(){
    $location.path('/blog');
  };

}]);
