# TableComponent Documentation

## Overview
A powerful, configurable table component for CRUD operations with built-in features like filtering, sorting, pagination, and export capabilities.

## Inputs

### Core Configuration

#### `config` (required)
**Type:** `CrudItemOptions[]`  
**Description:** Defines the structure and behavior of table columns and form fields.

```typescript
config: [
  {
    key: 'name',
    label: 'Name',
    controlType: CONTROL_TYPES.INPUT,
  },
  {
    key: 'email',
    label: 'Email',
    controlType: CONTROL_TYPES.INPUT,
  }
]
```

#### `httpCalls` (required)
**Type:** `CrudCalls<TData>`  
**Description:** Configuration object containing all HTTP operations for CRUD functionality.

```typescript
httpCalls: {
  get: (params) => this.userService.getUsers(params),
  create: (user) => this.userService.createUser(user),
  update: (user) => this.userService.updateUser(user),
  archive: (ids) => this.userService.deleteUsers(ids)
}
```

> **Note — `getHistory` visibility:** providing `getHistory` is necessary but not sufficient to display the history panel. The panel is automatically hidden in the following cases:
> - `update` is not provided (read-only table)
> - the opened row matches one of the `additionalReadonlyProperties` pairs

#### `entityFactory` (required)
**Type:** `CrudItemFactory<TData>`  
**Description:** Factory function that creates new entity instances for the creation dialog.

```typescript
entityFactory: () => ({
  id: null,
  name: '',
  email: '',
  status: 'active'
})
```

#### `entityId` (required)
**Type:** `string`  
**Description:** Unique identifier for the entity type, used for persisting column preferences.

```typescript
entityId: "users"
```

#### `tableTitle` (required)
**Type:** `string`  
**Description:** Display title shown at the top of the table component.

```typescript
tableTitle: "Users"
```

### Display & Behavior

#### `clickableRows`
**Type:** `boolean` | **Default:** `true`  
**Description:** Determines user interaction mode with table rows.

```typescript
// Clickable rows - click anywhere on row to edit
clickableRows: true

// Non-clickable rows - only action buttons work
clickableRows: false
```

#### `lazy`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables lazy loading mode for large datasets.

```typescript
// For large datasets (>1000 rows)
lazy: true

// Load all data at once (<500 rows)
lazy: false
```

#### `selectable`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables row selection with checkboxes for bulk operations.

#### `stripedRows`
**Type:** `boolean` | **Default:** `true`  
**Description:** Enables alternating background colors on table rows (zebra striping). When `true`, odd and even rows will have slightly different background colors, making it easier to visually follow a row across wide tables. When `false`, all rows share the same background color.

```typescript
// Striped rows (default) — improves readability for wide tables
stripedRows: true

// Uniform rows — use when row styling is handled externally (e.g. customRowStyles)
stripedRows: false
```

#### `customRowStyles`
**Type:** `(row: TData) => Record<string, string>`  
**Description:** Applies conditional CSS styles to table rows.

```typescript
customRowStyles: (row) => ({
  'background-color': row.status === 'inactive' ? '#ffe6e6' : '',
  'color': row.priority === 'high' ? '#d32f2f' : ''
})
```

#### `additionalReadonlyProperties`
**Type:** `Record<string, unknown>`  
**Description:** Forces read-only mode on the edition dialog when a row matches one of the provided property/value pairs. Each key-value entry is checked against the clicked row: if any matches, the dialog opens in read-only mode instead of edit mode. Takes precedence over the normal edit/write mode resolution.

> **Side effect on history:** when a row matches, the history panel is also hidden, even if `getHistory` is provided in `httpCalls`.

```typescript
// Open inactive users in read-only mode
additionalReadonlyProperties: { active: false }

// Open locked entries in read-only mode
additionalReadonlyProperties: { locked: true }
```

### Table Features

#### `filterable`
**Type:** `boolean` | **Default:** `true`  
**Description:** Enables/disables column filtering functionality.

#### `sortable`
**Type:** `boolean` | **Default:** `true`  
**Description:** Enables column sorting functionality.

#### `paginator`
**Type:** `boolean` | **Default:** `true`  
**Description:** Enables pagination controls.

#### `filterLevel`
**Type:** `FilterLevel` | **Default:** `"basic"`  
**Description:** Defines the complexity level of filtering interface.

#### `isContextMenuEnabled`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables the context menu on right-clicking table rows.

When enabled, right-clicking a row shows a context menu with actions like View and Edit. Context menu actions emit the same events as clicking the row or action buttons. Useful for providing quick access to common actions without cluttering the UI.

```typescript
// Enable context menu
isContextMenuEnabled: true

// Disable context menu (default)
isContextMenuEnabled: false
```

### Export Options

#### `isCsvExportEnabled`
**Type:** `boolean` | **Default:** `true`  
**Description:** Enables CSV export functionality.

#### `isExcelExportEnabled`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables Excel export functionality.

#### `excelExportMode`
**Type:** `ExcelExportMode` | **Default:** `"server"`  
**Description:** Determines how Excel export is processed: by front-end ('local') or by back-end ('server').

### Dialog Configuration

#### `editionDialogWidth`
**Type:** `string` | **Default:** `"70vw"`  
**Description:** Sets the width of the edition/creation dialog modal.

```typescript
// Standard width
editionDialogWidth: "70vw"

// Narrow for simple forms
editionDialogWidth: "400px"

// Wide for complex forms
editionDialogWidth: "90vw"
```

#### `isDefaultEditionDisabled`
**Type:** `boolean` | **Default:** `false`  
**Description:** Disables the default edition modal dialog.

#### `editionDialogTitle`
**Type:** `string` | **Default:** `""`  
**Description:** Custom title for the edition dialog.

### Access Control & Navigation

#### `functionalityKey`
**Type:** `number | undefined`  
**Description:** Links the table to a specific functionality for access control.

#### `shouldSyncPageWithUrl`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables URL synchronization for the current page.

When enabled:
- changing the table page writes `page` in query params (e.g. `?page=3`)
- on component init, `page` is restored from URL so the table opens on the same page

Can be combined with `shouldSyncIdWithUrl` to also track the opened item.

#### `shouldSyncIdWithUrl`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables URL synchronization for the opened item.

When enabled:
- opening an item writes `?id=123` in query params to deep-link directly to its edition dialog
- on component init, if `id` is present in the URL, the matching item is fetched and opened

Can be combined with `shouldSyncPageWithUrl` to also track pagination.

### Column Management

#### `areColumnsConfigurable`
**Type:** `boolean` | **Default:** `true`  
**Description:** Controls whether columns can be hidden/shown through the configuration dialog.

### Advanced Options

#### `persistState`
**Type:** `boolean` | **Default:** `false`  
**Description:** Enables persistence of table state (filters, sorting, pagination) across page reloads. When `true`, the state is stored using the storage type defined by `stateStorage`. Disabled by default — set to `true` to opt in.

```typescript
// Enable state persistence (stored in sessionStorage by default)
persistState: true

// Also specify storage type
persistState: true
stateStorage: "local" // persist across browser sessions
```

#### `entityLabel`
**Type:** `string` | **Default:** `""`  
**Description:** Human-readable label for a single entity instance.

#### `forceReload`
**Type:** `number`  
**Description:** Trigger for forcing table data reload from parent component.

#### `groupValidator`
**Type:** `ValidatorFn | undefined`  
**Description:** Custom validator function applied to the entire form group.

```typescript
groupValidator: (group: AbstractControl) => {
  const start = group.get('startDate')?.value;
  const end = group.get('endDate')?.value;
  return start && end && start > end ? { dateRange: true } : null;
}
```

#### `customActionsTemplate`
**Type:** `TemplateRef<unknown>`  
**Description:** Custom template for actions in the table's action column. Allows injection of custom buttons or controls in place of the default edit/delete actions.

The template receives the current row data as context via `let-rowData`, enabling dynamic action visibility and behavior based on row content.

```typescript
// Component template
<tbl-table 
  [config]="userConfig"
  [httpCalls]="userHttpCalls"
  [entityFactory]="userFactory"
  [customActionsTemplate]="customActions"
  entityId="users"
  tableTitle="Users">
</tbl-table>

<ng-template #customActions let-rowData>
  <!-- View details action -->
  <p-button 
    icon="pi pi-eye" 
    severity="info" 
    size="small"
    (onClick)="viewDetails(rowData)"
    [pTooltip]="'View Details'">
  </p-button>
  
  <!-- Conditional duplicate action -->
  <p-button 
    *ngIf="rowData.status === 'active'"
    icon="pi pi-copy" 
    severity="secondary" 
    size="small"
    (onClick)="duplicate(rowData)"
    [pTooltip]="'Duplicate'">
  </p-button>
  
  <!-- Export action with confirmation -->
  <p-button 
    icon="pi pi-download" 
    severity="help" 
    size="small"
    (onClick)="exportItem(rowData)"
    [pTooltip]="'Export Item'">
  </p-button>
</ng-template>
```

```typescript
// Component class methods
export class MyComponent {
  viewDetails(rowData: User): void {
    this.router.navigate(['/users', rowData.id, 'details']);
  }
  
  duplicate(rowData: User): void {
    const duplicated = { ...rowData, id: null, name: `${rowData.name} (Copy)` };
    this.userService.createUser(duplicated).subscribe();
  }
  
  exportItem(rowData: User): void {
    this.exportService.exportSingleUser(rowData.id);
  }
}
```

## Outputs

- `editionDialogClosed: TData | null` - Emitted when edition dialog is closed
- `formChanged: TData` - Emitted when form values change
- `newClicked: void` - Emitted when new button is clicked
- `rowClicked: TData` - Emitted when a row is clicked
- `validityChanged: boolean` - Emitted when form validity changes

## Usage Examples

### Basic Table
```typescript
<tbl-table
  [config]="userConfig"
  [httpCalls]="userHttpCalls"
  [entityFactory]="userFactory"
  entityId="users"
  tableTitle="Users"
  entityLabel="User">
</tbl-table>
```

### Advanced Table with Custom Features
```typescript
<tbl-table
  [config]="orderConfig"
  [httpCalls]="orderHttpCalls"
  [entityFactory]="orderFactory"
  entityId="orders"
  tableTitle="Purchase Orders"
  entityLabel="Order"
  [lazy]="true"
  [selectable]="true"
  [shouldSyncPageWithUrl]="true"
  [shouldSyncIdWithUrl]="true"
  [isExcelExportEnabled]="true"
  [customRowStyles]="getOrderRowStyles"
  [functionalityKey]="orders"
  editionDialogWidth="80vw">
</tbl-table>
```

## Internationalisation (i18n)

All labels produced by the table component (toolbar buttons, export dialog, confirmation dialogs, column views, history panel, edition dialog, etc.) are driven by the `CRUD_LABELS` injection token. The library ships with French defaults; override any section with `provideCrudLabels()`.

### Setup

```typescript
// app.config.ts
import { provideCrudLabels } from '@dwtechs/ngx-crud-builder';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCrudLabels({
      toolbar: {
        export: 'Export data',
        configureColumns: 'Configure columns',
        refresh: 'Refresh',
      },
      table: {
        exportFailedTitle: 'Export failed',
        exportFailedDetail: 'An error occurred while exporting data.',
        deleteConfirmationSingle: 'Are you sure you want to archive this item?',
        deleteConfirmationMultiple: (count) =>
          `Are you sure you want to archive these ${count} items?`,
        restoreConfirmationSingle: 'Are you sure you want to restore this item?',
        restoreConfirmationMultiple: (count) =>
          `Are you sure you want to restore these ${count} items?`,
        confirmationHeader: 'Confirmation',
        confirmationCancel: 'Cancel',
        confirmationConfirm: 'Confirm',
        defaultViewName: 'Default',
      },
    }),
  ],
};
```

### Translatable sections for the table

| Section | Keys | Usage |
|---|---|---|
| `toolbar` | `export`, `configureColumns`, `refresh` | Toolbar action buttons |
| `exportDialog` | `header`, `chooseFormat`, `chooseData`, `all`, `selection`, `cancel`, `export` | Export dialog content |
| `columnsDialog` | `header`, `cancel`, `save` | Column management dialog |
| `columnsViews` | `title`, `add`, `delete`, `rename`, `validate`, `cancel`, `deleteConfirmation` | Saved column views panel |
| `tableActions` | `edit`, `delete` | Row action button tooltips |
| `tableRegular` | `currentPageReport(first, last, total)` | Pagination report text |
| `table` | `exportFailedTitle`, `exportFailedDetail`, `deleteConfirmationSingle`, `deleteConfirmationMultiple(count)`, `restoreConfirmationSingle`, `restoreConfirmationMultiple(count)`, `confirmationHeader`, `confirmationCancel`, `confirmationConfirm`, `defaultViewName` | Confirmation dialogs, error toasts, default view name |
| `history` | `restore`, `updatedAt`, `updatedBy`, `property`, `value`, `previousValue` | History/audit panel |
| `editionDialog` | `historyHeader`, `archive`, `modeCreate`, `modeConsult`, `modeEdit`, `cancel`, `close` | Edition dialog header and buttons |
| `archivedConfig` | `label`, `labelAt`, `archived`, `active` | Archive status filter/label |
| `download` | `noPdfPrintWarning` | Info message when printing a non-PDF file |

### Date filter format

`p-columnFilter type="date"` renders PrimeNG's built-in date filter, which internally
instantiates its own `p-datepicker`. That internal component isn't exposed through a
`pt`/passthrough section you can bind `dateFormat` to — `pt` only forwards HTML
attributes to internal DOM elements, not `@Input()` properties.

When no explicit `dateFormat` input is set, PrimeNG's datepicker falls back to the
global `translation.dateFormat`. Set it once, application-wide, via the second
argument of `provideCrudLabels()` (forwarded to `PrimeNG.setTranslation()`):

```typescript
provideCrudLabels(
  { /* label overrides */ },
  { dateFormat: 'yy-mm-dd' }, // matches DATE_FORMAT_CALENDAR
);
```

This is the only way to change the format without overriding the filter with a custom
`pTemplate="filter"` template.

### English override example

```typescript
provideCrudLabels({
  toolbar: {
    export: 'Export data',
    configureColumns: 'Configure columns',
    refresh: 'Refresh',
  },
  exportDialog: {
    header: 'Export data',
    chooseFormat: 'Choose format',
    chooseData: 'Which data?',
    all: 'All',
    selection: 'Selection',
    cancel: 'Cancel',
    export: 'Export',
  },
  columnsDialog: {
    header: 'Column management',
    cancel: 'Cancel',
    save: 'Save',
  },
  columnsViews: {
    title: 'Views',
    add: 'Add',
    delete: 'Delete',
    rename: 'Rename',
    validate: 'Apply',
    cancel: 'Cancel',
    deleteConfirmation: 'Are you sure you want to delete this view?',
  },
  tableActions: {
    edit: 'Edit',
    delete: 'Delete',
  },
  tableRegular: {
    currentPageReport: (first, last, total) =>
      `Showing ${first} to ${last} of ${total} entries`,
  },
  table: {
    exportFailedTitle: 'Export failed',
    exportFailedDetail: 'An error occurred while exporting data.',
    deleteConfirmationSingle: 'Are you sure you want to archive this item?',
    deleteConfirmationMultiple: (count) =>
      `Are you sure you want to archive these ${count} items?`,
    restoreConfirmationSingle: 'Are you sure you want to restore this item?',
    restoreConfirmationMultiple: (count) =>
      `Are you sure you want to restore these ${count} items?`,
    confirmationHeader: 'Confirmation',
    confirmationCancel: 'Cancel',
    confirmationConfirm: 'Confirm',
    defaultViewName: 'Default',
  },
  history: {
    restore: 'Restore',
    updatedAt: 'Updated at',
    updatedBy: 'Updated by',
    property: 'Property',
    value: 'Value',
    previousValue: 'Previous value',
  },
  editionDialog: {
    historyHeader: 'Change history',
    archive: 'Archive',
    modeCreate: 'Creation',
    modeConsult: 'View',
    modeEdit: 'Edit',
    cancel: 'Cancel',
    close: 'Close',
  },
  archivedConfig: {
    label: 'Archived',
    labelAt: 'Archived on',
    archived: 'Archived',
    active: 'Active',
  },
  download: {
    noPdfPrintWarning:
      'The file is not a PDF; printing is not available. It will be downloaded instead.',
  },
})
```
