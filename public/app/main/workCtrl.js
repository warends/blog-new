angular.module('willsBlog').controller('workCtrl', ['$scope', function($scope){

  $scope.tendrilShown = false;
  $scope.toggleTendril = function() {
    $scope.tendrilShown = !$scope.tendrilShown;
    console.log($scope.tendrilShown);
  };

  $scope.crownShow = false;
  $scope.toggleCrown = function() {
    $scope.crownShow = !$scope.crownShow;
    console.log($scope.crownShow);
  };

  $scope.broadShow = false;
  $scope.toggleBroad = function() {
    $scope.broadShow = !$scope.broadShow;
  };

  $scope.adihow = false;
  $scope.toggleAdi = function() {
    $scope.adiShow = !$scope.adiShow;
  };

}]);
