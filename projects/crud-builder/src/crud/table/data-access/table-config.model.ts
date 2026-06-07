import { TableColumn } from "../../core/utils/table/table-column.model";

export class TableConfig {
  id: number | null | undefined = null;
  name = "";
  component = "";
  conf: ColumnConfig[] = [];
  isActive = false;
  locked = false;

  constructor(component: string, name = "Default") {
    this.component = component;
    this.name = name;
    this.isActive = true;
  }
}

export interface ExtendedTableConfig extends TableConfig {
  columns: TableColumn[];
  isCreation?: boolean;
}

export type ColumnConfig = Pick<
  TableColumn,
  "key" | "isVisible" | "defaultWidth"
>;
