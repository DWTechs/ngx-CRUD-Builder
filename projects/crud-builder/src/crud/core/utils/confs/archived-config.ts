import { CONTROL_TYPES } from "../../models/control-type.model";
import { StrictCrudItemOptions } from "../../models/crud-item-options.model";

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

export const ARCHIVED_CONFIG: StrictCrudItemOptions<ArchiveInfo>[] = [
  {
    key: "archived",
    controlType: CONTROL_TYPES.CHECKBOX,
    label: $localize`:@@Shared_ArchivedComment:Archivé`,
    columnOptions: {
      isSoftHidden: true,
      customCellRenderer: (cellValue) => {
        return cellValue
          ? '<span class="red">Archivé</span>'
          : '<span class="green">Actif</span>';
      },
      tooltip: (cellValue) => {
        return cellValue ? "Archivé" : "Actif";
      },
    },
    controlOptions: {
      hidden: true,
    },
  },
  {
    key: "archivedAt",
    controlType: CONTROL_TYPES.DATE,
    label: $localize`:@@Shared_ArchivedAtComment:Archivé le`,
    columnOptions: {
      isSoftHidden: true,
    },
    controlOptions: {
      hidden: true,
    },
  },
];
