import { InjectionToken } from "@angular/core";
import { HistorizedData } from "./history.model";

/**
 * Optional injection token to provide a global mapper that transforms raw API history rows
 * into the `HistorizedData` shape expected by the history component.
 *
 * Provide this token in your `app.config.ts` when your API response shape differs
 * from the `HistorizedData` contract (e.g. different field names).
 *
 * The `historyMapper` input on `EditionDialogComponent` takes precedence over this token
 * when both are defined.
 *
 * @example
 * // app.config.ts
 * {
 *   provide: HISTORY_MAPPER,
 *   useValue: (raw: unknown): HistorizedData<unknown> => {
 *     const r = raw as { timestamp: string; action: string; consumerId: number; consumerName: string; data: unknown };
 *     return {
 *       tstamp: r.timestamp,
 *       operation: r.action,
 *       updaterId: r.consumerId,
 *       updaterName: r.consumerName,
 *       val: r.data,
 *       table_name: 'unknown',
 *     };
 *   }
 * }
 */
export const HISTORY_MAPPER = new InjectionToken<
  (raw: unknown) => HistorizedData<unknown>
>("HISTORY_MAPPER");
