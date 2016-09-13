angular.module('willsBlog').controller('mainCtrl', ['$scope', '$location', 'mvCachedPost', 'notifier' ,'TwitterService', function($scope, $location, mvCachedPost, notifier, TwitterService){

  if($location.path() === '/'){
    const nav = angular.element('.navbar-brand');
    const bannerLogo = angular.element('.square-logo');
    const contact = angular.element('.contact-link');
    $(window).scroll(function(){
      if($(this).scrollTop() > 40){
        nav.addClass('show-logo').removeClass('hide-logo');
        bannerLogo.addClass("hide-logo").removeClass('show-logo');
        contact.addClass("hide-logo").removeClass('show-logo');
      } else {
        nav.removeClass('show-logo').addClass('hide-logo');
        bannerLogo.removeClass("hide-logo").addClass('show-logo');
        contact.removeClass("hide-logo").addClass('show-logo');
      }
    });
  }

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
      })
      .error(function(data, status, headers, config){
        notifier.notify('There was an error processing your request. Please try again');
      });
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

  $scope.tenShow = false;
  $scope.toggleTen = function() {
    $scope.tenShow = !$scope.tenShow;
  };

  $scope.crownShow = false;
  $scope.toggleCrown = function() {
    $scope.crownShow = !$scope.crownShow;
  };

  $scope.broadShow = false;
  $scope.toggleBroad = function() {
    $scope.broadShow = !$scope.broadShow;
  };

  $scope.gbShow = false;
  $scope.toggleGB = function() {
    $scope.gbShow = !$scope.gbShow;
  };

  //$scope.getUser();



}]);
