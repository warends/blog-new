angular.module('willsBlog').controller('WorkController', ['$scope', function($scope){

  $scope.options = {
    origin: 'left',
    distance: '150px',
    easing: 'ease-in-out',
    delay: 30,
    scale: 1,
    duration: 1000,
    // reset: true,
    afterReveal: function (domEl) {
      document.getElementById("gallery").style.visibility = "visible";
    },
    sequence: {
       selector: '.gallery-inner',
       interval: 300
     }
  };

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
      name: 'Hayley Bagwell Interior Design',
      link: 'http://www.hbedesign.com/',
      clickFunc: toggleHB = function() {
        this.modal = !this.modal;
      },
      backgroundImg: 'img/gallery/hbe-design.png',
      modal: false,
      modalImg: 'img/gallery/hbe-design-responsive.png',
      noLink: false
    },
    {
      name: 'Colorado Broadband Portal',
      link: 'http://broadband.co.gov',
      clickFunc: toggleBroad = function() {
        this.modal = !this.modal;
      },
      backgroundImg: 'img/gallery/wires.png',
      modal: false,
      modalImg: 'img/gallery/broadband.png',
      noLink: false
    },
    {
      name: 'adidas adiPlayer',
      link: '',
      clickFunc: toggleAdi = function() {
        this.modal = !this.modal;
      },
      backgroundImg: 'img/gallery/adiplayer.png',
      modal: false,
      modalImg: 'img/gallery/adiplayer_mockup.png',
      noLink: true
    }
  ]

}]);
