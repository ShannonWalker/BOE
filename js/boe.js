/**
 * @author Shannon Walker
 *  Burden of Eden javascript routines
 *  1st: 8/14/13
 */
$(window).on("load", function()
{  
	$.boeSettings=boeInit(); 
	if ($.boeSettings.unsupported)
	     window.location.replace("notsupported.html");
   	boeConfig();
	$("#videocontainer").hide();
	$.screenIn = function(){ 
   							                $('.accordionContent').hide(); 
											$("#splash").hide();
											$("#wrapper").animate({"opacity":1},1000);
	 										if ($.boeSettings.desktop)
	   	 										scrollToMark($.boeSettings.bannerHome); 
											else
	    										scrollToMark($.boeSettings.accordionButtons,  $.boeSettings.resetButtonsAdjustment);
	    		   				         };    
$.fbLoaded = function(){ var fbInt = setInterval(function(){ var fbH,fbW; 
                                                        									    var $fbSpan = $("#boefb span");		
                                                       											if ($fbSpan !== undefined)	
                                                     											 {
    	                                                    										fbH =parseInt($fbSpan.css("height"));
    	                                                    										fbW=parseInt($fbSpan.css("width") );
    	                                                    										fbHRad = Math.abs(fbH-$.boeSettings.fbHeight);
    	                                                    										fbWRad = Math.abs(fbW-$.boeSettings.fbWidth); 
    																								if (fbHRad<=3 && fbWRad <= 3)      
    																								{
    																									clearInterval(fbInt);
       																									$.screenIn();
        																							}   
     												 											}	
                                          														},100); };
	 $.ajaxSetup({ cache: true });
     $.getScript('//connect.facebook.net/en_US/all.js', function(){
                            FB.init({
                                        appId: '1419525251598984',
                                        channelUrl: '//www.burdenofeden.com/channel.html',
                                        status     : true,                                 // Check Facebook Login status
                                        xfbml      : true     
                                      });
                            $('#loginbutton,#feedbutton').removeAttr('disabled');
                            FB.getLoginStatus() }  ).done(function(){  $.fbLoaded();  }); 

	var theEvent = ($.boeSettings.iOS || $.boeSettings.android || (!$.boeSettings.desktop))? "click" : "click"; 
	
    $(".badge_title_container").on(theEvent,function(event)
    {   
    	if ($.boeSettings.desktop) return false;event.stopPropagation();
        handleButtonRequest( $(this) ); 	 
      });
      
   $(".badge_icon_container").on(theEvent,function(event)
    {  
       	event.stopPropagation();
      	event.preventDefault();
      	if ($.boeSettings.desktop)
      	{   
      		handleMenuIconRequest($(this));
      	}
        else    	
               {
               	   handleButtonRequest( $(this) );
               } 	 
     });
	$("section.pages").on(theEvent,".accordionButton",function(event)
	{   event.stopPropagation(); 
		handleButtonRequest( $(this) ); 	
	});
	$("section.topbanner").on("click","a", function(event)
	{ var url = $(this).attr("href");
      event.preventDefault();
      if(url && url.indexOf("#") != -1 && url.indexOf("#") == 0)
      { var pieces = url.split("#",2);
	     var $target = $('#'+pieces[1]); 
	     handleMenuRequest($target);	
	   }
	});
 	$(this).on("scroll",titlesForScroll); 
 	$.boeSettings.videoResize = function(force)
	 {                                                                           
	 	 if (force || $.boeSettings.videoOpen)	
	 	 {    /* only size the video if it is playing or setting up to be played, videoOpen flag */
		         var  vidContainerTop = 0,
        	            width =$(window).width(),
        	            vConHeight = (!!$.boeSettings.currentContent) ? $.boeSettings.currentContent.height():0,
        	            contentTop = $.boeSettings.currentContent.position().top; 
                        contentTop +=  ( ($.boeSettings.desktop) ? 0 : $.boeSettings.buttonHeight),
		                height= $(window).height() - $.boeSettings.topBannerHeight-(($.boeSettings.screenWidth > 767)?20:0), 
		                dims = videoDimensions(height,width-($.boeSettings.desktop?20:0 ) ), 
		                padLeft=0;
		                padLeft = (width-dims.width-$.boeSettings.videoDesktopIconWidth)/2;
		                if ($.boeSettings.desktop)
                           padLeft = (padLeft < $.boeSettings.videoDesktopIconWidth) ? $.boeSettings.videoDesktopIconWidth: padLeft; 
		                if (!$.boeSettings.desktop)
		                   vConHeight-=83;
                       $("#videocontainer").height(vConHeight).css({"padding-left": padLeft +"px","width":(width-padLeft)+"px","padding-top":"15px","top":contentTop+"px"});
                      ($.boeSettings.myPlayer).height(dims.height).width( dims.width);
            }  	 
     }; /*end video resize */                                   								
	videojs("my_video_player").ready(function()
	{          	 $.boeSettings.myPlayer = this;
	  	     	this.volume(0.5);
	  	     	$(window).afterResize($.boeSettings.videoResize,true,150); 
	 });	     
	 $(window).afterResize(boeConfig,false,150); 
	 
});

/* configuration routines */
/* boeInit called once in JQuery ready. Sets up boeSettings variables. Also determines pixel density and pixel ratio used to determine if display should be
 * for a mobile device or a desktop
 */
function boeInit()
{         
	var   $buttons= $('.accordionButton'),
	        butHeight = $buttons.height(),
	        butBottomMargin = parseInt($buttons.css("margin-bottom")),
	        ua = !!window.navigator && !!navigator.userAgent ? navigator.userAgent : false,
	        unsupported = !$.browser || (typeof($.browser.msie) != "undefined" && (parseInt($.browser.version,10) <10)  );
	        iPad = !!ua && ua.match(/iPad/i),
	        iPhone = !!ua && (ua.match(/iPhone/i)) || (ua.match(/iPod/i)),
	        iOS = iPad || iPhone,
	       android = !!ua && (ua.match(/Android/i)),
	       settings = {
	 	       "doc":$(document),
	 	       "topBanner":$(".topbanner"),
	 	       "topBannerHeader":$(".topbanner header"),
	 	       "navAnchors":$(".nav a"),
	 	       "bigFilmTitle":$('#page-filmtitle'),
	 	       "bannerHome":$(".banner.home"),
	 	       "bannerHomeDiv":$(".banner.home > div"),
	 	       "bannerPages":$('.banner.pages'),
	 	        "accordionButtons":$(".accordionButton"),
	   	       "windowHeight": $(window).height(),
	   	       "windowWidth":  $(window).width(),
	   	       "screenHeight": window.screen.height,
	   	       "screenWidth": window.screen.width,
	   	       "topBannerHeight":$(".topbanner").height(),
	   	       "homeBannerHeight":$(".banner.home > div").height(),
	   	       "buttonHeight":  butHeight,
	   	       "buttonBottomMargin": butBottomMargin,
	   	       "buttonGroupHeight": ($buttons.length * (butHeight + butBottomMargin))-butBottomMargin,
	   	       "buttonLastOffset":0,
	   	       "buttonGroupAdjustment":0,
	   	       "scrollToMarkAdjustment":0,
	   	       "resetButtonsAdjustment":0,
	   	       "initButtonOffset":60,
	   	       "fbHeight":20,
	   	       "fbWidth":75,
	   	       "desktop":false,
	   	       "unsupported": unsupported,
	   	       "iPad":!!iPad, 
	   	       "iPhone":!!iPhone,
	   	       "iOS":!!iOS,
	   	       "mobile":false,
	   	       "android":!!android,
	   	       "videoOpen":false,
	   	       "videoResize":null,
	   	       "videoDesktopIconWidth":0,
	   	       "myPlayer":null,
	   	       "currentContent":null,
	   	       "currentContentHeight":0,
	   	       "currentPrefix":"X",
	   	       "nextPrefix":"Z",
	   	       "com":{"buttonPosition":0, "poster":"img/Com-Poster.jpg","vidsrc":[ { type: "video/mp4", src: "video/Community.mp4" }, { type: "video/webm", src: "video/Community.webm" },
                                                                                      { type: "video/ogg", src: "video/Community.ogv" }] },
	   	       "des":{"buttonPosition":0, "poster":"img/Des-Poster.jpg","vidsrc":[ { type: "video/mp4", src: "video/Design.mp4" }, { type: "video/webm", src: "video/Design.webm" },
                                                                                      { type: "video/ogg", src: "video/Design.ogv" }] },
	   	       "his":{"buttonPosition":0,"poster":"img/His-Poster.jpg","vidsrc":[ { type: "video/mp4", src: "video/History.mp4" }, { type: "video/webm", src: "video/History.webm" },
                                                                                      { type: "video/ogg", src: "video/History.ogv" }] }
	 };
      if (settings.screenWidth < 768) /*indicate Small video src*/
     { 
     	var vidPropArray = [settings.com.vidsrc,settings.des.vidsrc,settings.his.vidsrc],
              limit = vidPropArray.length,
              i;    	
     	      for (i=0;i<limit;i++)
     	      {   
     	      	  $.each(vidPropArray[i],function(i,o)
     	      	  {      
     	      	        this.src=this.src.replace(".","S.");
     	      	  });  
     	      }
        }	
  	 $(".accordionButton").each(function(index,  element)
	 {
	   		var prefix = $(element).attr("id").substr(0,3);   
            if (  settings[prefix] !== undefined)
            {
            	settings[prefix].buttonPosition=index;
            } 
	 });
	return settings;
}
 /* boeConfig changes some boeSettings after resize event; also called once after boeInit, called from jQ ready */
function boeConfig()
{  	 
   if($.boeSettings.videoOpen)
	     $.boeSettings.videoResize();
	 $('.nav').myspasticNav();
	 $('.nav li:last-child').prev().css('margin-right','0'); 
	 $.boeSettings.windowHeight = $(window).height();
	 $.boeSettings.windowWidth =  $(window).width(); 
	 $.boeSettings.buttonBottomMargin = parseInt($(".accordionButton").css("margin-bottom"));
	 $("#communityButton").removeClass("com-display");
	 $("#designButton").removeClass("des-display");
	 $("#historyButton").removeClass("his-display");
	 $.boeSettings.resetButtonsAdjustment= 170;
     $.boeSettings.videoDesktopIconWidth = 0;
     
     if ($.boeSettings.desktop )
     { $.boeSettings.scrollToMarkAdjustment=$.boeSettings.topBannerHeight;
	   $.boeSettings.initButtonOffset = 0;
	   $.boeSettings.buttonGroupAdjustment=$.boeSettings.topBannerHeight;
	   $.boeSettings.videoDesktopIconWidth=$(".accordionButton").width()+10;
	   $("#communityButton").addClass("com-display");
	   $("#designButton").addClass("des-display");
	   $("#historyButton").addClass("his-display");
	   $.boeSettings.mobile=false;
	   sizeBannersAndPagesDesktop();
     }
     else
            {	 
            	$.boeSettings.mobile=true;
            	if( $.boeSettings.iPad || $.boeSettings.screenWidth >= 768 )
	             {  $.boeSettings.scrollToMarkAdjustment=$.boeSettings.topBannerHeight; 
	 	            $.boeSettings.initButtonOffset = 60;
	 	            $.boeSettings.buttonGroupAdjustment=$.boeSettings.topBannerHeight;
	 	            sizeBannersAndPagesIPad(); 
	             }  
	             else
	      	 	            {  $.boeSettings.initButtonOffset = 10; 
	         				   $.boeSettings.buttonGroupAdjustment = 0;
	                    	   $.boeSettings.scrollToMarkAdjustment=0;
	                    	   sizeBannersAndPagesMobile(); 
	             			} 	
		      }
	 if ($.boeSettings.videoOpen)
	 {    
	 	   $.boeSettings.videoResize(); 
	 }
	 else
	 {	
	 		if ($.boeSettings.desktop)
			{   titlesForScroll();
	 		}
	 		else
	 		{  
	 	   		hideTitlesForScroll();
	 		}
	 }
} 
/*sizing routines */
/* sizeBannerAndPagesDesktop, the home banner which is where the main titles screen displays in desktop mode. Home banner is set to the hight of the
   viewport . bannerHomeDiv contains the maintitles, so that div is padded on top with half of the difference between the titles height and the window height
   bannerPages is where an opened "page" such as sections for History, Design, etc is shown. So an open page has a min height of the  viewport
   as does the content wrapper for each of these sections
  */ 
function sizeBannersAndPagesDesktop(){
		var wH = $.boeSettings.windowHeight; 
        $.boeSettings.bannerHome.css( "height", wH + "px");
        $.boeSettings.bannerHomeDiv.css("padding-top", parseInt((wH - $.boeSettings.homeBannerHeight) / 2)); 
        $.boeSettings.bannerPages.css("min-height",wH + "px");
        $(".accordionContent [id*='-wrapper']").css("min-height",wH+"px" ); 
}
function sizeBannersAndPagesIPad(){
	 var contentMinHeight = 1024,
	        bannerHomeHeight = $.boeSettings.topBannerHeight + $.boeSettings.initButtonOffset,
	        pageH=sizeButtonBannerPage();
	   $.boeSettings.bannerPages.css("min-height",pageH +"px"); 
       $.boeSettings.bannerHome.css( "height", bannerHomeHeight + "px");  
       /*$(".accordionContent [id*='-wrapper']").css("min-height",contentMinHeight +"px" );  */
       $.boeSettings.bannerHomeDiv.css('padding-top', 0 ); 
 }
 
function sizeBannersAndPagesMobile() {
   var pageH = sizeButtonBannerPage(),
   contentMinHeight = 400;
 $.boeSettings.bannerPages.css("min-height",pageH +"px");  
 $.boeSettings.bannerHome.css( "height",$.boeSettings.initButtonOffset + "px");  
 $(".accordionContent [id*='-wrapper']").css("min-height",contentMinHeight +"px" );  /*$.boeSettings.topBannerHeight + $.boeSetttings.initButtonOffset*/
 $.boeSettings.bannerHomeDiv.css('padding-top', 0 );    
}

function sizeButtonBannerPage()
{
	var unusedWindow= $.boeSettings.windowHeight - $.boeSettings.scrollToMarkAdjustment+$.boeSettings.initButtonOffset,
	       distanceToMoveLastButton= ($.boeSettings.accordionButtons.length-1)*($.boeSettings.buttonBottomMargin+$.boeSettings.buttonHeight)+($.boeSettings.topBannerHeight+$.topBannerHeight+$.boeSettings.initButtonOffset);      
	       return (unusedWindow+distanceToMoveLastButton);
}
/*gives a video screen that fits according to 16/9 ratio returns an object with height and width */

function videoDimensions(wH,wW)
 { 
 	var aspectRatio=16/9,
           inverseAspectRatio = 9/16,
           sideSpace,
           width=wW,height=wH,
           docWidth = $.boeSettings.doc.width();
           if($.boeSettings.desktop)
           {  width= wH * aspectRatio; 
              if  ( (width + $.boeSettings.videoDesktopIconWidth) >  docWidth )
              {   width = docWidth - $.boeSettings.videoDesktopIconWidth-20; /*20 for scroll bar */
                  height = width * inverseAspectRatio;
              }
           }
           else {  /* tablets just take the max width and work from there */
                       height=width * inverseAspectRatio;
                       if (wH < height)
                       {     width = wH*aspectRatio;
                            height=width * inverseAspectRatio; }
                  }
           return {"height":height,"width":width};        
 } 
 
 /* calculate how far button is from the "top"; used when deferred objects haven't yet updated on a closing content page, so promButtonDomReady polls 
  * with this function
  */
function calcButtonTopOffset($button)
{
   return    $.boeSettings.resetButtonsAdjustment + 
                (($button.data("order")-1) * ($.boeSettings.buttonHeight+$.boeSettings.buttonBottomMargin));
}
function videoWrapperTop(index)
{    var topV =   (index * ( $.boeSettings.buttonHeight + $.boeSettings.buttonBottomMargin  ) ) + $.boeSettings.buttonHeight ;
     return topV;
}

/* scroll routines */
/* titlesForScroll  called after boeConfig which is to say after a resize event. 
  * titlesForScroll toggles visibility of header picture depending upon scroll position. menuDark is dark menu on lighter background photo. Scroll changes to
  * darker background image in header and thus lightMenu, offwhite menu elements
  * 
   */
function titlesForScroll()
{   
   var menuDark = $.boeSettings.navAnchors.hasClass("darkmenu");
   if ($.boeSettings.desktop)   		 		
   {  	if( menuDark && $.boeSettings.doc.scrollTop() > 110 ) 
     	{  	    $.boeSettings.navAnchors.removeClass("darkmenu");
      			$.boeSettings.topBannerHeader.addClass('showbg');
      			$.boeSettings.topBanner.addClass("showbackground");
     			$.boeSettings.navAnchors.addClass("lightmenu");
     			$.boeSettings.topBannerHeader.fadeIn();
    		    $.boeSettings.bigFilmTitle.fadeOut();
    	}
      	else  if(!menuDark && $.boeSettings.doc.scrollTop() <=110)
        	     {  
        	   	  	$.boeSettings.navAnchors.removeClass("lightmenu");
            	  	$.boeSettings.topBanner.removeClass("showbackground");
            	  	$.boeSettings.navAnchors.addClass("darkmenu");
            	  	$.boeSettings.topBannerHeader.fadeOut();
     	            $.boeSettings.bigFilmTitle.fadeIn();
              	 }  
        }
}
/* if configured for a mobile browser, this will hide the titles that show as part of the home banner section. They are suppressed because the mobile
 * configuration will have navigation buttons over that portion of the screen
 */
function hideTitlesForScroll()
{
	$.boeSettings.bigFilmTitle.hide();
	$.boeSettings.topBanner.removeClass("showbackground");   
	$.boeSettings.topBannerHeader.addClass("showbg").fadeIn();
	showButtons();
}
/*
 * scrollToMark takes elements position in the document and scrolls to the top of the document less an adjustment.
 * The adjustment is either a boeSetting, scrollToMarkAdjustment  which adjusts how an element ""slides up"  in a mobile environment or
 * @adjustment is a parameter indicating returning a button menu group to an offset, therefore when an "open"" button is closed the adjustment parameter
 * puts the button and the group it is in, back to the proper offset from the top of the document
 * 
 * scrollToMark is mostly called within a promScrollToMark wrapper that makes the scrolling an action of a deferred object so that the scrolling completes before  
 * subsequent actions are executed
 * Called in: initialization in JQ ready when the home banner is loaded [dektop version only]
 * showContent FromMenu, handleButtonRequest, showContentButtonForScroll
 * scrolling is set to go faster if closing a video (because there is an extra step after the video page closes)
 */
function scrollToMark($target, adjustment)
{   var a = adjustment || $.boeSettings.scrollToMarkAdjustment,  
	      scrollSpeed = $.boeSettings.videoOpen?1200:500,
          topDestination = $target.offset().top-a; 
          $('body,html').animate({scrollTop: topDestination }, scrollSpeed);
 } 
 
/* showButtons if version is mobile and using button navigation*/ 
 function showButtons()
{	$.boeSettings.accordionButtons.show();
}

/* full featured navigation routines -- menu */
/* handleMenuRequest on menu anchor click event
 /* all anchors except HOME are sent to a hash that is the name of the content section, HOME on the other hand is id=mytopButton"
  * if target is home and nothing is current do nothing
  * if current open menu item content is selected do nothing
  * if target is a content section (".accordionContent") then assign new prefix to nextPrefix and assign current content
  * old button is what was current going in (could be null); if video open from existing content, then close it and restore icons else skip that step and handle
  * the menu request by calling showContentFromMenu
 * */
function handleMenuRequest($target)  
{ 
var $oldButton,
       $oldContent,
       newPrefix=null,
       dfr, p1,p2,p3,lastPromise;

if  ( ($target.attr("id")=="mytopButton") && !($.boeSettings.currentContent) )
        return;
if ($target.hasClass("current"))
        return;
if ($target.hasClass("accordionContent"));
{       
	     $.boeSettings.nextPrefix = $target.attr("id").substr(0,3);     
         $.boeSettings.currentContent = $target;
}
$oldButton = $(".accordionButton.current");

if ($.boeSettings.videoOpen)
 {
  	      p1=promVideoClose(50);
 	      p2 =p1.then(function(){ return (promFadeHide($oldButton,50));} );
          return ( p2.then(function(){  restoreButtonToDisplayPosition($oldButton);
          	                                             $.boeSettings.currentPrefix = $.boeSettings.nextPrefix;
          	                                             showContentFromMenu($target,true);                     
          	                                 }));
  }
 else
      {
         $.boeSettings.currentPrefix = $.boeSettings.nextPrefix;         	 
       	  return (showContentFromMenu($target)  );
       }
}	
/* called from desktop mode via click on 'badge_icon_container' class attached to 'accordionButton'  section
 * if video open, then the clicked icon is set adjacent to the video player screen, so restore button to display position (in content section)
 * also close the video
 * if opening video then move the badge_icon_container to be adjacent to the video player screen
 * in any case, we want to fade out the button and fade back in after button has been moved
 */
function handleMenuIconRequest($target)
{
	   var newPrefix = $target.attr("id").substr(0,3),
	         $button = $target.closest(".accordionButton");
	        
	       if ( $.boeSettings.videoOpen )
	       {
	         vidToggle = promVideoClose;
	         iconLoc = restoreButtonToDisplayPosition;
	       }
	       else {
	       	         vidToggle = promVideoOpen; 
	       	         iconLoc = moveButtonToVideoPosition; 
	               }
	 
   	 p1 = promFadeHide($button); 
   	 p2= p1.then(function(){ return vidToggle(150);});
   	return ( p2.then(function(){	iconLoc($button); 
   			                                    	$.boeSettings.currentPrefix = $.boeSettings.nextPrefix;
   			                                     	return promFadeShow($button);}
   			                                     	));
}
/* called from handleMenuRequest. will show content that is in $target (a section with class=accordionContent); 
 * @forceQuick boolean to close faster due to being called from content with video open (and therefore requring an extra step)
 *  here badge is a container for an icon and a title. The icon is either a video launch icon or a return to text (close video) icon 
 * 
 *  first time in both badge and content are nil so just show the target content and then take the target's sibling :prev() which is the badge and mark it current
 *  in with open current: unmark content section and if video open, unmark as current  badge; hide badge and current; other wise no video, just hide current
 *  if target is NOT accordionContent class ie HOME, then scroll the content closed and exit
 *  if open content then p2 waits for it to fade to hide before showing target, else target shows immediately
 *  then mark target as current, acquire badge and wait for process to update DOM; then scroll to Mark ie scroll content to top of position under heading.
 *  finally with new content displayed mark badge as current and with deskshow class (for position) this fades icon badge into view (for calling video)
 *  */
function showContentFromMenu($target,forceQuick)
{
	if ($target.hasClass("current"))  /* target is current accordionContent class element */
	    return null;
	
    var $badge = $(".accordionButton.current"),
	      $content = $(".accordionContent.current"),
          $currentBadge,
          contentA=400,
          contentH=400,
          p1,p2,p3,p4,p5,lastPromise;  
          /* process variables from deferred objects so that processing goes synchrously*/
          /* p1=hidebadge;p2=hideContent;p3=show target;
          * 
          * p4=wait for changes to update in DOM;p5=scrollToMark;p6=update badge to show in desktop version and mark current
          */
	
	if (forceQuick)
	{
		contentA=50;
	    contentH=50;   
	}
	
	$content.removeClass("current");	/*unlabel current content section*/
	if ( $badge.length)                           /* here only processing badges that link to video */
	{   $badge.removeClass("current");
        p1 = promFadeHide($badge);
        p2 = p1.then(function(){return promFadeHide($content);});     
	 
    }
    else  
	{   
		if ($content.length)
		{  
			p2 = promFadeHide($content,contentA,contentH);
	    }
	}
   if ( !$target.hasClass("accordionContent"))  /* NOT has class */
   { 
            return( p2.then(function(){return promScrollToMark($target); }) );	  
   }
   else
   {  if (p2) 
           p3=p2.then(function(){return promFadeShow($target);});
     else p3 = promFadeShow($target);
     p4 = p3.then(function(){ $target.addClass("current");
     										  $currentBadge= $target.prev();
     										  return promDomReady($content,$target);});
     p5=p4.then(function(){return promScrollToMark($target);});	
     p6 = p5.then(function(){if ($currentBadge.hasClass("deskshow"))
     	                                        {  $currentBadge.addClass("current");
                                                    return promFadeShow($currentBadge,300); 	
     	                                         }});
     return p6;
    }
 }
 
 /* when in desktop mode, moves badge_icon_contaiiner to be adjacent to the just opened video screen
  * toggle to make the icon show a face indicating it will return the content to text
  * remove [pre-fix]+"display" class because it has just  called video display; then set top and left dimensions
  */
 function moveButtonToVideoPosition($button)
{     makeIconText($button);
	  var classOut = $button.attr("id").substr(0,3) + "-display",
	  leftShift =  ($(window).width()-$("#my_video_player").width())/2;
	  leftShift-=($button.width()+15); 
	  leftShift=Math.max(leftShift,15);
	  $button.removeClass(classOut).css("left",leftShift+"px").css("top","125px");
}
/*
 * make current text calling badge_icon_container as a video invoking badge. Attach class of [prefix]+"display"
 * 
 * */
function restoreButtonToDisplayPosition($button)
{   
	makeIconVideo($button);
	var classIn = $button.attr("id").substr(0,3) + "-display";
	$button.css("left","").css("top","").addClass(classIn);
}
/* change icon image source*/
function makeIconVideo($button)
{
	var iconImg = $button.find(".iconlink a img");
	 iconImg.attr("src","img/videoIcon.png");
}
/*change icon image source*/
function makeIconText($button)
{
	var iconImg = $button.find(".iconlink a img");
	      iconImg.attr("src","img/textIcon.png");   
}

/* mobile and pad related navigation via "buttons"   */
function handleButtonRequest($target)
{	
	var $button = $target.closest(".accordionButton"),
	      newPrefix = $button.attr("id").substr(0,3),
	      currentPrefix = $.boeSettings.currentPrefix,
	      newSection = (newPrefix != currentPrefix),
	      vidDef;
	      
	$.boeSettings.currentContent = $button.next();
	$.boeSettings.nextPrefix = newPrefix;
	
	if ( $target.hasClass("badge_title_container") || $target.hasClass(".accordionButton")  )
	{
		handleButtonLabelForContent($button);
	}

	if ($target.hasClass("badge_icon_container") )
	{ vidDef = handleButtonIconForContent($button, newSection);
	  vidDef.then(function(){if ($.boeSettings.videoOpen && !$.boeSettings.desktop)
			                                     scrollToMark($button,$.boeSettings.topBannerHeight-$.boeSettings.buttonHeight-10);});
	}
    $.boeSettings.currentPrefix = $.boeSettings.nextPrefix;
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
	     	   return (p1.then( function(){  }));
	     }
	     else {
	     	        makeIconText($oldButton);
	     	        p1= promVideoOpen();
	     	        return (p1.then(function(){ }));
	             }
	}
	if ($.boeSettings.videoOpen)   /* this closes the current video and content section */
	{    p1= buttonClearVideo($oldButton);
	     p2=p1.then(function(){ return showContentButtonsAndScroll($button,true); } );
	     return p2.then(function(){ makeIconText($button);hideContentUnderVideo();
	                                                return promVideoOpen();});
   }
    p1= showContentButtonsAndScroll($button);
 	return (  p1.then(function(){ makeIconText($button);hideContentUnderVideo();
 	                                               return promVideoOpen();} )) ;
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
	flagRapid=true; /*walker added*/
	contentAnimateDelay = (flagRapid) ? 20 : 400;
	contentHideDelay = (flagRapid) ? 20 : 200;
    
	  if ( ($button.length) &&  ($target.hasClass("current") ))
       {      
 	               /* same section as is open so close */
       	       	$.boeSettings.currentPrefix="Z";
 	            $.boeSettings.nextPrefix="X";
 	            $.boeSettings.currentContent = null;
 	            $target.removeClass("current");
 	            $content.removeClass("current");
                $target.css("color","");
 	            p1 =  promFadeHide($content,0,0);
 	          return ( p1.then(function(){  return (promScrollToMark($(".accordionButton"),$.boeSettings.resetButtonsAdjustment));}) );
 	    }
     	 
      $newContent=$target.next();
      $button.removeClass("current");
      $button.css("color","");
      $button.find(".badge_title").removeClass("darkred");
      $newContent.addClass("current");
      $target.addClass("current");
      $target.css("color","#fac864");
        
      if ($content.length) /* remove existing content */
	  {  
	 	
	 	if ($target.data("order") > $content.data("order"))
	 	    contentHideDelay *= 2;
	 	$content.removeClass("current");
	 	$button.removeClass("current");
    
      p1 = promFadeHide($content,contentAnimateDelay,contentHideDelay);
      p2 = p1.then( function(result){ return ( promButtonDomReady($target));} );
      p3= p2.then( function(result){ return  promFadeShow($newContent,true);});
       
      return p3.then(function(result){ return promScrollToMark($target);} );	                                    
      }    		                       																	
	 else
	 {         	  
      	 p1=  promFadeShow($newContent,true);
         return  (p1.done(function(){return promScrollToMark($target);}));
     } 
 }

/* deferred / promise routines */
/* full featured menu related deferred/promise routines */
function promFadeShow($targ,aniDur)
{    var $self=$targ;
	 var aDuration = aniDur || 400;
	
	 return $.Deferred(function(dfr)
	{    
	$self.css("opacity",0); 
	$self.show(0);
     	    
    $self.animate({"opacity":1},aDuration,function(){ dfr.resolve("Show DONE"); }); 
	
	}).promise();
}
function promFadeHide($targ,aniDur,hideDur)
{
	var aDuration = aniDur || 400;
	var hDuration = hideDur || 200;
	var $self = $targ;
	return $.Deferred(function(dfr)
	{		
		$self.animate({"opacity":0},aDuration).hide(hDuration,function(){dfr.resolve("HIDE DONE");});   
	}).promise();
} 

function promDomReady($cont,$targ)
 {
 	    var $content = $cont;
 	    var $target = $targ;
 	    var ut = new Date().getTime();
 	          
        return $.Deferred(function(dfr)
        {         
                 	var to;
 					var rCnt=0;
           			           			
  					if (recurseTime())
 					{    dfr.resolve();
 						 return;
 					}
 					else { dfr.resolve();}
    	    	          
                   function recurseTime()
 				    {   
 				         var heightRatio = $.boeSettings.windowHeight / $target.offset().top;
 		    	          var dtt =new Date().getTime();
 		    	       
   		    	          if ( heightRatio > .55 )
 		    	          {    clearTimeout(to);
 		    			       return true;
 		   	               }
 		    	           if (++rCnt > 20)
 		   		           {  var ft = new Date().getTime(); 
 		   		               clearTimeout(to);
 		    	   		      return true;  
 		   	                }
 		   	                to=setTimeout(recurseTime,100);
 		 	            }  
 		 	  }).promise();
}	   

function promButtonDomReady($targ)
{ 
      var $target=$targ,
            topOffset,
             tryCount = 0,
             tryLimit=20,
             timeOut;
             
     return $.Deferred(function(dfr)
     {    
             topOffset = calcButtonTopOffset($target);
     
             if (checkDom()  )
             {  
             	   dfr.resolve("PBDR DONE");
             }
    }).promise(); 
   	
      function checkDom()
 	 {  
 	     if  ( ( topOffset/$target.offset().top)  > .90)
   	     {    return true;
 	      }
 	     if (++tryCount > tryLimit)
 	     {     
 	         return true;  /* walker I have no handler */
 	      }
 	         timeOut=setTimeout(checkDom,100);
    }
}

function promScrollToMark($targ,adj)
{   var $target = $targ;
	var adjustment = adj;
	
	return $.Deferred(function(dfr)
	{  
	    setTimeout(function(){ dfr.resolve("Prom Scroll");},520);
		scrollToMark($target,adjustment);
    }).promise();
}
function promVideoOpen(d_lay)
{
   var  delay = d_lay || 400;
    var vt = new Date().getTime(); 
    var gt;
  
     return $.Deferred(function(dfr)
     {  
     	 var sectionObj  = $.boeSettings[$.boeSettings.nextPrefix];
          var      poster = sectionObj.poster,
                      conBar,
                      thePlayer=$.boeSettings.myPlayer,
                      $vidCont=$("#videocontainer");
     	     
     	      $("video").attr("poster", poster );
         	  $(".vjs-poster").css("background-image","url('"+poster+"')");
         	  /* thePlayer.pause();*/
         	  conBar = $(".vjs-control-bar");
         	  if ($.boeSettings.iOS)
         	  {   setTimeout(function(){thePlayer.src( sectionObj.vidsrc ); },200);
         	  }
              thePlayer.src( sectionObj.vidsrc );
             $.boeSettings.videoResize(true); 
            
   	           $.boeSettings.videoOpen = true;
   	           $(".vjs-big-play-button").hide();
   	           if (conBar)
   	           {		 	if ($.boeSettings.iOS)
   	           		 	       conBar.addClass(".vjs-hidden"); 
   	           		 	    else
   	           		 	    {    
   	           		 	    	 if (conBar.hasClass("vjs-lock-showing"))  
   	           		 	    	 { thePlayer.play();}
   	           		 	    	 else {   conBar.removeClass("vjs-lock-showing");
   	           		 	    	 	         conBar.addClass("vjs-fade-in");
   	           		 	                     setTimeout(function(){conBar.addClass("vjs-fade-out");},100);
   	           		 	                 }
   	           		 	     }
   	            }            
   	           promFadeShow($vidCont,delay).then(function(){dfr.resolve();});
     }).promise();
 }
function promVideoClose(d_lay)
{
	var dlay = d_lay || 400,
    thePlayer=$.boeSettings.myPlayer,
     p1;
    
    return $.Deferred(function(dfr)
    {      
    	/*thePlayer.pause();*/   thePlayer.src("");
        $(".vjs-play-control").removeClass("vjs-playing").addClass("vjs-paused");
    	$(".vjs-control-bar").addClass("vjs-lock-showing");
  	    promFadeHide($("#videocontainer"),dlay).then(function(){dfr.resolve();});
  	    $.boeSettings.videoOpen=false;
  	    thePlayer.height(10).width(10);  
      }).promise();
 } 
 
 /* video routines */
function showContentUnderVideo()
  {
  	var cText = "#"+ $.boeSettings.nextPrefix + "-text",
 	       cBack="#"+ $.boeSettings.nextPrefix+"-bg";
   	$(cText).removeClass("makeinvisible");
   	$(cBack).removeClass("makeinvisible");
  }
  function hideContentUnderVideo()
 {
 	var cText = "#" + $.boeSettings.nextPrefix + "-text",
 	 cBack = "#" + $.boeSettings.nextPrefix + "-bg"; 
 	$(cText).addClass("makeinvisible");
 	$(cBack).addClass("makeinvisible");
 }
  function buttonClearVideo($button)
 {
         makeIconVideo($button);
         showContentUnderVideo(); 
         return (promVideoClose() );	
 }