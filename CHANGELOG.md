# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Breaking

- Form rendering adapter is now mandatory: register `provideFormFieldRenderer('primeng' | 'native')` in app providers when using forms or table edition dialogs. Without it, runtime DI fails with `NullInjectorError`.

### Changed

- Table URL synchronization input renamed to `isUrlStateSyncEnabled` for clarity.
- `canAccessItemFromUrl` remains supported as a deprecated alias for backward compatibility.

## [1.0.0] - 2026-04-12

### Added

- `TableComponent` — configurable data table with sorting, filtering, pagination, lazy loading, column management, row selection, context menu, Excel/CSV export, and deep linking
- `FormComponent` — dynamic reactive form generated from `CrudItemOptions[]` with 15+ input types, validators, conditional visibility, nested groups and arrays
- `EditionDialogComponent` — edition dialog wrapping the form with create/edit/view modes
- `CrudRepository<T>` — base class for HTTP CRUD operations with optimistic updates, archive/restore, and history tracking
- `HistoryComponent` — audit trail panel for entity change history
- `CrudButtonsComponent` — toolbar buttons wired to CRUD permissions
- `FormBuilderService` — reactive form construction from `ControlOptions` configuration
- `TableConfigService` — table state management with localStorage persistence for column preferences
- `OfflineService` — offline detection and notification
- `DownloadService` — file download helper with non-PDF print warning
- `LoadingService` — global loading indicator service
- `LocalStorageService` — typed localStorage wrapper
- `SnackbarService` — toast notification helper
- `provideCrudLabels()` — deep-partial i18n override function; French labels shipped by default
- `APP_CONFIG`, `ACL_ADAPTER`, `APP_FORM_CONFIG` — optional injection tokens for app-level configuration
- Full support for Angular 21 standalone components, signals, `OnPush` change detection
