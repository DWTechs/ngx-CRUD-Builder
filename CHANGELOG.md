# 0.1.4 (Jul xxth 2026)
--

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