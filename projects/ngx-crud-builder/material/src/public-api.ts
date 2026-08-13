// Secondary entry point: `@dwtechs/ngx-crud-builder/material`.
// Kept separate from the root entry point so `@angular/material` and
// `@angular/animations` are only ever resolved by apps that import this module.
export * from "./form/provide-material-form-field-renderer";
export * from "./provide-material-crud-renderer";
export * from "./table/provide-material-table-renderer";
