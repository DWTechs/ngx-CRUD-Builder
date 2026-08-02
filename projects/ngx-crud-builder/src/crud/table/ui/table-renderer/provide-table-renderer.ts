import { Provider } from "@angular/core";
import { TableRegularComponent } from "../table-regular/table-regular.component";
import { TABLE_RENDERER } from "./table-renderer.token";

/**
 * Adapters supported by `provideTableRenderer`. Currently only `'primeng'` has a
 * full shell implementation — the token exists so native/material shells can be
 * added later without changing `TableComponent`.
 */
export type TableAdapterType = "primeng";

/**
 * Provides the table renderer shell used by `TableComponent`.
 *
 * Registers `TABLE_RENDERER` — the component rendering rows, columns, sorting,
 * filtering, pagination and column resizing.
 *
 * @param adapter `"primeng"` for the PrimeNG-based table shell.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [...provideTableRenderer('primeng')]
 * };
 */
export function provideTableRenderer(_adapter: TableAdapterType): Provider[] {
  return [{ provide: TABLE_RENDERER, useValue: TableRegularComponent }];
}
