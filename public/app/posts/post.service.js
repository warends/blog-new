angular.module('post.service', ['ngResource']).factory('PostService', ['$resource', function($resource){

  var PostResource = $resource('/api/posts/:slug', {slug: '@slug'}, {
    update : {
      method: 'PUT'
    }
  });

  return PostResource;

}]);
