angular.module('willsBlog').factory('mvPost', ['$resource', function($resource){

  return $resource('/api/posts/:slug', {slug: '@slug'}, {
    update : {
      method: 'PUT'
    }
  }, {
    stripTrailingSlashes: false
  });

}]);
