<?php
/**
 * @file
 * Contains theme override functions and preprocess functions for the theme.
 *
 * ABOUT THE TEMPLATE.PHP FILE
 *
 *   The template.php file is one of the most useful files when creating or
 *   modifying Drupal themes. You can modify or override Drupal's theme
 *   functions, intercept or make additional variables available to your theme,
 *   and create custom PHP logic. For more information, please visit the Theme
 *   Developer's Guide on Drupal.org: http://drupal.org/theme-guide
 *
 * OVERRIDING THEME FUNCTIONS
 *
 *   The Drupal theme system uses special theme functions to generate HTML
 *   output automatically. Often we wish to customize this HTML output. To do
 *   this, we have to override the theme function. You have to first find the
 *   theme function that generates the output, and then "catch" it and modify it
 *   here. The easiest way to do it is to copy the original function in its
 *   entirety and paste it here, changing the prefix from theme_ to STARTERKIT_.
 *   For example:
 *
 *     original: theme_breadcrumb()
 *     theme override: STARTERKIT_breadcrumb()
 *
 *   where STARTERKIT is the name of your sub-theme. For example, the
 *   zen_classic theme would define a zen_classic_breadcrumb() function.
 *
 *   If you would like to override either of the two theme functions used in Zen
 *   core, you should first look at how Zen core implements those functions:
 *     theme_breadcrumbs()      in zen/template.php
 *     theme_menu_local_tasks() in zen/template.php
 *
 *   For more information, please visit the Theme Developer's Guide on
 *   Drupal.org: http://drupal.org/node/173880
 *
 * CREATE OR MODIFY VARIABLES FOR YOUR THEME
 *
 *   Each tpl.php template file has several variables which hold various pieces
 *   of content. You can modify those variables (or add new ones) before they
 *   are used in the template files by using preprocess functions.
 *
 *   This makes THEME_preprocess_HOOK() functions the most powerful functions
 *   available to themers.
 *
 *   It works by having one preprocess function for each template file or its
 *   derivatives (called template suggestions). For example:
 *     THEME_preprocess_page    alters the variables for page.tpl.php
 *     THEME_preprocess_node    alters the variables for node.tpl.php or
 *                              for node-forum.tpl.php
 *     THEME_preprocess_comment alters the variables for comment.tpl.php
 *     THEME_preprocess_block   alters the variables for block.tpl.php
 *
 *   For more information on preprocess functions and template suggestions,
 *   please visit the Theme Developer's Guide on Drupal.org:
 *   http://drupal.org/node/223440
 *   and http://drupal.org/node/190815#template-suggestions
 */


/**
 * Override or insert variables into the html templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("html" in this case.)
 */
/* -- Delete this line if you want to use this function
function STARTERKIT_preprocess_html(&$variables, $hook) {
  $variables['sample_variable'] = t('Lorem ipsum.');

  // The body tag's classes are controlled by the $classes_array variable. To
  // remove a class from $classes_array, use array_diff().
  //$variables['classes_array'] = array_diff($variables['classes_array'], array('class-to-remove'));
}
// */

/**
 * Override or insert variables into the page templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("page" in this case.)
 */

function murray_preprocess_page(&$variables, $hook) {
  if (
    isset($variables['node']) && 
    (
      $variables['node']->type == 'project'
      ||
      $variables['node']->type == 'page'
    )
  ) {
      
      global $base_url,$user;
      
      $file_directory_path = '/' . file_stream_wrapper_get_instance_by_uri('public://')->getDirectoryPath();
    
      $node = $variables['node'];
      
      $node_url = url("node/".$node->nid);
      $node_title = $node->title;
      
      $created_date = date("Y/m/d", $node->created);
    
      $body = "";
      foreach($node->body as $key=>$value) {   
        $body .= $node->body[$key][0]['safe_value'];
      }


        if ( count($node->field_downloads) ) {
        $download = "<ul>";
        foreach($node->field_downloads as $value){
          foreach ($value as $item) {
              $file_title = ! empty($item['description']) ? $item['description'] : $item['filename'];
              $attributes = array(
                'title'=>$file_title,
                'class'=>array('download', str_replace("/", "-", $item['filemime'])),
                'target'=>'_BLANK',
              );
              $link = l($file_title, file_create_url($item['uri']), array('attributes'=>$attributes));
              $download .= "<li>$link</li>";
          }   
        
        }
        $download .="</ul>";
      }

      $project_property = "<dl>";

      $property_data = db_query("SELECT DISTINCT node.nid AS nid, field_data_field_property.delta AS field_data_field_property_delta, field_data_field_property.language AS field_data_field_property_language, field_data_field_property.bundle AS field_data_field_property_bundle, field_data_field_property.field_property_value AS field_data_field_property_field_property_value, node.created AS node_created, 'node' AS field_data_field_property_node_entity_type
                FROM
                node node
                LEFT JOIN field_data_field_property  field_data_field_property ON node.nid = field_data_field_property.entity_id AND (field_data_field_property.entity_type = 'node' AND field_data_field_property.deleted = '0')
                WHERE (( (node.status = '1') AND (node.type IN  ('project')) AND (node.nid = :nid ) ))
                ORDER BY node_created DESC",array(
                ':nid' => $node->nid,
                ));

      if(!empty($property_data)) {
          foreach($property_data as $p_item){
          
              $bundle = $p_item->field_data_field_property_bundle;
              $property_value = $p_item->field_data_field_property_field_property_value;
              
              $property_add_url = $base_url.'/field-collection/field-property/add/node/' . $node->nid . '?destination=node/' . $node->nid;
              $property_edit_url = $base_url.'/field-collection/field-property/' . $property_value . '/edit?destination=node/' . $node->nid;
              $property_delete_url = $base_url.'/field-collection/field-property/' . $property_value . '/delete?destination=node/' . $node->nid;
              
              $result = db_query("Select property_key.field_property_key_tid as id, term_data.name, property_value.field_property_value_value as value From 
              (field_data_field_property_key  property_key
              Inner Join field_data_field_property_value property_value On property_key.entity_id = property_value.entity_id) Inner Join taxonomy_term_data term_data on property_key.field_property_key_tid = term_data.tid
              Where property_key.entity_id = :id ", array(
              ':id' => $property_value,
              ));
              

              foreach($result as $item) {
                  $project_property .= "<dt>" . $item->name . "</dt><dd class='item-value'>" . htmltrim(strip_tags($item->value,'<a><strong><em>')) . "</dd>";
                  if($user->uid != 0) {
                    if(in_array('editor',$user->roles) || in_array('administrator',$user->roles) ) {
                        $project_property .= "<dd class='item-edit'><a href='" . $property_edit_url . "' class='edit_property'>Edit</a>";
                        $project_property .= "<a href='" . $property_delete_url . "' class='edit_property delete_property'>Delete</a></dd>";
                    }
                  }
              }
          }          
      }
      
      if(in_array('editor',$user->roles) || in_array('administrator',$user->roles) ) {
        $project_property .= "<dt>&nbsp;</dt><dd>&nbsp;</dd><dd class='item-edit'><a href='" . $property_add_url . "' class='edit_property add_property'>Add</a></dd>";
      }              
        
      
      $project_property .= "</dl>";
      
      if($project_property == "<dl></dl>") {
          if(in_array('editor',$user->roles) || in_array('administrator',$user->roles) ) {
                $property_add_url = $base_url.'/field-collection/field-property/add/node/' . $node->nid . '?destination=node/' . $node->nid; 
                $project_property = "<dl><dd class='item-edit'><a href='" . $property_add_url . "' class='edit_property'>Add</a></dd></dl>";
          }else{
                $project_property = "";
          }
      }
      
      $link_info = "";
      foreach($node->field_link as $value){
        foreach($value as $item){
          $link_title = $item['title'];
          $attributes = array(
            'title'=>$file_title,
            'class'=>array('link'),
            'target'=>'_BLANK',
          );
          $link_info .= l($link_title, $item['url'], array('attributes'=>$attributes));
        }
      }

      $date_info ="";
      foreach($node->field_date as $value){
        foreach($value as $item){
            $date = $item['value'];
            $date_info .= $date; 
        }   
        
      }
      
      $media = $node->field_media;
      
      $media_info = "<ul>";
      $thumb_info = "<ul>";
        
      $first_image = array();
      $index = 0;
      error_log(var_export($media, TRUE));
      foreach($media as $value){
          foreach($value as $info){
              //Get File info.
            $file = $info['file'];
            $classes = array();

            list($filetype, $filesubtype) = explode("/", $file->filemime);
//  crop is available for images not video
            if ( $filetype == 'image' ) {
              if ( $file->field_media_crop['und'][0]['value'] == 1 ) {
                $classes[] = 'crop';
              }
            }
            $classes[] = "type-$filetype";
            $classes[] = "type-$filesubtype";
 
//  caption is an array, empty on vimeo
            $caption = $file->field_media_caption;
            
            $caption_value = "";
            
            if(!empty($caption)){
                foreach($caption as $item)
                    $caption_value = $item[0]['value'];
            }

            $index++;
            if ( $index == 1 ) {
              $classes[] = "active";
            }
            
            if ( $filetype == "image" ) {
              $large_file_src = image_style_url("large", $file->uri);
              $large_file = theme_image(array("path"=>$large_file_src, "alt"=>$caption_value)); 
              $thumbnail_file_src = image_style_url("square_thumbnail", $file->uri);
            } else if ( $filesubtype == 'vimeo' ) {

//      'variables' => array('uri' => NULL, 'width' => NULL, 'height' => NULL, 'autoplay' => NULL, 'fullscreen' => NULL),
              $large_file = theme('media_vimeo_video', array('uri'=>$file->uri, 'width'=>'100%', 'height'=>'90%', 'autoplay'=>false, 'fullscreen'=>true));
		error_log(var_export($media, true));   
                $wrapper = file_stream_wrapper_get_instance_by_uri($file->uri);
                $thumbnail_file_src = $wrapper->getLocalThumbnailPath();
 		$thumbnail_file_src = image_style_url("square_thumbnail", $thumbnail_file_src);
            }
            error_log("thumbnail: " . $thumbnail_file_src);
            $tabs = "";
            if(in_array('editor',$user->roles) || in_array('administrator',$user->roles) ) {
              $tabs .= l("Edit", "file/" . $file->fid . "/edit", array("query"=>array("destination"=>current_path()), "attributes"=>array("class"=>array("edit"))));
//              $tabs .= "<a class='item-edit' href='" . $property_edit_url . "' class='edit_property'>Edit</a>";
            }
            $thumbnail_file = theme_image(array("path"=>$thumbnail_file_src, "alt"=>$caption_value)); 
            $media_info .= '<li class="' . implode(" ", $classes) . '"><a href="'. url("node/".$node->nid) .'" title="'. $caption_value . '">' . $large_file . '</a></li>';
		$thumb_info .= '<li class="default ' . implode(" ", $classes) . '">' . $tabs . '<a href="'. $base_url . $file_directory_path . '/styles/large/public/' . $file->filename .'" title="'. $caption_value . '">' . $thumbnail_file . '</a></li>';
            
          }
     }
     $media_info .= "</ul>";
     $thumb_info .= "</ul>";
     
     
     
     
     if($media_info == "<ul></ul>") 
        $media_info = "";
     
     if($thumb_info == "<ul></ul>") 
        $thumb_info = "";
     else{
        $thumb_info =  '<div id="project-media" class="menu secondary default">' . $thumb_info . '</div>';
     }
     
     
     
     $color_info ="";
      foreach($node->field_background as $value){
        foreach($value as $item){
            $color = $item['jquery_colorpicker'];
            $color_info .= $color; 
        }   
        
      }
        
    
    $variables['media_info'] = $media_info;
    $variables['thumb_info'] = $thumb_info;
    $variables['node_url'] = $node_url;
    $variables['node_title'] = $node_title;
    $variables['created_date'] = $created_date;
    $variables['body'] = $body;
    $variables['download'] = $download;
    $variables['project_property'] = $project_property;
    $variables['link_info'] = $link_info;
    $variables['date_info'] = $date_info;
    $variables['color_info'] = $color_info;
        
    $variables['theme_hook_suggestions'][] = 'page__'. str_replace('_', '--', $variables['node']->type);
  }
  else if (isset($variables['node']) && ($variables['node']->type == 'page')) {
      
      global $base_url;
      
      $file_directory_path = '/' . file_stream_wrapper_get_instance_by_uri('public://')->getDirectoryPath();
    
      $node = $variables['node'];
    
      $node_url = url("node/".$node->nid);
      $node_title = $node->title;
      
      $created_date = date("Y/m/d", $node->created);
    
      $body = "";
      foreach($node->body as $key=>$value) {   
        $body .= $node->body[$key][0]['safe_value'];
      }
      
        if ( count($node->field_downloads) ) {
        $download = "<ul>";
        foreach($node->field_downloads as $value){
          foreach($value as $item){
              $file_title = ! empty($item['description']) ? $item['description'] : $item['filename'];
              $attributes = array(
                'title'=>$file_title,
                'class'=>array('download', str_replace("/", "-", $item['filemime'])),
                'target'=>'_BLANK',
              );
              $link = l($file_title, file_create_url($item['uri']), array('attributes'=>$attributes));
              $download .= "<li>$link</li>";
          }   
        
        }
        $download .="</ul>";
        }
      
      
      $color_info ="";
      foreach($node->field_background as $value){
        foreach($value as $item){
            $color = $item['jquery_colorpicker'];
            $color_info .= $color; 
        }   
        
      }
        

      $variables['node_url'] = $node_url;
      $variables['node_title'] = $node_title;
      $variables['created_date'] = $created_date;
      $variables['body'] = $body;
      $variables['download'] = $download;
      $variables['color_info'] = $color_info;
      
      $variables['theme_hook_suggestions'][] = 'page__'. str_replace('_', '--', $variables['node']->type);
  }
  
  
     
  $variables['sample_variable'] = t('Lorem ipsum.');
}


/**
 * Override or insert variables into the node templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("node" in this case.)
 */
/* -- Delete this line if you want to use this function
function STARTERKIT_preprocess_node(&$variables, $hook) {
  $variables['sample_variable'] = t('Lorem ipsum.');

  // Optionally, run node-type-specific preprocess functions, like
  // STARTERKIT_preprocess_node_page() or STARTERKIT_preprocess_node_story().
  $function = __FUNCTION__ . '_' . $variables['node']->type;
  if (function_exists($function)) {
    $function($variables, $hook);
  }
}
// */

/**
 * Override or insert variables into the comment templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("comment" in this case.)
 */
/* -- Delete this line if you want to use this function
function STARTERKIT_preprocess_comment(&$variables, $hook) {
  $variables['sample_variable'] = t('Lorem ipsum.');
}
// */

/**
 * Override or insert variables into the block templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("block" in this case.)
 */
/* -- Delete this line if you want to use this function
function STARTERKIT_preprocess_block(&$variables, $hook) {
  // Add a count to all the blocks in the region.
  $variables['classes_array'][] = 'count-' . $variables['block_id'];
}
// */


function htmltrim($string) {
    $pattern = '(?:[ \t\n\r\x0B\x00\x{A0}\x{AD}\x{2000}-\x{200F}\x{201F}\x{202F}\x{3000}\x{FEFF}]|&nbsp;|<br\s*\/?>)+';
    return preg_replace('/^' . $pattern . '|' . $pattern . '$/u', '', $string);
}
