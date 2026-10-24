# Changelog

This changelog documents only the two most recent published GitHub releases. Each entry records changes verified by comparing its release tag with the immediately preceding published release. Later changes on `master` are excluded.

## 1.1.7 - 2026-10-23

### Added

- Introduced a redesigned interactive fraction workspace with mode buttons for addition, subtraction, multiplication, division, comparison, simplification, and conversion. Switching modes displays the selected tool while preserving existing input values.
- Added fraction-bar diagrams for operands and calculated results, refreshed when inputs or operations change. The visual renderer supports negative and improper fractions and switches to a proportional meter for larger values.
- Added English and Brazilian Portuguese labels for operation selection, visual representations, and visual results.

### Changed

- Reworked the Mustache calculator template, the JavaScript source and compiled AMD module, and the activity-specific CSS to accommodate operation tabs, stacked fraction inputs, a wider calculator workspace, responsive layouts, and visual models.
- Removed the former hero/sidebar layout and expanded the calculator workspace.
- Added release-workflow concurrency settings using a group based on `github.ref`, `cancel-in-progress: false`, and `queue: max`.
- Removed the standalone `.github/workflows/amd-build.yml` workflow, the `amd/build/calculator.min.js.map` source map, `.gitattributes`, and `.gitignore` in the compared release history.
- Updated the plugin release identifier from `1.1.6` to `1.1.7` and its build number from `2026101500` to `2026102300`.

[Compare 1.1.6...1.1.7](https://github.com/EduardoKrausME/moodle-mod_fraction/compare/1.1.6...1.1.7)

## 1.1.6 - 2026-10-15

### Changed

- Updated the GitHub Actions CI PostgreSQL service from version 16 to 17.
- Updated the MariaDB CI service from version 10 to 11.4, revising its startup environment variables and health-check configuration.
- Added `pix/icon.png` and reorganized the SVG logo asset as `pix/monologo.svg`.
- Updated the plugin release identifier from `1.1.5` to `1.1.6` and its build number from `2026101200` to `2026101500`.

No changes to the calculator's arithmetic functionality were identified in this tag comparison.

[Compare 1.1.5...1.1.6](https://github.com/EduardoKrausME/moodle-mod_fraction/compare/1.1.5...1.1.6)
