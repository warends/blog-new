angular.module('willsBlog').factory('mvCachedPost', ['mvPost', function(mvPost){
  var postList;

  return {
    query: function(){
      if(!postList){
        postList = mvPost.query();
      }
      return postList;
    }
  }

}]);
