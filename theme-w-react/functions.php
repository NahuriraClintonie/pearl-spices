<?php
/**
 * Enqueue main theme stylesheet.
 */
function enqueue_theme_styles(): void
{
    wp_enqueue_style(
        "my-theme-style",
        get_template_directory_uri() . "/bundled/css/index.css",
        [],
        "1.0.0",
        "all"
    );
}
add_action("wp_enqueue_scripts", "enqueue_theme_styles");

/**
 * Enqueue our bundled React app and localize WP data (window.WPData).
 * Enqueues the React script and localizes page and related restaurant data for frontend use.
 *
 * This function:
 * - Retrieves the current page ID.
 * - Fetches custom field data associated with the page.
 * - Retrieves related restaurants, their corresponding menus, and menu details.
 * - Enqueues the React script from the theme directory.
 * - Localizes the structured page data to be accessible in the React frontend.
 * - Ensures the script is loaded as a module.
 */

function enqueue_react_script(): void
{
    $handle = "react-script";

    $script_name = "index"; // The main JS bundle file name (index.js)

    // Get the current page ID
    $post_id = get_the_ID();

    // Prepare the data we want to pass to React
    $page_data = [];

    // If single 'restaurant', fetch data for that restaurant only
    if (is_singular("restaurant")) {
        $page_data["restaurant"] = get_restaurant_data($post_id);
    } else {
        // Otherwise, it's likely a page that might have related restaurants
        $page_data = get_page_data($post_id);
        $page_data["restaurants"] = get_related_restaurants_data($post_id);
    }

    // Enqueue the bundled React JS
    wp_enqueue_script(
        $handle,
        get_template_directory_uri() . "/bundled/js/{$script_name}.js",
        [],
        null,
        true
    );

    // Localize script data to window.WPData
    wp_localize_script($handle, "WPData", [
        "postId" => $post_id,
        "pageData" => $page_data,
        "restaurant" => $page_data["restaurant"] ?? [],
    ]);

    // Make the script load as type="module"
    add_filter(
        "script_loader_tag",
        function ($tag, $current_handle, $src) use ($handle) {
            if ($current_handle === $handle) {
                return '<script type="module" src="' .
                    esc_url($src) .
                    '"></script>';
            }
            return $tag;
        },
        10,
        3
    );
}
add_action("wp_enqueue_scripts", "enqueue_react_script");

/**
 * Retrieve and sanitize custom fields for a given "page" via Pods.
 *
 This function:
  * - Initializes the 'page' pod object using the provided page ID.
  * - Checks if the pod exists.
  * - Iterates over all fields in the 'page' pod and retrieves their values.
  * - Specifically processes the 'page_banners' field, extracting URLs if available.
  * - Sanitizes the values of other fields before adding them to the returned array.
 * @param int $post_id  The current page/post ID.
 * @return array        An associative array of page data.
 */
function get_page_data(int $post_id): array
{
    // Initialize the 'page' pod object for the given post ID
    $page_pod = pods("page", $post_id);
    $page_data = [];

    // Check if the 'page' pod exists
    if ($page_pod->exists()) {
        $fields = $page_pod->fields();

        // Iterate through each field to process and retrieve values
        foreach ($fields as $field_name => $field_info) {
            if ($field_name === "page_banners") {
                // Example of handling multiple images
                $banners = $page_pod->field($field_name);
                $banner_urls = [];

                if (!empty($banners) && is_array($banners)) {
                    foreach ($banners as $banner) {
                        if (isset($banner["guid"])) {
                            $banner_urls[] = $banner["guid"];
                        }
                    }
                }
                // Store the extracted banner URLs in the result array
                $page_data[$field_name] = $banner_urls;
            } else {
                // Generic field
                // For other fields, sanitize and store their values
                $page_data[$field_name] = sanitize_text_field(
                    $page_pod->field($field_name)
                );
            }
        }
    }
    // Return the array of field names and their sanitized values
    return $page_data;
}

/**
 * If the "page" Pod has a 'restaurants' relationship field, retrieve them.
 *
 * This function:
 * - Fetches the 'restaurants' field from the 'page' pod for the specified page ID.
 * - Iterates through each restaurant linked to the page and retrieves its data.
 * - Uses the restaurant's ID to call another function to get detailed restaurant data.
 * - Only adds restaurant data to the result if valid data is returned.
 *
 * @param int $post_id  The current page ID.
 * @return array        An array of restaurant data.
 */
function get_related_restaurants_data(int $post_id): array
{
    //initialize the page pod for the specified page ID
    $page_pod = pods("page", $post_id);
    $restaurants_data = [];
    // retrieve the restaurants field from the page pod
    $restaurants = $page_pod->field("restaurants");

    // check if restaurants data are not empty and is an array
    if (!empty($restaurants) && is_array($restaurants)) {
        // iterate through each restaurant linked to the page
        foreach ($restaurants as $restaurant) {
            // check if the restaurant is an array
            if (is_array($restaurant)) {
                // Get the restaurant ID
                $restaurant_id = (int) $restaurant["ID"];
                // retrieve detailed restaurant data using the restaurant ID
                $restaurant_item = get_restaurant_data($restaurant_id);
                // if valid data is found, add it to the array
                if ($restaurant_item) {
                    $restaurants_data[] = $restaurant_item;
                }
            }
        }
    }
    // Return the array of restaurants data
    return $restaurants_data;
}

/**
 * Retrieves menu data for a specific restaurant.
 *
 * Fetches menu items associated with a given restaurant ID using the Pods Framework.
 * Handles both single and multiple relationships for menu details.  Includes data sanitization.
 *
 * @param int $restaurant_id The ID of the restaurant.
 * @return array An array of menu data.  Returns an empty array if:
 *               - The restaurant doesn't exist.
 *               - There are no associated menus.
 *               - There are errors retrieving menu or menu detail data.
 *               - Each element in the returned array is a menu item, with nested menu details.
 */
function get_restaurant_menus($restaurant_id)
{
    // Initialize an empty array to store the menu data.
    $menus_data = [];

    // Load the 'restaurant' pod with the given restaurant ID.
    $restaurant_pod = pods("restaurant", $restaurant_id);

    // Check if the restaurant exists.  If not, return the empty array.
    if (!$restaurant_pod->exists()) {
        return $menus_data;
    }

    // Get the 'restaurant_menus' relationship field from the restaurant pod.
    // This field links the restaurant to its associated menu items.
    $menus = $restaurant_pod->field("restaurant_menus");

    // Check for errors or empty results.  Return an empty array if:
    // - $menus is a WP_Error object (indicating an error occurred).
    // - $menus is empty (no menus are associated with the restaurant).
    // - $menus is not an array.
    if (is_wp_error($menus) || empty($menus) || !is_array($menus)) {
        return $menus_data;
    }

    // Iterate through each menu item associated with the restaurant.
    foreach ($menus as $menu_item) {
        // Check if the menu item has an ID.  Skip if it doesn't.
        if (!isset($menu_item["ID"])) {
            continue;
        }

        $menu_pod = pods("menu", $menu_item["ID"]);

        if (!$menu_pod->exists()) {
            continue;
        }

        $menu_data = [
            "ID" => (int) $menu_item["ID"],
            "menu_name" => get_the_title($menu_item["ID"]),
            "menu_image" => $menu_pod->field("menu_image"),
            "menu_price" => (float) $menu_pod->field("menu_price"),
            "menu_details" => [],
        ];

        // Get the 'menu_details' relationship field from the menu pod.

        $menu_details = $menu_pod->field("menu_details");

        if (!empty($menu_details)) {
            if (is_array($menu_details)) {
                foreach ($menu_details as $detail) {
                    if (!empty($detail["ID"])) {
                        $menu_details_pod = pods("menu_details", $detail["ID"]);

                        // Check if the menu_details pod exists before accessing its fields.
                        if ($menu_details_pod->exists()) {
                            $menu_data["menu_details"][] = [
                                "menu_description" => wp_kses_post(
                                    $menu_details_pod->field("menu_description")
                                ),
                                "menu_ingredients" => array_map(
                                    "sanitize_text_field",
                                    (array) $menu_details_pod->field(
                                        "menu_ingredients"
                                    )
                                ),
                                "menu_price" => (float) $menu_details_pod->field(
                                    "menu_price"
                                ),
                                "prep_time" => (int) $menu_details_pod->field(
                                    "prep_time"
                                ),
                            ];
                        }
                    }
                }
            } else {
                // Single relationship:
                if (!empty($menu_details["ID"])) {
                    $menu_details_pod = pods(
                        "menu_details",
                        $menu_details["ID"]
                    );
                    if ($menu_details_pod->exists()) {
                        $menu_data["menu_details"][] = [
                            "menu_description" => wp_kses_post(
                                $menu_details_pod->field("menu_description")
                            ), // Sanitize with wp_kses_post.
                            "menu_ingredients" => array_map(
                                "sanitize_text_field",
                                (array) $menu_details_pod->field(
                                    "menu_ingredients"
                                )
                            ),
                            "menu_price" => (float) $menu_details_pod->field(
                                "menu_price"
                            ),
                            "prep_time" => (int) $menu_details_pod->field(
                                "prep_time"
                            ),
                        ];
                    }
                }
            }
        }

        $menus_data[] = $menu_data;
    }

    return $menus_data;
}

/**
 * Retrieves custom fields and related data for a single "restaurant" Pod.
 *
 * Fetches restaurant data, including its name, image, rating, countries, menus, and permalink,
 * using the Pods Framework. Sanitizes the data for safe output.
 *
 * @param int $restaurant_id The ID of the restaurant post.
 * @return array An associative array containing the restaurant's data.  Returns a default
 *               array with empty values if the restaurant pod doesn't exist.  The array
 *               includes the following keys:
 *               - id: The restaurant's ID.
 *               - restaurant_name: The restaurant's name (sanitized).
 *               - restaurant_image: An array with a 'guid' key containing the image URL (escaped), or null if no image.
 *               - restaurant_rating: The restaurant's rating (integer).
 *               - restaurant_countries: An array of country codes (sanitized).
 *               - menus: An array of menu data (see `get_restaurant_menus` function).
 *               - permalink: The restaurant's permalink.
 */
function get_restaurant_data(int $restaurant_id): array
{
    // Initialize the default restaurant data array.
    $restaurant_data = [
        "id" => $restaurant_id,
        "restaurant_name" => "",
        "restaurant_image" => null,
        "restaurant_rating" => 0,
        "restaurant_countries" => [],
        "menus" => [], // Will be populated by get_restaurant_menus().
        "permalink" => "",
    ];

    $restaurant_pod = pods("restaurant", $restaurant_id);

    if ($restaurant_pod->exists()) {
        $restaurant_data["restaurant_name"] = sanitize_text_field(
            $restaurant_pod->field("restaurant_name")
        );

        // Retrieve and process the restaurant image.
        $image = $restaurant_pod->field("restaurant_image");

        if (!empty($image) && isset($image["guid"])) {
            $restaurant_data["restaurant_image"] = [
                "guid" => esc_url($image["guid"]), // Escape the URL for security.
            ];
        }

        // Retrieve and cast the restaurant rating to an integer.
        $restaurant_data["restaurant_rating"] = (int) $restaurant_pod->field(
            "restaurant_rating"
        );

        // Retrieve and sanitize the restaurant countries.
        $restaurant_countries = $restaurant_pod->field("restaurant_countries");

        if (is_array($restaurant_countries)) {
            $restaurant_data["restaurant_countries"] = array_map(
                "sanitize_text_field",
                $restaurant_countries
            );
        } elseif (!empty($restaurant_countries)) {
            // If it's not an array but is not empty, treat it as a single country.
            $restaurant_data["restaurant_countries"] = [
                sanitize_text_field($restaurant_countries),
            ];
        }

        // Retrieve the restaurant's menus using the `get_restaurant_menus` function.
        $restaurant_data["menus"] = get_restaurant_menus($restaurant_id);

        // Get the restaurant's permalink.
        $restaurant_data["permalink"] = get_permalink($restaurant_id);
    }

    // Return the restaurant data array.
    return $restaurant_data;
}

function register_menu_customposttype(): void
{
    register_post_type("menu", [
        "label" => "Menus",
        "public" => true,
        "has_archive" => true,
        "rewrite" => ["slug" => "menus", "with_front" => false],
        "supports" => ["title", "editor", "thumbnail"],
    ]);
}
add_action("init", "register_menu_customposttype");

/**
 * Register the custom post type for "restaurant."
 */
function register_restaurant_customposttype(): void
{
    register_post_type("restaurant", [
        "label" => "Restaurant",
        "public" => true,
        "has_archive" => true,
        "rewrite" => ["slug" => "restaurant", "with_front" => false],
    ]);
}
add_action("init", "register_restaurant_customposttype");

/**
 * Flush rewrite rules after registering the CPT (only on activation or init).
 */
function my_cpt_rewrite_flush(): void
{
    register_restaurant_customposttype();
    flush_rewrite_rules();
}
add_action("init", "my_cpt_rewrite_flush");
