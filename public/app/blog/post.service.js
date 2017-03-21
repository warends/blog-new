angular.module('blog.service', []).factory('PostService', ['$resource', function($resource){

  return $resource('/api/posts/:slug', {slug: '@slug'}, {
    update : {
      method: 'PUT'
    }
  }, {
    stripTrailingSlashes: false
  });

}]);
