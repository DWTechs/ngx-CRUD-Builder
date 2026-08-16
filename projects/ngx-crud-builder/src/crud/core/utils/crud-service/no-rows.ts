import { Rows, RowsAndCount } from "./dto.model";

// biome-ignore lint/suspicious/noExplicitAny: must be assignable to RowsAndCount<T>/Rows<T> for any unconstrained generic T; unknown breaks that assignability
export const NO_ROWS_AND_COUNT: RowsAndCount<any> = {
  rows: [],
  total: 0,
};

// biome-ignore lint/suspicious/noExplicitAny: see NO_ROWS_AND_COUNT above
export const NO_ROWS: Rows<any> = {
  rows: [],
};
