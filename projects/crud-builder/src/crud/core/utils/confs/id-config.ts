import { CONTROL_TYPES } from "../../models/control-type.model";
import { StrictCrudItemOptions } from "../../models/crud-item-options.model";
import { INPUT_TYPES } from "../../models/input-type.model";

export class IdInfo {
  id: number | null = null;
}

export const ID_CONFIG: StrictCrudItemOptions<IdInfo> = {
  key: "id",
  controlType: CONTROL_TYPES.INPUT,
  type: INPUT_TYPES.TEXT,
  label: "ID",
  columnOptions: {
    isHardHidden: true,
  },
  controlOptions: {
    hidden: true,
    disabled: true,
  },
};
