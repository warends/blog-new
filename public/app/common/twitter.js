angular.module('willsBlog').factory('TwitterService', ['$http', '$q', function($http, $q){

  var getUser = function(username){
    var d = $q.defer();

    $http.post('/twitter/user', {username : username})
      .success(function(data){
        return d.resolve(data);
      })
      .error(function(error){
        return d.reject(error);
      });
      return d.promise;
    };

    return {
      getUser : getUser
    }
}]);
