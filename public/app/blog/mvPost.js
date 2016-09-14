angular.module('willsBlog').factory('mvPost', ['$resource', '$q', function($resource, $q){

  var PostResource = $resource('/api/posts/:slug', {_slug: '@slug'}, {
    update: {method: 'PUT', isArray: false}
  });

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

  // PostResource.prototype.updateCurrentPost = function(newPostData){
  //   var dfd = $q.defer();
  //   var editedPost = newPostData;
  //   editedPost.$update().then(function(){
  //     dfd.resolve();
  //   }, function(response){
  //     dfd.reject(response.data.reason);
  //   });
  //   return dfd.promise;
  // }

  return PostResource;
}]);
