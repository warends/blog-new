angular.module('willsBlog').controller('loginCtrl', ['$scope', '$http', 'identity', 'notifier', 'mvAuth', '$location', 'Meta', function($scope, $http, identity, notifier, mvAuth, $location, Meta){

    window.scrollTo(0,0);
    Meta.setTitle('Account');

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
