import { CrudItemOptions } from "../../models/crud-item-options.model";

export type HistorizedData<T> = {
  id: number;
  tstamp: string;
  // table_name: string;
  operation: string;
  updaterId: number;
  updaterName: string;
  record: T;
};

export interface FullHistoryRow<T> extends HistorizedData<T> {
  id: number;
  changes: {
    oldValue: unknown;
    newValue: unknown;
    propKey: keyof T;
    label: string;
    hasChanged: boolean;
    confItem: CrudItemOptions;
  }[];
}
