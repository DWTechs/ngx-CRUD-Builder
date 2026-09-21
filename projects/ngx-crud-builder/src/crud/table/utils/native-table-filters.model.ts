import { CONTROL_TYPES } from "../../core/models/control-type.model";
import { TableColumn } from "../../core/utils/table/table-column.model";

/**
 * Structurally compatible with Optimus UI's `FilterMetadata`, declared locally so the
 * native adapter does not depend on the Optimus UI API package.
 */
export interface NativeFilterMetadata {
  value: unknown;
  matchMode: string;
}

export type NativeTableFilters = Record<string, NativeFilterMetadata>;

/** Match mode applied to a column, mirroring the Optimus UI basic filter row. */
export function filterMatchMode(col: TableColumn): string {
  switch (col.filterType) {
    case CONTROL_TYPES.DATE:
      return "dateRange";
    case CONTROL_TYPES.MULTISELECT:
      return "in";
    case CONTROL_TYPES.CHECKBOX:
    case CONTROL_TYPES.SELECT:
      return "equals";
    case CONTROL_TYPES.INPUT:
      return col.type === "number" ? "equals" : "contains";
    default:
      return "contains";
  }
}

export function isEmptyFilterValue(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return true;
  if (Array.isArray(value)) {
    return !value.length || value.every((item) => item === null);
  }
  return false;
}

/** Flattens the advanced-mode array form so both shapes can seed the native filter row. */
export function normalizeFilters(
  filters: Record<string, unknown> | undefined,
): NativeTableFilters {
  const normalized: NativeTableFilters = {};
  for (const [key, meta] of Object.entries(filters ?? {})) {
    const single = (Array.isArray(meta) ? meta[0] : meta) as
      | NativeFilterMetadata
      | undefined;
    if (single && !isEmptyFilterValue(single.value)) {
      normalized[key] = single;
    }
  }
  return normalized;
}

export function matchesFilters(
  row: unknown,
  filters: NativeTableFilters,
): boolean {
  const record = row as Record<string, unknown>;
  return Object.entries(filters).every(([key, meta]) =>
    matchesFilter(record[key], meta),
  );
}

function matchesFilter(
  cellValue: unknown,
  { value, matchMode }: NativeFilterMetadata,
): boolean {
  if (isEmptyFilterValue(value)) return true;
  switch (matchMode) {
    case "in":
      return (value as unknown[]).some((item) =>
        Array.isArray(cellValue)
          ? cellValue.includes(item)
          : cellValue === item,
      );
    case "equals":
      return cellValue === value;
    case "dateRange":
      return matchesDateRange(cellValue, value as unknown[]);
    default:
      return String(cellValue ?? "")
        .toLowerCase()
        .includes(String(value).toLowerCase());
  }
}

function matchesDateRange(cellValue: unknown, range: unknown[]): boolean {
  const from = midnightTime(range?.[0]);
  if (from === null) return true;
  const cell = midnightTime(cellValue);
  if (cell === null) return false;
  const to = midnightTime(range?.[1]);
  return to === null ? cell >= from : cell >= from && cell <= to;
}

function midnightTime(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const date =
    value instanceof Date ? new Date(value) : new Date(value as string);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() - b.getTime();
  }
  return String(a).localeCompare(String(b));
}
