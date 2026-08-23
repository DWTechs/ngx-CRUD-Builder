# 0.2.1 (unreleased)
- **Breaking:** remove the `'material'` adapter literal from `FormFieldAdapterType`, `TableAdapterType`, `provideFormFieldRenderer()`, `provideTableRenderer()` and `provideCrudRenderer()` — these now only accept `'optimus-ui'` (and `'native'` for form fields)
- Add a new `@dwtechs/ngx-crud-builder/material` secondary entry point exposing `provideMaterialFormFieldRenderer()`, `provideMaterialTableRenderer()` and `provideMaterialCrudRenderer()` for Angular Material support
- `@angular/material` and `@angular/animations` are now genuinely optional: they are only resolved by apps that import the `/material` entry point, instead of being pulled in by every app regardless of adapter choice
- Update README and inline docs to reference the new Material entry point
- Fix `edition-dialog` to focus on cancel button instead of first editable field

# 0.2.0 (Aug 9th 2026)
- Remove PrimeNG in favor of `@openng/optimus-ui` as the UI component library
- **Breaking:** require Angular **^22.0** (was ^21.0); bump `@openng/optimus-ui` peer dependency to `^2.0.0-rc.0`
- **Breaking:** rename the `'primeng'` adapter literal to `'optimus-ui'` in `FormFieldAdapterType`, `TableAdapterType`, `provideCrudRenderer()`, `provideFormFieldRenderer()` and `provideTableRenderer()`
- Update README and inline docs to reflect the Optimus UI adapter name and setup (`provideOptimus`, `@openng/optimus-ui-themes`)

# 0.1.9 (Aug 2nd 2026)
- Fix `table` local update when archiving a row: default behavior now marks row as archived instead of deleting it from the table
- Fix `Restore` edition dialog button translation
- Fix `Restore` button so that it calls the `restore` HTTP route

# 0.1.8 (Aug 1st 2026)
- Fix columns management to enable columns selection when preferences mode is not activated
- Add number and date formats to column options
- Fix date prime filter cell to show selected filter value on re-opening
- Fix createdAt and updatedAt control type

# 0.1.7 (Jul 19th 2026)
- Fix PrimeNG column-resize style persisting after switching preference views, by clearing cached table styles whenever a view is created, updated or deleted

# 0.1.6 (Jul 18th 2026)
- Fix `TableColumnsStorage.updateMany()` re-sending an unchanged `conf` for every preference view on save, which could make the backend mistake a plain selection change (`isActive`) for a real template edit

# 0.1.5 (Jul 17th 2026)
- Fix package install

# 0.1.4 (Jul 17th 2026)
- Add `history` field ordering to match the form field order
- Decouple creation and deletion from bulk update in `preferences` management
- Rename `rows` to `limit` in the GET request parameters

# 0.1.3 (Jul 16th 2026)

- Improve the columns management experience by keeping the active view in sync when a view is deleted
- Fix autofocus behavior for the new field input when creating or editing a view
- Refine the table and toolbar spacing for a cleaner layout

# 0.1.2 (Jul 15th 2026)

- Add `TableColumnsStorage.deleteView()` and `TableConfigService.deleteOne()` to delete a single preference view immediately, independently of saving
- `ColumnsManagementDialogComponent` now emits a `viewDeleted` output when a saved view is deleted, wired up by `TableComponent` to persist the deletion right away instead of waiting for the Save button

# 0.1.1 (Jul 14th 2026)

- Fix `history` component/model imports to use relative paths instead of `@crud` path alias

# 0.1.0 (Jul 13th 2026)

- Initial release