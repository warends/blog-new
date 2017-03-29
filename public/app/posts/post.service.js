angular.module('post.service', ['ngResource']).factory('PostService', ['$resource', function($resource){

  var PostResource = $resource('/api/posts/:slug', {slug: '@slug'}, {
    update : { method: 'PUT' }
  });

  PostResource.getPost = function(slug){
    return PostResource.get({slug: slug}).$promise.then(function(response){
      return response;
    });
  };

  return PostResource;

}]);
