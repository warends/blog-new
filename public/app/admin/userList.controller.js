angular.module('willsBlog').controller('UserListController', ['$scope', 'UserFactory', function($scope, UserFactory){
  $scope.users = UserFactory.query();
}]);
