angular.module('willsBlog').controller('workCtrl', ['$scope', function($scope){

  $scope.projects = [
    {
      name: 'Tendril Inc.',
      link: 'https://www.tendrilinc.com',
      clickFunc: toggleTendril = function(){
        this.modal = !this.modal;
      },
      backgroundImg: 'img/gallery/tendril.png',
      modal: false,
      modalImg: 'img/gallery/tendril-mockup.png',
      noLink: false
    },
    {
      name: 'Crown Offroad',
      link: 'http://crownoffroad.com',
      clickFunc: toggleCrown = function() {
        this.modal = !this.modal;
      },
      backgroundImg: 'img/gallery/crown-offroad.jpg',
      modal: false,
      modalImg: 'img/gallery/crown-offroad-mockup.jpg',
      noLink: false
    },
    {
      name: 'Colorado Broadband Portal',
      link: 'http://broadband.co.gov',
      clickFunc: $scope.toggleBroad = function() {
        this.modal = !this.modal;
      },
      backgroundImg: 'img/gallery/wires.jpg',
      modal: false,
      modalImg: 'img/gallery/broadband.jpg',
      noLink: false
    },
    {
      name: 'adidas adiPlayer',
      link: '',
      clickFunc: toggleAdi = function() {
        this.modal = !this.modal;
      },
      backgroundImg: 'img/gallery/adiplayer.jpg',
      modal: false,
      modalImg: 'img/gallery/adiplayer_mockup.jpg',
      noLink: true
    }
  ]

}]);
