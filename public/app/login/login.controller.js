angular.module('users.login', []).controller('LoginController', ['$scope', 'IdentityService', 'NotifierService', 'AuthService', '$location', 'Meta', function($scope, identity, notifier, AuthService, $location, Meta){

    Meta.setTitle('Account');

    $scope.identity = identity;

    $scope.signIn = function(username, password){
      AuthService.authenticateUser(username, password).then(function(success){
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
      AuthService.logoutUser().then(function() {
        $scope.username = '';
        $scope.password = '';
        notifier.notify('You have logged out');
        $location.path('/');
      });
    };

    $scope.signup = function(firstName, lastName, username, password){
      var newUserData = {
        'username': username,
        'firstName': firstName,
        'lastName': lastName,
        'password': password
      };
      AuthService.createUser(newUserData)
        .then(function(){
          notifier.notify('User Account Created');
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
