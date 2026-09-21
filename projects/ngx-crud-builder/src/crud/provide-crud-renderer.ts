import { Provider } from "@angular/core";
import { provideFormFieldRenderer } from "./form/ui/field-renderer/provide-form-field-renderer";
import { provideTableRenderer } from "./table/ui/table-renderer/provide-table-renderer";

/**
 * Provides matching form field and table renderers for the given adapter, so the
 * form controls and the table shell stay visually consistent.
 *
 * Equivalent to calling `provideFormFieldRenderer(adapter)` and
 * `provideTableRenderer(adapter)` together. Accepts `'optimus-ui'` or `'native'` — use
 * `provideMaterialCrudRenderer()` from `@dwtechs/ngx-crud-builder/material` for the
 * Material adapter.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [...provideCrudRenderer('optimus-ui')]
 * };
 */
export function provideCrudRenderer(
  adapter: "optimus-ui" | "native",
): Provider[] {
  return [
    ...provideFormFieldRenderer(adapter),
    ...provideTableRenderer(adapter),
  ];
}
