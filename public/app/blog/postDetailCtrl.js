angular.module('willsBlog').controller('postDetailCtrl', function($scope, mvPost, $routeParams){
  $scope.post = mvPost.get({ _id: $routeParams.id });
});
