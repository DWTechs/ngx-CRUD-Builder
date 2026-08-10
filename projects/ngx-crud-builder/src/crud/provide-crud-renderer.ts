import { Provider } from "@angular/core";
import { provideFormFieldRenderer } from "./form/ui/field-renderer/provide-form-field-renderer";
import { provideTableRenderer } from "./table/ui/table-renderer/provide-table-renderer";

/**
 * Provides matching form field and table renderers for the given adapter, so the
 * form controls and the table shell stay visually consistent (e.g. an Optimus UI form
 * next to an Optimus UI table).
 *
 * Equivalent to calling `provideFormFieldRenderer(adapter)` and
 * `provideTableRenderer(adapter)` together. Restricted to `'optimus-ui' | 'material'`
 * since `provideTableRenderer` has no native shell yet — use
 * `provideFormFieldRenderer('native')` directly if you only need to swap the form
 * controls. The `'material'` table shell only supports non-lazy mode (`lazy = false`)
 * and has no filtering, sorting, column resizing or state persistence yet.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [...provideCrudRenderer('optimus-ui')]
 * };
 */
export function provideCrudRenderer(
  adapter: "optimus-ui" | "material",
): Provider[] {
  return [
    ...provideFormFieldRenderer(adapter),
    ...provideTableRenderer(adapter),
  ];
}
