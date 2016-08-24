angular.module('willsBlog').factory('mvNewPost', function($resource){
    var PostResource = $resource('/api/posts', {_id : '@id'}, {
      update: {method: 'PUT', isArray: false}
    });

    return PostResource;
});
