import { InjectionToken, Type } from "@angular/core";

/**
 * Injection token used to provide the table renderer shell component (the part of
 * `<tbl-table>` responsible for rendering rows, columns, sorting, filtering, pagination
 * and column resizing).
 *
 * **Required** — the application will throw a `NullInjectorError` at runtime
 * if this token is not provided. Use `provideTableRenderer('primeng')` to keep
 * the default PrimeNG behaviour.
 *
 * The provided component must accept the same inputs/outputs as `TableRegularComponent`.
 *
 * @see TableRegularComponent for the reference implementation satisfying this contract.
 */
export const TABLE_RENDERER = new InjectionToken<Type<unknown>>(
  "TABLE_RENDERER",
);
