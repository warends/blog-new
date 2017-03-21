angular.module('willsBlog').controller('MainController', ['$scope', '$location', 'CachedPostService', 'NotifierService' ,'$window', '$http', 'Meta',  function($scope, $location, CachedPostService, notifier, $window, $http, Meta){

  $(window).scroll(function() {
      var $bgobj = $('#home');
      var windowSize = $window.innerWidth;
      var xPos = (windowSize > 768) ? xPos = '50' : xPos = '20';
      var yPos = -( $(window).scrollTop() / $bgobj.data('speed'));
      var coords = xPos + '% '+ yPos + 'px';
      $bgobj.css({ backgroundPosition: coords });
  });

  $scope.aboutOptions = {
    origin: 'top',
    distance: '150px',
    easing: 'ease-in-out',
    delay: 30,
    scale: 1,
    duration: 1000,
    // reset: true,
    sequence: {
       selector: '.services-web',
       interval: 300
     }
  };

  Meta.setTitle('Home');
  Meta.setDesc('I enjoy all things web development and am always actively learning the newest techniques and langauges. If you have a web design or development project, give me a shout, I would love to talk about it.');

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

  $scope.posts = CachedPostService.query();

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
