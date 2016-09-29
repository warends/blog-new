willsBlog.factory('mvSavePost', ['$q', 'mvPost', function($q, mvPost){

  return {

    updateCurrentPost : function(newPostData){
      var dfd = $q.defer();
      var editedPost = newPostData;
      editedPost.$save().then(function(){
        dfd.resolve();
      }, function(response){
        dfd.reject(response.data.reason);
      });
      return dfd.promise;
    }

  }// return
}]);
