angular.module('willsBlog').controller('navCtrl', ['$scope', '$location', function($scope, $location){
  $scope.linkTo = function(id){
    $location.url(id);
  };

}]);
