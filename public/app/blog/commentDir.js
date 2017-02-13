angular.module('willsBlog').directive('commentForm', [function(){
  return{
    restrict: 'E',
    templateUrl: '/partials/blog/comment-form'
  }
}]);

angular.module('willsBlog').directive('commentList', [function(){
  return{
    restrict: 'E',
    templateUrl: '/partials/blog/comment-list'
  }
}]);
