<?php
/**
 * Settings page banner that introduces our other plugins.
 *
 * @package    hab_Hide_Admin_Bar_Based_On_User_Roles
 * @subpackage hab_Hide_Admin_Bar_Based_On_User_Roles/admin/partials
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$hab_other_plugins = array(
    array(
        'name'        => 'Page Visit Counter',
        'tagline'     => __( 'Privacy-first analytics inside WordPress', 'hide-admin-bar-based-on-user-roles' ),
        'description' => __( 'See visitors and page views right in your dashboard, with no cookies and no external scripts.', 'hide-admin-bar-based-on-user-roles' ),
        'url'         => 'https://pagevisitcounter.com/',
        'icon'        => 'page-visit-counter-icon.svg',
    ),
    array(
        'name'        => 'PushRow for Google Sheets',
        'tagline'     => __( 'Keep Google Sheets in sync with WordPress', 'hide-admin-bar-based-on-user-roles' ),
        'description' => __( 'Send posts, users, form entries and WooCommerce orders to any spreadsheet.', 'hide-admin-bar-based-on-user-roles' ),
        'url'         => 'https://getpushrow.com/',
        'icon'        => 'pushrow-icon.svg',
    ),
);

// Lets the product sites attribute visits to this banner.
$hab_other_plugins_utm = array(
    'utm_source'   => 'hide-admin-bar',
    'utm_medium'   => 'settings_page',
    'utm_campaign' => 'other_plugins',
);
?>
<div class="hab-other-plugins">
    <h2 class="hab-other-plugins-title"><?php esc_html_e( 'More plugins from the makers of Hide Admin Bar', 'hide-admin-bar-based-on-user-roles' ); ?></h2>
    <div class="hab-other-plugins-grid">
        <?php foreach ( $hab_other_plugins as $hab_other_plugin ) : ?>
            <a class="hab-other-plugins-card" href="<?php echo esc_url( add_query_arg( $hab_other_plugins_utm, $hab_other_plugin['url'] ) ); ?>" target="_blank" rel="noopener noreferrer">
                <img class="hab-other-plugins-icon" src="<?php echo esc_url( plugin_dir_url( __DIR__ ) . 'images/' . $hab_other_plugin['icon'] ); ?>" width="48" height="48" alt="">
                <span class="hab-other-plugins-text">
                    <span class="hab-other-plugins-name"><?php echo esc_html( $hab_other_plugin['name'] ); ?></span>
                    <span class="hab-other-plugins-tagline"><?php echo esc_html( $hab_other_plugin['tagline'] ); ?></span>
                    <span class="hab-other-plugins-description"><?php echo esc_html( $hab_other_plugin['description'] ); ?></span>
                    <span class="hab-other-plugins-cta">
                        <?php esc_html_e( 'Learn more', 'hide-admin-bar-based-on-user-roles' ); ?> <span aria-hidden="true">&rarr;</span>
                        <span class="screen-reader-text"><?php esc_html_e( '(opens in a new tab)', 'hide-admin-bar-based-on-user-roles' ); ?></span>
                    </span>
                </span>
            </a>
        <?php endforeach; ?>
    </div>
</div>

<style>
.hab-other-plugins {
    margin: 32px 0 16px;
    max-width: 1100px;
}

.hab-other-plugins-title {
    margin: 0 0 12px;
    font-size: 15px;
    font-weight: 600;
    color: #1d2327;
}

.hab-other-plugins-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
    gap: 16px;
}

.hab-other-plugins-card {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 18px 20px;
    background: #fff;
    border: 1px solid #dcdcde;
    border-radius: 8px;
    color: #1d2327;
    text-decoration: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.hab-other-plugins-card:hover,
.hab-other-plugins-card:focus {
    color: #1d2327;
    text-decoration: none;
    border-color: #6610F2;
    box-shadow: 0 4px 14px rgba(102, 16, 242, 0.12);
}

.hab-other-plugins-card:focus {
    outline: 2px solid #6610F2;
    outline-offset: 2px;
}

.hab-other-plugins-icon {
    flex: 0 0 48px;
    width: 48px;
    height: 48px;
    border-radius: 10px;
}

.hab-other-plugins-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.hab-other-plugins-name {
    font-size: 15px;
    font-weight: 600;
}

.hab-other-plugins-tagline {
    font-size: 13px;
    font-weight: 600;
    color: #3c434a;
}

.hab-other-plugins-description {
    font-size: 13px;
    line-height: 1.5;
    color: #50575e;
}

.hab-other-plugins-cta {
    margin-top: 4px;
    font-size: 13px;
    font-weight: 600;
    color: #6610F2;
}
</style>
