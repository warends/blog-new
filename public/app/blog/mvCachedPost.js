angular.module('willsBlog').factory('mvCachedPost', function(mvPost){
  var postList;

  return {
    query: function(){
      if(!postList){
        postList = mvPost.query();
      }

      return postList;
    }
  }

});
