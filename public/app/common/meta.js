angular.module('willsBlog').factory('Meta', function(){
  var title = 'Web Development, Seattle, WA';
  var desc = 'I enjoy all things web development and am always actively learning the newest techniques and langauges. If you have a web design or development project, give me a shout, I would love to talk about it.';
  return {
    title: function() {return title;},
    setTitle: function(newTitle) { title = newTitle },
    description: function() { return desc;},
    setDesc : function(newDesc) { desc = newDesc}
  }
})
.controller('metaCtrl', ['$scope', 'Meta', function($scope, Meta){
  $scope.Meta = Meta;
  $scope.metaDesc = Meta;
}]);
