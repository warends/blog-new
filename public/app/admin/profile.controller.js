angular.module('willsBlog').controller('ProfileController', ['$scope', 'AuthService', 'IdentityService', 'NotifierService', function($scope, AuthService, identity, notifier){
  $scope.username = identity.currentUser.username;
  $scope.fName = identity.currentUser.firstName;
  $scope.lName = identity.currentUser.lastName;

  $scope.update = function(){
      var newUserData = {
        username: $scope.username,
        firstName: $scope.fName,
        lastName: $scope.lName
      }

      if($scope.password && $scope.password.length > 0) {
       newUserData.password = $scope.password;
      }

      AuthService.updateCurrentUser(newUserData)
        .then(function(){
          notifier.notify('Your information has been updated');
        }, function(reason){
          notifier.error(reason);
        });
  }

}]);
