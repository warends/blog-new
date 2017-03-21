angular.module('willsBlog').controller('UserListController', ['$scope', 'UserService', function($scope, UserService){
  $scope.users = UserService.query();
}]);
