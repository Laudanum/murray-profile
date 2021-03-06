var transition_speed = 700;
var slide_speed = 7000;

jQuery(document).ready(function(){

  menu_height = 94;
  menu_border = 1;


  var menu_opts = {
    primary: {
      show: {
        height: menu_height + menu_border
      },
      hide: {
        height: 0
      }
    },
    secondary: {
      show: {
        height: menu_height,
        bottom: menu_height + menu_border * 2
      },
      hide: {
        height: 0,
        bottom: 0
      }        
    }
  }
/* msie misbehaves with transitioning opacity */  
  if ( ! jQuery.browser.msie ) {
    menu_opts.primary.show.opacity = 1;
    menu_opts.primary.hide.opacity = 0;
    menu_opts.secondary.show.opacity = 1;
    menu_opts.secondary.hide.opacity = 0;
  }

//move header into primary-links
//	jQuery("#primary-links").prepend(jQuery("#header"));

/* show the correct row of thumbnails and hide the others */
  var _showSubmenu = function(_obj) {
//  do nothing if we're currently active
    if ( jQuery(_obj).hasClass("active") ) {
      return false;
    }
//  hide any existing menus
    jQuery(".menu.secondary").not(_obj).removeClass("active").animate(menu_opts.secondary.hide, "fast", "swing");

//  if primary is active set bottom first
    if ( jQuery("div.menu.primary.active").size() ) {
      jQuery(_obj).css("bottom", menu_height + menu_border);
    }
//  show the correct one
    jQuery(_obj).addClass("active").animate(menu_opts.secondary.show, "slow", "swing");
  }


/* show a particular slide, or the next slide if no slide is specified */
  var _showSlide = function(_next_slide) {
    var _active_slide = jQuery('#gallery ul li.active');
    if ( _active_slide.length == 0 ) _active_slide = jQuery('#gallery ul li:last');
    if ( ! _next_slide ) {
      _next_slide =  _active_slide.next("li").length ? _active_slide.next("li") : jQuery('#gallery ul li:first');
    }
//  if we're looking at the next slide then do nothing
    if ( _next_slide.hasClass("active") )
      return true;

//  if the previous slide is still running then don't do anything
    if ( _active_slide.is(':animated') ) {
      return false;
    }

//  if required adjust the image position
    var _mt = 0;
    if ( _next_slide.hasClass("crop") ) {
//  	var _imageSize = function(img, bg_container, menu_opts) {
      settings = {fill:true, centre:true};
      _imageSize(_next_slide.find("img"), _next_slide, settings)
      /*
  //  top margin should be negative 1/2 ( height of image - height of screen )
      _wh = jQuery('#gallery').height();
      _h = _next_slide.find("img")[0].height;
      _mt = -(_h-_wh)/2;
      alert(jQuery(window).height() + " " + _wh + " " + _h + " " + _mt);

//      alert("height " + _h + " window " + _wh + " margin " + _mt)
      _next_slide.children("a").css({marginTop : _mt, height : _h});
      */
    }
// pause any active videos
    pauseVideo(_active_slide);
    _active_slide.addClass('last-active');
    _updateSlideInfo(_next_slide);

    // If its a video set the size.
    if ( _next_slide.hasClass('type-video') ) {
      var _h = jQuery('body').height();
      var _w = jQuery('body').width();
      _next_slide
        .find('.media-vimeo-preview-wrapper').width(_w).height(_h)
        .find('iframe').width(_w).height('100%')
        ;

    }
    _next_slide.css({opacity: 0.0}).addClass('active').animate(
      {opacity: 1.0},
      transition_speed,
      function() {
        _active_slide.removeClass('active last-active');
      }
    );
  }

/*
  start the slideshow and trigger the first image update
  */
  var _startSlideshow = function() {
//  update the info area with the correct information
    _updateSlideInfo(jQuery("#gallery li.active"));
    jQuery("body").addClass("slideshow-running").everyTime(slide_speed, "slideshow", function() {
      _showSlide();
    });
  }
  
  
/* 
  update the title area and set the active class on the current thumbnail 
  */
  var _updateSlideInfo = function(_obj) {
//  update the correct thumbnail
    _src = jQuery(_obj).find("img").attr("src");
    jQuery(".secondary a.active").removeClass("active");
    jQuery(".secondary a[href=" + _src + "]").addClass("active");

    selector = null;
//  front page - update the header with the title of the work shown
    if ( jQuery("body.front").size() ) {
        var gallery_info = jQuery(_obj).find('.detail-info').html();
        selector = "#slidecontent";
    } else {
//  else project pages -- update caption
        gallery_info = jQuery(_obj).find("a").attr('title');
        selector = "#sidebar-container .title.caption";
    }
    if(gallery_info != ""){
      jQuery(selector).fadeOut(transition_speed, function() {
        jQuery(selector).html(gallery_info).fadeIn(transition_speed);
      });
    }
  }
  

  var pauseVideo = function(slide) {
    var iframe = jQuery("iframe", slide);
    if ( iframe.size() ) {
      var player = $f(iframe[0]);
      player.api("pause");
    }
  }

 
  jQuery('.type-video iframe').each(function(){
// move the id to the iframe (not the div)
    id = jQuery(this).closest("div").attr("id");
    jQuery(this).attr("id", id);
    jQuery(this).closest("div").removeAttr(id);
  //  $f(this).addEvent('play', function(id) {alert(id)});
    $f(this).addEvent('ready', function(id) {
      var player = jQuery("iframe#" + id)[0];
      $f(player).addEvent('play', function(id) {
        _stopSlideshow();
        _hideMenus();
        _hideSidebar(); 
      }); 
      $f(player).addEvent('pause', function(id) {
        _showMenus();
        _showSidebar();
      });
    });
  });

  var _stopSlideshow = function() {
    jQuery("body").removeClass("slideshow-running").stopTime("slideshow");
  }


  var _toggleSlideshow = function() {
    if ( jQuery("body").hasClass("slideshow-running") ) 
      _stopSlideshow();
    else {
      _showSlide();
      _startSlideshow();
    }
  }


/* initialisation */
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
      if ( jQuery(this).hasClass("active") )
        return
//  pause the slideshow
      _stopSlideshow();
      _rel = jQuery(this).parent("li").attr("rel");
//      _src = jQuery(this).attr("href");      
//      next_slide = jQuery("#gallery img[src=" + _src + "]").parents("li");
      next_slide = jQuery("#" + _rel);
      if ( next_slide.length ) {
        _showSlide(next_slide);
      }      
    });
	}
	
	
//  nicemenus
	primary = "div.primary";
//  system menus
	primary_selector = "#block-system-main-menu div.content";
	
	jQuery("#secondary-links li a img").each(function(){
//		jQuery(this).parent().css({backgroundImage: "url(" + jQuery(this).attr("src") + ")"});
//		jQuery(this).hide();
	});
    
//    var length = jQuery('#gallery ul li').length;

/* reveal the concealled menu */
  jQuery("body").prepend("<a class='navigation show' href='javascript:void(0);'>Show menu</a>");
  jQuery("a.navigation.show").hover(function(event) {
    _showMenus();
  }, function(event) {});

/* if we have a gallery set up a slideshow and run it */
    if(jQuery('#gallery ul li').size() > 1) {
      _startSlideshow();

//  create some buttons if we don't have them already
      jQuery("#gallery ul").append("<a class='navigation next' href='javascript:void(0);'>Next</a><a class='navigation previous' href='javascript:void(0);'>Previous</a>");
      
//  listen for clicks on the navigation arrows
      jQuery("a.navigation").click(function(event) {
        if ( jQuery(this).hasClass("next") ) {
          _stopSlideshow();
          _showSlide();
        } else if ( jQuery(this).hasClass("previous") ) {
          _stopSlideshow();
          var _active_slide = jQuery('#gallery ul li.active');
          _previous_slide = _active_slide.prev("li").length ? _active_slide.prev("li") : jQuery('#gallery ul li:last');
          _showSlide(_previous_slide);
        }
      });
    } else {
//  interrupt clicks on gallery items and do nothing
      jQuery("#gallery ul li a").click(function(e) {e.preventDefault(); return false;});
    }

//  use keyboard arrows to navigate the slideshow
			jQuery(document).keydown(function(event) {
//  ignore keycommands if modifier keys are pressed
			  if ( event.ctrlKey || event.shiftKey || event.altKey || event.metaKey ) {
          return true;
			  }
			  
				if ( event.which == 37 ) { // left
					event.preventDefault()
					jQuery(".previous").click();
				} else if ( event.which == 39 ) { // right
					event.preventDefault()
					jQuery(".next").click();
				} else if ( event.which == 32 ) { // space
				  _toggleSlideshow();
				} else if ( event.which == 27 ) { // esc
				  jQuery("div.toggle a").click();
				} else {
//						alert(event.which)
				}
			});

    
/*
	handle the secondary menu exits
*/
//refactor with intent or timer
	jQuery(".secondary").hover(function(event){
	},function(event){
// only exit if we're exiting up
			if ( event.pageY < jQuery(this).offset().top && jQuery(this).hasClass("active") ) {
        _hideMenus();
	    }
      jQuery("#bottom").show();
	});


/* show submenu */
/*
	jQuery(".primary ul ul").hover(function(){
//	close all the others
		jQuery(this).parent().addClass("active").siblings().removeClass("active").find("ul").hide();
		jQuery(this).show();
	}, function(event) {
//	if we are not exiting up then close it up
		if ( event.pageY > jQuery(primary).offset().top ) {
			jQuery(this).hide().parent().removeClass("active");
		} else {
     jQuery(this).parent().find("a").show();
		}
	});
*/

/*
	reveal the correct secondary menu
*/
	jQuery(primary_selector + " ul li a").click(function(e){
        var taxnomy_name_list = jQuery(this).attr("href");
        var taxnomy_name = taxnomy_name_list.split("/");
        var current_name = taxnomy_name[taxnomy_name.length - 1];

        submenu = jQuery('#works-'+ current_name);
        if ( submenu.size() ) {
            e.preventDefault();
            _showSubmenu(submenu);
            return false;
        } else {
            return true;
        }
//        jQuery(".secondary.active").removeClass("active").animate({height:0, opacity:0}, "fast", "swing");    
//      jQuery('#works-'+ current_name).addClass("active").animate({height:95, bottom:95, opacity:1}, "slow", "swing");    
	});

  
/* show titles on hover over the thumbnails */
  jQuery(".secondary ul li a").hover(function(event){
    _src = jQuery(this).attr("href");
    _title = jQuery(this).attr("title");
    _date =  jQuery(this).attr("data-date");
//    alert(_title)
//    _obj = jQuery("#gallery").find("li > a[href=" + _src + "]");
//    var gallery_info = jQuery(_obj).parent().find('.detail-info').html();
//    var _title = gal
    if(_title != "") {
      jQuery('#slidecontent h2').html(_title);
      jQuery('#slidecontent div.meta').html(_date);
    }  
  });

/*
	close - show and hide the sidebar content 
*/
	jQuery(".toggle a").toggle(function() {
	  if ( ! jQuery("body").hasClass("front") ) {
      var target ='#sidebar';
//		    jQuery(target).slideToggle("slow");
      jQuery(target).hide('slide',{direction:'right'}, 1000);
  //      jQuery(target).animate({width:'toggle'},500)
//          jQuery(target).hide('slide',{direction:'right'},1000);
//          jQuery(target).animate({left:'toggle'},500)
    }
    _hideMenus();
        
	},
    function() {
	    if ( ! jQuery("body").hasClass("front") ) {
        var target ='#sidebar';
        jQuery(target).show('slide',{direction:'right'},500);
      }
//  jQuery(target).fadeIn(500);
//        jQuery(target).slideToggle("slow");
//        jQuery(target).animate({width:'toggle'},500)
        _showMenus();
    });
    
    var _hideSidebar = function() {
      jQuery('#sidebar').hide('slide',{direction:'right'}, 1000);
    }	

    var _showSidebar = function() {
      jQuery('#sidebar').show('slide',{direction:'right'}, 500);
    }
	
//  using opacity causes IE8 to render solid pngs 	
	var _hideMenus = function() {
    jQuery("div.secondary").animate(menu_opts.secondary.hide, "slow", "swing").removeClass("active");
    jQuery(primary_selector).animate(menu_opts.primary.hide, "slow", "swing").removeClass("active");
//  front page title
//  project page titles
    jQuery("#slidecontent, #sidebar-container div.title").animate({bottom:0}, "slow");
	}
	
	var _showMenus = function() {
    jQuery(primary_selector).animate(menu_opts.primary.show, "slow", "swing", function(){
      jQuery(this).addClass("active");
    });	  
    jQuery("#slidecontent, #sidebar-container div.title").animate({bottom:190, opacity:1}, "slow");
    _showSubmenu(jQuery("div.secondary.default, div.secondary#header"));
	}
	
	
	var _imageSize = function(img, bg_container, settings) {
	  //  get the images parent ( this gives us our size )
				img = jQuery(img);
//				alert(img.width())
	//			alert(img.height())
				if ( ! bg_container )
					bg_container = img.parents('div.full-item');
//	get the original image sizes if we don't have them already
        if ( ! jQuery(img).attr("data-ratio") ) {
          jQuery("<img/>") // Make in memory copy of image to avoid css issues
            .attr("src", jQuery(img).attr("src"))
            .load(function() {
          //    jQuery.data(img, '_w', this.width);    // Note: $(this).width() will not
            //  jQuery.data(img, '_h', this.height);  // work for in memory images.
              jQuery(img).attr("data-ratio", this.width/this.height);
              _imageSize(img, bg_container, settings);
            });
          return; //  as we are recalling imagesize onload
        }

				_pw = bg_container.width();
				_ph = bg_container.height();
				
				_pratio = _pw/_ph;
				_iratio = jQuery(img).attr("data-ratio");
				
//				alert("_pratio " + _pratio + " _iratio " + _iratio)
//	are we scaling to fit or fill ?
				if ( settings.fill ) {
					if ( _pratio > _iratio ) {
						_w = _pw;
						_h = _pw / _iratio;
					} else {
						_w = _ph * _iratio;
						_h = _ph;					
					}
				} else {
					if ( _pratio < _iratio ) {
						_w = _pw;
						_h = _pw / _iratio;
					} else {
						_w = _ph * _iratio;
						_h = _ph;					
					}				
				}
				
				if ( settings.centre ) {
					_ml = (_pw - _w) / 2;
					_mt = (_ph - _h ) / 2;
					
					img.css('margin-top', _mt).css('margin-left', _ml);
				}
				
//				alert('w ' + _w + ' h ' + _h);
//				alert('w ' + _pw + ' h ' + _ph);
//				alert(bg_container.attr('id'))
				img.css('width',_w).css('height',_h);	  
	}


	var _recropImages = function() {
	  jQuery("#gallery .crop.active").each(function() {
      settings = {fill:true, centre:true};
      _imageSize(jQuery(this).find("img"), jQuery(this), settings)
	  });
	};

	
	var _scaleSidebar = function() {
  //  detect the available space and position the scrollbar div
    _h = jQuery("#sidebar").height();
    jQuery("#sidebar div.body .viewport, #sidebar div.body").css("height","auto")
    _vph = jQuery("#sidebar div.body .overview").height();
//    alert(_vph)

  //  alert(_h);
    _b = jQuery("#sidebar .body").css("bottom");
  //  arbitrary top margin determined by murray
    _mt = 95;
    _bh = (parseInt(_h) - parseInt(_b) - _mt);
    if ( _bh < 95 )
      _bh = 95;
    else if ( _bh > _vph )
      _bh = _vph;
      
    jQuery("#sidebar div.body, #sidebar div.body .viewport").css({"max-height":"none", "height": _bh});

  	jQuery('#sidebar div.body').tinyscrollbar();
  }


//  resize cropped images on window resize
	jQuery(window).resize(function() {
	  _recropImages();
	  _scaleSidebar();
	});
	
//  crop them on load too
  _recropImages();
  _scaleSidebar();
		
	
});

