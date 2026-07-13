import { CONTROL_TYPES } from "../../models/control-type.model";
import { StrictCrudItemOptions } from "../../models/crud-item-options.model";
import { INPUT_TYPES } from "../../models/input-type.model";
import { ArchiveInfo } from "../../utils/confs/archived-config";
import {
  CrudLabels,
  DEFAULT_CRUD_LABELS,
} from "../../utils/i18n/crud-labels.token";

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
