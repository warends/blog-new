willsBlog.controller('userListCtrl', ['$scope', 'mvUser', function($scope, mvUser){
  $scope.users = mvUser.query();
}]);
