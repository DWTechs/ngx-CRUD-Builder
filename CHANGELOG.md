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