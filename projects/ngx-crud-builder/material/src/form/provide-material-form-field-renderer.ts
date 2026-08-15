import { Provider } from "@angular/core";
import {
  FORM_ADAPTER,
  FORM_FIELD_COMPONENT,
  FORM_FIELD_RENDERER,
} from "@dwtechs/ngx-crud-builder";
import { MaterialFormFieldComponent } from "./field-renderer/material-form-field.component";
import { MaterialFormFieldRenderer } from "./field-renderer/material-form-field-renderer";

/**
 * Provides Angular Material form field controls. Only exported from
 * `@dwtechs/ngx-crud-builder/material`, so `@angular/material` and `@angular/animations`
 * are only ever resolved by apps that import this entry point.
 *
 * Leaves controls with no Material equivalent unsupported (color, files, picklist,
 * table, custom, wysiwyg). Also requires `provideAnimationsAsync()` (or
 * `provideNoopAnimations()`) and a date adapter such as `provideNativeDateAdapter()`.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [...provideMaterialFormFieldRenderer()]
 * };
 */
export function provideMaterialFormFieldRenderer(): Provider[] {
  return [
    { provide: FORM_ADAPTER, useValue: "material" },
    { provide: FORM_FIELD_RENDERER, useValue: MaterialFormFieldRenderer },
    { provide: FORM_FIELD_COMPONENT, useValue: MaterialFormFieldComponent },
  ];
}
