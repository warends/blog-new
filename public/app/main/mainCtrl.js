angular.module('willsBlog').controller('mainCtrl', function($scope, $location, mvCachedPost, $http, notifier, TwitterService){
  $scope.services = [
    { name: 'Web Design',
    svg: 'design-logo',
    description: 'Creating an excellent user experience through clean, simple and thoroughly crafted design. Collaboration with clients during design process ensures a superb finished project.',
    more: 'Services include wire frames, photoshop mockups, logo design, and company branding.' },

    { name: 'Development',
    svg: 'dev-logo',
    description: 'Customized and reusable code using the most up to date HTML5, CSS3 and Javascript. Options range from static sites, content managed sites, and ecommerce stores.',
    more: 'Development Skills include HTML5, CSS, Sass, Javascript, Jquery, Boostrap, WordPress, Magento and more.' },

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
		// console.log("username entered ", username);
		TwitterService.getUser(username)
		    .then(function(data){
		        $scope.twitterErrors = undefined;
	        	$scope.tweets = JSON.parse(data.result.userData);
						console.log($scope.tweets);
		    })
		    .catch(function(error){
		        console.error('there was an error retrieving data: ', error);
		        $scope.twitterErrors = error.error;
		    })
	}

  $scope.getUser();


});
