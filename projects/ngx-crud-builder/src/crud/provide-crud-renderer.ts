import { Provider } from "@angular/core";
import { provideFormFieldRenderer } from "./form/ui/field-renderer/provide-form-field-renderer";
import { provideTableRenderer } from "./table/ui/table-renderer/provide-table-renderer";

/**
 * Provides matching form field and table renderers for the given adapter, so the
 * form controls and the table shell stay visually consistent (e.g. a PrimeNG form
 * next to a PrimeNG table).
 *
 * Equivalent to calling `provideFormFieldRenderer(adapter)` and
 * `provideTableRenderer(adapter)` together. Restricted to `'primeng' | 'material'`
 * since `provideTableRenderer` has no native shell yet — use
 * `provideFormFieldRenderer('native')` directly if you only need to swap the form
 * controls. The `'material'` table shell only supports non-lazy mode (`lazy = false`)
 * and has no filtering, sorting, column resizing or state persistence yet.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [...provideCrudRenderer('primeng')]
 * };
 */
export function provideCrudRenderer(
  adapter: "primeng" | "material",
): Provider[] {
  return [
    ...provideFormFieldRenderer(adapter),
    ...provideTableRenderer(adapter),
  ];
}
