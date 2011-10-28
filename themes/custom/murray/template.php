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
  
  if (isset($variables['node']) && ($variables['node']->type == 'project')) {
      
      global $base_url,$user;
      
      
      $file_direcoty_path = '/' . file_stream_wrapper_get_instance_by_uri('public://')->getDirectoryPath();
    
      $node = $variables['node'];
    
      $node_url = url("node/".$node->nid);
      $node_title = $node->title;
      
      $created_date = date("Y/m/d", $node->created);
    
      $body = "";
      foreach($node->body as $key=>$value) {   
        $body .= $node->body[$key][0]['safe_value'];
      }
      
      $download = "<ul>";
      foreach($node->field_downloads as $value){
        foreach($value as $item){
            $fname = isset($item['description']) ? $item['description'] : $item['filename'];
            $target_path = $base_url . $file_direcoty_path;
//            $url = str_replace("public://", $target_path, $item['uri']);
			$url = file_create_url($item['uri']);
			$mimetype = str_replace("/", "-", $item['filemime']);
            
            $download .= '<li><a href="' . $url . '" class="download ' . $mimetype . '">' . $fname . '</a></li>';
        }   
        
      }
      $download .="</ul>";
      
      
      $project_property = "<dl>";
      
      $property_data = db_query("SELECT DISTINCT node.nid AS nid, field_data_field_property.delta AS field_data_field_property_delta, field_data_field_property.language AS field_data_field_property_language, field_data_field_property.bundle AS field_data_field_property_bundle, field_data_field_property.field_property_value AS field_data_field_property_field_property_value, node.created AS node_created, 'node' AS field_data_field_property_node_entity_type
                FROM
                node node
                LEFT JOIN field_data_field_property  field_data_field_property ON node.nid = field_data_field_property.entity_id AND (field_data_field_property.entity_type = 'node' AND field_data_field_property.deleted = '0')
                WHERE (( (node.status = '1') AND (node.type IN  ('project')) AND (node.nid = :nid ) ))
                ORDER BY node_created DESC",array(
                ':nid' => $node->nid,
                ));
                
      foreach($property_data as $p_item){
          
          $bundle = $p_item->field_data_field_property_bundle;
          $property_value = $p_item->field_data_field_property_field_property_value;
          
          $property_edit_url = url('field-collection/field-property/' . $property_value . '/edit?destination=node/' . $node->nid);
          
          
          
          
          
          $result = db_query("Select property_key.field_property_key_tid as id, term_data.name, property_value.field_property_value_value as value From 
          (field_data_field_property_key  property_key
          Inner Join field_data_field_property_value property_value On property_key.entity_id = property_value.entity_id) Inner Join taxonomy_term_data term_data on property_key.field_property_key_tid = term_data.tid
          Where property_key.entity_id = :id ", array(
          ':id' => $property_value,
          ));
          
          
          foreach($result as $item) {
              $project_property .= "<dt>" . $item->name . "</dt><dd>". strip_tags($item->value,'<a>') . "</dd>";
              if($user->uid != 0){
                  
                if(in_array('editor user',$user->roles) || in_array('administrator',$user->roles) ) {
                    $project_property .= "<dd><a href='" . $property_edit_url . "' class='edit_property'>Edit</a></dd>";
                }
              }
          }
          
      }
      $project_property .= "</dl>";
      if($project_property == "<dl></dl>") $project_property = "";
      
      $link_info = "";
      foreach($node->field_link as $value){
        foreach($value as $item){
            $url = $item['url'];
            $link_name = $item['title'];
            $link_info .= '<a href="' . $url . '" class="link">' . $link_name . '</a>'; 
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
        
      $first_image = array();
      $index = 0;
      foreach($media as $value){
          foreach($value as $info){
              //Get File info.
            $file = $info ['file'];
            
            $caption = $file->field_media_caption;
            
            $caption_value = "";
            
            if(!empty($caption)){
                foreach($caption as $item)
                    $caption_value = $item[0]['value'];
            }
            
            
            
            $index++;
            
            
            $style_thumbnail = image_style_load('large');
            image_style_create_derivative($style_thumbnail, $file->uri, file_default_scheme() . '://styles/large/public/' . $file->filename);
            if($index == 1)
                $media_info .= '<li class="active"><a href="'. url("node/".$node->nid) .'" title="'. $caption_value . '"><img src="' . $base_url . $file_direcoty_path .'/styles/large/public/' . $file->filename . '" title="'. $caption_value . '" /></a></li>';
            else
                $media_info .= '<li ><a href="'. url("node/".$node->nid) .'" title="'. $caption_value . '"><img src="' . $base_url . $file_direcoty_path . '/styles/large/public/' . $file->filename . '" title="'. $caption_value . '" /></li>';
            
          }
     }
     $media_info .= "</ul>";
     
     
     
     
     if($media_info == "<ul></ul>") 
        $media_info = "";
        
    
    $variables['media_info'] = $media_info;
    $variables['node_url'] = $node_url;
    $variables['node_title'] = $node_title;
    $variables['created_date'] = $created_date;
    $variables['body'] = $body;
    $variables['download'] = $download;
    $variables['project_property'] = $project_property;
    $variables['link_info'] = $link_info;
    $variables['date_info'] = $date_info;
        
    $variables['theme_hook_suggestions'][] = 'page__'. str_replace('_', '--', $variables['node']->type);
  }
  else if (isset($variables['node']) && ($variables['node']->type == 'page')) {
      
      global $base_url;
      
      $file_direcoty_path = '/' . file_stream_wrapper_get_instance_by_uri('public://')->getDirectoryPath();
    
      $node = $variables['node'];
    
      $node_url = url("node/".$node->nid);
      $node_title = $node->title;
      
      $created_date = date("Y/m/d", $node->created);
    
      $body = "";
      foreach($node->body as $key=>$value) {   
        $body .= $node->body[$key][0]['safe_value'];
      }
      
      $download = "<ul>";
      foreach($node->field_downloads as $value){
        foreach($value as $item){
            $fname = $item['filename'];
            $target_path = $base_url . $file_direcoty_path;
            $url = str_replace("public://", $target_path, $item['uri']);    
            
            $download .= '<li><a href="' . $url . '" class="download">' . $fname . '</a></li>';
        }   
        
      }
      $download .="</ul>";
      
      $variables['node_url'] = $node_url;
      $variables['node_title'] = $node_title;
      $variables['created_date'] = $created_date;
      $variables['body'] = $body;
      $variables['download'] = $download;
      
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
