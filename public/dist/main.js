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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFkbWluL3Byb2ZpbGVDdHJsLmpzIiwiYWRtaW4vdXNlckxpc3RDdHJsLmpzIiwiYmxvZy9ibG9nTGlzdEN0cmwuanMiLCJibG9nL2VkaXRQb3N0Q3RybC5qcyIsImJsb2cvbXZDYWNoZWRQb3N0LmpzIiwiYmxvZy9tdlBvc3QuanMiLCJibG9nL25ld1Bvc3RDdHJsLmpzIiwiYmxvZy9wb3N0RGV0YWlsQ3RybC5qcyIsImNvbW1vbi9tb2RhbERpci5qcyIsImNvbW1vbi9ub3RpZmllci5qcyIsImNvbW1vbi90d2l0dGVyLmpzIiwibG9naW4vaWRlbnRpdHkuanMiLCJsb2dpbi9sb2dpbkN0cmwuanMiLCJsb2dpbi9tdkF1dGguanMiLCJsb2dpbi9tdlVzZXIuanMiLCJsb2dpbi9zaWdudXBDdHJsLmpzIiwibWFpbi9jYXJvdXNlbEN0cmwuanMiLCJtYWluL21haW5DdHJsLmpzIiwibWFpbi9uYXZDdHJsLmpzIiwibWFpbi93b3JrQ3RybC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnLCBbJ25nUmVzb3VyY2UnLCduZ0FuaW1hdGUnLCduZ1JvdXRlJywnbmdTYW5pdGl6ZScsJ3VpLmJvb3RzdHJhcCddKTtcblxuYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJywgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKXtcblxuICB2YXIgcm91dGVSb2xlQ2hlY2tzID0ge1xuICAgIGFkbWluOiB7YXV0aDogZnVuY3Rpb24obXZBdXRoKXtcbiAgICAgICAgcmV0dXJuIG12QXV0aC5hdXRob3JpemVDdXJyZW50VXNlckZvclJvdXRlKCdhZG1pbicpO1xuICAgIH19LFxuICAgIHVzZXI6IHthdXRoOiBmdW5jdGlvbihtdkF1dGgpe1xuICAgICAgICByZXR1cm4gbXZBdXRoLmF1dGhvcml6ZUF1dGhldGljYXRlZFVzZXJGb3JSb3V0ZSgpO1xuICAgIH19XG4gIH1cblxuICAgICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh0cnVlKTtcblxuICAgICRyb3V0ZVByb3ZpZGVyXG4gICAgLndoZW4oJy8nLCB7XG4gICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9tYWluL21haW4nLFxuICAgICAgY29udHJvbGxlcjogJ21haW5DdHJsJ1xuICAgIH0pXG4gICAgLndoZW4oJy9hY2NvdW50Jywge1xuICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvbG9naW4vbG9naW4nLFxuICAgICAgY29udHJvbGxlcjogJ2xvZ2luQ3RybCdcbiAgICB9KVxuICAgIC53aGVuKCcvc2lnbnVwJywge1xuICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvbG9naW4vc2lnbnVwJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdzaWdudXBDdHJsJ1xuICAgIH0pXG4gICAgLndoZW4oJy9ibG9nJywge1xuICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvYmxvZy9ibG9nLWxpc3QnLFxuICAgICAgY29udHJvbGxlcjogJ2Jsb2dMaXN0Q3RybCdcbiAgICB9KVxuICAgIC53aGVuKCcvcHJvZmlsZScsIHtcbiAgICAgIHRlbXBsYXRlVXJsOiAnL3BhcnRpYWxzL2FkbWluL3Byb2ZpbGUnLFxuICAgICAgY29udHJvbGxlcjogJ3Byb2ZpbGVDdHJsJyxcbiAgICAgIHJlc29sdmU6IHJvdXRlUm9sZUNoZWNrcy51c2VyXG4gICAgfSlcbiAgICAud2hlbignL3Bvc3RzLzppZCcsIHsgLy92aWV3IHNpbmdsZSBwb3N0XG4gICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9ibG9nL3Bvc3QtZGV0YWlsJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdwb3N0RGV0YWlsQ3RybCdcbiAgICB9KVxuICAgIC53aGVuKCcvYWRtaW4vbmV3LXBvc3QnLCB7ICAvL2FkZGluZyBhIG5ldyBwb3N0XG4gICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9ibG9nL25ldy1wb3N0JyxcbiAgICAgIGNvbnRyb2xsZXI6ICduZXdQb3N0Q3RybCcsXG4gICAgICByZXNvbHZlOiByb3V0ZVJvbGVDaGVja3MuYWRtaW5cbiAgICB9KVxuICAgIC53aGVuKCcvYWRtaW4vOmlkL2VkaXQnLCB7ICAvL2VkaXQgcG9zdFxuICAgICAgdGVtcGxhdGVVcmw6ICcvcGFydGlhbHMvYmxvZy9lZGl0LXBvc3QnLFxuICAgICAgY29udHJvbGxlcjogJ2VkaXRQb3N0Q3RybCcsXG4gICAgICByZXNvbHZlOiByb3V0ZVJvbGVDaGVja3MuYWRtaW5cbiAgICB9KVxuICAgIC53aGVuKCcvYWRtaW4vdXNlcnMnLCB7XG4gICAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9hZG1pbi91c2Vycy1saXN0JyxcbiAgICAgIGNvbnRyb2xsZXI6ICd1c2VyTGlzdEN0cmwnLFxuICAgICAgcmVzb2x2ZTogcm91dGVSb2xlQ2hlY2tzLmFkbWluXG4gICAgfSk7XG5cbn1dKTsvL2VuZCBjb25maWdcblxuXG5hbmd1bGFyLm1vZHVsZSgnd2lsbHNCbG9nJykucnVuKFsnJHJvb3RTY29wZScsICckbG9jYXRpb24nLCAnJHJvdXRlUGFyYW1zJywgJyRhbmNob3JTY3JvbGwnLCBmdW5jdGlvbigkcm9vdFNjb3BlLCAkbG9jYXRpb24sICRyb3V0ZVBhcmFtcywgJGFuY2hvclNjcm9sbCl7XG5cbiAgJHJvb3RTY29wZS4kb24oJyRyb3V0ZUNoYW5nZUVycm9yJywgZnVuY3Rpb24oZXZ0LCBjdXJyZW50LCBwcmV2aW91cywgcmVqZWN0aW9uKSB7XG4gICAgICBpZihyZWplY3Rpb24gPT09ICdub3QgYXV0aG9yaXplZCcpIHtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgICAgIH1cbiAgfSk7XG5cbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnKS5jb250cm9sbGVyKCdwcm9maWxlQ3RybCcsIFsnJHNjb3BlJywgJ212QXV0aCcsICdpZGVudGl0eScsICdub3RpZmllcicsIGZ1bmN0aW9uKCRzY29wZSwgbXZBdXRoLCBpZGVudGl0eSwgbm90aWZpZXIpe1xuICAkc2NvcGUudXNlcm5hbWUgPSBpZGVudGl0eS5jdXJyZW50VXNlci51c2VybmFtZTtcbiAgJHNjb3BlLmZOYW1lID0gaWRlbnRpdHkuY3VycmVudFVzZXIuZmlyc3ROYW1lO1xuICAkc2NvcGUubE5hbWUgPSBpZGVudGl0eS5jdXJyZW50VXNlci5sYXN0TmFtZTtcblxuICAkc2NvcGUudXBkYXRlID0gZnVuY3Rpb24oKXtcbiAgICAgIHZhciBuZXdVc2VyRGF0YSA9IHtcbiAgICAgICAgdXNlcm5hbWU6ICRzY29wZS51c2VybmFtZSxcbiAgICAgICAgZmlyc3ROYW1lOiAkc2NvcGUuZk5hbWUsXG4gICAgICAgIGxhc3ROYW1lOiAkc2NvcGUubE5hbWVcbiAgICAgIH1cblxuICAgICAgaWYoJHNjb3BlLnBhc3N3b3JkICYmICRzY29wZS5wYXNzd29yZC5sZW5ndGggPiAwKSB7XG4gICAgICAgbmV3VXNlckRhdGEucGFzc3dvcmQgPSAkc2NvcGUucGFzc3dvcmQ7XG4gICAgICB9XG5cbiAgICAgIG12QXV0aC51cGRhdGVDdXJyZW50VXNlcihuZXdVc2VyRGF0YSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICBub3RpZmllci5ub3RpZnkoJ1lvdXIgaW5mb3JtYXRpb24gaGFzIGJlZW4gdXBkYXRlZCcpO1xuICAgICAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAgIG5vdGlmaWVyLmVycm9yKHJlYXNvbik7XG4gICAgICAgIH0pO1xuICB9XG5cbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnKS5jb250cm9sbGVyKCd1c2VyTGlzdEN0cmwnLCBbJyRzY29wZScsICdtdlVzZXInLCBmdW5jdGlvbigkc2NvcGUsIG12VXNlcil7XG4gICRzY29wZS51c2VycyA9IG12VXNlci5xdWVyeSgpO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmNvbnRyb2xsZXIoJ2Jsb2dMaXN0Q3RybCcsIFsnJHNjb3BlJywgJ212Q2FjaGVkUG9zdCcsICdpZGVudGl0eScsICckbG9jYXRpb24nLCBmdW5jdGlvbigkc2NvcGUsIG12Q2FjaGVkUG9zdCwgaWRlbnRpdHksICRsb2NhdGlvbil7XG4gIFxuICAkc2NvcGUucG9zdHMgPSBtdkNhY2hlZFBvc3QucXVlcnkoKTtcblxuICAkc2NvcGUuaWRlbnRpdHkgPSBpZGVudGl0eTtcblxuICAkc2NvcGUuc29ydE9wdGlvbnM9IFtcbiAgICB7dmFsdWU6ICd0aXRsZScsIHRleHQ6ICdTb3J0IGJ5IFRpdGxlJ30sXG4gICAge3ZhbHVlOiAncHVibGlzaGVkJywgdGV4dDogJ1B1Ymxpc2hlZCBEYXRlJ31dO1xuXG4gICRzY29wZS5zb3J0T3JkZXIgPSAkc2NvcGUuc29ydE9wdGlvbnNbMF0udmFsdWU7XG59XSk7XG4iLCIgYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmNvbnRyb2xsZXIoJ2VkaXRQb3N0Q3RybCcsIFsnJHNjb3BlJywgJ25vdGlmaWVyJywgJ212UG9zdCcsICckcScsICckbG9jYXRpb24nLCAnJHJvdXRlUGFyYW1zJywgZnVuY3Rpb24oJHNjb3BlLCBub3RpZmllciwgbXZQb3N0LCAkcSwgJGxvY2F0aW9uLCAkcm91dGVQYXJhbXMpe1xuXG4gICAgJHNjb3BlLnBvc3QgPSBtdlBvc3QuZ2V0KHsgaWQ6ICRyb3V0ZVBhcmFtcy5pZCB9KTtcblxuICAgICRzY29wZS5wb3N0LmRhdGEgPSB7XG4gICAgICAgIF9pZDogJHNjb3BlLnBvc3QuX2lkLFxuICAgICAgICB0aXRsZSA6ICRzY29wZS5wb3N0LnRpdGxlLFxuICAgICAgICBzbHVnOiAkc2NvcGUucG9zdC5zbHVnLFxuICAgICAgICBjYXRlZ29yaWVzIDogJHNjb3BlLnBvc3QuY2F0ZWdvcmllcyxcbiAgICAgICAgaGVhZGVySW1hZ2UgOiAkc2NvcGUucG9zdC5oZWFkZXJJbWFnZSxcbiAgICAgICAgZXhjZXJwdCA6ICRzY29wZS5wb3N0LmV4Y2VycHQsXG4gICAgICAgIGJvZHkgOiAkc2NvcGUucG9zdC5ib2R5LFxuICAgICAgICBhdXRob3I6ICRzY29wZS5wb3N0LmF1dGhvclxuICAgIH1cblxuICAgICRzY29wZS51cGRhdGVQb3N0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJHNjb3BlLnBvc3QuJHVwZGF0ZSggeyBpZDogJHNjb3BlLnBvc3QuX2lkIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgbm90aWZpZXIubm90aWZ5KCdZb3VyIHBvc3QgaGFzIGJlZW4gdXBkYXRlZCcpO1xuICAgICAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICAgIG5vdGlmaWVyLmVycm9yKHJlYXNvbi5kYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgJHNjb3BlLmRlbGV0ZVBvc3QgPSBmdW5jdGlvbigpe1xuICAgICAgJHNjb3BlLnBvc3QuJGRlbGV0ZSh7IGlkOiAkc2NvcGUucG9zdC5faWQgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIG5vdGlmaWVyLm5vdGlmeSgnRGVsZXRlZCBmcm9tIHNlcnZlcicpO1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2Jsb2cnKTtcbiAgICAgIH0pO1xuICAgIH1cblxufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmZhY3RvcnkoJ212Q2FjaGVkUG9zdCcsIFsnbXZQb3N0JywgZnVuY3Rpb24obXZQb3N0KXtcbiAgdmFyIHBvc3RMaXN0O1xuXG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGZ1bmN0aW9uKCl7XG4gICAgICBpZighcG9zdExpc3Qpe1xuICAgICAgICBwb3N0TGlzdCA9IG12UG9zdC5xdWVyeSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcG9zdExpc3Q7XG4gICAgfVxuICB9XG5cbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnKS5mYWN0b3J5KCdtdlBvc3QnLCBbJyRyZXNvdXJjZScsICckcScsIGZ1bmN0aW9uKCRyZXNvdXJjZSwgJHEpe1xuXG4gIHJldHVybiAkcmVzb3VyY2UoJy9hcGkvcG9zdHMvOmlkJywge19pZDogJ0BpZCd9LCB7XG4gICAgdXBkYXRlIDoge1xuICAgICAgbWV0aG9kOiAnUFVUJ1xuICAgIH1cbiAgfSwge1xuICAgIHN0cmlwVHJhaWxpbmdTbGFzaGVzOiBmYWxzZVxuICB9KTtcblxufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmNvbnRyb2xsZXIoJ25ld1Bvc3RDdHJsJywgWyckc2NvcGUnLCAnbm90aWZpZXInLCAnbXZQb3N0JywgJyRxJywgJyRsb2NhdGlvbicsIGZ1bmN0aW9uKCRzY29wZSwgbm90aWZpZXIsIG12UG9zdCwgJHEsICRsb2NhdGlvbil7XG5cbiAgJHNjb3BlLnBvc3QgPSBuZXcgbXZQb3N0KCk7XG5cbiAgJHNjb3BlLmNyZWF0ZU5ld1Bvc3QgPSBmdW5jdGlvbigpe1xuICAgICRzY29wZS5wb3N0LiRzYXZlKGZ1bmN0aW9uKCl7XG4gICAgICAgIG5vdGlmaWVyLm5vdGlmeSgnTmV3IFBvc3QgQ3JlYXRlZCcpO1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2Jsb2cnKTtcbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbigpe1xuICAgICRsb2NhdGlvbi5wYXRoKCcvYmxvZycpO1xuICB9O1xuXG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2lsbHNCbG9nJykuY29udHJvbGxlcigncG9zdERldGFpbEN0cmwnLCBbJyRzY29wZScsICdtdkNhY2hlZFBvc3QnLCAnbXZQb3N0JywgJyRyb3V0ZVBhcmFtcycsIGZ1bmN0aW9uKCRzY29wZSwgbXZDYWNoZWRQb3N0LCBtdlBvc3QsICRyb3V0ZVBhcmFtcyl7XG5cbiAgd2luZG93LnNjcm9sbFRvKDAsMCk7XG5cbiAgLy8gbXZDYWNoZWRQb3N0LnF1ZXJ5KCkuJHByb21pc2UudGhlbihmdW5jdGlvbihjb2xsZWN0aW9uKXtcbiAgLy8gICBjb2xsZWN0aW9uLmZvckVhY2goZnVuY3Rpb24ocG9zdCl7XG4gIC8vICAgICBpZihwb3N0Ll9pZCA9PT0gJHJvdXRlUGFyYW1zLmlkKXtcbiAgLy8gICAgICAgJHNjb3BlLnBvc3QgPSBwb3N0O1xuICAvLyAgICAgfVxuICAvLyAgIH0pO1xuICAvLyB9KTtcbiAgXG4gICAkc2NvcGUucG9zdCA9IG12UG9zdC5nZXQoeyBpZDogJHJvdXRlUGFyYW1zLmlkIH0pO1xufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmRpcmVjdGl2ZSgnZ2xvYmFsTW9kYWwnLCBmdW5jdGlvbigpe1xuICByZXR1cm57XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBzY29wZToge1xuICAgICAgc2hvdzogJz0nXG4gICAgfSxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRyYW5zY2x1ZGU6IHRydWUsXG4gICAgbGluayA6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycyl7XG4gICAgICBzY29wZS5kaWFsb2dTdHlsZSA9IHt9O1xuICAgICAgaWYoYXR0cnMud2lkdGgpXG4gICAgICAgIHNjb3BlLmRpYWxvZ1N0eWxlLndpZHRoID0gYXR0cnMud2lkdGg7XG4gICAgICBpZiAoYXR0cnMuaGVpZ2h0KVxuICAgICAgICBzY29wZS5kaWFsb2dTdHlsZS5oZWlnaHQgPSBhdHRycy5oZWlnaHQ7XG5cbiAgICAgIHNjb3BlLmhpZGVNb2RhbCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHNjb3BlLnNob3cgPSBmYWxzZTtcbiAgICAgIH07XG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy9wYXJ0aWFscy9jb21tb24vbW9kYWwnXG4gIH1cbn0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLnZhbHVlKCdUb2FzdHInLCB0b2FzdHIpO1xuXG5hbmd1bGFyLm1vZHVsZSgnd2lsbHNCbG9nJykuZmFjdG9yeSgnbm90aWZpZXInLCBbJ1RvYXN0cicsIGZ1bmN0aW9uKFRvYXN0cil7XG4gIHJldHVybiB7XG4gICAgbm90aWZ5OiBmdW5jdGlvbihtZXNzYWdlKXtcbiAgICAgIFRvYXN0ci5zdWNjZXNzKG1lc3NhZ2UpO1xuICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgfSxcbiAgICBlcnJvcjogZnVuY3Rpb24obWVzc2FnZSl7XG4gICAgICBUb2FzdHIuZXJyb3IobWVzc2FnZSk7XG4gICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnKS5mYWN0b3J5KCdUd2l0dGVyU2VydmljZScsIFsnJGh0dHAnLCAnJHEnLCBmdW5jdGlvbigkaHR0cCwgJHEpe1xuXG4gIHZhciBnZXRVc2VyID0gZnVuY3Rpb24odXNlcm5hbWUpe1xuICAgIHZhciBkID0gJHEuZGVmZXIoKTtcblxuICAgICRodHRwLnBvc3QoJy90d2l0dGVyL3VzZXInLCB7dXNlcm5hbWUgOiB1c2VybmFtZX0pXG4gICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgcmV0dXJuIGQucmVzb2x2ZShkYXRhKTtcbiAgICAgIH0pXG4gICAgICAuZXJyb3IoZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICByZXR1cm4gZC5yZWplY3QoZXJyb3IpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZC5wcm9taXNlO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgZ2V0VXNlciA6IGdldFVzZXJcbiAgICB9XG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2lsbHNCbG9nJykuZmFjdG9yeSgnaWRlbnRpdHknLCBbJyR3aW5kb3cnLCAnbXZVc2VyJywgZnVuY3Rpb24oJHdpbmRvdywgbXZVc2VyKXtcblxuICB2YXIgY3VycmVudFVzZXI7XG4gIGlmKCEhJHdpbmRvdy5ib290c3RyYXBwZWRVc2VyT2JqZWN0KSB7XG4gICAgY3VycmVudFVzZXIgPSBuZXcgbXZVc2VyKCk7XG4gICAgYW5ndWxhci5leHRlbmQoY3VycmVudFVzZXIsICR3aW5kb3cuYm9vdHN0cmFwcGVkVXNlck9iamVjdCk7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBjdXJyZW50VXNlcjogY3VycmVudFVzZXIsXG4gICAgaXNBdXRoZW50aWNhdGVkOiBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuICEhdGhpcy5jdXJyZW50VXNlcjtcbiAgICB9LFxuXG4gICAgaXNBdXRob3JpemVkOiBmdW5jdGlvbihyb2xlKXtcbiAgICAgIHJldHVybiAhIXRoaXMuY3VycmVudFVzZXIgJiYgdGhpcy5jdXJyZW50VXNlci5yb2xlcy5pbmRleE9mKHJvbGUpID4gLTE7XG4gICAgfVxuXG4gIH1cblxufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmNvbnRyb2xsZXIoJ2xvZ2luQ3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywgJ2lkZW50aXR5JywgJ25vdGlmaWVyJywgJ212QXV0aCcsICckbG9jYXRpb24nLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCBpZGVudGl0eSwgbm90aWZpZXIsIG12QXV0aCwgJGxvY2F0aW9uKXtcblxuICAgICRzY29wZS5pZGVudGl0eSA9IGlkZW50aXR5O1xuXG4gICAgJHNjb3BlLnNpZ25JbiA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCl7XG4gICAgICBtdkF1dGguYXV0aGVudGljYXRlVXNlcih1c2VybmFtZSwgcGFzc3dvcmQpLnRoZW4oZnVuY3Rpb24oc3VjY2Vzcyl7XG4gICAgICAgIGlmKHN1Y2Nlc3Mpe1xuICAgICAgICAgIG5vdGlmaWVyLm5vdGlmeSgnWW91IGhhdmUgc2lnbmVkIGluJyk7XG4gICAgICAgICAgJGxvY2F0aW9uLnVybCgnL2FjY291bnQnKTtcbiAgICAgICAgICAkc2NvcGUuYWN0U2hvd24gPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub3RpZmllci5ub3RpZnkoJ1VzZXJuYW1lL1Bhc3N3b3JkIEluY29ycmVjdCcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnNpZ25PdXQgPSBmdW5jdGlvbigpe1xuICAgICAgbXZBdXRoLmxvZ291dFVzZXIoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUudXNlcm5hbWUgPSAnJztcbiAgICAgICAgJHNjb3BlLnBhc3N3b3JkID0gJyc7XG4gICAgICAgIG5vdGlmaWVyLm5vdGlmeSgnWW91IGhhdmUgbG9nZ2VkIG91dCcpO1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgICRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpe1xuICAgICAgdmFyIG5ld1VzZXJEYXRhID0ge1xuICAgICAgICB1c2VybmFtZTogJHNjb3BlLnVzZXJuYW1lLFxuICAgICAgICBmaXJzdE5hbWU6ICRzY29wZS5mTmFtZSxcbiAgICAgICAgbGFzdE5hbWU6ICRzY29wZS5sTmFtZSxcbiAgICAgICAgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZFxuICAgICAgfTtcbiAgICAgIG12QXV0aC5jcmVhdGVVc2VyKG5ld1VzZXJEYXRhKVxuICAgICAgICAudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgIG5vdGlmaWVyLm5vdGlmeSgnVXNlciBhY2NvdW50IGNyZWF0ZWQnKTtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKXtcbiAgICAgICAgbm90aWZpZXIuZXJyb3IocmVhc29uKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24oKXtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfTtcblxuICAgICRzY29wZS5hY3RTaG93biA9IGZhbHNlO1xuICAgICRzY29wZS50b2dnbGVBY2NvdW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZihpZGVudGl0eS5pc0F1dGhlbnRpY2F0ZWQoKSl7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvYWNjb3VudCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJHNjb3BlLmFjdFNob3duID0gISRzY29wZS5hY3RTaG93bjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgJHNjb3BlLnNpZ251cFNob3duID0gZmFsc2U7XG4gICAgJHNjb3BlLnRvZ2dsZVNpZ251cCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJHNjb3BlLnNpZ251cFNob3duID0gISRzY29wZS5zaWdudXBTaG93bjtcbiAgICB9O1xuXG5cbn1dKTtcbiIsIlxuYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmZhY3RvcnkoJ212QXV0aCcsIFsnJGh0dHAnLCAnaWRlbnRpdHknLCAnJHEnLCAnbXZVc2VyJywgZnVuY3Rpb24oJGh0dHAsIGlkZW50aXR5LCAkcSwgbXZVc2VyKXtcblxuICByZXR1cm4ge1xuICAgIC8vIHRoaXMgdGhpbmcgd29ya2luZ1xuICAgIGF1dGhlbnRpY2F0ZVVzZXI6IGZ1bmN0aW9uKHVzZXJuYW1lLCBwYXNzd29yZCl7XG4gICAgICB2YXIgZGVmZXJyZWQgPSAkcS5kZWZlcigpO1xuXG4gICAgICAkaHR0cC5wb3N0KCcvbG9naW4nLCB7XG4gICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEuc3VjY2Vzcyl7XG5cbiAgICAgICAgICB2YXIgdXNlciA9IG5ldyBtdlVzZXIoKTtcbiAgICAgICAgICBhbmd1bGFyLmV4dGVuZCh1c2VyLCByZXNwb25zZS5kYXRhLnVzZXIpO1xuICAgICAgICAgIGlkZW50aXR5LmN1cnJlbnRVc2VyID0gdXNlcjtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfSxcblxuICAgIGxvZ291dFVzZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcblxuICAgICAgJGh0dHAucG9zdCgnL2xvZ291dCcsIHtsb2dvdXQ6IHRydWV9KS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgIGlkZW50aXR5LmN1cnJlbnRVc2VyID0gdW5kZWZpbmVkO1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG5cbiAgICB9LFxuXG4gICAgYXV0aG9yaXplQ3VycmVudFVzZXJGb3JSb3V0ZTogZnVuY3Rpb24ocm9sZSl7XG4gICAgICBpZiAoaWRlbnRpdHkuaXNBdXRob3JpemVkKCdhZG1pbicpKXtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJHEucmVqZWN0KCdub3QgYXV0aG9yaXplZCcpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBhdXRob3JpemVBdXRoZXRpY2F0ZWRVc2VyRm9yUm91dGU6IGZ1bmN0aW9uKCl7XG4gICAgICBpZiAoaWRlbnRpdHkuaXNBdXRoZW50aWNhdGVkKCkpe1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAkcS5yZWplY3QoJ25vdCBhIGN1cnJlbnQgdXNlcicpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBjcmVhdGVVc2VyIDogZnVuY3Rpb24obmV3VXNlckRhdGEpIHtcbiAgICAgICB2YXIgbmV3VXNlciA9IG5ldyBtdlVzZXIobmV3VXNlckRhdGEpO1xuICAgICAgIHZhciBkZWZlcnJlZCA9ICRxLmRlZmVyKCk7XG5cbiAgICAgICBuZXdVc2VyLiRzYXZlKCkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgaWRlbnRpdHkuY3VycmVudFVzZXIgPSBuZXdVc2VyO1xuICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZXNwb25zZS5kYXRhLnJlYXNvbik7XG4gICAgICAgfSk7XG5cbiAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9LFxuXG4gICAgdXBkYXRlQ3VycmVudFVzZXI6IGZ1bmN0aW9uKG5ld1VzZXJEYXRhKXtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgdmFyIGNsb25lID0gYW5ndWxhci5jb3B5KGlkZW50aXR5LmN1cnJlbnRVc2VyKTtcbiAgICAgICAgYW5ndWxhci5leHRlbmQoY2xvbmUsIG5ld1VzZXJEYXRhKTtcbiAgICAgICAgY2xvbmUuJHVwZGF0ZSgpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICBpZGVudGl0eS5jdXJyZW50VXNlciA9IGNsb25lO1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZXNwb25zZS5kYXRhLnJlYXNvbik7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9XG5cbiAgfS8vIHJldHVyblxuXG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2lsbHNCbG9nJykuZmFjdG9yeSgnbXZVc2VyJywgWyckcmVzb3VyY2UnLCBmdW5jdGlvbigkcmVzb3VyY2Upe1xuXG4gIHZhciBVc2VyUmVzb3VyY2UgPSAkcmVzb3VyY2UoJy9hcGkvdXNlcnMvOmlkJywge19pZCA6ICdAaWQnfSwge1xuICAgIHVwZGF0ZToge21ldGhvZDogJ1BVVCcsIGlzQXJyYXk6IGZhbHNlfVxuICB9KTtcblxuICBVc2VyUmVzb3VyY2UucHJvdG90eXBlLmlzQWRtaW4gPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiB0aGlzLnJvbGVzICYmIHRoaXMucm9sZXMuaW5kZXhPZignYWRtaW4nKSA+IC0xO1xuICB9XG5cbiAgcmV0dXJuIFVzZXJSZXNvdXJjZTtcblxufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmNvbnRyb2xsZXIoJ3NpZ251cEN0cmwnLCBbJyRzY29wZScsICdtdkF1dGgnLCAnbm90aWZpZXInLCAnJGxvY2F0aW9uJywgZnVuY3Rpb24oJHNjb3BlLCBtdkF1dGgsIG5vdGlmaWVyLCAkbG9jYXRpb24pe1xuICAgICRzY29wZS5zaWdudXAgPSBmdW5jdGlvbigpe1xuXG4gICAgICB2YXIgbmV3VXNlckRhdGEgPSB7XG4gICAgICAgIHVzZXJuYW1lOiAkc2NvcGUudXNlcm5hbWUsXG4gICAgICAgIGZpcnN0TmFtZTogJHNjb3BlLmZOYW1lLFxuICAgICAgICBsYXN0TmFtZTogJHNjb3BlLmxOYW1lLFxuICAgICAgICBwYXNzd29yZDogJHNjb3BlLnBhc3N3b3JkXG4gICAgICB9O1xuICAgICAgbXZBdXRoLmNyZWF0ZVVzZXIobmV3VXNlckRhdGEpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgbm90aWZpZXIubm90aWZ5KCdVc2VyIGFjY291bnQgY3JlYXRlZCcpO1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pe1xuICAgICAgICBub3RpZmllci5lcnJvcihyZWFzb24pO1xuICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uKCl7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgIH07XG5cbn1dKTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnKS5jb250cm9sbGVyKCdjYXJvdXNlbEN0cmwnLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gICRzY29wZS5zbGlkZXMgPSBbXG4gICAgeyBuYW1lOiAnTW9iaWxlJyxcbiAgICBzdmc6ICdtb2JpbGUtc3ZnJyxcbiAgICBkZXNjOiAnSXMgeW91ciB3ZWJzaXRlIHVwIHRvIGRhdGUgd2l0aCB0aGUgbW9zdCBjdXJyZW50IG1vYmlsZSBkZXNpZ24gdHJlbmRzPyBJZiBub3QsIHlvdSBhcmUgbG9vc2luZyB2YWx1YWJsZSBidXNpbmVzcy4gRW5zdXJlIHRoYXQgeW91ciBjdXN0b21lcnMgY2FuIHJlYWNoIHlvdXIgYnVzaW5lc3MgZnJvbSBhbnl3aGVyZSBhbmQgcmVjZWl2ZSB0aGUgYmVzdCB1c2VyIGV4cGVyaWVuY2UuIEJ5IGJ1aWxkaW5nIHdpdGggcmVzcG9uc2l2ZSBkZXNpZ24gaW4gbWluZCwgeW91ciBjdXN0b21lcnMgd2lsbCBnZXQgYSBwaXhlbCBwZXJmZWN0IGxvb2sgZnJvbSBtb2JpbGUgdG8gdGFibGV0IG9yIGRlc2t0b3AuJyB9LFxuXG4gICAgeyBuYW1lOiAnRUNvbW1lcmNlJyxcbiAgICBzdmc6ICdlY29tbS1zdmcnLFxuICAgIGRlc2M6ICdEbyB5b3UgaGF2ZSBhIG5ldyBwcm9kdWN0IHlvdSBhcmUgbG9va2luZyB0byBicmluZyB0byBtYXJrZXQgYW5kIG5lZWQgYW4gZS1jb21tZXJjZSBzaXRlIG9yIGp1c3QgbG9va2luZyBmb3IgbW9yZSBtb2Rlcm4gZmVlbCB0byBhbiBleGlzdGluZyBzaXRlPyAgQnkgdXRpbGl6aW5nIHJvYnVzdCBlY29tbWVyY2UgcGxhdGZvcm1zLCB3ZSBjYW4gZGVzaWduIGFuZCBkZXZlbG9wIGEgc2l0ZSB0aGF0IHdpbGwgc2NhbGUgd2l0aCB5b3VyIGJ1c2luZXNzIGFuZCBuZWVkcyBhbGwgaW4gdGltZSB0byBtZWV0IHlvdXIgYnVzeSBkZWFkbGluZXMuICcgfSxcblxuICAgIHsgbmFtZTogJ1NFTycsXG4gICAgc3ZnOiAnc2VvLXN2ZycsXG4gICAgZGVzYzogJ0hhdmluZyBhIG1vZGVybiBkZXNpZ24gYW5kIHVzZXIgZnJpZW5kbHkgd2Vic2l0ZSBpcyBncmVhdCwgYnV0IGlmIGN1c3RvbWVycyBjYW5gdCBmaW5kIHlvdXIgYnVzaW5lc3MsIGl0IHdvbnQgbWF0dGVyIG11Y2guICBXZSBkZXNpZ24gYW5kIGRldmVsb3AgZXZlcnkgYXNwZWN0IG9mIHRoZSB3ZWJzaXRlIHdpdGggc2VhcmNoIGVuZ2luZSBvcHRpbWl6YXRpb24gaW4gbWluZCBhbmQgc28geW91ciBjdXN0b21lcnMgY2FuIGZpbmQgeW91IGFtb25nIHRoZSBjb21wZXRpdGlvbi4gIEFsc28gdGhyb3VnaCByZXNlYXJjaCBhbmQgYW5hbHl0aWNzIHdlIGNhbiBkZXZlbG9wLCBwbGFuIGFuZCBkZXBsb3kgdGhlIGJlc3QgU0VPIGFuZCBtYXJrZXRpbmcgcHJhY3RpY2VzIHRvIGluY3JlYXNlIGNvbnZlcnNpb25zIGFuZCByZXRlbnRpb24uJyB9XG5cbiAgXTtcblxuICAkc2NvcGUuY3VycmVudEluZGV4ID0gMDtcbiAgJHNjb3BlLnNldEN1cnJlbnRTbGlkZUluZGV4ID0gZnVuY3Rpb24oaW5kZXgpe1xuICAgICRzY29wZS5jdXJyZW50SW5kZXggPSBpbmRleDtcbiAgfVxuICAkc2NvcGUuaXNDdXJyZW50U2xpZGVJbmRleCA9IGZ1bmN0aW9uKGluZGV4KXtcbiAgICByZXR1cm4gJHNjb3BlLmN1cnJlbnRJbmRleCA9PT0gaW5kZXg7XG4gIH1cbn1dKVxuXG4uYW5pbWF0aW9uKCcuc2xpZGUtYW5pbWF0aW9uJywgZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHtcbiAgICBhZGRDbGFzczogZnVuY3Rpb24oZWxlbWVudCwgY2xhc3NOYW1lLCBkb25lKXtcbiAgICAgIGlmIChjbGFzc05hbWUgPT0gJ25nLWhpZGUnKXtcbiAgICAgICAgICBUd2Vlbk1heC50byhlbGVtZW50LCAwLjUsIHtsZWZ0OiAtZWxlbWVudC5wYXJlbnQoKS53aWR0aCgpLCBvbkNvbXBsZXRlOiBkb25lIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9uZSgpO1xuICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKGVsZW1lbnQsIGNsYXNzTmFtZSwgZG9uZSl7XG4gICAgICBpZihjbGFzc05hbWUgPT0gJ25nLWhpZGUnKXtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVDbGFzcygnbmctaGlkZScpO1xuICAgICAgICBUd2Vlbk1heC5zZXQoZWxlbWVudCwgeyBsZWZ0OiBlbGVtZW50LnBhcmVudCgpLndpZHRoKCkgfSk7XG4gICAgICAgIFR3ZWVuTWF4LnRvKGVsZW1lbnQsIDAuNSwge2xlZnQ6IDAsIG9uQ29tcGxldGU6IGRvbmUgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb25lKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcbiIsImFuZ3VsYXIubW9kdWxlKCd3aWxsc0Jsb2cnKS5jb250cm9sbGVyKCdtYWluQ3RybCcsIFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdtdkNhY2hlZFBvc3QnLCAnbm90aWZpZXInICwnVHdpdHRlclNlcnZpY2UnLCAnJGh0dHAnLCBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgbXZDYWNoZWRQb3N0LCBub3RpZmllciwgVHdpdHRlclNlcnZpY2UsICRodHRwKXtcblxuXG4gICRzY29wZS5zZXJ2aWNlcyA9IFtcbiAgICB7IG5hbWU6ICdEZXZlbG9wbWVudCcsXG4gICAgc3ZnOiAnZGV2LWxvZ28nLFxuICAgIGRlc2NyaXB0aW9uOiAnQ3VzdG9taXplZCBhbmQgcmV1c2FibGUgY29kZSB1c2luZyB0aGUgbW9zdCB1cCB0byBkYXRlIEhUTUw1LCBDU1MzIGFuZCBKYXZhc2NyaXB0IGZyYW13b3Jrcy4gT3B0aW9ucyByYW5nZSBmcm9tIHN0YXRpYyBzaXRlcywgY29udGVudCBtYW5hZ2VkIHNpdGVzLCBhbmQgZWNvbW1lcmNlIHN0b3Jlcy4nLFxuICAgIG1vcmU6ICdEZXZlbG9wbWVudCBTa2lsbHMgaW5jbHVkZSBIVE1MNSwgQ1NTLCBKYXZhc2NyaXB0LCBBbmd1bGFyLCBCYWNrYm9uZSwgTm9kZSwgRXhwcmVzcywgQm9vc3RyYXAgYW5kIG1vcmUuJyB9LFxuXG4gICAgeyBuYW1lOiAnV2ViIERlc2lnbicsXG4gICAgc3ZnOiAnZGVzaWduLWxvZ28nLFxuICAgIGRlc2NyaXB0aW9uOiAnQ3JlYXRpbmcgYW4gZXhjZWxsZW50IHVzZXIgZXhwZXJpZW5jZSB0aHJvdWdoIGNsZWFuLCBzaW1wbGUgYW5kIHRob3JvdWdobHkgY3JhZnRlZCBkZXNpZ24uIENvbGxhYm9yYXRpb24gd2l0aCBjbGllbnRzIGR1cmluZyBkZXNpZ24gcHJvY2VzcyBlbnN1cmVzIGEgc3VwZXJiIGZpbmlzaGVkIHByb2plY3QuJyxcbiAgICBtb3JlOiAnU2VydmljZXMgaW5jbHVkZSB3aXJlIGZyYW1lcywgcGhvdG9zaG9wIG1vY2t1cHMsIGxvZ28gZGVzaWduLCBhbmQgY29tcGFueSBicmFuZGluZy4nIH0sXG5cbiAgICB7IG5hbWU6ICdTdXBwb3J0JyxcbiAgICBzdmc6ICdzdXAtbG9nbycsXG4gICAgZGVzY3JpcHRpb246ICdTdXBwb3J0IGlzIHJlYWRpbHkgYXZhaWxhYmxlIGZvciBjbGllbnRzIHdoZW4gYW55dGhpbmcgY29tZXMgdXAgYWxvbmcgdGhlIGRldmVsb3BtZW50IHByb2Nlc3MuIEFsc28gYXZhaWxhYmxlIGFyZSBwZXJzb25hbCBpbnN0cnVjdGlvbiBvbiBob3cgdG8gbWFpbnRhaW4gb3IgdXBkYXRlIHlvdXIgb3duIHNpdGUuJyxcbiAgICBtb3JlOiAnSGF2ZSBhIG5ldyBwcm9kdWN0IG9yIGZlYXR1cmUgeW91IHdhbnQgdG8gaW1wbGVtZW50PyBQbGFucyBmb3IgY29udGludWVkIHN1cHBvcnQgYW5kIG1haW50ZW5hbmNlIGFyZSBhdmFpbGFibGUuJyB9XG5cbiAgXTtcblxuICAkc2NvcGUucG9zdHMgPSBtdkNhY2hlZFBvc3QucXVlcnkoKTtcblxuICAkc2NvcGUuZm9ybSA9IHt9O1xuXG4gICRzY29wZS5zZW5kTWFpbCA9IGZ1bmN0aW9uKCl7XG4gICAgdmFyIGRhdGEgPSh7XG4gICAgICBjb250YWN0TmFtZSA6IHRoaXMuY29udGFjdE5hbWUsXG4gICAgICBjb250YWN0Q29tcGFueSA6IHRoaXMuY29udGFjdENvbXBhbnksXG4gICAgICBjb250YWN0RW1haWwgOiB0aGlzLmNvbnRhY3RFbWFpbCxcbiAgICAgIGNvbnRhY3RNZXNzYWdlIDogdGhpcy5jb250YWN0TWVzc2FnZVxuICAgIH0pO1xuXG4gICAgJGh0dHAucG9zdCgnL2NvbnRhY3QtZm9ybScsIGRhdGEpXG4gICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZyl7XG4gICAgICAgIG5vdGlmaWVyLm5vdGlmeSgnVGhhbmsgeW91IGZvciB5b3VyIG1lc3NhZ2UgJyArIGRhdGEuY29udGFjdE5hbWUpO1xuICAgICAgICAgICAkc2NvcGUuZm9ybS5jb250YWN0Rm9ybS4kc2V0UHJpc3RpbmUoKTtcbiAgICAgICAgICAgJHNjb3BlLmZvcm0uY29udGFjdEZvcm0uJHNldFVudG91Y2hlZCgpO1xuICAgICAgfSlcbiAgICAgIC5lcnJvcihmdW5jdGlvbihkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZyl7XG4gICAgICAgIG5vdGlmaWVyLm5vdGlmeSgnVGhlcmUgd2FzIGFuIGVycm9yIHByb2Nlc3NpbmcgeW91ciByZXF1ZXN0LiBQbGVhc2UgdHJ5IGFnYWluJyk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuY29udGFjdE5hbWUgPSBudWxsO1xuICAgICAgdGhpcy5jb250YWN0Q29tcGFueSA9IG51bGw7XG4gICAgICB0aGlzLmNvbnRhY3RFbWFpbCA9IG51bGw7XG4gICAgICB0aGlzLmNvbnRhY3RNZXNzYWdlID0gbnVsbDtcblxuICB9XG5cbiAgJHNjb3BlLmdldFVzZXIgPSBmdW5jdGlvbih1c2VybmFtZSl7XG5cdFx0VHdpdHRlclNlcnZpY2UuZ2V0VXNlcih1c2VybmFtZSlcblx0XHQgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG5cdFx0ICAgICAgICAkc2NvcGUudHdpdHRlckVycm9ycyA9IHVuZGVmaW5lZDtcblx0ICAgICAgICBcdCRzY29wZS50d2VldHMgPSBKU09OLnBhcnNlKGRhdGEucmVzdWx0LnVzZXJEYXRhKTtcblx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCRzY29wZS50d2VldHMpO1xuXHRcdCAgICB9KVxuXHRcdCAgICAuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdCAgICAgICAgY29uc29sZS5lcnJvcigndGhlcmUgd2FzIGFuIGVycm9yIHJldHJpZXZpbmcgZGF0YTogJywgZXJyb3IpO1xuXHRcdCAgICAgICAgJHNjb3BlLnR3aXR0ZXJFcnJvcnMgPSBlcnJvci5lcnJvcjtcblx0XHQgICAgfSlcblx0fTtcblxuICAvLyRzY29wZS5nZXRVc2VyKCk7XG5cblxuXG59XSk7XG4iLCJhbmd1bGFyLm1vZHVsZSgnd2lsbHNCbG9nJykuY29udHJvbGxlcignbmF2Q3RybCcsIFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICckYW5jaG9yU2Nyb2xsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sICRhbmNob3JTY3JvbGwpe1xuICAkc2NvcGUubGlua1RvID0gZnVuY3Rpb24oaWQpe1xuICAgICRsb2NhdGlvbi51cmwoaWQpO1xuICAgICRhbmNob3JTY3JvbGwoKTtcbiAgfTtcblxufV0pO1xuIiwiYW5ndWxhci5tb2R1bGUoJ3dpbGxzQmxvZycpLmNvbnRyb2xsZXIoJ3dvcmtDdHJsJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuXG4gICRzY29wZS50ZW5kcmlsU2hvd24gPSBmYWxzZTtcbiAgJHNjb3BlLnRvZ2dsZVRlbmRyaWwgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUudGVuZHJpbFNob3duID0gISRzY29wZS50ZW5kcmlsU2hvd247XG4gIH07XG5cbiAgJHNjb3BlLmNyb3duU2hvdyA9IGZhbHNlO1xuICAkc2NvcGUudG9nZ2xlQ3Jvd24gPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuY3Jvd25TaG93ID0gISRzY29wZS5jcm93blNob3c7XG4gIH07XG5cbiAgJHNjb3BlLmJyb2FkU2hvdyA9IGZhbHNlO1xuICAkc2NvcGUudG9nZ2xlQnJvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUuYnJvYWRTaG93ID0gISRzY29wZS5icm9hZFNob3c7XG4gIH07XG5cbiAgJHNjb3BlLmFkaWhvdyA9IGZhbHNlO1xuICAkc2NvcGUudG9nZ2xlQWRpID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLmFkaVNob3cgPSAhJHNjb3BlLmFkaVNob3c7XG4gIH07XG5cbn1dKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
