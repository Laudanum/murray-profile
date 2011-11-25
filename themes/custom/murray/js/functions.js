var transition_speed = 500;
var slide_speed = 7000;

function slideSwitch() {
  var _active_slide = jQuery('#gallery ul li.active');

//  front page - update the header with the title of the work shown
  var gallery_info = jQuery('#gallery ul li.active .detail-info').html();
  if(gallery_info != ""){
    jQuery('#slidecontent').html(gallery_info);
  }
  
/*  
//  front page - update the content area with the project description  
  var gallery_body = jQuery('#gallery ul li.active .detail-body').html();
  if(gallery_info != ""){
      jQuery('#content').html(gallery_body);
  }
*/  
  

  if ( _active_slide.length == 0 ) _active_slide = jQuery('#gallery ul li:last');

  // use this to pull the images in the order they appear in the markup
  var _next_slide =  _active_slide.next().length ? _active_slide.next() : jQuery('#gallery ul li:first');

  // uncomment the 3 lines below to pull the images in random order
  
  // var $sibs  = _active_slide.siblings();
  // var rndNum = Math.floor(Math.random() * $sibs.length );
  // var _next_slide  = $( $sibs[ rndNum ] );


  _active_slide.addClass('last-active');

  _next_slide.css({opacity: 0.0}).addClass('active').animate(
    {opacity: 1.0}, 
    transition_speed, 
    function() {
      _active_slide.removeClass('active last-active');
    }
  );
}


jQuery(document).ready(function(){
//move header into primary-links
//	jQuery("#primary-links").prepend(jQuery("#header"));


/* show the correct row of thumbnails and hide the others */
  var _showSubmenu = function(obj) {
//  do nothing if we're currently active
    if ( jQuery(obj).hasClass("active") ) {
      return false;
    }
//  hide any existing menus
    jQuery(".menu.secondary").removeClass("active").animate({
      opacity : 0,
      height : 0
    }, "fast", "swing");
//  show the correct one
    jQuery(obj).addClass("active").animate({
      opacity : 1,
      height : 94
    }, "slow", "swing");
  }

/* show a particular slide, or the next slide if no slide is specified */
  var _showSlide = function(_next_slide) {
    var _active_slide = jQuery('#gallery ul li.active');
    if ( _active_slide.length == 0 ) _active_slide = jQuery('#gallery ul li:last');
    if ( ! _next_slide ) {
      _next_slide =  _active_slide.next().length ? _active_slide.next() : jQuery('#gallery ul li:first');
    }

//  if the previous slide is still running then don't do anything
    if (_active_slide.is(':animated') ) {
      return false;
    }

//  if required adjust the image position
    var _mt = 0;
    if ( _next_slide.hasClass("crop") ) {
  //  top margin should be negative 1/2 ( height of image - height of screen )
      _wh = jQuery('#gallery').height();
      _h = _next_slide.find("img")[0].height;
      _mt = -(_h-_wh)/2;
      _next_slide.children("a").css({marginTop : _mt, height : 'auto'});
    } else {
    }

    _active_slide.addClass('last-active');
    _next_slide.css({opacity: 0.0}).addClass('active').animate(
      {opacity: 1.0}, 
      transition_speed, 
      function() {
        _active_slide.removeClass('active last-active');
      }
    );
    
//  update the correct thumbnail
    _src = jQuery(_next_slide).find("img").attr("src");
    jQuery(".secondary a.active").removeClass("active");
    jQuery(".secondary a[href=" + _src + "]").addClass("active");
  //  front page - update the header with the title of the work shown
    var gallery_info = jQuery('#gallery ul li.active .detail-info').html();
    if(gallery_info != ""){
      jQuery('#slidecontent').html(gallery_info);
    }  
  }  
  

  var _startSlideshow = function() {
    jQuery("body").everyTime(slide_speed, "slideshow", function() {
      _showSlide();
    });
  }
  
  
  var _stopSlideshow = function() {
    jQuery("body").stopTime("slideshow");
  }
  

	if ( jQuery("body").hasClass("front") ) {
		secondary = "#header";
	} else {
		secondary = "#secondary-links";
	}


/* * * *
 *
 *  project pages only	
 *
 * * * */
	if ( jQuery("body").hasClass("node-type-project") ) {
	  _showSubmenu(jQuery("#project-media"));

//  interrput clicks on the project title and show the project media submenu
    jQuery("div.title h2 a").click(function(event) {
      event.preventDefault();
	    _showSubmenu(jQuery("#project-media"));
    });

//  interrupt clicks on project media thumbs and show the correct slide
    jQuery("#project-media li a:not(.edit)").click(function(event) {
      event.preventDefault();
//  pause the slideshow
      _stopSlideshow();
      
      _src = jQuery(this).attr("href");      
      next_slide = jQuery("#gallery img[src=" + _src + "]").parents("li");
      if ( next_slide.length ) {
        _showSlide(next_slide);
      }      
    });
	}
	
	
	
	primary = ".primary";
	
	jQuery("#secondary-links li a img").each(function(){
//		jQuery(this).parent().css({backgroundImage: "url(" + jQuery(this).attr("src") + ")"});
//		jQuery(this).hide();
	});
    
//    var length = jQuery('#gallery ul li').length;
    
/* if we have a gallery set up a slideshow and run it */
    if(jQuery('#gallery ul li').size() > 1) {
      _startSlideshow();

//  create some buttons if we don't have them already
      jQuery("#gallery").append("<a class='navigation next' href='javascript:void(0);'>Next</a><a class='navigation previous' href='javascript:void(0);'>Previous</a>");

//  listen for clicks on the navigation arrows
      jQuery("#gallery a.navigation").click(function(event) {
        _stopSlideshow();
        if ( jQuery(this).hasClass("next") ) {
          _showSlide();
        } else {
          var _active_slide = jQuery('#gallery ul li.active');
          _previous_slide = _active_slide.prev().length ? _active_slide.prev() : jQuery('#gallery ul li:last');
          _showSlide(_previous_slide);
        }
      });

//  use keyboard arrows to navigate the slideshow
			jQuery(document).keydown(function(event) {
				if ( event.which == 37 ) { // left
					event.preventDefault()
					jQuery(".previous").click();
				} else if ( event.which == 39 ) { // right
					event.preventDefault()
					jQuery(".next").click();
				} else {
//						alert(event.which)
				}
			});
    }
    
    
     
     /*
     jQuery('div.secondary ul').jcarousel({
         scroll:12       
     });
     */
     
     

    

/*
	jQuery("#primary-links").hover(function(){
		jQuery(secondary+","+primary).stop();
		jQuery(this).animate({height:94}, "slow", "swing");
//		jQuery(secondary).animate({height:94, bottom:95, opacity:1}, "slow", "swing");
	}, function() {
//		jQuery(this).animate({height:41}, "slow", "swing");
//		jQuery(secondary).animate({height:0, bottom:41, opacity:0}, "slow", "swing");
	});
*/
/*
	handle the secondary menu exits
*/
//refactor with intent or timer
	jQuery(".secondary").hover(function(event){
        //alert('okay');
		jQuery(secondary+","+primary).stop();					
	},function(event){
// only exit if we're exiting up
			if ( event.pageY < jQuery(this).offset().top && jQuery(this).hasClass("active") ) {
//			  jQuery(this).css("border", "1px solid red");
//    	  alert('exit event y ' + event.pageY + " this top " + jQuery(this).offset().top);
    		jQuery(this).animate({height:0, opacity:0}, "slow", "swing", function() {
//	if we exit from the top close primary
//	dont' close the primary menu any more
/*
			if ( event.pageY < jQuery(primary).offset().top ) {
				jQuery(primary).animate({height:41}, "slow", "swing");
				jQuery(primary).find("ul ul").animate({opacity:0});
			} else {
			}
*/
		    });
	    }
      jQuery("#bottom").show();
	});

/* show submenu */
	jQuery(".primary ul ul").hover(function(){
//	close all the others
		jQuery(this).parent().addClass("active").siblings().removeClass("active").find("ul").animate({opacity:0});
		jQuery(this).animate({opacity:1});
	}, function(event) {
//	if we are not exiting up then close it up
		if ( event.pageY > jQuery(primary).offset().top ) {
			jQuery(this).animate({opacity:0}).parent().removeClass("active");
//			alert("close from primary ul ul exit")
//  why are we closing here ? probably from old hover interaction
//			jQuery(".secondary").animate({height:0, opacity:0}, "slow", "swing");
            
		} else {
            //alert('me');
           jQuery(this).parent().find("a").animate({opacity:1});
			
		}
	});

/*
	reveal the correct secondary menu
*/
	jQuery(".primary ul ul li a").click(function(){
        
        var taxnomy_name_list = jQuery(this).attr("href");
        
        var taxnomy_name = taxnomy_name_list.split("/");
        var current_name = taxnomy_name[taxnomy_name.length - 1];
//        alert("Closing others")
_showSubmenu(jQuery('#works-'+ current_name));
//        jQuery(".secondary.active").removeClass("active").animate({height:0, opacity:0}, "fast", "swing");    
  //      jQuery('#works-'+ current_name).addClass("active").animate({height:95, bottom:95, opacity:1}, "slow", "swing");    
        
        /*jQuery.ajax({
          url: "murray_thumbnail/" + current_name,
          cache: false,
          success: function(id){
              alert(id);
            if(id != '0'){  
                alert(id);
                jQuery('#works-'+ id).animate({height:94, bottom:95, opacity:1}, "slow", "swing");    
            }
          }
        });*/
        
        
		/*event.preventDefault();
		s_id = jQuery(this).attr("href");
		if ( jQuery(s_id).size() ) {
			jQuery(s_id).animate({height:94, opacity:1}, "slow", "swing");
			jQuery(".secondary:not("+s_id+")").animate({height:0, opacity:0}, "slow", "swing");

		}
		if ( jQuery(secondary).css('opacity') < 1 ) {
			jQuery(secondary).animate({height:94, opacity:1}, "slow", "swing");
		} else {
			jQuery(secondary).animate({height:0, opacity:0}, "slow", "swing");
		}  */
        
        
        
        return false;
	});

/*
	show and hide the sidebar content 
*/
	jQuery(".toggle a").toggle(function() {
        var target ='#sidebar';
		//jQuery(target).slideToggle("slow");
        jQuery(target).animate({width:'toggle'},500)
        
	},
    function() {
        var target ='#sidebar';
        //jQuery(target).slideToggle("slow");
        jQuery(target).animate({width:'toggle'},500)
        
    });
	
	
	jQuery('#sidebar div.body').tinyscrollbar();
	
	
});

