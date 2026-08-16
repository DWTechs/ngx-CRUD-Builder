import { isArray } from "@dwtechs/checkard";
import { CONTROL_TYPES } from "../../../core/models/control-type.model";
import { CrudItemBase } from "../../../core/models/crud-item-base.class";
import { CrudItemOptions } from "../../../core/models/crud-item-options.model";
import { FileInfo } from "../../../form/ui/renderers-optimus-ui/file-upload-input/file-info.class";

export function extractUploadedFiles<TData extends CrudItemBase>(
  config: CrudItemOptions[],
  entry: TData,
): File[] {
  const fileControls = config.filter(
    (item) => item.controlType === CONTROL_TYPES.FILES,
  );
  return fileControls.flatMap((control) => {
    const key = control.key as keyof TData;
    const value = entry[key] as FileInfo[];
    if (isArray(value)) {
      return value
        .map((v) => v.file)
        .filter((v): v is File => v instanceof File);
    }
    return [];
  });
}
