<!-- template page page -->
<?php
/**
 * @file
 * Zen theme's implementation to display a single Drupal page.
 *
 * Available variables:
 *
 * General utility variables:
 * - $base_path: The base URL path of the Drupal installation. At the very
 *   least, this will always default to /.
 * - $directory: The directory the template is located in, e.g. modules/system
 *   or themes/garland.
 * - $is_front: TRUE if the current page is the front page.
 * - $logged_in: TRUE if the user is registered and signed in.
 * - $is_admin: TRUE if the user has permission to access administration pages.
 *
 * Site identity:
 * - $front_page: The URL of the front page. Use this instead of $base_path,
 *   when linking to the front page. This includes the language domain or
 *   prefix.
 * - $logo: The path to the logo image, as defined in theme configuration.
 * - $site_name: The name of the site, empty when display has been disabled
 *   in theme settings.
 * - $site_slogan: The slogan of the site, empty when display has been disabled
 *   in theme settings.
 *
 * Navigation:
 * - $main_menu (array): An array containing the Main menu links for the
 *   site, if they have been configured.
 * - $secondary_menu (array): An array containing the Secondary menu links for
 *   the site, if they have been configured.
 * - $secondary_menu_heading: The title of the menu used by the secondary links.
 * - $breadcrumb: The breadcrumb trail for the current page.
 *
 * Page content (in order of occurrence in the default page.tpl.php):
 * - $title_prefix (array): An array containing additional output populated by
 *   modules, intended to be displayed in front of the main title tag that
 *   appears in the template.
 * - $title: The page title, for use in the actual HTML content.
 * - $title_suffix (array): An array containing additional output populated by
 *   modules, intended to be displayed after the main title tag that appears in
 *   the template.
 * - $messages: HTML for status and error messages. Should be displayed
 *   prominently.
 * - $tabs (array): Tabs linking to any sub-pages beneath the current page
 *   (e.g., the view and edit tabs when displaying a node).
 * - $action_links (array): Actions local to the page, such as 'Add menu' on the
 *   menu administration interface.
 * - $feed_icons: A string of all feed icons for the current page.
 * - $node: The node object, if there is an automatically-loaded node
 *   associated with the page, and the node ID is the second argument
 *   in the page's path (e.g. node/12345 and node/12345/revisions, but not
 *   comment/reply/12345).
 *
 * Regions:
 * - $page['help']: Dynamic help text, mostly for admin pages.
 * - $page['highlighted']: Items for the highlighted content region.
 * - $page['content']: The main content of the current page.
 * - $page['sidebar_first']: Items for the first sidebar.
 * - $page['sidebar_second']: Items for the second sidebar.
 * - $page['header']: Items for the header region.
 * - $page['footer']: Items for the footer region.
 * - $page['bottom']: Items to appear at the bottom of the page below the footer.
 *
 * @see template_preprocess()
 * @see template_preprocess_page()
 * @see zen_preprocess_page()
 * @see template_process()
 */
?>

<?php
?>

<div id="gallery">
    <?php print $media_info; ?>
</div>

<div id="wrapper">
    
    <div id="sidebar-container" class="container_12">
        <div class="title">
            <h2><a href="<?php print $node_url; ?>" title="<?php print $node_title; ?>" description"<?php print $created_date; ?>"><?php print $node_title; ?></a></h2>
            <div class="meta"></div>
        </div>
        <div id="sidebar" class="">                
            <div class="body grid_4">
                <div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div>
                <div class="viewport">
                    <div class="overview">
                        <div class="content">
                        <?php if ($tabs = render($tabs)): ?>
                        <div class="tabs"><?php print $tabs; ?></div>
                      <?php endif; ?>
                            <?php print $body; ?></p>
                        </div>
                        <div class="media">
                            <?php print $download; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="clear">&nbsp;</div>
    </div>
    <div class="toggle"><a href="javascript:void(0)">Close</a></div>
   <?php print render($page['main_menu']); ?>
   <?php print render($page['thumbnail_collection']); ?>
</div>
<div id="bottom" style="display: block;">
    <?php print render($page['footer']); ?>
    <div class="copyright">
      <a href="<?php print $front_page; ?>">Home | Copyright <?=date("Y")?> Ainslie Murray</a>
    </div>
</div>

<?php
    if($color_info != ""){
        print '<script type="text/javascript">
        jQuery(document).ready(function(){
            jQuery("body").css("background-color","#' . $color_info . '");
        });
        </script>';    
    }
    
 ?>
        

