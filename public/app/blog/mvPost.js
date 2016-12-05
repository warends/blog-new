angular.module('willsBlog').factory('mvPost', ['$resource', '$q', function($resource, $q){

  return $resource('/api/posts/:id', {_id: '@id'}, {
    update : {
      method: 'PUT'
    }
  }, {
    stripTrailingSlashes: false
  });

}]);
