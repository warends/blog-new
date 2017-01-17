angular.module('willsBlog').controller('navCtrl', ['$scope', '$location', '$document', function($scope, $location, $document){
  $scope.showMenu = function(){
      angular.element(document.getElementsByClassName('collapse')).toggleClass('in');
  };

  $scope.scrollTop = function(){
    $document.scrollTopAnimated(0);
  };

  $scope.linkTo = function(id){

      var route = $location.url();
      var offset = 60;
      var duration = 800;
      var element = angular.element(document.getElementById(id));

      if(route !== '/'){
        $location.url('/', function(){
          $document.scrollToElement(element, offset, duration);
        });

      } else {
        $document.scrollToElement(element, offset, duration);
      }
    };

}]);
