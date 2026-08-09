import { Provider } from "@angular/core";
import { TableRegularMaterialComponent } from "../table-regular-material/table-regular-material.component";
import { TableRegularComponent } from "../table-regular/table-regular.component";
import { TABLE_RENDERER } from "./table-renderer.token";

/**
 * Adapters supported by `provideTableRenderer`. `'native'` has no shell yet —
 * the token exists so it can be added later without changing `TableComponent`.
 */
export type TableAdapterType = "primeng" | "material";

/**
 * Provides the table renderer shell used by `TableComponent`.
 *
 * Registers `TABLE_RENDERER` — the component rendering rows, columns, sorting,
 * filtering, pagination and column resizing.
 *
 * @param adapter `"primeng"` for the full-featured PrimeNG table shell, or
 * `"material"` for a minimal Angular Material shell (non-lazy mode only —
 * no filtering, sorting, column resizing or state persistence yet).
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [...provideTableRenderer('primeng')]
 * };
 */
export function provideTableRenderer(adapter: TableAdapterType): Provider[] {
  const shell =
    adapter === "material"
      ? TableRegularMaterialComponent
      : TableRegularComponent;
  return [{ provide: TABLE_RENDERER, useValue: shell }];
}
