angular.module('willsBlog').controller('signupCtrl', function($scope, mvAuth, notifier, $location){
    $scope.signup = function(){

      var newUserData = {
        username: $scope.username,
        firstName: $scope.fName,
        lastName: $scope.lName,
        password: $scope.password
      };
      mvAuth.createUser(newUserData)
        .then(function(){
          notifier.notify('User account created');
          $location.path('/');
      }, function(reason){
        notifier.error(reason);
      });

    }

    $scope.cancel = function(){
      $location.path('/');
    }

});
