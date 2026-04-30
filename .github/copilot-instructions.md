# crud-builder — Project Guidelines

## Structure

This is an Angular monorepo with two projects:

- **`projects/crud-builder/`** — The published library. Contains the `TableComponent`, `FormComponent`, models, services, and utilities.
- **`projects/crud-builder-demo/`** — The demo app that showcases the library. Contains live examples and the documentation page rendered in the browser.

## Documentation

Inline documentation lives in `projects/crud-builder/src/crud/core/doc/`:
- `table.component.md`
- `form.component.md`
- `column-options.md`
- `control-options.documentation.md`

The rendered doc page is in `projects/crud-builder-demo/src/app/doc/`.

## Demo pages

| Page | Path |
|------|------|
| Table demo | `projects/crud-builder-demo/src/app/table-demo/` |
| Form demo | `projects/crud-builder-demo/src/app/form-demo/` |
| Full example | `projects/crud-builder-demo/src/app/full-example/` |

## Public API

Exports are declared in `projects/crud-builder/src/public-api.ts`.
