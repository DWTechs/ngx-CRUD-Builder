import { isArray } from "@dwtechs/checkard";
import { FilterMetadata } from "primeng/api";
import { TableLazyLoadEvent } from "primeng/table";
import { getDateRangeWithoutTime } from "../../../core/utils/dates/dates.utils";

export function cleanFilters(params: TableLazyLoadEvent | undefined) {
  if (!params) {
    return;
  }
  const { rows, ...rest } = JSON.parse(
    JSON.stringify(params),
  ) as TableLazyLoadEvent & { limit?: number };
  const cleanParams = { ...rest, limit: rest.limit ?? rows } as Omit<
    TableLazyLoadEvent,
    "rows"
  > & { limit: number | undefined };
  if (!cleanParams.filters) {
    return cleanParams;
  }
  for (const key of Object.keys(cleanParams.filters)) {
    const filter = cleanParams.filters[key];
    if (!filter) {
      continue;
    }
    if (isFilterNull(filter)) {
      delete cleanParams.filters[key];
    }
    if (!isValueArray(filter) && isDateRangeFilter(filter)) {
      filter.value = getDateRangeWithoutTime(filter.value as [Date, Date]);
    }
  }
  return cleanParams;
}

function isValueArray(
  filter: FilterMetadata | FilterMetadata[],
): filter is FilterMetadata[] {
  return isArray(filter);
}

function isFilterNull(filter: FilterMetadata | FilterMetadata[]): boolean {
  const isArrayFilter = isValueArray(filter);
  const isFilterNull =
    (isArrayFilter && filter[0].value === null) ||
    (!isArrayFilter && filter?.value === null);
  return isFilterNull;
}

function isDateRangeFilter(filter: FilterMetadata): boolean {
  return filter.matchMode === "dateRange" && filter.value?.length;
}
