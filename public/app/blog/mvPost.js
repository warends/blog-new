angular.module('willsBlog').factory('mvPost', function($resource){
  var PostResource = $resource('/api/posts/:_id', {_id: '@id'}, {
    update: {method: 'PUT', isArray: false}
  });

  return PostResource;
});
