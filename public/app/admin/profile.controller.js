angular.module('willsBlog').controller('ProfileController', ['$scope', 'AuthFactory', 'IdentityService', 'NotifierService', function($scope, AuthFactory, identity, notifier){
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

      AuthFactory.updateCurrentUser(newUserData)
        .then(function(){
          notifier.notify('Your information has been updated');
        }, function(reason){
          notifier.error(reason);
        });
  }

}]);
