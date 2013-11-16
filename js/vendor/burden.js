/*
 * @author Shannon Walker
 */
jQuery(document).ready(function($) 
{
	   
	$.boeSettings=boeInit();   
	boeConfig();
	
	$("#videocontainer").hide();
	
    $(".badge_title_container").on("click",function(event)
    {   
    	if ($.boeSettings.fullFeatures) return false;
        handleButtonRequest( $(this) );event.stopPropagation(); 	 
      });
    
   $(".badge_icon_container").on("click",function(event)
    {  
       	event.stopPropagation();
      	event.preventDefault();
      	if ($.boeSettings.fullFeatures)
      	{   
      		handleMenuIconRequest($(this));
      	}
        else    	
               {
               	   handleButtonRequest( $(this) );
               } 	 
     });
     
	$("section.pages").on("click",".accordionButton",function(event)
	{   event.stopPropagation(); 
	  	handleButtonRequest( $(this) ); 	
	});
	
	$("section.topbanner").on("click","a", function(event)
	{  
		var url = $(this).attr("href");
     	event.preventDefault();
     	 if(url && url.indexOf("#") != -1 && url.indexOf("#") == 0)
     	 {
			var pieces = url.split("#",2);
		    var $target = $('#'+pieces[1]); 
		    handleMenuRequest($target);	
	     }
	});
	
    $('.accordionContent').hide(); 
    
 	$(this).on("scroll",titlesForScroll); 

$(window).load(function()
	  {   $("#splash").hide();
	  	  $("#wrapper").animate({"opacity":1},1000);
	  	  if ($.boeSettings.fullFeatures)
	  	      	 scrollToMark($.boeSettings.bannerHome); 
	  	  else
	  	         scrollToMark($.boeSettings.accordionButtons,  $.boeSettings.resetButtonsAdjustment);
	 $.boeSettings.videoResize = function(force)
	 {                                                                           
	 	             	 if (force || $.boeSettings.videoOpen)	
	 	                {    /* only size the video if it is playing or setting up to be played, videoOpen flag */
	 	               		var myPlayer = $.boeSettings.myPlayer;
                     		var vidContainerTop = ($.boeSettings.iPad || $.boeSettings.fullFeatures) ? $.boeSettings.topBannerHeight : 0; 
                     		var vertPadding = 20;
                     		var height= $(window).height() - vidContainerTop;
                     		var width =$(window).width(); 
                     		var dims = videoDimensions(height-vertPadding,width-20); /* width less scroll bar */
                            var padLeft = (width-$.boeSettings.videoDesktopIconWidth-dims.width)/2;
                             if ($.boeSettings.fullFeatures)
                                 padLeft = (padLeft < $.boeSettings.videoDesktopIconWidth) ?$.boeSettings.videoDesktopIconWidth: padLeft;
                    	   $("#videocontainer").height(height).width(width).css("padding-left",padLeft +"px");  
                    	   myPlayer.height(dims.height).width( dims.width);
                    }  	 
      };
      
      videojs("my_video_player").ready(function()
	  {      
	  	     $.boeSettings.myPlayer = this;
	  	     this.volume(0.4);
	  	     $(window).afterResize($.boeSettings.videoResize,true,150); 
	  });
 
     $(window).afterResize(boeConfig,false,150);
 
     });   /* load */
 });  
 
function handleButtonRequest($target)
{	
	var $button = $target.closest(".accordionButton"),
	      newPrefix = $button.attr("id").substr(0,3),
	      currentPrefix = $.boeSettings.currentPrefix,
	      newSection = (newPrefix != currentPrefix);
	      
	$.boeSettings.currentContent = $button.next();  console.log($.boeSettings.currentContent);
	$.boeSettings.nextPrefix = newPrefix;
	
	if ( $target.hasClass("badge_title_container") || $target.hasClass(".accordionButton")  )
	{
		handleButtonLabelForContent($button);
	}

	if ($target.hasClass("badge_icon_container") )
	{   
		handleButtonIconForContent($button, newSection);
	}
    $.boeSettings.currentPrefix = $.boeSettings.nextPrefix;
 } 
 
 function hideContentUnderVideo()
 (
 	var cText = "#" + $.boeSettings.nextPrefix + "-text",
 	var cWrap = "#" + $.boeSettings.nextPrefix + "-wrapper";
 	
 	$(cWrap).addClass("makeinvisible");
 	
 )
 
 function showContentUnderVideo()
  {
  	var cText = "#" + $.boeSettings.nextPrefix + "-text",
 	var cWrap = "#" + $.boeSettings.nextPrefix + "-wrapper";
  	
  	$(cWrap).removeClass("makeinvisible");
  }
 
 function buttonClearVideo($button)
 {
         makeIconVideo($button);
         showContentUnderVideo();
         return (promVideoClose()  );	
 }
 
 function handleButtonIconForContent($button)
{
	var  $oldButton = $(".accordionButton.current"),
	       prefix = $button.attr("id").substr(0,3), 
	       p1,p2,p3,p4;
	       
	if (prefix == $.boeSettings.currentPrefix )
	{
	     if ($.boeSettings.videoOpen)
	     {
	     	   p1=buttonClearVideo($oldButton);
	     	   return (p1.then( function(){ console.log("content opacity would be called here") })    );
	    
	     }
	     else {
	     	        makeIconText($oldButton);
	     	        p1= promVideoOpen();
	     	        return (p1.then(function(){ console.log("invoking opacity would be called here") })   );
	             }
	}
	
	if ($.boeSettings.videoOpen)   /* this closes the current video and content section */
	{    console.log("NEW SECTION VIDEO OPEN");
	     p1= buttonClearVideo($oldButton);
	     p2=p1.then(function(){ return showContentButtonsAndScroll($button,true) } );
	     return p2.then(function(){ console.log("new but clear old opacity first");
	                                                 hideContentUnderVideo();
	                                                 return promVideoOpen() });
	      
	}
	       
 	p1= showContentButtonsAndScroll($button);
 	return (  p1.then(function(){ console.log("new video opacity here"); makeIconText($button);
 	                                               hideContentUnderVideo();
 	                                 return promVideoOpen()} )         ) ;
}  
 
function handleButtonLabelForContent($button)
{    var  $oldButton = $(".accordionButton.current"),
	          p1,p2,p3;
	     
     if ($.boeSettings.videoOpen)  
     {        p1 = buttonClearVideo($oldButton);
     	   	  return (  p1.then(function(){ return showContentButtonsAndScroll($button);})   );
	 }
     return ( showContentButtonsAndScroll($button) );
} 

function showContentButtonsAndScroll($target,flagRapid)   /* $target is section with class of accordionButton */
{	
	var $button = $(".accordionButton.current");
	var $content = $(".accordionContent.current");
	var $newContent;
	var p1,p2,p3,p4,p5;	
	var contentAnimateDelay,contentHideDelay;
	
	contentAnimateDelay = (flagRapid) ? 20 : 400;
	contentHideDelay = (flagRapid) ? 20 : 200;
    console.log("cA and cH " + contentAnimateDelay + " " + contentHideDelay);
	
	  if ( ($button.length) &&  ($target.hasClass("current") ))
       {      
 	               /* same section as is open so close */
       	       	    console.log("SCB close SAME open section");console.log("111111111111111");
       	       		$.boeSettings.currentPrefix="Z";
 	                $.boeSettings.nextPrefix="X";
 	                $.boeSettings.currentContent = null;
 	                $target.removeClass("current"); 
 	            p1 =  promFadeHide($content);
 	          return ( p1.then(function(){  return (promScrollToMark($(".accordionButton"),$.boeSettings.resetButtonsAdjustment));}) );
 	    }
     	 
      $newContent=$target.next();
      $button.removeClass("current");
      $newContent.addClass("current");
      $target.addClass("current");
      
      if ($content.length) /* remove existing content */
	 {  
	 	
	 	if ($target.data("order") > $content.data("order"))
	 	    contentHideDelay *= 2;
	 	$content.removeClass("current");
	 	$button.removeClass("current");
       
       console.log("SCB close DIFFERENT open section THEN OPEN");
       
      p1 = promFadeHide($content,contentAnimateDelay,contentHideDelay);
      p2 = p1.then( function(result){var ft = new Date().getTime();console.log(result + " mid chain 1st THEN  " + ft);
       	                                        return ( promButtonDomReady($target))} );
      p3= p2.then( function(result){var ft = new Date().getTime();console.log(result + " mid chain 2nd THEN  " + ft);
       	                                                return  promFadeShow($newContent,true) });
       
      return p3.then(function(result){ var ft = new Date().getTime();
      	                                             console.log(result + " mid chain 3rd THEN  " + ft);
                                                     return promScrollToMark($target);
                                                     } );	                                    
      }    		                       																	
	 else
	 {   
      	  console.log("OPEN SECTION NO OTHERS OPEN");
      	  
      	/*     p1 = promButtonDomReady($target); */
      	 
      	    p1=  promFadeShow($newContent,true);
		    		     
		   return  (p1.done(function(){return promScrollToMark($target)}));
     } 
     console.log("END OF FUNCTION BUTTTON SHOW CONT AND SCROLL");
 }
function promTime()
{
	return $.Deferred(function(dfr)
	{
		var ht = new Date().getTime();
		console.log("PROM time is " + ht);
		setTimeout(function(){dfr.resolve()},100);
	}).promise();
}


function calcButtonTopOffset($button)
{
   return    $.boeSettings.resetButtonsAdjustment + 
                ($button.data("order")-1) * 107 ;
/*walker don't like 107 fixed get calc */ 
}

function promButtonDomReady($targ)
{ 
      var $target=$targ,
            topOffset,
             tryCount = 0,
             tryLimit=20,
             timeOut;
             
     return $.Deferred(function(dfr)
     {     console.log("inner BUTTON DR");
             topOffset = calcButtonTopOffset($target);
     
             if (checkDom()  )
             {  var wt = new Date().getTime(); console.log("returning resolve from pbdr " + wt);
             	  {  dfr.resolve("PBDR DONE"); }
             }
    }).promise(); 
   	
      function checkDom()
 	 {  var gt = new Date().getTime(); 
 	 	console.log("check DOM  COMP OT "+ topOffset + " "+$target.offset().top + " " + gt);
 	     if  ( ( topOffset/$target.offset().top)  > .90)
   	     {    console.log("checkDom true");
                  return true;
 	      }
 	     if (++tryCount > tryLimit)
 	     {     console.log("lcheck DOM imit exceeded true");
 	         return true;  /* walker I have no handler */
 	      }
 	         timeOut=setTimeout(checkDom,100);
    }
}

function promVideoOpen(d_lay)
{
   var  delay = d_lay || 400;
    var vt = new Date().getTime(); 
    var gt;
  
     return $.Deferred(function(dfr)
     {  
     	 var sectionObj  = $.boeSettings[$.boeSettings.nextPrefix]; 
     	 var poster = sectionObj.poster, 
     	       
              contentTop = $.boeSettings.currentContent.position().top; console.log($.boeSettings.currentContent);
              contentTop +=  ( ($.boeSettings.fullFeatures) ? 0 : $.boeSettings.buttonHeight);
              $(".vjs-big-play-button").show(); 
     	      $("video").attr("poster", poster );
         	  $(".vjs-poster").css("background-image","url('"+poster+"')");
         	 
              $.boeSettings.myPlayer.src( sectionObj.vidsrc );
              $.boeSettings.videoResize(true); 
               if (!$.boeSettings.fullFeatures)    /* walker not used at the moment */
	           {           
				    setTop = videoWrapperTop(sectionObj.buttonPosition)+"px"; /* WALKER */
				    setPadTop= "15px"; 
               }
   	           $("#videocontainer").css({"padding-top":15 + "px","top":contentTop + "px"});
   	           $.boeSettings.videoOpen = true;
   	      /*     $.when( promFadeShow($("#videocontainer"),delay)).done(dfr.resolve()); */
   	           promFadeShow($("#videocontainer"),delay).then(function(){ dfr.resolve() });
     }).promise();
 }

function promVideoClose(d_lay)
{
	console.log("prom video Close invoked");
	
    var dlay = d_lay || 400;
    var wt = new Date().getTime(); 
    var p1;
    return $.Deferred(function(dfr)
    {      
    	console.log("ROM VIDEO CLOSE");
        $.boeSettings.myPlayer.pause(); 
  	    promFadeHide($("#videocontainer"),dlay).then(function(){dfr.resolve() });
  	   
  	    $.boeSettings.videoOpen=false;
  	    $.boeSettings.myPlayer.height(10).width(10);  
      }).promise();
 }

function videoClose()
{      
        $.boeSettings.myPlayer.pause(); 
        promFadeHide($("#videocontainer"),300);  /*walker  speeds */       //.done(dfr.resolve());
  	    $.boeSettings.videoOpen=false;
  	    $.boeSettings.myPlayer.height(10).width(10);  
}

function scrollToMark($target, adjustment)
{   var t1 = new Date().getTime(); console.log($target.attr("id")+" TIMIE SCROLL " + t1);
	var a = adjustment || $.boeSettings.scrollToMarkAdjustment; 
	var scrollSpeed = 500;
    var topDestination = $target.offset().top; console.log(" scroll target dest and adj "+ $target.attr("id") +" "+topDestination + " "+a);
    topDestination -= a;
  
    $('html, body').animate({
					scrollTop: topDestination,
			    	scrollLeft:0
				    }, scrollSpeed);
 } 

function makeIconVideo($button)
{
	var iconImg = $button.find(".iconlink a img");
	 iconImg.attr("src","img/videoIcon.png");
}

function makeIconText($button)
{
	var iconImg = $button.find(".iconlink a img");
	      iconImg.attr("src","img/textIcon.png");   
}

function videoWrapperTop(index)
{    console.log("videoWrapperTop " + index);
	 var topV =   (index * ( $.boeSettings.buttonHeight + $.boeSettings.buttonBottomMargin  ) ) + $.boeSettings.buttonHeight ;
     console.log("resetButtonAdjust " + $.boeSettings.resetButtonsAdjustment);
     console.log("button index " + index);
     console.log("$button height " + $.boeSettings.buttonHeight);
     console.log("button bott margin " + $.boeSettings.buttonBottomMargin);
     console.log("vid top calc " + topV);
     return topV;
}

function promScrollToMark($targ,adj)
{   
	var dt = new Date().getTime();console.log(" promScrollToMark time " +  dt);
	var $target = $targ;
	var adjustment = adj;
	
	return $.Deferred(function(dfr)
	{  
	    var ddt = new Date().getTime(); 
		console.log("inner scroll time " + ddt); 
		setTimeout(function(){ var gt = new Date().getTime(); console.log("prom scroll resolved " + gt); dfr.resolve("Prom Scroll REZ");},520);
		scrollToMark($target,adjustment);

    }).promise();
}
