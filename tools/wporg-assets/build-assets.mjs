/**
 * Builds the wordpress.org listing assets for Hide Admin Bar Based on User Roles.
 *
 *   node tools/wporg-assets/build-assets.mjs                 icon PNGs and banners
 *   node tools/wporg-assets/build-assets.mjs --screenshots   also the settings page screenshots
 *
 * Everything is written to .wordpress-org/ (or HAB_ASSETS_DIR), which the deploy
 * workflow copies to the plugin's assets/ folder on wordpress.org. The icon PNGs come
 * from .wordpress-org/icon.svg and the banners from banner.html in this folder, rendered
 * in headless Chrome at the exact sizes wordpress.org expects. Screenshots are taken from
 * the plugin's settings page on a local WordPress site, signed in through a short-lived
 * WP-CLI session that is destroyed afterwards; nothing is saved on the site.
 *
 * Needs Google Chrome, plus puppeteer-core and the Inter and Manrope fonts from the
 * WPAnkit Product theme's QA tools (set HAB_QA_DIR if they live elsewhere). Screenshots
 * also need WP-CLI and the site: set HAB_SITE_PATH, HAB_SITE_URL and HAB_DB_SOCKET.
 */

import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const HERE = dirname( fileURLToPath( import.meta.url ) );
const OUT = process.env.HAB_ASSETS_DIR || join( HERE, '../../.wordpress-org' );
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const QA = process.env.HAB_QA_DIR ||
	join( homedir(), 'Local Sites/pushrow-lp/app/public/wp-content/themes/wpankit-product/tools/qa' );
const SITE_PATH = process.env.HAB_SITE_PATH || join( homedir(), 'Local Sites/hide-admin-bar-plugin/app/public' );
const SITE_URL = process.env.HAB_SITE_URL || 'http://hide-admin-bar-plugin.local';
const DB_SOCKET = process.env.HAB_DB_SOCKET ||
	join( homedir(), 'Library/Application Support/Local/run/-6kgDsNFG/mysql/mysqld.sock' );

for ( const [ what, path ] of [
	[ 'Google Chrome', CHROME ],
	[ 'puppeteer-core from the theme QA tools', join( QA, 'node_modules/puppeteer-core' ) ],
	[ 'Inter and Manrope from the theme QA tools', join( QA, 'node_modules/@fontsource/manrope' ) ],
] ) {
	if ( ! existsSync( path ) ) {
		console.error( `${ what } not found at ${ path }` );
		process.exit( 1 );
	}
}

const puppeteer = createRequire( join( QA, 'package.json' ) )( 'puppeteer-core' );

// Fonts are inlined: pages loaded with setContent can't read file:// URLs.
const font = ( family, pkg, weight ) =>
	`@font-face{font-family:${ family };font-weight:${ weight };src:url(data:font/woff2;base64,${ readFileSync( join( QA, 'node_modules/@fontsource', pkg, 'files', `${ pkg }-latin-${ weight }-normal.woff2` ) ).toString( 'base64' ) }) format("woff2")}`;
const FONTS = [
	font( 'Inter', 'inter', 500 ),
	font( 'Inter', 'inter', 600 ),
	font( 'Inter', 'inter', 700 ),
	font( 'Manrope', 'manrope', 800 ),
].join( '\n' );

const iconSvg = readFileSync( join( OUT, 'icon.svg' ), 'utf8' );
const iconUri = 'data:image/svg+xml;base64,' + Buffer.from( iconSvg ).toString( 'base64' );

// Width and height from the PNG header, to check every output.
function pngSize( file ) {
	const b = readFileSync( file );
	return [ b.readUInt32BE( 16 ), b.readUInt32BE( 20 ) ];
}

function check( name, width, height ) {
	const file = join( OUT, name );
	const [ w, h ] = pngSize( file );
	if ( w !== width || h !== height ) {
		throw new Error( `${ name } is ${ w }x${ h }, expected ${ width }x${ height }` );
	}
	console.log( `${ name }  ${ w }x${ h }  ${ Math.round( statSync( file ).size / 1024 ) } KB` );
}

const browser = await puppeteer.launch( { executablePath: CHROME, headless: 'new' } );

try {
	const page = await browser.newPage();

	/* Icon ------------------------------------------------------------- */
	for ( const size of [ 128, 256 ] ) {
		await page.setViewport( { width: size, height: size, deviceScaleFactor: 1 } );
		await page.setContent( `<html><body style="margin:0;background:transparent"><img src="${ iconUri }" width="${ size }" height="${ size }" style="display:block"></body></html>` );
		const name = `icon-${ size }x${ size }.png`;
		await page.screenshot( { path: join( OUT, name ), omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } } );
		check( name, size, size );
	}

	/* Banners ---------------------------------------------------------- */
	const banner = readFileSync( join( HERE, 'banner.html' ), 'utf8' )
		.replace( '/* FONTS: build-assets.mjs injects the Inter and Manrope @font-face rules here. */', FONTS )
		.replace( 'ICON_URI', iconUri );

	for ( const [ width, height, scale ] of [ [ 772, 250, 1 ], [ 1544, 500, 2 ] ] ) {
		await page.setViewport( { width: 772, height: 250, deviceScaleFactor: scale } );
		await page.setContent( banner, { waitUntil: 'load' } );
		await page.evaluate( () => document.fonts.ready );
		const missing = await page.evaluate( () => [ '800 36px Manrope', '500 16px Inter', '600 12px Inter', '700 11px Inter' ].filter( ( f ) => ! document.fonts.check( f ) ) );
		if ( missing.length ) {
			throw new Error( 'Fonts not loaded: ' + missing.join( ', ' ) );
		}
		const name = `banner-${ width }x${ height }.png`;
		await page.screenshot( { path: join( OUT, name ), clip: { x: 0, y: 0, width: 772, height: 250 } } );
		check( name, width, height );
	}

	/* Screenshots ------------------------------------------------------ */
	if ( process.argv.includes( '--screenshots' ) ) {
		await screenshots( page );
	}
} finally {
	await browser.close();
}

async function screenshots( page ) {
	const wp = ( code ) => execFileSync( 'php', [ '-d', 'error_reporting=0', '-d', 'display_errors=0', '-d', `mysqli.default_socket=${ DB_SOCKET }`, '/usr/local/bin/wp', `--path=${ SITE_PATH }`, 'eval', code ], { encoding: 'utf8' } );
	const session = JSON.parse( wp( '$u = get_users( array( "role" => "administrator", "number" => 1 ) )[0]; $exp = time() + 600; $t = WP_Session_Tokens::get_instance( $u->ID )->create( $exp ); echo json_encode( array( "uid" => $u->ID, "token" => $t, "cookies" => array( array( "name" => AUTH_COOKIE, "value" => wp_generate_auth_cookie( $u->ID, $exp, "auth", $t ) ), array( "name" => LOGGED_IN_COOKIE, "value" => wp_generate_auth_cookie( $u->ID, $exp, "logged_in", $t ) ) ) ) );' ) );

	try {
		const domain = new URL( SITE_URL ).hostname;
		await page.setCookie( ...session.cookies.map( ( c ) => ( { ...c, domain, path: '/' } ) ) );
		await page.setViewport( { width: 1360, height: 900, deviceScaleFactor: 2 } );

		// 1. Rules for logged-out visitors, two roles and two capabilities (not saved).
		await open( page );
		await page.click( '#hab-hide-for-guests' );
		for ( const role of [ 'subscriber', 'contributor' ] ) {
			await page.click( `input[name="hab_roles[]"][value="${ role }"]` );
		}
		await page.type( '#hab-capability-input', 'upload_files,edit_published_posts,' );
		await settle( page );
		await shoot( page, '.hab-settings', 'screenshot-1.png' );

		// 2. "Hide for everyone" switches the other rules off.
		await open( page );
		await page.click( '#hab-hide-for-all' );
		await settle( page );
		await shoot( page, '#hab-settings-form', 'screenshot-2.png' );
	} finally {
		wp( `WP_Session_Tokens::get_instance( ${ session.uid } )->destroy( "${ session.token }" );` );
	}
}

async function open( page ) {
	await page.goto( SITE_URL + '/wp-admin/options-general.php?page=hide-admin-bar-settings', { waitUntil: 'networkidle0' } );
	// Show only the plugin page: no WordPress toolbar or menu, review request or other plugins' notices.
	await page.addStyleTag( { content: 'html.wp-toolbar{padding-top:0!important}#wpadminbar,#adminmenumain,#wpfooter,#hab-review,.notice,.update-nag{display:none!important}#wpcontent{margin-left:0!important}' } );
}

async function settle( page ) {
	await page.click( '.hab-card-header h2' );
	await page.mouse.move( 0, 0 );
	await page.evaluate( () => document.activeElement && document.activeElement.blur() );
}

async function shoot( page, selector, name ) {
	const el = await page.$( selector );
	const box = await el.boundingBox();
	const pad = 16;
	await page.screenshot( {
		path: join( OUT, name ),
		clip: { x: Math.max( 0, box.x - pad ), y: Math.max( 0, box.y - pad ), width: box.width + pad * 2, height: box.height + pad * 2 },
	} );
	const [ w, h ] = pngSize( join( OUT, name ) );
	console.log( `${ name }  ${ w }x${ h }  ${ Math.round( statSync( join( OUT, name ) ).size / 1024 ) } KB` );
}
