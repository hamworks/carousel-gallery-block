<?php
/**
 * Plugin Name:       Carousel Gallery Block
 * Description:
 * Version:           0.1.0
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Author:            mel_cha
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       carousel-gallery-block
 *
 * @package CarouselGalleryBlock
 * @version 0.1.0
 * @author mel_cha
 * @license GPL-2.0-or-later
 * @since 0.1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Define plugin constants

/** @var string Plugin version */
define( 'CGB_VERSION', '0.1.0' );
define( 'CGB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'CGB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'CGB_TEXT_DOMAIN', 'carousel-gallery-block' );

/**
 * Initialize the plugin
 */
function cgb_init() {
	// Register the block using block.json
	register_block_type( CGB_PLUGIN_DIR . 'build/' );
}
add_action( 'init', 'cgb_init' );

