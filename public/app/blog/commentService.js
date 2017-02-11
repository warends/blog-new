angular.module('willsBlog').service('CommentService', ['$http', 'notifier', function($http, notifier){

  this.postComment = function(data, slug){
    //console.log('Comment Service ' + data + 'Slug ' + slug);
    return $http.post('/api/posts/comments/' + slug, data)
      .success(function(){
        notifier.notify('Thanks for submitting your comment')
      })
      .error(function(err){
        console.log(err);
      });
  }

}]);
