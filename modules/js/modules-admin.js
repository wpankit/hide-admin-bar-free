/**
 * Hide Admin Bar, Admin cleanup tab: show one role's checklist at a time and keep the
 * "(n hidden)" counts in the role picker up to date.
 *
 * Without this script every role's checklist is shown, so the page still works.
 */
( function () {
	'use strict';

	var format = ( window.habModules && window.habModules.hiddenCount ) || '%1$s (%2$d hidden)';

	function countLabel( name, count ) {
		return count ? format.replace( '%1$s', name ).replace( '%2$d', count ) : name;
	}

	Array.prototype.forEach.call( document.querySelectorAll( '[data-hab-role-panels]' ), function ( wrap ) {
		var select = wrap.querySelector( '.hab-role-select' );
		var panels = wrap.querySelectorAll( '.hab-role-panel' );

		if ( ! select || ! panels.length ) {
			return;
		}

		function show() {
			Array.prototype.forEach.call( panels, function ( panel ) {
				panel.hidden = panel.getAttribute( 'data-role' ) !== select.value;
			} );
		}

		function updateCounts() {
			Array.prototype.forEach.call( panels, function ( panel ) {
				var option = select.querySelector( 'option[value="' + panel.getAttribute( 'data-role' ) + '"]' );
				if ( option ) {
					option.textContent = countLabel( option.getAttribute( 'data-name' ), panel.querySelectorAll( 'input[type="checkbox"]:checked' ).length );
				}
			} );
		}

		wrap.classList.add( 'is-enhanced' );
		select.addEventListener( 'change', show );
		wrap.addEventListener( 'change', function ( event ) {
			if ( 'checkbox' === event.target.type ) {
				updateCounts();
			}
		} );

		show();
	} );
}() );
