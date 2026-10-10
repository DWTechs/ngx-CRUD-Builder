import { Provider } from "@angular/core";
import { TableRegularComponent } from "../table-regular/table-regular.component";
import { TableRegularNativeComponent } from "../table-regular-native/table-regular-native.component";
import { TABLE_RENDERER } from "./table-renderer.token";

/** Adapters supported by `provideTableRenderer`. */
export type TableAdapterType = "optimus-ui" | "native";

/**
 * Provides the table renderer shell used by `TableComponent`.
 *
 * Registers `TABLE_RENDERER` — the component rendering rows, columns, sorting,
 * filtering, pagination and column resizing.
 *
 * @param adapter `"optimus-ui"` for the full-featured Optimus UI table shell,
 * `"native"` for a plain HTML shell (pagination, sorting, basic filtering and lazy mode,
 * but no column resizing, state persistence or context menu).
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
export function provideTableRenderer(adapter: TableAdapterType): Provider[] {
  return [
    {
      provide: TABLE_RENDERER,
      useValue:
        adapter === "native"
          ? TableRegularNativeComponent
          : TableRegularComponent,
    },
  ];
}
