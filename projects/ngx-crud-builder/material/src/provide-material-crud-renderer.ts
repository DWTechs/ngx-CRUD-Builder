import { Provider } from "@angular/core";
import { provideMaterialFormFieldRenderer } from "./form/provide-material-form-field-renderer";
import { provideMaterialTableRenderer } from "./table/provide-material-table-renderer";

/**
 * Provides matching Material form field and table renderers, so the form controls and
 * the table shell stay visually consistent. Only exported from
 * `@dwtechs/ngx-crud-builder/material`, so `@angular/material` and `@angular/animations`
 * are only ever resolved by apps that import this entry point.
 *
 * Equivalent to calling `provideMaterialFormFieldRenderer()` and
 * `provideMaterialTableRenderer()` together.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [...provideMaterialCrudRenderer()]
 * };
 */
export function provideMaterialCrudRenderer(): Provider[] {
  return [
    ...provideMaterialFormFieldRenderer(),
    ...provideMaterialTableRenderer(),
  ];
}
