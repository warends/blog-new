angular.module('willsBlog').value('Toastr', toastr);

angular.module('willsBlog').factory('notifier', ['Toastr', function(Toastr){
  return {
    notify: function(message){
      Toastr.success(message);
      console.log(message);
    },
    error: function(message){
      Toastr.error(message);
      console.log(message);
    }
  }
}]);
