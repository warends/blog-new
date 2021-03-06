angular.module('willsBlog').controller('CarouselController', ['$scope', function($scope){
  $scope.slides = [
    { name: 'Mobile',
    svg: 'mobile-svg',
    desc: 'Is your website up to date with the most current mobile design trends? If not, you are loosing valuable business. Ensure that your customers can reach your business from anywhere and receive the best user experience. By building with responsive design in mind, your customers will get a pixel perfect look from mobile to tablet or desktop.' },

    { name: 'ECommerce',
    svg: 'ecomm-svg',
    desc: 'Do you have a new product you are looking to bring to market and need an e-commerce site or just looking for more modern feel to an existing site?  By utilizing robust ecommerce platforms, I can design and develop a site that will scale with your business and needs all in time to meet your busy deadlines. ' },

    { name: 'SEO',
    svg: 'seo-svg',
    desc: 'Having a modern design and user friendly website is great, but if customers can`t find your business, it wont matter much.  I design and develop every aspect of the website with search engine optimization in mind and so your customers can find you among the competition.  Also through research and analytics I can develop, plan and deploy the best SEO and marketing practices to increase conversions and retention.' }
  ];

  $scope.currentIndex = 0;
  $scope.setCurrentSlideIndex = function(index){
    $scope.currentIndex = index;
  }
  $scope.isCurrentSlideIndex = function(index){
    return $scope.currentIndex === index;
  }
}]);
