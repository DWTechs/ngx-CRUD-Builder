import { Provider } from "@angular/core";
import { provideFormFieldRenderer } from "./form/ui/field-renderer/provide-form-field-renderer";
import { provideTableRenderer } from "./table/ui/table-renderer/provide-table-renderer";

/**
 * Provides matching form field and table renderers for the given adapter, so the
 * form controls and the table shell stay visually consistent (e.g. a PrimeNG form
 * next to a PrimeNG table).
 *
 * Equivalent to calling `provideFormFieldRenderer(adapter)` and
 * `provideTableRenderer(adapter)` together. Restricted to `'primeng'` since
 * `provideTableRenderer` has no native/material shell yet — use
 * `provideFormFieldRenderer('native' | 'material')` directly if you only need to
 * swap the form controls.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [...provideCrudRenderer('primeng')]
 * };
 */
export function provideCrudRenderer(adapter: "primeng"): Provider[] {
  return [
    ...provideFormFieldRenderer(adapter),
    ...provideTableRenderer(adapter),
  ];
}
