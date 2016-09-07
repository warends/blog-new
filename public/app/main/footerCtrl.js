angular.module('willsBlog').controller('footerCtrl', ['$scope', function($scope){
  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };

}]);
