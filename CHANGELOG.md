# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

## [v1.2.0] - 2018-08-03

### Added
- `Execute` option on granules to start a workflow with the granule as payload.
- Dashboard menus now support `GITC` and `DAAC` labels. The dashboard also supports addition of new labels.

### Changed
- The Rules add and edit forms are changed to a JSON editor box
- All Rule fields are now editable on the dashboard

### Fixed
- batch-async-command now collects all errors in a queue, rather than emptying the queue after the first error

## [v1.1.0] - 2018-04-20
### Added
- Expandable errors. [CUMULUS-394]

### Changed
- In `components/logs/viewer.js`, changed references to `type` to `level` to match cumulus v1 logging [CUMULUS-306].
- Tests use ava instead of tape. [CUMULUS-418]
- Remove `defaultVersion` from the config. To use a particular version of the API, just set that in the API URL.

## v1.0.1 - 2018-03-07

### Added
- Versioning and changelog [CUMULUS-197] by @kkelly51

[Unreleased]: https://github.com/cumulus-nasa/cumulus/compare/v1.1.0...HEAD
[v1.1.0]: https://github.com/cumulus-nasa/cumulus/compare/v1.0.1...v1.1.0
