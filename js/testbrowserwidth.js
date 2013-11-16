 (function()
 {
    
      $(window).resize(function()
     {      
         $('body').prepend('<div>' + $(window).width() +" " + $(window).height() + " " + '</div>');
      });
}())