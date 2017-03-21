angular.module('willsBlog').factory('IdentityService', ['$window', 'UserFactory', function($window, UserFactory){

  var currentUser;
  if(!!$window.bootstrappedUserObject) {
    currentUser = new UserFactory();
    angular.extend(currentUser, $window.bootstrappedUserObject);
  }
  return {
    currentUser: currentUser,
    isAuthenticated: function(){
      return !!this.currentUser;
    },

    isAuthorized: function(role){
      return !!this.currentUser && this.currentUser.roles.indexOf(role) > -1;
    }

  }

}]);
