angular.module('willsBlog').factory('mvPost', ['$resource', '$q', function($resource, $q){

  var PostResource = $resource('/api/posts/:_id', {_id: '@id'});

  PostResource.createPost = function(newPostData) {
    var newPost = new PostResource(newPostData);
    var deferred = $q.defer();

    newPost.$save().then(function(){
      deferred.resolve();
    }, function(response){
      deferred.reject(response.data.reason);
    });
    return deferred.promise;
  }

  return PostResource;
}]);
