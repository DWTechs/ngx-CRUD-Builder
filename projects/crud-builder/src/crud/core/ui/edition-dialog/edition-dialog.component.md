# EditionDialogComponent Documentation

## Overview
A generic dialog component for creating and editing CRUD entities. Provides a dynamic form interface with history tracking, validation, and configurable actions based on user permissions and CRUD features.

## Generic Type
```typescript
EditionDialogComponent<TData extends CrudItemBase>
```
The component is generic and works with any data type that extends `CrudItemBase`.

## Inputs

### Core Configuration

#### `config`
**Type:** `CrudItemOptions[]` | **Default:** `[]`  
**Description:** Configuration array that defines the structure and behavior of form fields.

```typescript
config: [
  {
    key: 'name',
    label: 'Name',
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
    controlOptions: {
        validators: [Validators.required]
    }
  },
  {
    key: 'age',
    label: 'Age',
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.NUMBER,
    controlOptions: {
      hidden: true,
    }
  }
]
```

#### `features`
**Type:** `CrudFeatures` | **Default:** `{} as CrudFeatures`  
**Description:** CRUD features configuration that defines available operations.

```typescript
features: {
  create: true,
  read: true,
  update: true,
  archive: true,
  getHistory: true,
  export: false
}
```

### Dialog Configuration

#### `header`
**Type:** `string` | **Default:** `""`  
**Description:** Dialog header title text.

```typescript
// Simple title
header: "Edit User"

// Dynamic title based on mode
header: isCreation ? "Create New User" : "Edit User"
```

#### `width`
**Type:** `string` | **Default:** `"50vw"`  
**Description:** Dialog width using CSS values.

```typescript
// Percentage of viewport
width: "80vw"

// Fixed pixels
width: "600px"

// Responsive breakpoints
width: "min(90vw, 800px)"
```

#### `height`
**Type:** `string | undefined` | **Default:** `undefined`  
**Description:** Dialog height using CSS values.

```typescript
// Auto height (default)
height: undefined

// Fixed height
height: "70vh"

// Maximum height
height: "max(500px, 60vh)"
```

### Form Behavior

#### `isCreation`
**Type:** `boolean` | **Default:** `false`  
**Description:** Whether the dialog is in creation mode (vs edit mode).

```typescript
// Creation mode - shows create form
<crd-edition-dialog [isCreation]="true" />

// Edit mode - shows edit form
<crd-edition-dialog [isCreation]="false" />

// Dynamic based on data
<crd-edition-dialog [isCreation]="!selectedItem?.id" />
```

#### `groupValidator`
**Type:** `ValidatorFn | undefined`  
**Description:** Custom validator applied to the entire form group.

```typescript
// Cross-field validation
groupValidator: (group: AbstractControl) => {
  const startDate = group.get('startDate')?.value;
  const endDate = group.get('endDate')?.value;
  
  if (startDate && endDate && startDate > endDate) {
    return { dateRange: 'Start date must be before end date' };
  }
  
  return null;
}
```

### History and Permissions

#### `getHistory`
**Type:** `(id: number) => Observable<{rows: unknown[], total: number}>` | **Default:** `undefined`  
**Description:** Function to retrieve history data for an entry by ID. The rows can be raw/unknown when used together with `HISTORY_MAPPER` or `historyMapper`.

```typescript
getHistory: (id: number) => {
  return this.userService.getHistory(id).pipe(
    map(response => ({
      rows: response.data,
      total: response.total
    }))
  );
}
```

#### `historyMapper`
**Type:** `(raw: unknown) => HistorizedData<TData>` | **Default:** `undefined`  
**Description:** Per-component mapper to transform raw API history rows into the `HistorizedData<TData>` shape. Takes precedence over the global `HISTORY_MAPPER` token.

For app-wide configuration, prefer providing the `HISTORY_MAPPER` injection token in `app.config.ts` (see below).

```typescript
// In the host component
historyMapper = (raw: unknown): HistorizedData<User> => {
  const r = raw as { timestamp: string; action: string; consumerId: number; consumerName: string; data: User };
  return {
    tstamp: r.timestamp,
    operation: r.action,
    updaterId: r.consumerId,
    updaterName: r.consumerName,
    val: r.data,
    table_name: 'users',
  };
};
```

#### Global mapper — `HISTORY_MAPPER` token
**Type:** `InjectionToken<(raw: unknown) => HistorizedData<unknown>>`  
**Description:** Provide this token once in `app.config.ts` to define a global history mapper for all dialogs in the application. The `historyMapper` input overrides this token when both are defined.

```typescript
// app.config.ts
import { HISTORY_MAPPER } from '@crud/core/ui/history/history-mapper.token';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: HISTORY_MAPPER,
      useValue: (raw: unknown): HistorizedData<unknown> => {
        const r = raw as {
          timestamp: string;
          action: string;
          consumerId: number;
          consumerName: string;
          data: unknown;
        };
        return {
          tstamp: r.timestamp,
          operation: r.action,
          updaterId: r.consumerId,
          updaterName: r.consumerName,
          val: r.data,
          table_name: 'unknown',
        };
      },
    },
  ],
};
```

#### `functionalityKey`
**Type:** `number | undefined`  
**Description:** Unique identifier for functionality access control.

```typescript
// Used for permission checking
functionalityKey: 42 // Maps to specific functionality in access control system
```

### Model Inputs

#### `editedEntry` (required, model)
**Type:** `TData`  
**Description:** The data object being edited (two-way binding).

```typescript
// Initial data for editing
editedEntry: {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  status: 'active'
}

// Empty object for creation
editedEntry: {} as User
```

#### `isVisible` (model)
**Type:** `boolean` | **Default:** `false`  
**Description:** Controls dialog visibility state (two-way binding).

```typescript
// Show dialog
[(isVisible)]="showDialog"

// Hide dialog programmatically
this.showDialog = false;
```

## Outputs

- `archived: TData | null` - Emitted when entry is archived/deleted
- `edited: TData | null` - Emitted when entry is edited (value changes)
- `formChanged: TData` - Emitted when form values change
- `hide: void` - Emitted when dialog should be hidden
- `saved: TData | null` - Emitted when entry is saved
- `validityChanged: boolean` - Emitted when form validation state changes

## Public Properties

### `invalidForm`
**Type:** `boolean`  
**Description:** Whether the form is currently invalid. Used to control save button state.

### `forceReloadTime`
**Type:** `Signal<number>`  
**Description:** Timestamp signal to force form reload when history is selected.

### `history$`
**Type:** `Observable<{rows: HistorizedData<TData>[], total: number}>`  
**Description:** Observable stream of history data for the current entry.

### `isSaveButtonDisplayed`
**Type:** `Signal<boolean>`  
**Description:** Computed property that determines if save button should be shown based on permissions and form state.

## Usage Examples

### Basic CRUD Dialog
```typescript
<crd-edition-dialog
  [(editedEntry)]="selectedUser"
  [(isVisible)]="showEditDialog"
  [config]="userFormConfig"
  [features]="crudFeatures"
  [header]="isCreation ? 'Create User' : 'Edit User'"
  [isCreation]="!selectedUser?.id"
  (saved)="onUserSaved($event)"
  (archived)="onUserDeleted($event)"
  (hide)="closeDialog()"
/>
```
