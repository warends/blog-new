angular.module('willsBlog').controller('navCtrl', ['$scope', '$location', '$anchorScroll', '$document', function($scope, $location, $anchorScroll, $document){

  $scope.scrollTop = function(){
    $document.scrollTopAnimated(0);
  }
  $scope.linkTo = function(id){

      var route = $location.url();
      var offset = 60;
      var duration = 800;
      var element = angular.element(id);

      if(route !== '/'){
        //console.log('another route + ' + route);
        $location.url('/', function(){
          $document.scrollToElement(element, offset, duration);
        });

      } else {
        //console.log('same route');
        $document.scrollToElement(element, offset, duration);
      }

     //$location.url(id);
     //$anchorScroll();
  };

}]);
