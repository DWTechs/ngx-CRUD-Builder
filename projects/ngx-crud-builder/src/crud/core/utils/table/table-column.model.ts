import { ColumnOptions } from "../../models/column-options.model";
import { CrudItemOptions } from "../../models/crud-item-options.model";

type TableColumnBase = CrudItemOptions & ColumnOptions;
export interface TableColumn extends TableColumnBase {
  key: string;
  isVisible?: boolean; // can be overridden by the user
  defaultWidth?: string; // can be overridden by the user
}
