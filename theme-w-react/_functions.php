<?php
function enqueue_theme_styles() {
    wp_enqueue_style(
        'my-theme-style',
        get_template_directory_uri() . '/bundled/css/index.css',
        array(),
        '1.0.0',
        'all',
    );
}
add_action('wp_enqueue_scripts', 'enqueue_theme_styles');


function enqueue_custom_script($handle, $script_name, $data) {
    wp_enqueue_script(
        $handle,
        get_template_directory_uri() . '/bundled/js/' . $script_name . '.js',
        array(),
        null,
        true
    );
    wp_localize_script(
        $handle,
        'WPData',
        $data
    );
    add_filter('script_loader_tag', function ($tag, $current_handle, $src) use ($handle) {
        if ($current_handle === $handle) {
            return '<script type="module" src="' . esc_url($src) . '"></script>';
        }
        return $tag;
    }, 10, 3);
}

function enqueue_page_scripts() {
    enqueue_custom_script(
        'page-script',     // handle
        'page',            // script name
        array('postId' => get_the_ID()) // localized data
    );
    enqueue_custom_script(
        'single-restaurants-script',
        'single-restaurants',
        array('postId' => get_the_ID())
    );
}
add_action('wp_enqueue_scripts', 'enqueue_page_scripts');



function register_custom_post_type_restaurants() {
    register_post_type('restaurants', [
        'labels' => [
            'name' => __('Restaurants'),
            'singular_name' => __('Restaurant'),
        ],
        'public' => true, // 投稿タイプを公開
        'show_in_rest' => true, // REST APIを有効化
        'has_archive' => true, // アーカイブを有効化
        'rewrite' => [
            'slug' => 'restaurants', // URLスラッグ
            'with_front' => false,
        ],
        'supports' => ['title', 'editor', 'thumbnail'], // 必要なサポート機能のみ
        'template' => [
            ['core/paragraph', ['placeholder' => 'Enter restaurant details here...']],
        ],
        'template_lock' => false, // テンプレートのロックを解除
    ]);
}
add_action('init', 'register_custom_post_type_restaurants');
?>
