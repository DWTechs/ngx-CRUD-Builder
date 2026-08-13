import { Provider } from "@angular/core";
import { TableRegularComponent } from "../table-regular/table-regular.component";
import { TABLE_RENDERER } from "./table-renderer.token";

/**
 * Adapters supported by `provideTableRenderer`. `'native'` has no shell yet —
 * the token exists so it can be added later without changing `TableComponent`.
 */
export type TableAdapterType = "optimus-ui";

/**
 * Provides the table renderer shell used by `TableComponent`.
 *
 * Registers `TABLE_RENDERER` — the component rendering rows, columns, sorting,
 * filtering, pagination and column resizing.
 *
 * @param adapter `"optimus-ui"` for the full-featured Optimus UI table shell.
 * For a minimal Angular Material shell, use `provideMaterialTableRenderer()` from
 * `@dwtechs/ngx-crud-builder/material` instead — kept in a separate entry point so
 * `@angular/material` is never resolved by apps that don't use it.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [...provideTableRenderer('optimus-ui')]
 * };
 */
export function provideTableRenderer(_adapter: TableAdapterType): Provider[] {
  return [{ provide: TABLE_RENDERER, useValue: TableRegularComponent }];
}
