<?php
/**
 * A checklist of items to hide for each role, with a role picker.
 *
 * Expects $hab_panel_section (settings section), $hab_panel_items (list of array( 'id', 'label',
 * 'children' )), $hab_panel_hidden (role => hidden item IDs), plus $roles and $admin_roles from
 * the settings page. Without JavaScript every role's checklist is shown, one after another.
 *
 * @link       https://wpankit.com/
 * @since      7.5.0
 *
 * @package    hab_Hide_Admin_Bar_Based_On_User_Roles
 * @subpackage hab_Hide_Admin_Bar_Based_On_User_Roles/modules/partials
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Open the first role that already hides something, otherwise the first role that can't manage the site.
$hab_selected_role = '';
foreach ( array_keys( $roles ) as $hab_role_key ) {
	if ( ! empty( $hab_panel_hidden[ $hab_role_key ] ) ) {
		$hab_selected_role = $hab_role_key;
		break;
	}
}
if ( '' === $hab_selected_role ) {
	$hab_other_roles   = array_diff( array_keys( $roles ), $admin_roles );
	$hab_selected_role = $hab_other_roles ? reset( $hab_other_roles ) : key( $roles );
}

$hab_picker_id = 'hab-' . str_replace( '_', '-', $hab_panel_section ) . '-role';
?>
<div class="hab-role-panels" data-hab-role-panels>
	<div class="hab-role-picker">
		<label for="<?php echo esc_attr( $hab_picker_id ); ?>"><?php esc_html_e( 'Role', 'hide-admin-bar-based-on-user-roles' ); ?></label>
		<select id="<?php echo esc_attr( $hab_picker_id ); ?>" class="hab-role-select">
			<?php foreach ( $roles as $hab_role_key => $hab_role_name ) : ?>
				<?php
				$hab_role_label = translate_user_role( $hab_role_name );
				$hab_count      = empty( $hab_panel_hidden[ $hab_role_key ] ) ? 0 : count( $hab_panel_hidden[ $hab_role_key ] );
				?>
				<option value="<?php echo esc_attr( $hab_role_key ); ?>" data-name="<?php echo esc_attr( $hab_role_label ); ?>" <?php selected( $hab_role_key, $hab_selected_role ); ?>>
					<?php
					/* translators: 1: role name, 2: number of hidden items. */
					echo esc_html( $hab_count ? sprintf( __( '%1$s (%2$d hidden)', 'hide-admin-bar-based-on-user-roles' ), $hab_role_label, $hab_count ) : $hab_role_label );
					?>
				</option>
			<?php endforeach; ?>
		</select>
	</div>

	<?php foreach ( $roles as $hab_role_key => $hab_role_name ) : ?>
		<?php
		$hab_role_hidden = empty( $hab_panel_hidden[ $hab_role_key ] ) ? array() : $hab_panel_hidden[ $hab_role_key ];
		$hab_field_name  = 'hab_modules[' . $hab_panel_section . '][hidden][' . $hab_role_key . '][]';
		?>
		<fieldset class="hab-role-panel" data-role="<?php echo esc_attr( $hab_role_key ); ?>">
			<legend class="hab-role-panel-title">
				<?php
				/* translators: %s: role name. */
				printf( esc_html__( 'Hide for %s', 'hide-admin-bar-based-on-user-roles' ), esc_html( translate_user_role( $hab_role_name ) ) );
				?>
			</legend>
			<ul class="hab-checklist">
				<?php foreach ( $hab_panel_items as $hab_item ) : ?>
					<li>
						<label>
							<input type="checkbox" name="<?php echo esc_attr( $hab_field_name ); ?>" value="<?php echo esc_attr( $hab_item['id'] ); ?>" <?php checked( in_array( $hab_item['id'], $hab_role_hidden, true ) ); ?>>
							<span><?php echo esc_html( $hab_item['label'] ); ?></span>
						</label>
						<?php if ( ! empty( $hab_item['children'] ) ) : ?>
							<ul class="hab-checklist-children">
								<?php foreach ( $hab_item['children'] as $hab_child ) : ?>
									<li>
										<label>
											<input type="checkbox" name="<?php echo esc_attr( $hab_field_name ); ?>" value="<?php echo esc_attr( $hab_child['id'] ); ?>" <?php checked( in_array( $hab_child['id'], $hab_role_hidden, true ) ); ?>>
											<span><?php echo esc_html( $hab_child['label'] ); ?></span>
										</label>
									</li>
								<?php endforeach; ?>
							</ul>
						<?php endif; ?>
					</li>
				<?php endforeach; ?>
			</ul>
		</fieldset>
	<?php endforeach; ?>
</div>
