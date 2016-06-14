angular.module('willsBlog').controller('loginCtrl', function($scope, $http, identity, notifier, auth, $location){

    $scope.identity = identity;

    $scope.signin = function(username, password){
      auth.authenticateUser(username, password).then(function(success){
        if(success){
          notifier.notify('You have signed in');
        } else {
          notifier.notify('Username/Password Incorrect');
        }
      });

    }

    $scope.signOut = function(){
      auth.logoutUser().then(function() {
        $scope.username = '';
        $scope.password = '';
        notifier.notify('You have logged out');
        $location.path('/');
      });
    }
});
