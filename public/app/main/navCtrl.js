angular.module('willsBlog').controller('navCtrl', ['$scope', '$location', '$anchorScroll', function($scope, $location, $anchorScroll){
  $scope.linkTo = function(id){
    $location.url(id);
    $anchorScroll();
  };

}]);
