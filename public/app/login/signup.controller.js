angular.module('willsBlog').controller('SignupController', ['$scope', 'AuthFactory', 'NotifierService', '$location', function($scope, AuthFactory, notifier, $location){
    $scope.signup = function(){

      var newUserData = {
        username: $scope.username,
        firstName: $scope.fName,
        lastName: $scope.lName,
        password: $scope.password
      };
      AuthFactory.createUser(newUserData)
        .then(function(){
          notifier.notify('User account created');
          $location.path('/');
      }, function(reason){
        notifier.error(reason);
      });

    };

    $scope.cancel = function(){
      $location.path('/');
    };

}]);
