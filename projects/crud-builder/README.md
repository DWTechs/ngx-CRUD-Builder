# @dwtechs/crud-builder

An Angular component library providing a full CRUD experience: dynamic reactive forms, configurable data tables, edition dialogs, column management, export, history, and more.

## Requirements

- Angular ≥ 21
- PrimeNG ≥ 21

## Installation

```bash
npm install @dwtechs/crud-builder
```

## Quick start

### 1. Add the required providers

The library relies on PrimeNG's `ConfirmationService` and `MessageService`, and requires a PrimeNG theme to be configured via `providePrimeNG()`.

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import { ConfirmationService, MessageService } from 'primeng/api';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { provideCrudLabels } from '@dwtechs/crud-builder';

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: { /* your brand colours */ },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    providePrimeNG({
      theme: { preset: MyPreset },
    }),
    MessageService,
    ConfirmationService,
    // optional – defaults to French
    provideCrudLabels({ /* your overrides */ }),
  ],
};
```

> **`ConfirmationService`** is used by the table's archive/restore confirmation dialogs.  
> **`MessageService`** is used for the export-failure toast notification.  
> Both must be provided at the root level (or at the level of the component tree that hosts `<tbl-table>`).

### 2. Add the components

```typescript
// my-page.component.ts
import { TableComponent } from '@dwtechs/crud-builder';

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
import { APP_CONFIG } from '@dwtechs/crud-builder';

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
import { ACL_ADAPTER, AclAdapter, CallsPermissions } from '@dwtechs/crud-builder';

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

### `APP_FORM_CONFIG`

Registers application-level custom validation error messages that are merged with the library's built-in messages (and with field-level `customErrorMessages`). Use this for app-specific validators shared across all forms.

```typescript
import { APP_FORM_CONFIG } from '@dwtechs/crud-builder';

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

Set Angular's locale to match the language of your `CRUD_LABELS` override. This affects date/number formatting in PrimeNG controls.

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
import { providePrimeNG } from 'primeng/config';
import { ConfirmationService, MessageService } from 'primeng/api';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import {
  ACL_ADAPTER,
  APP_CONFIG,
  APP_FORM_CONFIG,
  provideCrudLabels,
} from '@dwtechs/crud-builder';
import { AclService } from './acl.service';
import { routes } from './app.routes';

const MyPreset = definePreset(Aura, {
  semantic: { primary: { /* brand colours */ } },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    providePrimeNG({ theme: { preset: MyPreset } }),
    MessageService,
    ConfirmationService,
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
import { provideCrudLabels } from '@dwtechs/crud-builder';

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

Output is placed in `dist/crud-builder/`.

## Running unit tests

```bash
npm test
```

## Further documentation

- [FormComponent](src/crud/core/doc/form.component.md)
- [TableComponent](src/crud/core/doc/table.component.md)
- [Column options](src/crud/core/doc/column-options.md)
- [Control options](src/crud/core/doc/control-options.documentation.md)

