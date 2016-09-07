angular.module('willsBlog').controller('loginCtrl', ['$scope', '$http', 'identity', 'notifier', 'mvAuth', '$location', function($scope, $http, identity, notifier, mvAuth, $location){

    $scope.identity = identity;

    $scope.signIn = function(username, password){
      mvAuth.authenticateUser(username, password).then(function(success){
        if(success){
          notifier.notify('You have signed in');
          $location.url('/account');
          $scope.modalShown = false;
        } else {
          notifier.notify('Username/Password Incorrect');
        }
      });

    };

    // $scope.animationsEnabled = true;

    $scope.signOut = function(){
      mvAuth.logoutUser().then(function() {
        $scope.username = '';
        $scope.password = '';
        notifier.notify('You have logged out');
        $location.path('/');
      });
    };

    // $scope.open = function (size) {
    //   var modalInstance = $uibModal.open({
    //     animation: $scope.animationsEnabled,
    //     ariaLabelledBy: 'modal-title',
    //     ariaDescribedBy: 'modal-body',
    //     templateUrl: 'myModalContent.html',
    //     size: size,
    //     controller: 'loginCtrl'
    //   });
    // };

    $scope.modalShown = false;
    $scope.toggleModal = function() {
      $scope.modalShown = !$scope.modalShown;
    };


}]);
