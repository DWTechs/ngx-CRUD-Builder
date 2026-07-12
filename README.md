# Crud builder

A comprehensive Angular library for building dynamic forms and data tables with minimal configuration. CRUD Builder provides a declarative approach to creating complex CRUD interfaces, eliminating boilerplate code while maintaining full flexibility and type safety.

**[View Live Demo](https://crud-builder-12c1d.web.app)**

## Migration notes

Recent versions include important migration points:

- Breaking: form renderer adapter is mandatory. Register `provideFormFieldRenderer('primeng' | 'native')` in app providers, otherwise forms and edition dialogs fail with `NullInjectorError`.
- Naming update: table URL sync input is now `isUrlStateSyncEnabled`. The old `canAccessItemFromUrl` name remains available as a deprecated alias.

See the full package migration details in `projects/crud-builder/README.md`.

---

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
git clone https://github.com/estellepicq/crud-builder.git
cd crud-builder

# Install dependencies
npm install

# Start the development server
ng serve

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

**Documentation** (`/doc`)
- Detailed configuration options reference
- Code examples and usage patterns
- Best practices and common patterns
