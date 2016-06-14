angular.module('willsBlog').factory('identity', function(){
  return {
    currentUser: undefined,
    isAuthenticated: function(){
      return !!this.currentUser;
    }
  }
});
