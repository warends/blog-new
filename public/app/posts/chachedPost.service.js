angular.module('post.cache', []).factory('CachedPostService', ['PostService', function(PostService){
  var postList;

  return {
    query: function(){
      if(!postList){
        postList = PostService.query();
      }
      return postList;
    }
  }

}]);
