angular.module('willsBlog').controller('LoginController', ['$scope', '$http', 'IdentityService', 'NotifierService', 'AuthFactory', '$location', 'Meta', function($scope, $http, identity, notifier, AuthFactory, $location, Meta){

    Meta.setTitle('Account');

    $scope.identity = identity;

    $scope.signIn = function(username, password){
      AuthFactory.authenticateUser(username, password).then(function(success){
        if(success){
          notifier.notify('You have signed in');
          $location.url('/account');
          $scope.actShown = false;
        } else {
          notifier.error('Username/Password Incorrect');
        }
      });
    };

    $scope.signOut = function(){
      AuthFactory.logoutUser().then(function() {
        $scope.username = '';
        $scope.password = '';
        notifier.notify('You have logged out');
        $location.path('/');
      });
    };

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
      }, function(message){
        notifier.error(message);
      });
    };

    $scope.cancel = function(){
      $location.path('/');
    };

    $scope.actShown = false;
    $scope.toggleAccount = function() {
      if(identity.isAuthenticated()){
        $location.path('/account');
      } else {
        $scope.actShown = !$scope.actShown;
      }
    };

    $scope.signupShown = false;
    $scope.toggleSignup = function() {
      $scope.signupShown = !$scope.signupShown;
    };


}]);
