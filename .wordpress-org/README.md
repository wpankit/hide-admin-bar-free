# wordpress.org listing assets

Listing assets for **Hide Admin Bar Based on User Roles** on wordpress.org. They are
not part of the plugin: `.gitattributes` marks this folder `export-ignore`, so
`git archive` leaves it out of the release ZIP.

## Where these go

wordpress.org serves listing assets from the **`/assets/` directory of the SVN
repository**, not from `trunk/` or a tag:

```
<svn-root>/
  assets/        <- the upload set below goes here
  trunk/         <- the plugin itself
  tags/
```

## Upload set

| File | Size | Used for |
| --- | --- | --- |
| `banner-772x250.png` | 772x250 | Standard banner |
| `banner-1544x500.png` | 1544x500 | High-DPI banner |
| `icon.svg` | vector | Plugin icon, used where supported |
| `icon-256x256.png`, `icon-128x128.png` | | Icon fallbacks (required with an SVG icon) |
| `screenshot-1.png`, `screenshot-2.png` | | Screenshots; captions come from `== Screenshots ==` in `README.txt` |

Upload only these files. `source/` holds the banner HTML the PNGs are made from.
The previous SVN `assets/` held a 1 MB `icon.svg` and an older `screenshot-1.png`;
both are replaced by the files above.

## Regenerating

```bash
node .wordpress-org/build-assets.mjs                # icon PNGs and banners
node .wordpress-org/build-assets.mjs --screenshots  # also the screenshots
```

Edit the copy and colours in `source/banner.html`, and the icon in `icon.svg`.
The script renders every PNG in headless Chrome at the exact size wordpress.org
expects and checks each file's dimensions. The icon also ships inside the plugin
as `admin/images/hab-icon.svg` (the settings page header); keep the two copies
identical.

It needs **Google Chrome**, plus **puppeteer-core** and the **Inter** and
**Manrope** fonts from the WPAnkit Product theme's QA tools (`tools/qa`). The
default path is the `pushrow-lp` Local site; set `HAB_QA_DIR` to use another.

`--screenshots` also needs WP-CLI and a local WordPress site with the plugin
active. It signs in through a short-lived WP-CLI session that it destroys
afterwards, sets the rules in the page without saving, and hides the WordPress
toolbar and menu so only the plugin page shows. Set `HAB_SITE_PATH`,
`HAB_SITE_URL` and `HAB_DB_SOCKET` for a site other than the default Local one.

## Design

Purple `#6610f2` with the gold `#ffc21a` of the plugin's toolbar mark, the same
colours as the settings page. The icon is a browser window whose gold toolbar is
crossed out by a slashed eye. The banner pairs the icon and name with a site whose
admin bar is gone and a panel of role switches.
