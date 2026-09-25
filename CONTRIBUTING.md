# Contributing to Hide Admin Bar Based on User Roles

Thanks for helping improve the plugin. This guide explains how to report problems, suggest features and send code.

## Questions and support

Please ask on the [WordPress.org support forum](https://wordpress.org/support/plugin/hide-admin-bar-based-on-user-roles/). GitHub issues are for bugs and feature ideas.

## Reporting a bug

Search the [open issues](https://github.com/wpankit/hide-admin-bar-free/issues) first. If the bug is new, open a [bug report](https://github.com/wpankit/hide-admin-bar-free/issues/new?template=bug_report.yml) with your settings, the steps to reproduce it, and your plugin, WordPress and PHP versions.

Found a security issue? Please don't open an issue; follow [SECURITY.md](SECURITY.md) instead.

## Suggesting a feature

Open a [feature request](https://github.com/wpankit/hide-admin-bar-free/issues/new?template=feature_request.yml) and describe the problem it would solve.

## Translating

Translations are managed on [translate.wordpress.org](https://translate.wordpress.org/projects/wp-plugins/hide-admin-bar-based-on-user-roles/).

## Contributing code

### Set up

1. Run WordPress locally, for example with [Local](https://localwp.com/), [wp-env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/) or [DDEV](https://ddev.com/).
2. Fork this repository and clone your fork into `wp-content/plugins/hide-admin-bar-based-on-user-roles`.
3. Run `composer install` to get the coding standards tools.
4. Activate the plugin; its settings are under **Settings → Hide Admin Bar**.

### Make your change

- Create a branch from `main`. `main` is protected, so every change arrives through a pull request.
- Keep each pull request to one topic.
- Follow the [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/). `composer lint` must pass; `composer format` fixes most issues.
- The code must keep working on PHP 5.6 and WordPress 5.5.
- Prefix new functions, classes, options and hooks with `hab_`, and use the `hide-admin-bar-based-on-user-roles` text domain. Keep existing names and the stored `hab_settings` format: sites and other code rely on them.
- Escape output, sanitize input, and check capabilities and nonces.
- Don't add anything to the site's front end; hiding the admin bar must stay free of CSS, JavaScript and extra queries.

### Test it

Before opening the pull request, try the flows your change touches, for example:

- the admin bar as a user it should be hidden for, and as one it should stay visible for,
- each setting: hide for everyone, logged-out visitors, roles and capabilities,
- saving the settings page, and the reset link.

### Open the pull request

Fill in the template: what changed, why, and how you tested it. The checks (Coding Standards, PHP Lint and Plugin Check) must pass before the pull request is merged.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By taking part, you agree to follow it.

## License

By contributing, you agree that your contributions are licensed under the [GPL-2.0-or-later](LICENSE) license.
