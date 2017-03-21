angular.module('blog.commentDirs', []).directive('commentForm', [function(){
  return{
    restrict: 'E',
    templateUrl: '/partials/blog/comment-form'
  }
}])

.directive('commentList', [function(){
  return{
    restrict: 'E',
    templateUrl: '/partials/blog/comment-list'
  }
}]);
