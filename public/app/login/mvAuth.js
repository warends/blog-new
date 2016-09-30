angular.module('willsBlog').factory('mvAuth', ['$http', 'identity', '$q', 'mvUser', function($http, identity, $q, mvUser){

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
    },

    authorizeAutheticatedUserForRoute: function(){
      if (identity.isAuthenticated()){
        return true;
      } else {
        return $q.reject('not a current user');
      }
    },

    createUser : function(newUserData) {
       var newUser = new mvUser(newUserData);
       var deferred = $q.defer();

       newUser.$save().then(function(){
         identity.currentUser = newUser;
         deferred.resolve();
       }, function(response){
         deferred.reject(response.data.reason);
       });

       return deferred.promise;
    },

    updateCurrentUser: function(newUserData){
        var deferred = $q.defer();
        var clone = angular.copy(identity.currentUser);
        angular.extend(clone, newUserData);
        clone.$update().then(function(){
          identity.currentUser = clone;
          deferred.resolve();
        }, function(response){
          deferred.reject(response.data.reason);
        });
        return deferred.promise;
    }

  }// return
}]);
