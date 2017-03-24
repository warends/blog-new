angular.module('post.commentDirs', []).directive('commentForm', [function(){
  return{
    restrict: 'E',
    templateUrl: '/partials/posts/comment-form'
  }
}])

.directive('commentList', [function(){
  return{
    restrict: 'E',
    templateUrl: '/partials/posts/comment-list'
  }
}]);
