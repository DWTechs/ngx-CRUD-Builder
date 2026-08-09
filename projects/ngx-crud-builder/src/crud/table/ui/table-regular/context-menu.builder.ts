import { TableRegularComponent } from "./table-regular.component";
import { MenuItem } from "@openng/optimus-ui/api";

export function buildContextMenu<TData>(
  tableRegular: TableRegularComponent<TData>,
): MenuItem[] {
  if (!tableRegular.isContextMenuEnabled()) return [];

  const seeItem = {
    label: "Visualiser",
    icon: "pi pi-fw pi-eye",
    command: () => {
      if (!tableRegular.rightClickedEntry) {
        return;
      }
      tableRegular.cellClicked.emit({
        row: tableRegular.rightClickedEntry,
        mode: "read",
      });
    },
  };

  const items = [seeItem];

  const editItem = {
    label: "Modifier",
    icon: "pi pi-fw pi-pencil",
    command: () => {
      if (!tableRegular.rightClickedEntry) {
        return;
      }
      tableRegular.cellClicked.emit({
        row: tableRegular.rightClickedEntry,
        mode: "write",
      });
    },
  };

  if (tableRegular.features().update) {
    items.push(editItem);
  }

  return items;
}
