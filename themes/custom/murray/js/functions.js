function slideSwitch() {
        var $active = jQuery('#gallery ul li.active');
        
        var gallery_info = jQuery('#gallery ul li.active .detail-info').html();
        if(gallery_info != ""){
            jQuery('#slidecontent').html(gallery_info);
        }
        
        

        if ( $active.length == 0 ) $active = jQuery('#gallery ul li:last');

        // use this to pull the images in the order they appear in the markup
        var $next =  $active.next().length ? $active.next()
            : jQuery('#gallery ul li:first');

        // uncomment the 3 lines below to pull the images in random order
        
        // var $sibs  = $active.siblings();
        // var rndNum = Math.floor(Math.random() * $sibs.length );
        // var $next  = $( $sibs[ rndNum ] );


        $active.addClass('last-active');

        $next.css({opacity: 0.0})
            .addClass('active')
            .animate({opacity: 1.0}, 1000, function() {
                $active.removeClass('active last-active');
            });
    }
    
jQuery(document).ready(function(){
//move header into primary-links
//	jQuery("#primary-links").prepend(jQuery("#header"));

	if ( jQuery("body").hasClass("front") ) {
		secondary = "#header";
	} else {
		secondary = "#secondary-links";
	}
	
	primary = ".primary";
	
	jQuery("#secondary-links li a img").each(function(){
//		jQuery(this).parent().css({backgroundImage: "url(" + jQuery(this).attr("src") + ")"});
//		jQuery(this).hide();
	});
    
    
     setInterval( "slideSwitch()", 5000 );
     
     jQuery('div.secondary ul').jcarousel({
         scroll:12       
     });
     
     
     

    

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
		jQuery(secondary+","+primary).stop();					
	},function(event){
		jQuery(".secondary").animate({height:0, opacity:0}, "slow", "swing", function() {
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
			jQuery(".secondary").animate({height:0, opacity:0}, "slow", "swing");
            
		} else {
            //alert('me');
            //jQuery(this).parent().find("a").animate({opacity:1});
			
		}
	});

/*
	reveal the correct secondary menu
*/
	jQuery(".primary ul ul li a").click(function(){
        
        var taxnomy_name_list = jQuery(this).attr("href");
        
        var taxnomy_name = taxnomy_name_list.split("/");
        var current_name = taxnomy_name[taxnomy_name.length - 1];
        
        jQuery(".secondary").animate({height:0, opacity:0}, "slow", "swing");    
        jQuery('#works-'+ current_name).animate({height:94, bottom:95, opacity:1}, "slow", "swing");    
        
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

