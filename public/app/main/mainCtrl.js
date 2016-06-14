angular.module('willsBlog').controller('mainCtrl', function($scope){
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

  ]
});
