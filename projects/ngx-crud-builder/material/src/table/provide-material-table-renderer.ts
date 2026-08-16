import { Provider } from "@angular/core";
import { TABLE_RENDERER } from "@dwtechs/ngx-crud-builder";
import { TableRegularMaterialComponent } from "./table-regular-material/table-regular-material.component";

/**
 * Provides a minimal Angular Material table shell. Only exported from
 * `@dwtechs/ngx-crud-builder/material`, so `@angular/material` and `@angular/animations`
 * are only ever resolved by apps that import this entry point.
 *
 * Non-lazy mode only (`lazy: false`) — no filtering, sorting, column resizing or
 * state persistence yet.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [...provideMaterialTableRenderer()]
 * };
 */
export function provideMaterialTableRenderer(): Provider[] {
  return [{ provide: TABLE_RENDERER, useValue: TableRegularMaterialComponent }];
}
