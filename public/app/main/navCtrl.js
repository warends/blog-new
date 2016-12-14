angular.module('willsBlog').controller('navCtrl', ['$scope', '$location', '$anchorScroll', 'smoothScroll', function($scope, $location, $anchorScroll, smoothScroll){
  $scope.linkTo = function(id){

      //$location.url('/' + eID);
      //smoothScroll.scrollTo(eID);


     $location.url(id);
     $anchorScroll();
  };

}]);
