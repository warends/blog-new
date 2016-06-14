angular.module('willsBlog').value('Toastr', toastr);

angular.module('willsBlog').factory('notifier', function(Toastr){
  return {
    notify: function(message){
      Toastr.success(message);
      console.log(message);
    }
  }
});
