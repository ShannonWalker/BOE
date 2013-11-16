(function($) {

	$.fn.myspasticNav = function(options) {
		options = $.extend({
			overlap : 20,
			speed : 300,
			reset : 1000,
			color : ''
		}, options);
	
		return this.each(function() {

		 	var nav = $(this),
		 		currentPageItem = $('.active', nav),
		 		blob,
		 		reset;
		 	
		 	var bleft, bwidth, shouldHide = false;
		 	
		 	if (currentPageItem.length > 0 && currentPageItem.position()) {
				bwidth = currentPageItem.outerWidth();
				bleft = currentPageItem.position().left;
		 	} else {
				shouldHide = true;
		 	}
		 	
		 	$('<li class="blob"></li>').css({
		 		width : bwidth,
		 		left : bleft,
		 		backgroundColor : options.color
		 	}).appendTo(this);
		 	
		 	blob = $('.blob', nav);
		 	
		 	if (shouldHide) blob.css('opacity', '0');

			$(nav).mouseleave(function() {
				if (shouldHide) blob.css('opacity', 0);
			});
		

			$('li:not(.blob)', nav).hover(function() {
				// mouse over
				clearTimeout(reset);
				blob.animate(
					{
						left : $(this).position().left,
						width : $(this).width(),
						opacity: 1
					},
					{
						duration : options.speed,
						easing : options.easing,
						queue : false
					}
				);
			}, function() {
				// mouse out
				reset = setTimeout(function() {
					blob.animate({
						width : bwidth,
						left : bleft
					}, options.speed)
				}, options.reset);
	
			});
			
			$('li a').on('click', function(e)
			{
				
				currentPageItem.removeClass("active")
				currentPageItem = $(this).parent();
				currentPageItem.addClass("active");
				bwidth = currentPageItem.outerWidth();
				bleft = currentPageItem.position().left;
			});
			
		  
  })  
	
};

})(jQuery);
/**
 * @author Shannon Walker
 */
