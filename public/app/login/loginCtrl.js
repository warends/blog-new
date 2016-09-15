angular.module('willsBlog').controller('loginCtrl', ['$scope', '$http', 'identity', 'notifier', 'mvAuth', '$location', function($scope, $http, identity, notifier, mvAuth, $location){

    $scope.identity = identity;

    $scope.signIn = function(username, password){
      mvAuth.authenticateUser(username, password).then(function(success){
        if(success){
          notifier.notify('You have signed in');
          $location.url('/account');
          $scope.actShown = false;
        } else {
          notifier.notify('Username/Password Incorrect');
        }
      });
    };

    $scope.signOut = function(){
      mvAuth.logoutUser().then(function() {
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
      mvAuth.createUser(newUserData)
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

    $scope.actShown = false;
    $scope.toggleAccount = function() {
      $scope.actShown = !$scope.actShown;
      console.log($scope.actShown);
    };

    $scope.signupShown = false;
    $scope.toggleSignup = function() {
      $scope.signupShown = !$scope.signupShown;
      console.log($scope.signupShown);
    };


}]);
