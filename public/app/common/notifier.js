angular.module('willsBlog').value('notific8', notific8);

angular.module('willsBlog').factory('notifier', ['notific8', function(notific8){

  notific8('configure', {
    life: 3000,
    theme: 'atomic',
    zindex: 9999,
    verticalEdge: 'right',
    horizontalEdge: 'top',
    closeText: 'X'
  });

  return {
    notify: function(message){
      notific8(message, {color: 'pear'});
      console.log(message);
    },
    error: function(message){
      notific8(message, {color: 'tomato'});
      console.log(message);
    }
  }
}]);
