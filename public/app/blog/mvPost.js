angular.module('willsBlog').factory('mvPost', ['$resource', function($resource){

  return $resource('/api/posts/:id', {_id: '@id'}, {
    update : {
      method: 'PUT'
    }
  }, {
    stripTrailingSlashes: false
  });

}]);
