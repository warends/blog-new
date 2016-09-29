willsBlog.controller('navCtrl', ['$scope', '$location', function($scope, $location, $anchorScroll){
  $scope.linkTo = function(id){
    $location.url(id);
  };

}]);
