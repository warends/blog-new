angular.module('willsBlog').factory('mvPost', ['$resource', '$q', function($resource, $q){

  var PostResource = $resource('/api/posts/:slug', {_slug: '@slug'}, {
    update: {
      method:'PUT',
      isArray: false
    },
    remove: {
      method: 'DELETE'
    }
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

  PostResource.updateCurrentPost = function(postData){
    var dfd = $q.defer();
    postData.$update().then(function(){
      dfd.resolve();
    }, function(response){
      dfd.reject(response.data.reason);
    });
    return dfd.promise;
  }

  PostResource.deleteCurrentPost = function(postData){
    postData.$remove(function(){
      notify.notify('Post has been deleted.');
      $location.path('/blog');
    });
  }

  return PostResource;
}]);
