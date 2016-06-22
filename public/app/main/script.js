
$(document).ready(function(){

	/*Sticky Header*/

	$(window).scroll(function(){
		if($(this).scrollTop() > 100){
			$('.navbar, .navbar-brand').addClass("sticky");
		} else {
			$('.navbar, .navbar-brand').removeClass("sticky");
		}

	});//end sticky header


	/*Toggle Services*/

	$('.more').click(function(){
		var $this = $(this);
		event.preventDefault();
		var slide = $this.attr('href');
		$(slide).slideToggle('slow');
	});

	/* Ajax Form */

	$('form').on('submit', function(e){
		e.preventDefault();
		var form = $(this);
		$.ajax({
			type: 'POST',
			url: form.attr('action'),
			data: form.serialize(),
			success: function(result){
				form.remove();
				$('.contact-form').html(result).fadeIn();

			}
		});
	});//end sumit
	
	

});//end ready