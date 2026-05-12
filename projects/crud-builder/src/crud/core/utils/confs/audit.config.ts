import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { StrictCrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { INPUT_TYPES } from "@crud/core/models/input-type.model";
import { ArchiveInfo } from "@crud/core/utils/confs/archived-config";
import {
  CrudLabels,
  DEFAULT_CRUD_LABELS,
} from "@crud/core/utils/i18n/crud-labels.token";

export function createAuditConfig(
  labels: CrudLabels["auditConfig"] = DEFAULT_CRUD_LABELS.auditConfig,
): StrictCrudItemOptions<ArchiveInfo>[] {
  return [
    {
      key: "createdAt",
      label: labels.createdAt,
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      controlOptions: { hidden: true },
      columnOptions: { isSoftHidden: true },
    },
    {
      key: "creatorName",
      label: labels.createdBy,
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      controlOptions: { hidden: true },
      columnOptions: { isSoftHidden: true },
    },
    {
      key: "updatedAt",
      label: labels.updatedAt,
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      controlOptions: { hidden: true },
      columnOptions: { isSoftHidden: true },
    },
    {
      key: "updaterName",
      label: labels.updatedBy,
      controlType: CONTROL_TYPES.INPUT,
      type: INPUT_TYPES.TEXT,
      controlOptions: { hidden: true },
      columnOptions: { isSoftHidden: true },
    },
  ];
}
