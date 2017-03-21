angular.module('blog.comments', []).service('CommentService', ['$http', 'NotifierService', function($http, notifier){

  this.postComment = function(data, slug){
    return $http.post('/api/posts/comments/' + slug, data)
      .then(function(response){
        notifier.notify('Thanks for submitting your comment ' + response.data.message);
      }, function(err){
        console.log(err);
        notifier.error('There was a problem submitting your comment.');
      });
  };

  this.deleteComment = function(data, slug){
    return $http.put('/api/posts/comments/' + slug, data)
      .then(function(response){
        notifier.notify('Comment number ' + response.data.message + ' has been deleted!');
      }, function(err){
        console.log(err);
        notifier.error('There was a problem deleting your comment.');
      });
  };

}]);
