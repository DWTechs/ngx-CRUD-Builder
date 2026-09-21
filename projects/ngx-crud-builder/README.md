# @dwtechs/ngx-crud-builder

An Angular component library for building dynamic forms and data tables with minimal configuration. It provides a declarative approach to creating CRUD interfaces with validation, dialogs, export, history, and column management.

**[View the live demo](https://crud-builder-12c1d.web.app)**

> **Compatibility:** requires Angular **^22.0** and `@openng/optimus-ui` **^2.0.0-rc.0**. The library version tracks Angular's major version — use the matching major.

## UI adapters — Optimus UI, Material or Native?

The library renders two independent things, each with its own adapter: the **form fields** (inputs, selects, dates...) and the **table shell** (rows, sorting, pagination...). Pick **one** adapter and use it for both — don't mix, e.g. an Optimus UI form with a Material table. Use `provideCrudRenderer('optimus-ui')` to provide both at once, or `provideMaterialCrudRenderer()` (from the separate `@dwtechs/ngx-crud-builder/material` entry point) for Material. Use `provideFormFieldRenderer(adapter)` / `provideTableRenderer('optimus-ui')` individually only if you don't render a `<tbl-table>` (e.g. `provideFormFieldRenderer('native')` for a lighter, Optimus UI-free form).

> ⚠️ **Optimus UI is always required as a peer dependency today**, whichever adapter you choose for forms or tables. `ConfirmService`, `SnackbarService`, the confirm dialog, toast, and the table toolbar (export, column management, refresh) are still built with Optimus UI components. Choosing `'material'` or `'native'` only changes how form controls and/or table rows are rendered — it does not remove the Optimus UI dependency.

> ℹ️ **Angular Material is opt-in.** Its providers, `provideMaterialFormFieldRenderer()` / `provideMaterialTableRenderer()` / `provideMaterialCrudRenderer()`, live in the separate `@dwtechs/ngx-crud-builder/material` entry point (not the root `@dwtechs/ngx-crud-builder` import). `@angular/material` and `@angular/animations` are declared as **optional** peer dependencies and are only ever resolved by apps that actually import that entry point.

| Adapter | Form fields | Table shell |
|---|---|---|
| `'optimus-ui'` | Full support — float labels, icon fields, all control types | Full-featured: sorting, filtering, lazy loading, column resizing, state persistence |
| Material (`@dwtechs/ngx-crud-builder/material`) | Full support for all control types (requires `@angular/material` + `@angular/animations`, a date adapter, and `provideAnimationsAsync()`) | Minimal shell — data display, pagination, sorting, basic filtering and lazy loading. No column resizing, state persistence or context menu yet |
| `'native'` | Plain HTML controls, no extra dependency, lightest bundle. Covers every control type except the `table` control, and is experimental — styling and edge cases are incomplete | **No shell available yet** — using `<tbl-table>` without a table renderer provided throws a `NullInjectorError` at runtime |

Use `provideFormFieldRenderer('native')` on its own only if you don't use `<tbl-table>` — there is currently no `'native'` table shell, so it can't be combined with `provideTableRenderer` or `provideCrudRenderer`.

## Highlights

- Dynamic form generation with 15+ input types and built-in validation
- Advanced data tables with filtering, pagination, selection, preferences, and export
- CRUD operations with HTTP integration, archive/restore, and history tracking
- Customization support for actions, dialogs, labels, and access control

## Demo application

The demo app showcases the library through a form builder, a table playground, and a full end-to-end example.

- `/` — interactive form demo
- `/table` — table configuration playground
- `/full-example` — realistic IT request workflow combining forms, tables, access control, and saved views

## Requirements

- Angular ≥ 22
- `@openng/optimus-ui` ≥ 2.0.0-rc.0 — **always required**, regardless of the form/table adapter you pick (see [UI adapters](#ui-adapters--optimus-ui-material-or-native))
- `@angular/material` + `@angular/animations` ≥ 22 — only if you import `@dwtechs/ngx-crud-builder/material` (i.e. use `provideMaterialFormFieldRenderer()` and/or `provideMaterialTableRenderer()`)

## Installation

```bash
npm install @dwtechs/ngx-crud-builder
```

## Quick start

### 1. Add the required providers

Every app using this library needs, **regardless of the adapter chosen**:

| Provider | Why |
|---|---|
| `provideOptimus({ theme: ... })` | Optimus UI theme, used by the toolbar/dialogs/toast even with Material or `'native'` form fields |
| `provideFormFieldRenderer(adapter)` | **Required** to render form fields — throws `NullInjectorError` if omitted |
| `provideTableRenderer('optimus-ui')` | **Required** if you use `<tbl-table>` — throws `NullInjectorError` if omitted (no shell exists for `'native'`, see [UI adapters](#ui-adapters--optimus-ui-material-or-native)) |

`provideCrudRenderer('optimus-ui')` is a shortcut that calls both `provideFormFieldRenderer('optimus-ui')` and `provideTableRenderer('optimus-ui')`, so forms and tables stay visually consistent. For Angular Material, use `provideMaterialCrudRenderer()` from the separate `@dwtechs/ngx-crud-builder/material` entry point instead.

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideOptimus } from '@openng/optimus-ui/config';
import { definePreset } from '@openng/optimus-ui-themes';
import Aura from '@openng/optimus-ui-themes/aura';
import { provideCrudLabels } from '@dwtechs/ngx-crud-builder';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: { /* your brand colours */ },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideOptimus({
      theme: { preset: MyPreset },
    }),
    // required – picks the adapter for both form fields and the table shell
    ...provideCrudRenderer('optimus-ui'), // see "UI adapters" above for the Material equivalent
    // optional – defaults to French
    provideCrudLabels({ /* your overrides */ }),
  ],
};
```

> For Angular Material, replace `...provideCrudRenderer('optimus-ui')` with `...provideMaterialCrudRenderer()` (imported from `@dwtechs/ngx-crud-builder/material`). It additionally requires `provideAnimationsAsync()` (or `provideNoopAnimations()`) and a date adapter such as `provideNativeDateAdapter()` from `@angular/material/core`.

### 2. Add the components

```typescript
// my-page.component.ts
import { TableComponent } from '@dwtechs/ngx-crud-builder';

@Component({
  selector: 'app-my-page',
  imports: [TableComponent],
  template: `
    <tbl-table
      [config]="config"
      [httpCalls]="httpCalls"
      [entityFactory]="factory"
      entityId="users"
      tableTitle="Users">
    </tbl-table>
  `,
})
export class MyPageComponent {
  config: CrudItemOptions[] = [ /* ... */ ];
  httpCalls = { get: ..., create: ..., update: ..., archive: ... };
  factory = () => ({ id: null, name: '' });
}
```

---

## Configuration tokens

### `APP_CONFIG`

Provides application-level metadata used internally (local storage key prefixes, API prefix, etc.). All fields have sensible defaults so this token is **optional**.

```typescript
import { APP_CONFIG } from '@dwtechs/ngx-crud-builder';

{ provide: APP_CONFIG, useValue: {
  title: 'My App',
  appKey: 'my_app',           // prefix for localStorage keys
  storageKeys: {
    TABLE_CONFIG: 'my_app_tableConfig',
  },
  apiPrefix: '/api/',         // default: '/api/'
}}
```

### `ACL_ADAPTER`

Controls which CRUD operations (create / update / archive / restore) are available based on a `functionalityKey`. The default grants all permissions. Override it to plug in your own access-control service.

```typescript
import { ACL_ADAPTER, AclAdapter, CallsPermissions } from '@dwtechs/ngx-crud-builder';

@Injectable({ providedIn: 'root' })
export class AclService implements AclAdapter {
  permissionsFor(functionality: string | undefined): CallsPermissions {
    // return permissions based on user roles / feature flags
    return {
      canCreate: this.userHasRole('EDITOR'),
      canUpdate: this.userHasRole('EDITOR'),
      canArchive: this.userHasRole('ADMIN'),
      canRestore: this.userHasRole('ADMIN'),
    };
  }
}

// app.config.ts
{ provide: ACL_ADAPTER, useExisting: AclService }
```

> When no `ACL_ADAPTER` is provided, all four operations are enabled for every table.

### `provideFormFieldRenderer(adapter)`

**Required** when using `FormComponent` or any form-bearing component (e.g. the table's edition dialog). Omitting it throws a `NullInjectorError` at runtime.

Choose the adapter that matches your UI stack:

| Value | Description |
|---|---|
| `'optimus-ui'` | Optimus UI controls — float labels, icon fields, full styling support |
| `'native'` | Plain HTML controls — no Optimus UI dependency, lighter bundle, experimental |

> For Angular Material controls, use `provideMaterialFormFieldRenderer()` from the separate `@dwtechs/ngx-crud-builder/material` entry point instead — it requires `@angular/material`, `@angular/animations`, `provideAnimationsAsync()` and a date adapter. All control types are supported; the `table` control does not implement per-column filtering yet.

```typescript
import { provideFormFieldRenderer } from '@dwtechs/ngx-crud-builder';

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideFormFieldRenderer('optimus-ui'), // spread: returns Provider[]
  ],
};
```

### `provideTableRenderer(adapter)`

**Required** when using `TableComponent`. Omitting it throws a `NullInjectorError` at runtime.

Provides the table shell (rows, columns, sorting, filtering, pagination, column resizing).

| Value | Description |
|---|---|
| `'optimus-ui'` | Full-featured Optimus UI table (`p-table`) — sorting, filtering, lazy loading, column resizing, state persistence |

> For Angular Material, use `provideMaterialTableRenderer()` from the separate `@dwtechs/ngx-crud-builder/material` entry point instead — a minimal Angular Material table (`mat-table`) with pagination, sorting, basic filtering and lazy loading; no column resizing, state persistence or context menu yet. `filterLevel` is ignored: only the basic filter row is rendered.

```typescript
import { provideTableRenderer } from '@dwtechs/ngx-crud-builder';

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideTableRenderer('optimus-ui'),
  ],
};
```

### `provideCrudRenderer(adapter)`

Convenience helper that provides both the form field renderer and the table renderer for the same adapter in one call, so the form controls and the table shell stay visually consistent. Only accepts `'optimus-ui'`, since `provideTableRenderer` has no native shell yet. For Angular Material, use `provideMaterialCrudRenderer()` from `@dwtechs/ngx-crud-builder/material` instead.

```typescript
import { provideCrudRenderer } from '@dwtechs/ngx-crud-builder';

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    ...provideCrudRenderer('optimus-ui'), // equivalent to provideFormFieldRenderer('optimus-ui') + provideTableRenderer('optimus-ui')
  ],
};
```

> If you only need to swap the form controls (e.g. to `'native'`) while keeping the Optimus UI table, call `provideFormFieldRenderer(adapter)` directly instead of `provideCrudRenderer`.

### `@dwtechs/ngx-crud-builder/material` — Angular Material adapter

A separate secondary entry point that provides the Material equivalents of the three functions above. It is kept apart from the root entry point so `@angular/material` and `@angular/animations` are only ever resolved by apps that actually import it — they stay genuinely optional otherwise.

| Function | Equivalent to |
|---|---|
| `provideMaterialFormFieldRenderer()` | `provideFormFieldRenderer('material')` |
| `provideMaterialTableRenderer()` | `provideTableRenderer('material')` |
| `provideMaterialCrudRenderer()` | `provideCrudRenderer('material')` (both of the above combined) |

```typescript
import { provideMaterialCrudRenderer } from '@dwtechs/ngx-crud-builder/material';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNativeDateAdapter } from '@angular/material/core';

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    ...provideMaterialCrudRenderer(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
  ],
};
```

### `APP_FORM_CONFIG`

Registers application-level custom validation error messages that are merged with the library's built-in messages (and with field-level `customErrorMessages`). Use this for app-specific validators shared across all forms.

```typescript
import { APP_FORM_CONFIG } from '@dwtechs/ngx-crud-builder';

{ provide: APP_FORM_CONFIG, useValue: {
  customErrorMessages: {
    // key = validator error key, value = message shown to the user
    unsafeWords: 'The text contains forbidden words: {words}',
    minDate: 'The date must be at least {days} day(s) from today',
  },
}}
```

> Message templates may include `{placeholder}` tokens that are interpolated at runtime by the validator.

### `LOCALE_ID` (Angular standard)

Set Angular's locale to match the language of your `CRUD_LABELS` override. This affects date/number formatting in Optimus UI controls.

```typescript
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';

registerLocaleData(localeEn, 'en');

// app.config.ts
{ provide: LOCALE_ID, useValue: 'en' }
```

### Complete `app.config.ts` example

```typescript
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { provideRouter } from '@angular/router';
import { provideOptimus } from '@openng/optimus-ui/config';
import { definePreset } from '@openng/optimus-ui-themes';
import Aura from '@openng/optimus-ui-themes/aura';
import {
  ACL_ADAPTER,
  APP_CONFIG,
  APP_FORM_CONFIG,
  provideCrudLabels,
  provideCrudRenderer,
} from '@dwtechs/crud-builder';
import { AclService } from './acl.service';
import { routes } from './app.routes';

const MyPreset = definePreset(Aura, {
  semantic: { primary: { /* brand colours */ } },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideOptimus({ theme: { preset: MyPreset } }),
    { provide: LOCALE_ID, useValue: 'fr' },
    { provide: APP_CONFIG, useValue: {
        title: 'My App',
        appKey: 'my_app',
        storageKeys: { TABLE_CONFIG: 'my_app_tableConfig' },
        apiPrefix: '/api/',
    }},
    { provide: ACL_ADAPTER, useExisting: AclService },
    { provide: APP_FORM_CONFIG, useValue: {
        customErrorMessages: {
          unsafeWords: 'Texte non autorisé : {words}',
        },
    }},
    ...provideCrudRenderer('optimus-ui'),
    provideCrudLabels({ /* label overrides */ }),
  ],
};

registerLocaleData(localeFr, 'fr');
```

---

## Internationalisation (i18n)

The library ships with **French default labels**. No `$localize` / Angular i18n pipeline is required. All UI strings are provided through a single `CRUD_LABELS` injection token and overridden per-application with `provideCrudLabels()`.

### `provideCrudLabels(overrides)`

Call this function once in your `ApplicationConfig` (or in any component/route `providers` array for a scoped override). Pass only the sections you want to change — the rest falls back to the French defaults automatically.

```typescript
import { provideCrudLabels } from '@dwtechs/ngx-crud-builder';

provideCrudLabels({
  toolbar: {
    export: 'Export data',
    configureColumns: 'Configure columns',
    refresh: 'Refresh',
  },
  form: {
    reset: 'Reset',
    submit: 'Save',
  },
  validators: {
    required: 'This field is required',
    emailInvalid: 'Invalid email address',
    minlength: 'Minimum {requiredLength} characters required',
    maxlength: 'Maximum {requiredLength} characters allowed',
    min: 'Value must be ≥ {min}',
    max: 'Value must be ≤ {max}',
    invalid: 'Invalid value',
    unknownValue: 'Please select one of the suggested values',
    maxFileSize: 'File exceeds the maximum allowed size',
  },
})
```

### Available label sections

| Section | Applies to |
|---|---|
| `toolbar` | Table toolbar buttons (export, refresh, configure columns) |
| `exportDialog` | Export dialog (header, format choices, data scope) |
| `columnsDialog` | Column management dialog |
| `columnsViews` | Saved column views panel |
| `tableActions` | Row action button tooltips (edit, delete) |
| `tableRegular` | Pagination report (`currentPageReport(first, last, total)`) |
| `table` | Confirmation dialogs, export error toast, default view name |
| `tableControl` | Inline table control inside forms |
| `history` | Audit / history panel column headers |
| `editionDialog` | Edition dialog header and action buttons |
| `archivedConfig` | Archive status filter and label |
| `form` | Form action buttons (reset, submit) and empty state |
| `arrayElement` | Delete button in array sub-forms |
| `dateControl` | Date picker overlay buttons |
| `richTextEditor` | Rich text editor action label |
| `fileUpload` | File upload control labels and messages |
| `autocomplete` | "Create new option" entry label |
| `picklist` | Picklist source/target column headers |
| `validators` | Form validation error messages |
| `patterns` | Regex pattern validation messages |
| `download` | Info message when printing a non-PDF file |

### Function-valued labels

Some labels are functions to allow runtime interpolation:

```typescript
provideCrudLabels({
  table: {
    deleteConfirmationMultiple: (count) =>
      `Are you sure you want to archive these ${count} items?`,
    restoreConfirmationMultiple: (count) =>
      `Are you sure you want to restore these ${count} items?`,
  },
  tableRegular: {
    currentPageReport: (first, last, total) =>
      `Showing ${first} to ${last} of ${total} entries`,
  },
  fileUpload: {
    maxFileSizeExceeded: (fileName, maxFileSize) =>
      `"${fileName}" exceeds the ${maxFileSize}-byte limit.`,
  },
})
```

### Full English override

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
  columnsDialog: { header: 'Column management', cancel: 'Cancel', save: 'Save' },
  columnsViews: {
    title: 'Views',
    add: 'Add',
    delete: 'Delete',
    rename: 'Rename',
    validate: 'Apply',
    cancel: 'Cancel',
    deleteConfirmation: 'Are you sure you want to delete this view?',
  },
  tableActions: { edit: 'Edit', delete: 'Delete' },
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
  tableControl: {
    add: 'Add',
    delete: 'Delete',
    noData: 'No data',
    actionsColumnHeader: 'Actions',
    multiselectValidate: 'Apply',
    multiselectUnsavedChanges: 'Remember to save your changes',
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
    modeCreate: 'Create',
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
  form: { reset: 'Reset', submit: 'Submit', noFields: 'No fields available' },
  arrayElement: { delete: 'Remove' },
  dateControl: { close: 'Close', clear: 'Clear', today: 'Today', validate: 'Apply' },
  richTextEditor: { editHtml: 'Edit HTML' },
  fileUpload: {
    chooseFile: 'Choose a file',
    dragDropLabel: 'Drag & drop files here, or click to select',
    uploadedFilesTitle: 'Uploaded files',
    canAddMore: 'You can add multiple files.',
    cannotAddMore:
      'Only one file allowed. Remove the current file to upload a new one.',
    maxFileSizeExceeded: (fileName, maxFileSize) =>
      `"${fileName}" exceeds the ${maxFileSize}-byte limit.`,
  },
  autocomplete: { newOption: '(new)' },
  picklist: { sourceHeader: 'Available', targetHeader: 'Selected' },
  validators: {
    required: 'This field is required',
    invalid: 'Invalid value',
    unknownValue: 'Please select one of the suggested values',
    emailInvalid: 'Invalid email address',
    minlength: 'Minimum {requiredLength} characters required',
    maxlength: 'Maximum {requiredLength} characters allowed',
    min: 'Value must be ≥ {min}',
    max: 'Value must be ≤ {max}',
    maxFileSize: 'File exceeds the maximum allowed size',
  },
  patterns: {
    nameWithDashes: 'Allowed: letters, spaces and hyphens',
    lettersWithSpaces: 'Allowed: letters and spaces',
    lettersWithoutSpaces: 'Allowed: letters only',
    alphanumericalWithSpaces: 'Allowed: letters, digits and spaces',
    alphanumerical: 'Allowed: letters and digits',
    onlyCaps: 'Allowed: uppercase letters and digits',
    integer: 'An integer is required',
    phoneNumber: 'Invalid phone number format',
    withExtension: 'A file extension is required',
  },
  download: {
    noPdfPrintWarning:
      'The file is not a PDF; printing is not available. It will be downloaded instead.',
  },
})
```

---

## Building

```bash
npm run build:lib
```

Output is placed in `dist/ngx-crud-builder/`.

## Running unit tests

```bash
npm test
```

## Further documentation

- [FormComponent](src/crud/core/doc/form.component.md)
- [TableComponent](src/crud/core/doc/table.component.md)
- [Column options](src/crud/core/doc/column-options.md)
- [Control options](src/crud/core/doc/control-options.documentation.md)

