angular.module('willsBlog').service('CommentService', ['$http', 'notifier', function($http, notifier){

  this.postComment = function(data, slug){
    return $http.post('/api/posts/comments/' + slug, data)
      .success(function(response){
        notifier.notify('Thanks for submitting your comment ' + response.message);
      })
      .error(function(err){
        notifier.notify('There was a problem submitting your comment.');
      });
  }

  this.deleteComment = function(data, slug){
    return $http.put('/api/posts/comments/' + slug, data)
      .success(function(response){
        notifier.notify('Comment number ' + response.message + ' has been deleted!');
      })
      .error(function(err){
        notifier.notify('There was a problem deleting your comment.');
      });
  }

}]);
