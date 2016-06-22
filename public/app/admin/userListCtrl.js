angular.module('willsBlog').controller('userListCtrl', function($scope, mvUser){
  $scope.users = mvUser.query();
});
