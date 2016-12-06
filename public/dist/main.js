angular.module('willsBlog', ['ngResource','ngAnimate','ngRoute','ngSanitize','ui.bootstrap']);

angular.module('willsBlog').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

  var routeRoleChecks = {
    admin: {auth: function(mvAuth){
        return mvAuth.authorizeCurrentUserForRoute('admin');
    }},
    user: {auth: function(mvAuth){
        return mvAuth.authorizeAutheticatedUserForRoute();
    }}
  }

    $locationProvider.html5Mode(true);

    $routeProvider
    .when('/', {
      templateUrl: '/partials/main/main',
      controller: 'mainCtrl'
    })
    .when('/account', {
      templateUrl: '/partials/login/login',
      controller: 'loginCtrl'
    })
    .when('/signup', {
      templateUrl: '/partials/login/signup',
      controller: 'signupCtrl'
    })
    .when('/blog', {
      templateUrl: '/partials/blog/blog-list',
      controller: 'blogListCtrl'
    })
    .when('/profile', {
      templateUrl: '/partials/admin/profile',
      controller: 'profileCtrl',
      resolve: routeRoleChecks.user
    })
    .when('/posts/:id', { //view single post
      templateUrl: '/partials/blog/post-detail',
      controller: 'postDetailCtrl'
    })
    .when('/admin/new-post', {  //adding a new post
      templateUrl: '/partials/blog/new-post',
      controller: 'newPostCtrl',
      resolve: routeRoleChecks.admin
    })
    .when('/admin/:id/edit', {  //edit post
      templateUrl: '/partials/blog/edit-post',
      controller: 'editPostCtrl',
      resolve: routeRoleChecks.admin
    })
    .when('/admin/users', {
      templateUrl: '/partials/admin/users-list',
      controller: 'userListCtrl',
      resolve: routeRoleChecks.admin
    });

}]);//end config


angular.module('willsBlog').run(['$rootScope', '$location', '$routeParams', '$anchorScroll', function($rootScope, $location, $routeParams, $anchorScroll){

  $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
      if(rejection === 'not authorized') {
        $location.path('/');
      }
  });

}]);

angular.module('willsBlog').controller('profileCtrl', ['$scope', 'mvAuth', 'identity', 'notifier', function($scope, mvAuth, identity, notifier){
  $scope.username = identity.currentUser.username;
  $scope.fName = identity.currentUser.firstName;
  $scope.lName = identity.currentUser.lastName;

  $scope.update = function(){
      var newUserData = {
        username: $scope.username,
        firstName: $scope.fName,
        lastName: $scope.lName
      }

      if($scope.password && $scope.password.length > 0) {
       newUserData.password = $scope.password;
      }

      mvAuth.updateCurrentUser(newUserData)
        .then(function(){
          notifier.notify('Your information has been updated');
        }, function(reason){
          notifier.error(reason);
        });
  }

}]);

angular.module('willsBlog').controller('userListCtrl', ['$scope', 'mvUser', function($scope, mvUser){
  $scope.users = mvUser.query();
}]);

angular.module('willsBlog').controller('blogListCtrl', ['$scope', 'mvCachedPost', 'identity', '$location', function($scope, mvCachedPost, identity, $location){
  
  $scope.posts = mvCachedPost.query();

  $scope.identity = identity;

  $scope.sortOptions= [
    {value: 'title', text: 'Sort by Title'},
    {value: 'published', text: 'Published Date'}];

  $scope.sortOrder = $scope.sortOptions[0].value;
}]);

 angular.module('willsBlog').controller('editPostCtrl', ['$scope', 'notifier', 'mvPost', '$q', '$location', '$routeParams', function($scope, notifier, mvPost, $q, $location, $routeParams){

    $scope.post = mvPost.get({ id: $routeParams.id });

      $scope.post.data = {
          _id: $scope.post._id,
          title : $scope.post.title,
          slug: $scope.post.slug,
          categories : $scope.post.categories,
          headerImage : $scope.post.headerImage,
          excerpt : $scope.post.excerpt,
          body : $scope.post.body,
          author: $scope.post.author
      }

      $scope.updatePost = function(){
          $scope.post.$update( { id: $scope.post._id }, function(){
            notifier.notify('Your post has been updated');
          }, function(reason){
            notifier.error(reason.data);
          });
      }

      $scope.deletePost = function(){
        $scope.post.$delete({ id: $scope.post._id }, function() {
          notifier.notify('Deleted from server');
          $location.path('/blog');
        });
      }

}]);

angular.module('willsBlog').factory('mvCachedPost', ['mvPost', function(mvPost){
  var postList;

  return {
    query: function(){
      if(!postList){
        postList = mvPost.query();
      }

      return postList;
    }
  }

}]);

angular.module('willsBlog').factory('mvPost', ['$resource', '$q', function($resource, $q){

  return $resource('/api/posts/:id', {_id: '@id'}, {
    update : {
      method: 'PUT'
    }
  }, {
    stripTrailingSlashes: false
  });

}]);

angular.module('willsBlog').controller('newPostCtrl', ['$scope', 'notifier', 'mvPost', '$q', '$location', function($scope, notifier, mvPost, $q, $location){

  $scope.post = new mvPost();

  $scope.createNewPost = function(){
    $scope.post.$save(function(){
        notifier.notify('New Post Created');
        $location.path('/blog');
    });
  }

  $scope.cancel = function(){
    $location.path('/blog');
  };

}]);

angular.module('willsBlog').controller('postDetailCtrl', ['$scope', 'mvCachedPost', 'mvPost', '$routeParams', function($scope, mvCachedPost, mvPost, $routeParams){

  window.scrollTo(0,0);

  // mvCachedPost.query().$promise.then(function(collection){
  //   collection.forEach(function(post){
  //     if(post._id === $routeParams.id){
  //       $scope.post = post;
  //     }
  //   });
  // });
  
   $scope.post = mvPost.get({ id: $routeParams.id });
}]);

angular.module('willsBlog').directive('globalModal', function(){
  return{
    restrict: 'E',
    scope: {
      show: '='
    },
    replace: true,
    transclude: true,
    link : function(scope, element, attrs){
      scope.dialogStyle = {};
      if(attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;

      scope.hideModal = function(){
        scope.show = false;
      };
    },
    templateUrl: '/partials/common/modal'
  }
});

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

angular.module('willsBlog').factory('identity', ['$window', 'mvUser', function($window, mvUser){

  var currentUser;
  if(!!$window.bootstrappedUserObject) {
    currentUser = new mvUser();
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

angular.module('willsBlog').controller('loginCtrl', ['$scope', '$http', 'identity', 'notifier', 'mvAuth', '$location', function($scope, $http, identity, notifier, mvAuth, $location){

    $scope.identity = identity;

    $scope.signIn = function(username, password){
      mvAuth.authenticateUser(username, password).then(function(success){
        if(success){
          notifier.notify('You have signed in');
          $location.url('/account');
          $scope.actShown = false;
        } else {
          notifier.notify('Username/Password Incorrect');
        }
      });
    };

    $scope.signOut = function(){
      mvAuth.logoutUser().then(function() {
        $scope.username = '';
        $scope.password = '';
        notifier.notify('You have logged out');
        $location.path('/');
      });
    };

    $scope.signup = function(){
      var newUserData = {
        username: $scope.username,
        firstName: $scope.fName,
        lastName: $scope.lName,
        password: $scope.password
      };
      mvAuth.createUser(newUserData)
        .then(function(){
          notifier.notify('User account created');
          $location.path('/');
      }, function(reason){
        notifier.error(reason);
      });
    };

    $scope.cancel = function(){
      $location.path('/');
    };

    $scope.actShown = false;
    $scope.toggleAccount = function() {
      if(identity.isAuthenticated()){
        $location.path('/account');
      } else {
        $scope.actShown = !$scope.actShown;
      }
    };

    $scope.signupShown = false;
    $scope.toggleSignup = function() {
      $scope.signupShown = !$scope.signupShown;
    };


}]);


angular.module('willsBlog').factory('mvAuth', ['$http', 'identity', '$q', 'mvUser', function($http, identity, $q, mvUser){

  return {
    // this thing working
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

angular.module('willsBlog').factory('mvUser', ['$resource', function($resource){

  var UserResource = $resource('/api/users/:id', {_id : '@id'}, {
    update: {method: 'PUT', isArray: false}
  });

  UserResource.prototype.isAdmin = function(){
    return this.roles && this.roles.indexOf('admin') > -1;
  }

  return UserResource;

}]);

angular.module('willsBlog').controller('signupCtrl', ['$scope', 'mvAuth', 'notifier', '$location', function($scope, mvAuth, notifier, $location){
    $scope.signup = function(){

      var newUserData = {
        username: $scope.username,
        firstName: $scope.fName,
        lastName: $scope.lName,
        password: $scope.password
      };
      mvAuth.createUser(newUserData)
        .then(function(){
          notifier.notify('User account created');
          $location.path('/');
      }, function(reason){
        notifier.error(reason);
      });

    };

    $scope.cancel = function(){
      $location.path('/');
    };

}]);

angular.module('willsBlog').controller('carouselCtrl', ['$scope', function($scope){
  $scope.slides = [
    { name: 'Mobile',
    svg: 'mobile-svg',
    desc: 'Is your website up to date with the most current mobile design trends? If not, you are loosing valuable business. Ensure that your customers can reach your business from anywhere and receive the best user experience. By building with responsive design in mind, your customers will get a pixel perfect look from mobile to tablet or desktop.' },

    { name: 'ECommerce',
    svg: 'ecomm-svg',
    desc: 'Do you have a new product you are looking to bring to market and need an e-commerce site or just looking for more modern feel to an existing site?  By utilizing robust ecommerce platforms, we can design and develop a site that will scale with your business and needs all in time to meet your busy deadlines. ' },

    { name: 'SEO',
    svg: 'seo-svg',
    desc: 'Having a modern design and user friendly website is great, but if customers can`t find your business, it wont matter much.  We design and develop every aspect of the website with search engine optimization in mind and so your customers can find you among the competition.  Also through research and analytics we can develop, plan and deploy the best SEO and marketing practices to increase conversions and retention.' }

  ];

  $scope.currentIndex = 0;
  $scope.setCurrentSlideIndex = function(index){
    $scope.currentIndex = index;
  }
  $scope.isCurrentSlideIndex = function(index){
    return $scope.currentIndex === index;
  }
}])

.animation('.slide-animation', function(){
  return {
    addClass: function(element, className, done){
      if (className == 'ng-hide'){
          TweenMax.to(element, 0.5, {left: -element.parent().width(), onComplete: done });
      } else {
        done();
      }
    },
    removeClass: function(element, className, done){
      if(className == 'ng-hide'){
        element.removeClass('ng-hide');
        TweenMax.set(element, { left: element.parent().width() });
        TweenMax.to(element, 0.5, {left: 0, onComplete: done });
      } else {
        done();
      }
    }
  }
});

angular.module('willsBlog').controller('mainCtrl', ['$scope', '$location', 'mvCachedPost', 'notifier' ,'TwitterService', '$http', function($scope, $location, mvCachedPost, notifier, TwitterService, $http){


  $scope.services = [
    { name: 'Development',
    svg: 'dev-logo',
    description: 'Customized and reusable code using the most up to date HTML5, CSS3 and Javascript framworks. Options range from static sites, content managed sites, and ecommerce stores.',
    more: 'Development Skills include HTML5, CSS, Javascript, Angular, Backbone, Node, Express, Boostrap and more.' },

    { name: 'Web Design',
    svg: 'design-logo',
    description: 'Creating an excellent user experience through clean, simple and thoroughly crafted design. Collaboration with clients during design process ensures a superb finished project.',
    more: 'Services include wire frames, photoshop mockups, logo design, and company branding.' },

    { name: 'Support',
    svg: 'sup-logo',
    description: 'Support is readily available for clients when anything comes up along the development process. Also available are personal instruction on how to maintain or update your own site.',
    more: 'Have a new product or feature you want to implement? Plans for continued support and maintenance are available.' }

  ];

  $scope.posts = mvCachedPost.query();

  $scope.form = {};

  $scope.sendMail = function(){
    var data =({
      contactName : this.contactName,
      contactCompany : this.contactCompany,
      contactEmail : this.contactEmail,
      contactMessage : this.contactMessage
    });

    $http.post('/contact-form', data)
      .success(function(data, status, headers, config){
        notifier.notify('Thank you for your message ' + data.contactName);
           $scope.form.contactForm.$setPristine();
           $scope.form.contactForm.$setUntouched();
      })
      .error(function(data, status, headers, config){
        notifier.notify('There was an error processing your request. Please try again');
      });
      this.contactName = null;
      this.contactCompany = null;
      this.contactEmail = null;
      this.contactMessage = null;

  }

  $scope.getUser = function(username){
		TwitterService.getUser(username)
		    .then(function(data){
		        $scope.twitterErrors = undefined;
	        	$scope.tweets = JSON.parse(data.result.userData);
						// console.log($scope.tweets);
		    })
		    .catch(function(error){
		        console.error('there was an error retrieving data: ', error);
		        $scope.twitterErrors = error.error;
		    })
	};

  //$scope.getUser();



}]);

angular.module('willsBlog').controller('navCtrl', ['$scope', '$location', '$anchorScroll', function($scope, $location, $anchorScroll){
  $scope.linkTo = function(id){
    $location.url(id);
    $anchorScroll();
  };

}]);

angular.module('willsBlog').controller('workCtrl', ['$scope', function($scope){

  $scope.tendrilShown = false;
  $scope.toggleTendril = function() {
    $scope.tendrilShown = !$scope.tendrilShown;
  };

  $scope.crownShow = false;
  $scope.toggleCrown = function() {
    $scope.crownShow = !$scope.crownShow;
  };

  $scope.broadShow = false;
  $scope.toggleBroad = function() {
    $scope.broadShow = !$scope.broadShow;
  };

  $scope.adihow = false;
  $scope.toggleAdi = function() {
    $scope.adiShow = !$scope.adiShow;
  };

}]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFkbWluL3Byb2ZpbGVDdHJsLmpzIiwiYWRtaW4vdXNlckxpc3RDdHJsLmpzIiwiYmxvZy9ibG9nTGlzdEN0cmwuanMiLCJibG9nL2VkaXRQb3N0Q3RybC5qcyIsImJsb2cvbXZDYWNoZWRQb3N0LmpzIiwiYmxvZy9tdlBvc3QuanMiLCJibG9nL25ld1Bvc3RDdHJsLmpzIiwiYmxvZy9wb3N0RGV0YWlsQ3RybC5qcyIsImNvbW1vbi9tb2RhbERpci5qcyIsImNvbW1vbi9ub3RpZmllci5qcyIsImNvbW1vbi90d2l0dGVyLmpzIiwibG9naW4vaWRlbnRpdHkuanMiLCJsb2dpbi9sb2dpbkN0cmwuanMiLCJsb2dpbi9tdkF1dGguanMiLCJsb2dpbi9tdlVzZXIuanMiLCJsb2dpbi9zaWdudXBDdHJsLmpzIiwibWFpbi9jYXJvdXNlbEN0cmwuanMiLCJtYWluL21haW5DdHJsLmpzIiwibWFpbi9uYXZDdHJsLmpzIiwibWFpbi93b3JrQ3RybC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnLCBbJ25nUmVzb3VyY2UnLCduZ0FuaW1hdGUnLCduZ1JvdXRlJywnbmdTYW5pdGl6ZScsJ3VpLmJvb3RzdHJhcCddKTtcblxuYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJywgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKXtcblxuICB2YXIgcm91dGVSb2xlQ2hlY2tzID0ge1xuICAgIGFkbWluOiB7YXV0aDogZnVuY3Rpb24obXZBdXRoKXtcbiAgICAgICAgcmV0dXJuIG12QXV0aC5hdXRob3JpemVDdXJyZW50VXNlckZvclJvdXRlKCdhZG1pbicpO1xuICAgIH19LFxuICAgIHVzZXI6IHthdXRoOiBmdW5jdGlvbihtdkF1dGgpe1xuICAgICAgICByZXR1cm4gbXZBdXRoLmF1dGhvcml6ZUF1dGhldGljYXRlZFVzZXJGb3JSb3V0ZSgpO1xuICAgIH19XG4gIH1cblxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcblxuICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgLndoZW4oJy8nLCB7XG4gICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9tYWluL21haW4nLFxuICAgICAgY29udHJvbGxlcjogJ21haW5DdHJsJ1xuICAgIH0pXG4gICAgLndoZW4oJy9hY2NvdW50Jywge1xuICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvbG9naW4vbG9naW4nLFxuICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ3RybCdcbiAgICB9KVxuICAgIC53aGVuKCcvc2lnbnVwJywge1xuICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvbG9naW4vc2lnbnVwJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdzaWdudXBDdHJsJ1xuICAgIH0pXG4gICAgLndoZW4oJy9ibG9nJywge1xuICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvYmxvZy9ibG9nLWxpc3QnLFxuICAgICAgY29udHJvbGxlcjogJ2Jsb2dMaXN0Q3RybCdcbiAgICB9KVxuICAgIC53aGVuKCcvcHJvZmlsZScsIHtcbiAgICAgIHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL2FkbWluL3Byb2ZpbGUnLFxuICAgICAgY29udHJvbGxlcjogJ3Byb2ZpbGVDdHJsJyxcbiAgICAgIHJlc29sdmU6IHJvdXRlUm9sZUNoZWNrcy51c2VyXG4gICAgfSlcbiAgICAud2hlbignL3Bvc3RzLzppZCcsIHsgLy92aWV3IHNpbmdsZSBwb3N0XG4gICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9ibG9nL3Bvc3QtZGV0YWlsJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdwb3N0RGV0YWlsQ3RybCdcbiAgICB9KVxuICAgIC53aGVuKCcvYWRtaW4vbmV3LXBvc3QnLCB7ICAvL2FkZGluZyBhIG5ldyBwb3N0XG4gICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9ibG9nL25ldy1wb3N0JyxcbiAgICAgIGNvbnRyb2xsZXI6ICduZXdQb3N0Q3RybCcsXG4gICAgICByZXNvbHZlOiByb3V0ZVJvbGVDaGVja3MuYWRtaW5cbiAgICB9KVxuICAgIC53aGVuKCcvYWRtaW4vOmlkL2VkaXQnLCB7ICAvL2VkaXQgcG9zdFxuICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvYmxvZy9lZGl0LXBvc3QnLFxuICAgICAgY29udHJvbGxlcjogJ2VkaXRQb3N0Q3RybCcsXG4gICAgICByZXNvbHZlOiByb3V0ZVJvbGVDaGVja3MuYWRtaW5cbiAgICB9KVxuICAgIC53aGVuKCcvYWRtaW4vdXNlcnMnLCB7XG4gICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9hZG1pbi91c2Vycy1saXN0JyxcbiAgICAgIGNvbnRyb2xsZXI6ICd1c2VyTGlzdEN0cmwnLFxuICAgICAgcmVzb2x2ZTogcm91dGVSb2xlQ2hlY2tzLmFkbWluXG4gICAgfSk7XG5cbn1dKTsvL2VuZCBjb25maWdcblxuXG5hbmd1bGFyLm1vZHVsZSgnd2lsbHNCbG9nJykucnVuKFsnJHJvb3RTY29wZScsICckbG9jYXRpb24nLCAnJHJvdXRlUGFyYW1zJywgJyRhbmNob3JTY3JvbGwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcywgJGFuY2hvclNjcm9sbCl7XG5cbiAgJHJvb3RTY29wZS4kb24oJyRyb3V0ZUNoYW5nZUVycm9yJywgZnVuY3Rpb24oZXZ0LCBjdXJyZW50LCBwcmV2aW91cywgcmVqZWN0aW9uKSB7XG4gICAgICBpZihyZWplY3Rpb24gPT09ICdub3QgYXV0aG9yaXplZCcpIHtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgIH1cbiAgfSk7XG5cbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnKS5jb250cm9sbGVyKCdwcm9maWxlQ3RybCcsIFsnJHNjb3BlJywgJ212QXV0aCcsICdpZGVudGl0eScsICdub3RpZmllcicsIGZ1bmN0aW9uKCRzY29wZSwgbXZBdXRoLCBpZGVudGl0eSwgbm90aWZpZXIpe1xuICAkc2NvcGUudXNlcm5hbWUgPSBpZGVudGl0eS5jdXJyZW50VXNlci51c2VybmFtZTtcbiAgJHNjb3BlLmZOYW1lID0gaWRlbnRpdHkuY3VycmVudFVzZXIuZmlyc3ROYW1lO1xuICAkc2NvcGUubE5hbWUgPSBpZGVudGl0eS5jdXJyZW50VXNlci5sYXN0TmFtZTtcblxuICAkc2NvcGUudXBkYXRlID0gZnVuY3Rpb24oKXtcbiAgICAgIHZhciBuZXdVc2VyRGF0YSA9IHtcbiAgICAgICAgdXNlcm5hbWU6ICRzY29wZS51c2VybmFtZSxcbiAgICAgICAgZmlyc3ROYW1lOiAkc2NvcGUuZk5hbWUsXG4gICAgICAgIGxhc3ROYW1lOiAkc2NvcGUubE5hbWVcbiAgICAgIH1cblxuICAgICAgaWYoJHNjb3BlLnBhc3N3b3JkICYmICRzY29wZS5wYXNzd29yZC5sZW5ndGggPiAwKSB7XG4gICAgICAgbmV3VXNlckRhdGEucGFzc3dvcmQgPSAkc2NvcGUucGFzc3dvcmQ7XG4gICAgICB9XG5cbiAgICAgIG12QXV0aC51cGRhdGVDdXJyZW50VXNlcihuZXdVc2VyRGF0YSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICBub3RpZmllci5ub3RpZnkoJ1lvdXIgaW5mb3JtYXRpb24gaGFzIGJlZW4gdXBkYXRlZCcpO1xuICAgICAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAgIG5vdGlmaWVyLmVycm9yKHJlYXNvbik7XG4gICAgICAgIH0pO1xuICB9XG5cbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnKS5jb250cm9sbGVyKCd1c2VyTGlzdEN0cmwnLCBbJyRzY29wZScsICdtdlVzZXInLCBmdW5jdGlvbigkc2NvcGUsIG12VXNlcil7XG4gICRzY29wZS51c2VycyA9IG12VXNlci5xdWVyeSgpO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmNvbnRyb2xsZXIoJ2Jsb2dMaXN0Q3RybCcsIFsnJHNjb3BlJywgJ212Q2FjaGVkUG9zdCcsICdpZGVudGl0eScsICckbG9jYXRpb24nLCBmdW5jdGlvbigkc2NvcGUsIG12Q2FjaGVkUG9zdCwgaWRlbnRpdHksICRsb2NhdGlvbil7XG4gIFxuICAkc2NvcGUucG9zdHMgPSBtdkNhY2hlZFBvc3QucXVlcnkoKTtcblxuICAkc2NvcGUuaWRlbnRpdHkgPSBpZGVudGl0eTtcblxuICAkc2NvcGUuc29ydE9wdGlvbnM9IFtcbiAgICB7dmFsdWU6ICd0aXRsZScsIHRleHQ6ICdTb3J0IGJ5IFRpdGxlJ30sXG4gICAge3ZhbHVlOiAncHVibGlzaGVkJywgdGV4dDogJ1B1Ymxpc2hlZCBEYXRlJ31dO1xuXG4gICRzY29wZS5zb3J0T3JkZXIgPSAkc2NvcGUuc29ydE9wdGlvbnNbMF0udmFsdWU7XG59XSk7XG4iLCIgYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmNvbnRyb2xsZXIoJ2VkaXRQb3N0Q3RybCcsIFsnJHNjb3BlJywgJ25vdGlmaWVyJywgJ212UG9zdCcsICckcScsICckbG9jYXRpb24nLCAnJHJvdXRlUGFyYW1zJywgZnVuY3Rpb24oJHNjb3BlLCBub3RpZmllciwgbXZQb3N0LCAkcSwgJGxvY2F0aW9uLCAkcm91dGVQYXJhbXMpe1xuXG4gICAgJHNjb3BlLnBvc3QgPSBtdlBvc3QuZ2V0KHsgaWQ6ICRyb3V0ZVBhcmFtcy5pZCB9KTtcblxuICAgICAgJHNjb3BlLnBvc3QuZGF0YSA9IHtcbiAgICAgICAgICBfaWQ6ICRzY29wZS5wb3N0Ll9pZCxcbiAgICAgICAgICB0aXRsZSA6ICRzY29wZS5wb3N0LnRpdGxlLFxuICAgICAgICAgIHNsdWc6ICRzY29wZS5wb3N0LnNsdWcsXG4gICAgICAgICAgY2F0ZWdvcmllcyA6ICRzY29wZS5wb3N0LmNhdGVnb3JpZXMsXG4gICAgICAgICAgaGVhZGVySW1hZ2UgOiAkc2NvcGUucG9zdC5oZWFkZXJJbWFnZSxcbiAgICAgICAgICBleGNlcnB0IDogJHNjb3BlLnBvc3QuZXhjZXJwdCxcbiAgICAgICAgICBib2R5IDogJHNjb3BlLnBvc3QuYm9keSxcbiAgICAgICAgICBhdXRob3I6ICRzY29wZS5wb3N0LmF1dGhvclxuICAgICAgfVxuXG4gICAgICAkc2NvcGUudXBkYXRlUG9zdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJHNjb3BlLnBvc3QuJHVwZGF0ZSggeyBpZDogJHNjb3BlLnBvc3QuX2lkIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBub3RpZmllci5ub3RpZnkoJ1lvdXIgcG9zdCBoYXMgYmVlbiB1cGRhdGVkJyk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgICAgIG5vdGlmaWVyLmVycm9yKHJlYXNvbi5kYXRhKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgJHNjb3BlLmRlbGV0ZVBvc3QgPSBmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUucG9zdC4kZGVsZXRlKHsgaWQ6ICRzY29wZS5wb3N0Ll9pZCB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBub3RpZmllci5ub3RpZnkoJ0RlbGV0ZWQgZnJvbSBzZXJ2ZXInKTtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2Jsb2cnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnKS5mYWN0b3J5KCdtdkNhY2hlZFBvc3QnLCBbJ212UG9zdCcsIGZ1bmN0aW9uKG12UG9zdCl7XG4gIHZhciBwb3N0TGlzdDtcblxuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBmdW5jdGlvbigpe1xuICAgICAgaWYoIXBvc3RMaXN0KXtcbiAgICAgICAgcG9zdExpc3QgPSBtdlBvc3QucXVlcnkoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHBvc3RMaXN0O1xuICAgIH1cbiAgfVxuXG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2lsbHNCbG9nJykuZmFjdG9yeSgnbXZQb3N0JywgWyckcmVzb3VyY2UnLCAnJHEnLCBmdW5jdGlvbigkcmVzb3VyY2UsICRxKXtcblxuICByZXR1cm4gJHJlc291cmNlKCcvYXBpL3Bvc3RzLzppZCcsIHtfaWQ6ICdAaWQnfSwge1xuICAgIHVwZGF0ZSA6IHtcbiAgICAgIG1ldGhvZDogJ1BVVCdcbiAgICB9XG4gIH0sIHtcbiAgICBzdHJpcFRyYWlsaW5nU2xhc2hlczogZmFsc2VcbiAgfSk7XG5cbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnKS5jb250cm9sbGVyKCduZXdQb3N0Q3RybCcsIFsnJHNjb3BlJywgJ25vdGlmaWVyJywgJ212UG9zdCcsICckcScsICckbG9jYXRpb24nLCBmdW5jdGlvbigkc2NvcGUsIG5vdGlmaWVyLCBtdlBvc3QsICRxLCAkbG9jYXRpb24pe1xuXG4gICRzY29wZS5wb3N0ID0gbmV3IG12UG9zdCgpO1xuXG4gICRzY29wZS5jcmVhdGVOZXdQb3N0ID0gZnVuY3Rpb24oKXtcbiAgICAkc2NvcGUucG9zdC4kc2F2ZShmdW5jdGlvbigpe1xuICAgICAgICBub3RpZmllci5ub3RpZnkoJ05ldyBQb3N0IENyZWF0ZWQnKTtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9ibG9nJyk7XG4gICAgfSk7XG4gIH1cblxuICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24oKXtcbiAgICAkbG9jYXRpb24ucGF0aCgnL2Jsb2cnKTtcbiAgfTtcblxufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmNvbnRyb2xsZXIoJ3Bvc3REZXRhaWxDdHJsJywgWyckc2NvcGUnLCAnbXZDYWNoZWRQb3N0JywgJ212UG9zdCcsICckcm91dGVQYXJhbXMnLCBmdW5jdGlvbigkc2NvcGUsIG12Q2FjaGVkUG9zdCwgbXZQb3N0LCAkcm91dGVQYXJhbXMpe1xuXG4gIHdpbmRvdy5zY3JvbGxUbygwLDApO1xuXG4gIC8vIG12Q2FjaGVkUG9zdC5xdWVyeSgpLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24oY29sbGVjdGlvbil7XG4gIC8vICAgY29sbGVjdGlvbi5mb3JFYWNoKGZ1bmN0aW9uKHBvc3Qpe1xuICAvLyAgICAgaWYocG9zdC5faWQgPT09ICRyb3V0ZVBhcmFtcy5pZCl7XG4gIC8vICAgICAgICRzY29wZS5wb3N0ID0gcG9zdDtcbiAgLy8gICAgIH1cbiAgLy8gICB9KTtcbiAgLy8gfSk7XG4gIFxuICAgJHNjb3BlLnBvc3QgPSBtdlBvc3QuZ2V0KHsgaWQ6ICRyb3V0ZVBhcmFtcy5pZCB9KTtcbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnKS5kaXJlY3RpdmUoJ2dsb2JhbE1vZGFsJywgZnVuY3Rpb24oKXtcbiAgcmV0dXJue1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IHtcbiAgICAgIHNob3c6ICc9J1xuICAgIH0sXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICB0cmFuc2NsdWRlOiB0cnVlLFxuICAgIGxpbmsgOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpe1xuICAgICAgc2NvcGUuZGlhbG9nU3R5bGUgPSB7fTtcbiAgICAgIGlmKGF0dHJzLndpZHRoKVxuICAgICAgICBzY29wZS5kaWFsb2dTdHlsZS53aWR0aCA9IGF0dHJzLndpZHRoO1xuICAgICAgaWYgKGF0dHJzLmhlaWdodClcbiAgICAgICAgc2NvcGUuZGlhbG9nU3R5bGUuaGVpZ2h0ID0gYXR0cnMuaGVpZ2h0O1xuXG4gICAgICBzY29wZS5oaWRlTW9kYWwgPSBmdW5jdGlvbigpe1xuICAgICAgICBzY29wZS5zaG93ID0gZmFsc2U7XG4gICAgICB9O1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvY29tbW9uL21vZGFsJ1xuICB9XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnKS52YWx1ZSgnVG9hc3RyJywgdG9hc3RyKTtcblxuYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmZhY3RvcnkoJ25vdGlmaWVyJywgWydUb2FzdHInLCBmdW5jdGlvbihUb2FzdHIpe1xuICByZXR1cm4ge1xuICAgIG5vdGlmeTogZnVuY3Rpb24obWVzc2FnZSl7XG4gICAgICBUb2FzdHIuc3VjY2VzcyhtZXNzYWdlKTtcbiAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICAgIH0sXG4gICAgZXJyb3I6IGZ1bmN0aW9uKG1lc3NhZ2Upe1xuICAgICAgVG9hc3RyLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgfVxuICB9XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2lsbHNCbG9nJykuZmFjdG9yeSgnVHdpdHRlclNlcnZpY2UnLCBbJyRodHRwJywgJyRxJywgZnVuY3Rpb24oJGh0dHAsICRxKXtcblxuICB2YXIgZ2V0VXNlciA9IGZ1bmN0aW9uKHVzZXJuYW1lKXtcbiAgICB2YXIgZCA9ICRxLmRlZmVyKCk7XG5cbiAgICAkaHR0cC5wb3N0KCcvdHdpdHRlci91c2VyJywge3VzZXJuYW1lIDogdXNlcm5hbWV9KVxuICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgIHJldHVybiBkLnJlc29sdmUoZGF0YSk7XG4gICAgICB9KVxuICAgICAgLmVycm9yKGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgcmV0dXJuIGQucmVqZWN0KGVycm9yKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGQucHJvbWlzZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFVzZXIgOiBnZXRVc2VyXG4gICAgfVxufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmZhY3RvcnkoJ2lkZW50aXR5JywgWyckd2luZG93JywgJ212VXNlcicsIGZ1bmN0aW9uKCR3aW5kb3csIG12VXNlcil7XG5cbiAgdmFyIGN1cnJlbnRVc2VyO1xuICBpZighISR3aW5kb3cuYm9vdHN0cmFwcGVkVXNlck9iamVjdCkge1xuICAgIGN1cnJlbnRVc2VyID0gbmV3IG12VXNlcigpO1xuICAgIGFuZ3VsYXIuZXh0ZW5kKGN1cnJlbnRVc2VyLCAkd2luZG93LmJvb3RzdHJhcHBlZFVzZXJPYmplY3QpO1xuICB9XG4gIHJldHVybiB7XG4gICAgY3VycmVudFVzZXI6IGN1cnJlbnRVc2VyLFxuICAgIGlzQXV0aGVudGljYXRlZDogZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiAhIXRoaXMuY3VycmVudFVzZXI7XG4gICAgfSxcblxuICAgIGlzQXV0aG9yaXplZDogZnVuY3Rpb24ocm9sZSl7XG4gICAgICByZXR1cm4gISF0aGlzLmN1cnJlbnRVc2VyICYmIHRoaXMuY3VycmVudFVzZXIucm9sZXMuaW5kZXhPZihyb2xlKSA+IC0xO1xuICAgIH1cblxuICB9XG5cbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnKS5jb250cm9sbGVyKCdsb2dpbkN0cmwnLCBbJyRzY29wZScsICckaHR0cCcsICdpZGVudGl0eScsICdub3RpZmllcicsICdtdkF1dGgnLCAnJGxvY2F0aW9uJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgaWRlbnRpdHksIG5vdGlmaWVyLCBtdkF1dGgsICRsb2NhdGlvbil7XG5cbiAgICAkc2NvcGUuaWRlbnRpdHkgPSBpZGVudGl0eTtcblxuICAgICRzY29wZS5zaWduSW4gPSBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQpe1xuICAgICAgbXZBdXRoLmF1dGhlbnRpY2F0ZVVzZXIodXNlcm5hbWUsIHBhc3N3b3JkKS50aGVuKGZ1bmN0aW9uKHN1Y2Nlc3Mpe1xuICAgICAgICBpZihzdWNjZXNzKXtcbiAgICAgICAgICBub3RpZmllci5ub3RpZnkoJ1lvdSBoYXZlIHNpZ25lZCBpbicpO1xuICAgICAgICAgICRsb2NhdGlvbi51cmwoJy9hY2NvdW50Jyk7XG4gICAgICAgICAgJHNjb3BlLmFjdFNob3duID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm90aWZpZXIubm90aWZ5KCdVc2VybmFtZS9QYXNzd29yZCBJbmNvcnJlY3QnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zaWduT3V0ID0gZnVuY3Rpb24oKXtcbiAgICAgIG12QXV0aC5sb2dvdXRVc2VyKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLnVzZXJuYW1lID0gJyc7XG4gICAgICAgICRzY29wZS5wYXNzd29yZCA9ICcnO1xuICAgICAgICBub3RpZmllci5ub3RpZnkoJ1lvdSBoYXZlIGxvZ2dlZCBvdXQnKTtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcbiAgICAgIHZhciBuZXdVc2VyRGF0YSA9IHtcbiAgICAgICAgdXNlcm5hbWU6ICRzY29wZS51c2VybmFtZSxcbiAgICAgICAgZmlyc3ROYW1lOiAkc2NvcGUuZk5hbWUsXG4gICAgICAgIGxhc3ROYW1lOiAkc2NvcGUubE5hbWUsXG4gICAgICAgIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmRcbiAgICAgIH07XG4gICAgICBtdkF1dGguY3JlYXRlVXNlcihuZXdVc2VyRGF0YSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICBub3RpZmllci5ub3RpZnkoJ1VzZXIgYWNjb3VudCBjcmVhdGVkJyk7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbil7XG4gICAgICAgIG5vdGlmaWVyLmVycm9yKHJlYXNvbik7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uKCl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuYWN0U2hvd24gPSBmYWxzZTtcbiAgICAkc2NvcGUudG9nZ2xlQWNjb3VudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYoaWRlbnRpdHkuaXNBdXRoZW50aWNhdGVkKCkpe1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2FjY291bnQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRzY29wZS5hY3RTaG93biA9ICEkc2NvcGUuYWN0U2hvd247XG4gICAgICB9XG4gICAgfTtcblxuICAgICRzY29wZS5zaWdudXBTaG93biA9IGZhbHNlO1xuICAgICRzY29wZS50b2dnbGVTaWdudXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICRzY29wZS5zaWdudXBTaG93biA9ICEkc2NvcGUuc2lnbnVwU2hvd247XG4gICAgfTtcblxuXG59XSk7XG4iLCJcbmFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnKS5mYWN0b3J5KCdtdkF1dGgnLCBbJyRodHRwJywgJ2lkZW50aXR5JywgJyRxJywgJ212VXNlcicsIGZ1bmN0aW9uKCRodHRwLCBpZGVudGl0eSwgJHEsIG12VXNlcil7XG5cbiAgcmV0dXJuIHtcbiAgICAvLyB0aGlzIHRoaW5nIHdvcmtpbmdcbiAgICBhdXRoZW50aWNhdGVVc2VyOiBmdW5jdGlvbih1c2VybmFtZSwgcGFzc3dvcmQpe1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcblxuICAgICAgJGh0dHAucG9zdCgnL2xvZ2luJywge1xuICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgIGlmIChyZXNwb25zZS5kYXRhLnN1Y2Nlc3Mpe1xuXG4gICAgICAgICAgdmFyIHVzZXIgPSBuZXcgbXZVc2VyKCk7XG4gICAgICAgICAgYW5ndWxhci5leHRlbmQodXNlciwgcmVzcG9uc2UuZGF0YS51c2VyKTtcbiAgICAgICAgICBpZGVudGl0eS5jdXJyZW50VXNlciA9IHVzZXI7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0sXG5cbiAgICBsb2dvdXRVc2VyOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cbiAgICAgICRodHRwLnBvc3QoJy9sb2dvdXQnLCB7bG9nb3V0OiB0cnVlfSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICBpZGVudGl0eS5jdXJyZW50VXNlciA9IHVuZGVmaW5lZDtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuXG4gICAgfSxcblxuICAgIGF1dGhvcml6ZUN1cnJlbnRVc2VyRm9yUm91dGU6IGZ1bmN0aW9uKHJvbGUpe1xuICAgICAgaWYgKGlkZW50aXR5LmlzQXV0aG9yaXplZCgnYWRtaW4nKSl7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICRxLnJlamVjdCgnbm90IGF1dGhvcml6ZWQnKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYXV0aG9yaXplQXV0aGV0aWNhdGVkVXNlckZvclJvdXRlOiBmdW5jdGlvbigpe1xuICAgICAgaWYgKGlkZW50aXR5LmlzQXV0aGVudGljYXRlZCgpKXtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJHEucmVqZWN0KCdub3QgYSBjdXJyZW50IHVzZXInKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgY3JlYXRlVXNlciA6IGZ1bmN0aW9uKG5ld1VzZXJEYXRhKSB7XG4gICAgICAgdmFyIG5ld1VzZXIgPSBuZXcgbXZVc2VyKG5ld1VzZXJEYXRhKTtcbiAgICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuXG4gICAgICAgbmV3VXNlci4kc2F2ZSgpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgIGlkZW50aXR5LmN1cnJlbnRVc2VyID0gbmV3VXNlcjtcbiAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICBkZWZlcnJlZC5yZWplY3QocmVzcG9uc2UuZGF0YS5yZWFzb24pO1xuICAgICAgIH0pO1xuXG4gICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfSxcblxuICAgIHVwZGF0ZUN1cnJlbnRVc2VyOiBmdW5jdGlvbihuZXdVc2VyRGF0YSl7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG4gICAgICAgIHZhciBjbG9uZSA9IGFuZ3VsYXIuY29weShpZGVudGl0eS5jdXJyZW50VXNlcik7XG4gICAgICAgIGFuZ3VsYXIuZXh0ZW5kKGNsb25lLCBuZXdVc2VyRGF0YSk7XG4gICAgICAgIGNsb25lLiR1cGRhdGUoKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgaWRlbnRpdHkuY3VycmVudFVzZXIgPSBjbG9uZTtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QocmVzcG9uc2UuZGF0YS5yZWFzb24pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfVxuXG4gIH0vLyByZXR1cm5cblxufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmZhY3RvcnkoJ212VXNlcicsIFsnJHJlc291cmNlJywgZnVuY3Rpb24oJHJlc291cmNlKXtcblxuICB2YXIgVXNlclJlc291cmNlID0gJHJlc291cmNlKCcvYXBpL3VzZXJzLzppZCcsIHtfaWQgOiAnQGlkJ30sIHtcbiAgICB1cGRhdGU6IHttZXRob2Q6ICdQVVQnLCBpc0FycmF5OiBmYWxzZX1cbiAgfSk7XG5cbiAgVXNlclJlc291cmNlLnByb3RvdHlwZS5pc0FkbWluID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcy5yb2xlcyAmJiB0aGlzLnJvbGVzLmluZGV4T2YoJ2FkbWluJykgPiAtMTtcbiAgfVxuXG4gIHJldHVybiBVc2VyUmVzb3VyY2U7XG5cbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnKS5jb250cm9sbGVyKCdzaWdudXBDdHJsJywgWyckc2NvcGUnLCAnbXZBdXRoJywgJ25vdGlmaWVyJywgJyRsb2NhdGlvbicsIGZ1bmN0aW9uKCRzY29wZSwgbXZBdXRoLCBub3RpZmllciwgJGxvY2F0aW9uKXtcbiAgICAkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKXtcblxuICAgICAgdmFyIG5ld1VzZXJEYXRhID0ge1xuICAgICAgICB1c2VybmFtZTogJHNjb3BlLnVzZXJuYW1lLFxuICAgICAgICBmaXJzdE5hbWU6ICRzY29wZS5mTmFtZSxcbiAgICAgICAgbGFzdE5hbWU6ICRzY29wZS5sTmFtZSxcbiAgICAgICAgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZFxuICAgICAgfTtcbiAgICAgIG12QXV0aC5jcmVhdGVVc2VyKG5ld1VzZXJEYXRhKVxuICAgICAgICAudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgIG5vdGlmaWVyLm5vdGlmeSgnVXNlciBhY2NvdW50IGNyZWF0ZWQnKTtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgbm90aWZpZXIuZXJyb3IocmVhc29uKTtcbiAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbigpe1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICB9O1xuXG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2lsbHNCbG9nJykuY29udHJvbGxlcignY2Fyb3VzZWxDdHJsJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICAkc2NvcGUuc2xpZGVzID0gW1xuICAgIHsgbmFtZTogJ01vYmlsZScsXG4gICAgc3ZnOiAnbW9iaWxlLXN2ZycsXG4gICAgZGVzYzogJ0lzIHlvdXIgd2Vic2l0ZSB1cCB0byBkYXRlIHdpdGggdGhlIG1vc3QgY3VycmVudCBtb2JpbGUgZGVzaWduIHRyZW5kcz8gSWYgbm90LCB5b3UgYXJlIGxvb3NpbmcgdmFsdWFibGUgYnVzaW5lc3MuIEVuc3VyZSB0aGF0IHlvdXIgY3VzdG9tZXJzIGNhbiByZWFjaCB5b3VyIGJ1c2luZXNzIGZyb20gYW55d2hlcmUgYW5kIHJlY2VpdmUgdGhlIGJlc3QgdXNlciBleHBlcmllbmNlLiBCeSBidWlsZGluZyB3aXRoIHJlc3BvbnNpdmUgZGVzaWduIGluIG1pbmQsIHlvdXIgY3VzdG9tZXJzIHdpbGwgZ2V0IGEgcGl4ZWwgcGVyZmVjdCBsb29rIGZyb20gbW9iaWxlIHRvIHRhYmxldCBvciBkZXNrdG9wLicgfSxcblxuICAgIHsgbmFtZTogJ0VDb21tZXJjZScsXG4gICAgc3ZnOiAnZWNvbW0tc3ZnJyxcbiAgICBkZXNjOiAnRG8geW91IGhhdmUgYSBuZXcgcHJvZHVjdCB5b3UgYXJlIGxvb2tpbmcgdG8gYnJpbmcgdG8gbWFya2V0IGFuZCBuZWVkIGFuIGUtY29tbWVyY2Ugc2l0ZSBvciBqdXN0IGxvb2tpbmcgZm9yIG1vcmUgbW9kZXJuIGZlZWwgdG8gYW4gZXhpc3Rpbmcgc2l0ZT8gIEJ5IHV0aWxpemluZyByb2J1c3QgZWNvbW1lcmNlIHBsYXRmb3Jtcywgd2UgY2FuIGRlc2lnbiBhbmQgZGV2ZWxvcCBhIHNpdGUgdGhhdCB3aWxsIHNjYWxlIHdpdGggeW91ciBidXNpbmVzcyBhbmQgbmVlZHMgYWxsIGluIHRpbWUgdG8gbWVldCB5b3VyIGJ1c3kgZGVhZGxpbmVzLiAnIH0sXG5cbiAgICB7IG5hbWU6ICdTRU8nLFxuICAgIHN2ZzogJ3Nlby1zdmcnLFxuICAgIGRlc2M6ICdIYXZpbmcgYSBtb2Rlcm4gZGVzaWduIGFuZCB1c2VyIGZyaWVuZGx5IHdlYnNpdGUgaXMgZ3JlYXQsIGJ1dCBpZiBjdXN0b21lcnMgY2FuYHQgZmluZCB5b3VyIGJ1c2luZXNzLCBpdCB3b250IG1hdHRlciBtdWNoLiAgV2UgZGVzaWduIGFuZCBkZXZlbG9wIGV2ZXJ5IGFzcGVjdCBvZiB0aGUgd2Vic2l0ZSB3aXRoIHNlYXJjaCBlbmdpbmUgb3B0aW1pemF0aW9uIGluIG1pbmQgYW5kIHNvIHlvdXIgY3VzdG9tZXJzIGNhbiBmaW5kIHlvdSBhbW9uZyB0aGUgY29tcGV0aXRpb24uICBBbHNvIHRocm91Z2ggcmVzZWFyY2ggYW5kIGFuYWx5dGljcyB3ZSBjYW4gZGV2ZWxvcCwgcGxhbiBhbmQgZGVwbG95IHRoZSBiZXN0IFNFTyBhbmQgbWFya2V0aW5nIHByYWN0aWNlcyB0byBpbmNyZWFzZSBjb252ZXJzaW9ucyBhbmQgcmV0ZW50aW9uLicgfVxuXG4gIF07XG5cbiAgJHNjb3BlLmN1cnJlbnRJbmRleCA9IDA7XG4gICRzY29wZS5zZXRDdXJyZW50U2xpZGVJbmRleCA9IGZ1bmN0aW9uKGluZGV4KXtcbiAgICAkc2NvcGUuY3VycmVudEluZGV4ID0gaW5kZXg7XG4gIH1cbiAgJHNjb3BlLmlzQ3VycmVudFNsaWRlSW5kZXggPSBmdW5jdGlvbihpbmRleCl7XG4gICAgcmV0dXJuICRzY29wZS5jdXJyZW50SW5kZXggPT09IGluZGV4O1xuICB9XG59XSlcblxuLmFuaW1hdGlvbignLnNsaWRlLWFuaW1hdGlvbicsIGZ1bmN0aW9uKCl7XG4gIHJldHVybiB7XG4gICAgYWRkQ2xhc3M6IGZ1bmN0aW9uKGVsZW1lbnQsIGNsYXNzTmFtZSwgZG9uZSl7XG4gICAgICBpZiAoY2xhc3NOYW1lID09ICduZy1oaWRlJyl7XG4gICAgICAgICAgVHdlZW5NYXgudG8oZWxlbWVudCwgMC41LCB7bGVmdDogLWVsZW1lbnQucGFyZW50KCkud2lkdGgoKSwgb25Db21wbGV0ZTogZG9uZSB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbihlbGVtZW50LCBjbGFzc05hbWUsIGRvbmUpe1xuICAgICAgaWYoY2xhc3NOYW1lID09ICduZy1oaWRlJyl7XG4gICAgICAgIGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ25nLWhpZGUnKTtcbiAgICAgICAgVHdlZW5NYXguc2V0KGVsZW1lbnQsIHsgbGVmdDogZWxlbWVudC5wYXJlbnQoKS53aWR0aCgpIH0pO1xuICAgICAgICBUd2Vlbk1heC50byhlbGVtZW50LCAwLjUsIHtsZWZ0OiAwLCBvbkNvbXBsZXRlOiBkb25lIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9uZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2lsbHNCbG9nJykuY29udHJvbGxlcignbWFpbkN0cmwnLCBbJyRzY29wZScsICckbG9jYXRpb24nLCAnbXZDYWNoZWRQb3N0JywgJ25vdGlmaWVyJyAsJ1R3aXR0ZXJTZXJ2aWNlJywgJyRodHRwJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIG12Q2FjaGVkUG9zdCwgbm90aWZpZXIsIFR3aXR0ZXJTZXJ2aWNlLCAkaHR0cCl7XG5cblxuICAkc2NvcGUuc2VydmljZXMgPSBbXG4gICAgeyBuYW1lOiAnRGV2ZWxvcG1lbnQnLFxuICAgIHN2ZzogJ2Rldi1sb2dvJyxcbiAgICBkZXNjcmlwdGlvbjogJ0N1c3RvbWl6ZWQgYW5kIHJldXNhYmxlIGNvZGUgdXNpbmcgdGhlIG1vc3QgdXAgdG8gZGF0ZSBIVE1MNSwgQ1NTMyBhbmQgSmF2YXNjcmlwdCBmcmFtd29ya3MuIE9wdGlvbnMgcmFuZ2UgZnJvbSBzdGF0aWMgc2l0ZXMsIGNvbnRlbnQgbWFuYWdlZCBzaXRlcywgYW5kIGVjb21tZXJjZSBzdG9yZXMuJyxcbiAgICBtb3JlOiAnRGV2ZWxvcG1lbnQgU2tpbGxzIGluY2x1ZGUgSFRNTDUsIENTUywgSmF2YXNjcmlwdCwgQW5ndWxhciwgQmFja2JvbmUsIE5vZGUsIEV4cHJlc3MsIEJvb3N0cmFwIGFuZCBtb3JlLicgfSxcblxuICAgIHsgbmFtZTogJ1dlYiBEZXNpZ24nLFxuICAgIHN2ZzogJ2Rlc2lnbi1sb2dvJyxcbiAgICBkZXNjcmlwdGlvbjogJ0NyZWF0aW5nIGFuIGV4Y2VsbGVudCB1c2VyIGV4cGVyaWVuY2UgdGhyb3VnaCBjbGVhbiwgc2ltcGxlIGFuZCB0aG9yb3VnaGx5IGNyYWZ0ZWQgZGVzaWduLiBDb2xsYWJvcmF0aW9uIHdpdGggY2xpZW50cyBkdXJpbmcgZGVzaWduIHByb2Nlc3MgZW5zdXJlcyBhIHN1cGVyYiBmaW5pc2hlZCBwcm9qZWN0LicsXG4gICAgbW9yZTogJ1NlcnZpY2VzIGluY2x1ZGUgd2lyZSBmcmFtZXMsIHBob3Rvc2hvcCBtb2NrdXBzLCBsb2dvIGRlc2lnbiwgYW5kIGNvbXBhbnkgYnJhbmRpbmcuJyB9LFxuXG4gICAgeyBuYW1lOiAnU3VwcG9ydCcsXG4gICAgc3ZnOiAnc3VwLWxvZ28nLFxuICAgIGRlc2NyaXB0aW9uOiAnU3VwcG9ydCBpcyByZWFkaWx5IGF2YWlsYWJsZSBmb3IgY2xpZW50cyB3aGVuIGFueXRoaW5nIGNvbWVzIHVwIGFsb25nIHRoZSBkZXZlbG9wbWVudCBwcm9jZXNzLiBBbHNvIGF2YWlsYWJsZSBhcmUgcGVyc29uYWwgaW5zdHJ1Y3Rpb24gb24gaG93IHRvIG1haW50YWluIG9yIHVwZGF0ZSB5b3VyIG93biBzaXRlLicsXG4gICAgbW9yZTogJ0hhdmUgYSBuZXcgcHJvZHVjdCBvciBmZWF0dXJlIHlvdSB3YW50IHRvIGltcGxlbWVudD8gUGxhbnMgZm9yIGNvbnRpbnVlZCBzdXBwb3J0IGFuZCBtYWludGVuYW5jZSBhcmUgYXZhaWxhYmxlLicgfVxuXG4gIF07XG5cbiAgJHNjb3BlLnBvc3RzID0gbXZDYWNoZWRQb3N0LnF1ZXJ5KCk7XG5cbiAgJHNjb3BlLmZvcm0gPSB7fTtcblxuICAkc2NvcGUuc2VuZE1haWwgPSBmdW5jdGlvbigpe1xuICAgIHZhciBkYXRhID0oe1xuICAgICAgY29udGFjdE5hbWUgOiB0aGlzLmNvbnRhY3ROYW1lLFxuICAgICAgY29udGFjdENvbXBhbnkgOiB0aGlzLmNvbnRhY3RDb21wYW55LFxuICAgICAgY29udGFjdEVtYWlsIDogdGhpcy5jb250YWN0RW1haWwsXG4gICAgICBjb250YWN0TWVzc2FnZSA6IHRoaXMuY29udGFjdE1lc3NhZ2VcbiAgICB9KTtcblxuICAgICRodHRwLnBvc3QoJy9jb250YWN0LWZvcm0nLCBkYXRhKVxuICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpe1xuICAgICAgICBub3RpZmllci5ub3RpZnkoJ1RoYW5rIHlvdSBmb3IgeW91ciBtZXNzYWdlICcgKyBkYXRhLmNvbnRhY3ROYW1lKTtcbiAgICAgICAgICAgJHNjb3BlLmZvcm0uY29udGFjdEZvcm0uJHNldFByaXN0aW5lKCk7XG4gICAgICAgICAgICRzY29wZS5mb3JtLmNvbnRhY3RGb3JtLiRzZXRVbnRvdWNoZWQoKTtcbiAgICAgIH0pXG4gICAgICAuZXJyb3IoZnVuY3Rpb24oZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpe1xuICAgICAgICBub3RpZmllci5ub3RpZnkoJ1RoZXJlIHdhcyBhbiBlcnJvciBwcm9jZXNzaW5nIHlvdXIgcmVxdWVzdC4gUGxlYXNlIHRyeSBhZ2FpbicpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmNvbnRhY3ROYW1lID0gbnVsbDtcbiAgICAgIHRoaXMuY29udGFjdENvbXBhbnkgPSBudWxsO1xuICAgICAgdGhpcy5jb250YWN0RW1haWwgPSBudWxsO1xuICAgICAgdGhpcy5jb250YWN0TWVzc2FnZSA9IG51bGw7XG5cbiAgfVxuXG4gICRzY29wZS5nZXRVc2VyID0gZnVuY3Rpb24odXNlcm5hbWUpe1xuXHRcdFR3aXR0ZXJTZXJ2aWNlLmdldFVzZXIodXNlcm5hbWUpXG5cdFx0ICAgIC50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdCAgICAgICAgJHNjb3BlLnR3aXR0ZXJFcnJvcnMgPSB1bmRlZmluZWQ7XG5cdCAgICAgICAgXHQkc2NvcGUudHdlZXRzID0gSlNPTi5wYXJzZShkYXRhLnJlc3VsdC51c2VyRGF0YSk7XG5cdFx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygkc2NvcGUudHdlZXRzKTtcblx0XHQgICAgfSlcblx0XHQgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcblx0XHQgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3RoZXJlIHdhcyBhbiBlcnJvciByZXRyaWV2aW5nIGRhdGE6ICcsIGVycm9yKTtcblx0XHQgICAgICAgICRzY29wZS50d2l0dGVyRXJyb3JzID0gZXJyb3IuZXJyb3I7XG5cdFx0ICAgIH0pXG5cdH07XG5cbiAgLy8kc2NvcGUuZ2V0VXNlcigpO1xuXG5cblxufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmNvbnRyb2xsZXIoJ25hdkN0cmwnLCBbJyRzY29wZScsICckbG9jYXRpb24nLCAnJGFuY2hvclNjcm9sbCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCAkYW5jaG9yU2Nyb2xsKXtcbiAgJHNjb3BlLmxpbmtUbyA9IGZ1bmN0aW9uKGlkKXtcbiAgICAkbG9jYXRpb24udXJsKGlkKTtcbiAgICAkYW5jaG9yU2Nyb2xsKCk7XG4gIH07XG5cbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnKS5jb250cm9sbGVyKCd3b3JrQ3RybCcsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcblxuICAkc2NvcGUudGVuZHJpbFNob3duID0gZmFsc2U7XG4gICRzY29wZS50b2dnbGVUZW5kcmlsID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLnRlbmRyaWxTaG93biA9ICEkc2NvcGUudGVuZHJpbFNob3duO1xuICB9O1xuXG4gICRzY29wZS5jcm93blNob3cgPSBmYWxzZTtcbiAgJHNjb3BlLnRvZ2dsZUNyb3duID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLmNyb3duU2hvdyA9ICEkc2NvcGUuY3Jvd25TaG93O1xuICB9O1xuXG4gICRzY29wZS5icm9hZFNob3cgPSBmYWxzZTtcbiAgJHNjb3BlLnRvZ2dsZUJyb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLmJyb2FkU2hvdyA9ICEkc2NvcGUuYnJvYWRTaG93O1xuICB9O1xuXG4gICRzY29wZS5hZGlob3cgPSBmYWxzZTtcbiAgJHNjb3BlLnRvZ2dsZUFkaSA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5hZGlTaG93ID0gISRzY29wZS5hZGlTaG93O1xuICB9O1xuXG59XSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
