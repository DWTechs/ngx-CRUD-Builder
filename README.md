# Crud builder

A comprehensive Angular library for building dynamic forms and data tables with minimal configuration. CRUD Builder provides a declarative approach to creating complex CRUD interfaces, eliminating boilerplate code while maintaining full flexibility and type safety.

**[View Live Demo](https://crud-builder-12c1d.web.app)**

> **Compatibility:** requires Angular **^21.1** and PrimeNG **^21.1** (`@primeng/themes ^21.0`, `@primeuix/themes ^2.0`, `primeicons ^7`). The library version tracks Angular's major version — use the matching major.

> **Native renderer (experimental):** a `provideNativeFormFieldRenderer()` adapter exists to render form fields without PrimeNG. It covers all control types but is not production-ready — styling and edge-case behaviour are incomplete. Use `providePrimengFormFieldRenderer()` for all current integrations.

## Crud builder library

CRUD Builder transforms configuration objects into fully functional forms and tables, handling validation, data binding, CRUD operations, and UI rendering automatically.

### Features

**Dynamic form generation**
- 15+ input types: text, number, email, date, select, multi-select, autocomplete, checkbox, radio, file upload, and more
- Automatic form validation with built-in and custom validators
- Conditional field visibility and disabled states
- Nested form groups and form arrays
- File upload with preview and multiple file support

**Advanced data tables**
- Sortable and filterable columns with basic and advanced filter modes
- Pagination with customizable page sizes
- Lazy loading for large datasets
- Row selection and bulk operations
- Column visibility management with user preferences
- Resizable and reorderable columns
- Excel and CSV export capabilities
- Context menu support
- Deep linking to specific items via URL parameters

**CRUD operations**
- Automatic HTTP call integration
- Create, read, update, and delete functionality
- Optimistic UI updates with error handling
- Archive/restore capabilities
- History tracking for auditing

**Customization**
- Custom row styles based on data
- Custom action templates
- Configurable dialog sizes and dimensions
- Access control integration
- Localization support (French by default, fully overridable via `provideCrudLabels()`)

---

## The demo application

The demo application showcases all features of the CRUD Builder library through interactive examples. It includes a form builder demo and a comprehensive table demo with live configuration controls.

**[Access the Live Demo](https://crud-builder-12c1d.web.app)**

### Running the demo

To run the demo locally:

```bash
# Clone the repository
git clone https://github.com/DWTechs/ngx-crud-builder.git
cd ngx-crud-builder

# Install dependencies
npm install

# Start the development server
npm run start:demo

# Navigate to http://localhost:4200
```

The demo will automatically reload when you make changes to the source files.

### Demo features

**Form demo** (`/`)
- Interactive form builder with live preview
- Configure form columns, validation modes, and field visibility
- Test all input types and validation scenarios
- Real-time form state monitoring

**Table demo** (`/table`)
- Comprehensive table configuration playground
- Toggle 20+ table features in real-time
- Test pagination, sorting, and filtering
- Experiment with dialog sizes and export options
- Mock CRUD operations with simulated API delays

**Full example** (`/full-example`)

A realistic IT request management scenario that combines all major library features in one cohesive application. It demonstrates how the `TableComponent` integrates with a service, custom views, access control, and route-based data.

- **Entity:** `ItRequest` — tracks hardware requests (laptop, screen, smartphone, accessory) with fields for type, model, OS, screen size, budget, justification, attachment, and manager validation
- **Dynamic field visibility:** `model` and `os` fields appear only for laptops and smartphones; `screenSize` only for screens; `accessoryType` only for laptops; `justification` and `attachment` only when `estimatedBudget > 1500 €`
- **Custom validators:** a `dateValidator` ensures `desiredDate` is at least 5 days in the future; a cross-field `budgetValidator` (group validator) enforces per-type budget ceilings (e.g. screen ≤ 800 €, laptop ≤ 3000 €)
- **Named views (column preferences):** three saved views — *Vue par défaut*, *Vue matériel*, *Vue administrative* — each with a different column visibility preset managed via `TableConfigService`
- **Access control:** `httpCalls` (create, update, archive, restore) are filtered at runtime through `ACL_ADAPTER` based on the route's `functionalityKey`
- **History tracking:** `getHistory` is wired to per-item audit data and exposed through the table's built-in history dialog
- **Table features enabled:** lazy loading, row selection, Excel export, advanced filters, URL sync for page and selected item, clickable rows, preferences mode, `editionDialogSize: "m"`

**File layout**

```
full-example/
├── data-access/
│   └── requests/
│       ├── request.model.ts          # ItRequest interface + factory
│       ├── request.conf.ts           # StrictCrudItemOptions[] field config
│       ├── request-group.validator.ts # Cross-field budget validator
│       ├── requests-data.ts          # Mock data + lookup lists
│       ├── requests-views.ts         # Saved TableConfig views
│       └── requests.service.ts       # CrudRepository + httpCalls
└── features/
    └── requests.ts                   # RequestsComponent (TableComponent host)
```

**Documentation** (`/doc`)
- Detailed configuration options reference
- Code examples and usage patterns
- Best practices and common patterns
