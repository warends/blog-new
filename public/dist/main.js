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
    .when('/admin/new-post', {
      templateUrl: '/partials/blog/new-post',
      controller: 'newPostCtrl',
      resolve: routeRoleChecks.admin
    })
    .when('/profile', {
      templateUrl: '/partials/admin/profile',
      controller: 'profileCtrl',
      resolve: routeRoleChecks.user
    })
    .when('/posts/:slug', {
      templateUrl: '/partials/blog/post-detail',
      controller: 'postDetailCtrl'
    })
    .when('/admin/edit-post/:slug', {
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

  const nav = angular.element('.navbar-brand');
  nav.show();

  $scope.identity = identity;

  $scope.sortOptions= [
    {value: 'title', text: 'Sort by Title'},
    {value: 'published', text: 'Published Date'}];

  $scope.sortOrder = $scope.sortOptions[0].value;
}]);

 angular.module('willsBlog').controller('editPostCtrl', ['$scope', 'notifier', 'mvPost', '$q', '$location', '$routeParams', function($scope, notifier, mvPost, $q, $location, $routeParams){

  $scope.post = mvPost.get({ id: $routeParams.id });

  $scope.updatePost = function(){
    var postData = {
      title : $scope.post.title,
      categories : $scope.post.categories,
      headerImage : $scope.post.headerImage,
      excerpt : $scope.post.excerpt,
      body : $scope.post.body,
      author: $scope.post.author
    }

    console.log(postData);

    mvPost.updateCurrentPost(postData)
    .then(function(){
      notifier.notify('Your post has been updated');
    }, function(error){
      notifier.error(error);
    });

  };

  $scope.cancel = function(){
    $location.path('/blog');
  };

  $scope.deletePost = function(){
    mvPost.deleteCurrentPost($scope.post);
  };

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

  var PostResource = $resource('/api/posts/:id', {_id: '@id'}, {
    update: {
      method:'PUT',
      isArray: false
    },
    remove: {
      method: 'DELETE'
    }
  });

  PostResource.createPost = function(newPostData) {
    var newPost = new PostResource(newPostData);
    var deferred = $q.defer();

    newPost.$save().then(function(){
      deferred.resolve();
    }, function(response){
      deferred.reject(response.data.reason);
    });
    return deferred.promise;
  }

  PostResource.updateCurrentPost = function(postData){
    var dfd = $q.defer();
    postData.$update().then(function(){
      dfd.resolve();
    }, function(response){
      dfd.reject(response.data.reason);
    });
    return dfd.promise;
  }

  PostResource.deleteCurrentPost = function(postData){
    postData.$remove(function(){
      notify.notify('Post has been deleted.');
      $location.path('/blog');
    });
  }

  return PostResource;
}]);

angular.module('willsBlog').factory('mvSavePost', ['$q', 'mvPost', function($q, mvPost){

  return {

    updateCurrentPost : function(newPostData){
      var dfd = $q.defer();
      var editedPost = newPostData;
      editedPost.$save().then(function(){
        dfd.resolve();
      }, function(response){
        dfd.reject(response.data.reason);
      });
      return dfd.promise;
    }

  }// return
}]);

angular.module('willsBlog').controller('newPostCtrl', ['$scope', 'notifier', 'mvPost', '$q', '$location', function($scope, notifier, mvPost, $q, $location){

    $scope.createNewPost = function(){

      var newPostData = {
        title : $scope.title,
        slug: $scope.slug,
        categories: $scope.categories,
        headerImage : $scope.headerImage,
        excerpt : $scope.excerpt,
        body : $scope.body,
        author: $scope.author,
        postedDate : new Date()
      };

      //  var newPost = new mvPost(newPostData);
      //  var deferred = $q.defer();

       mvPost.createPost(newPostData)
        .then(function(){
          notifier.notify('New Post Created');
          $location.path('/blog');
        }, function(reason){
          notifier.error(reason);
        });

    };

  $scope.cancel = function(){
    $location.path('/blog');
  };

}]);

angular.module('willsBlog').controller('postDetailCtrl', ['$scope', 'mvCachedPost', '$routeParams', function($scope, mvCachedPost, $routeParams){

  window.scrollTo(0,0);

  const nav = angular.element('.navbar-brand');
  nav.show();

  mvCachedPost.query().$promise.then(function(collection){
    collection.forEach(function(post){
      if(post.slug === $routeParams.slug){
        $scope.post = post;
      }
    });
  });
  // $scope.post = mvPost.get({ _id: $routeParams.id });
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
