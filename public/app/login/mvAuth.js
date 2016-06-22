angular.module('willsBlog').factory('mvAuth', function($http, identity, $q, mvUser){

  return {

    authenticateUser: function(username, password){
      var deferred = $q.defer();

      $http.post('/login', {
        username: username,
        password: password
      }).then(function(response){
        if (response.data.success){

          var user = new mvUser();
          angular.extend(user, response.data.user);
          identity.currentUser = user;
          deferred.resolve(true);

        } else {
          deferred.resolve(false);

        }
      });

      return deferred.promise;
    },

    logoutUser: function() {
      var deferred = $q.defer();

      $http.post('/logout', {logout: true}).then(function(){
        identity.currentUser = undefined;
        deferred.resolve();
      });

      return deferred.promise;

    },

    authorizeCurrentUserForRoute: function(role){
      if (identity.isAuthorized('admin')){
        return true;
      } else {
        return $q.reject('not authorized');
      }
    }

  }// return
});
