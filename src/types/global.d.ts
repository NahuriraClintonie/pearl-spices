/**
 * Type definitions for WordPress data structures passed from PHP to JavaScript.
 * These types reflect the custom fields and data structures defined in the WordPress backend
 * and made available through wp_localize_script.
 */

/**
 * Menu Details Pod Type Definition
 *
 * Represents detailed information about menu items.
 * Maps to the 'menu_details' pod structure in WordPress.
 */
interface MenuDetails {
  menu_description: string; // WYSIWYG Editor content
  menu_ingredients: string[]; // Repeatable plain text field
  nutrition_facts: string; // WYSIWYG Editor content
  prep_time: number; // Preparation time in minutes
  menu_price: number;
}

interface MenuImage {
  guid: string;
}
/**
 * Menus Pod Type Definition
 *
 * Represents menu items available in restaurants.
 * Maps to the 'menus' pod structure in WordPress.
 */
interface Menu {
  ID: number; // Unique identifier
  menu_name: string; // Menu item name
  menu_image: MenuImage; // URL to menu image
  menu_price: number;
  menu_details: MenuDetails[]; // Relationship to Menu Details pod
}

/**
 * Restaurant Pod Type Definition
 *
 * Represents a restaurant entity with its associated data.
 * Maps to the 'restaurant' pod structure in WordPress.
 */
interface Restaurant {
  id: number; // Unique identifier
  restaurant_name: string; // Restaurant name
  // restaurant_image: string;
  restaurant_image: {
    guid: string;
  }; // URL to restaurant image
  restaurant_rating: number; // Rating on 1-5 scale
  restaurant_countries: string | string[]; // Multiple selected countries
  menus: Menu[]; // Relationship to Menus pod
  permalink: string; // URL to the restaurant page
}

/**
 * Page Pod Type Definition
 *
 * Represents the structure of a page entity with custom fields.
 * Maps to the extended 'page' pod structure in WordPress.
 */
interface PageData {
  page_name: string; // Page name field
  restaurants?: Restaurant[]; // Relationship to Restaurants pod
  page_banners: string[]; // Multiple banner image URLs
  page_description: string; // WYSIWYG Editor content
  restaurant?: Restaurant;
}

/**
 * Global Window Interface Extension
 *
 * Extends the Window interface to include WordPress data made available
 * through wp_localize_script in functions.php
 */
interface Window {
  WPData: {
    postId: number; // Current page/post ID
    pageData?: {
      // Page data including custom fields
      restaurants?: Restaurant[];
      restaurant?: Restaurant;
      // restaurant_menus?: Menu[];
    };
    restaurant?: Restaurant;
  };
}
