import { CONTROL_TYPES } from "../../models/control-type.model";
import { StrictCrudItemOptions } from "../../models/crud-item-options.model";
import { CrudLabels, DEFAULT_CRUD_LABELS } from "../i18n/crud-labels.token";

export class ArchiveInfo {
  updatedAt: Date | null = null;
  updaterId: number | null = null;
  updaterName: string | null = null;
  createdAt: Date | null = null;
  creatorId: number | null = null;
  creatorName: string | null = null;
  archived = false;
  archivedAt: Date | null = null;
}

export function createArchivedConfig(
  labels: CrudLabels["archivedConfig"] = DEFAULT_CRUD_LABELS.archivedConfig,
): StrictCrudItemOptions<ArchiveInfo>[] {
  return [
    {
      key: "archived",
      controlType: CONTROL_TYPES.CHECKBOX,
      label: labels.label,
      columnOptions: {
        isSoftHidden: true,
        customCellRenderer: (cellValue) => {
          return cellValue
            ? `<span class="red">${labels.archived}</span>`
            : `<span class="green">${labels.active}</span>`;
        },
        tooltip: (cellValue) => {
          return cellValue ? labels.archived : labels.active;
        },
      },
      controlOptions: {
        hidden: true,
      },
    },
    {
      key: "archivedAt",
      controlType: CONTROL_TYPES.DATE,
      label: labels.labelAt,
      columnOptions: {
        isSoftHidden: true,
      },
      controlOptions: {
        hidden: true,
      },
    },
  ];
}

/** @deprecated Use createArchivedConfig() instead */
export const ARCHIVED_CONFIG = createArchivedConfig();
