import { Pipe, PipeTransform } from "@angular/core";
import { SelectItem } from "@openng/optimus-ui/api";
import { ExtendedSelectItem } from "../../../../core/models/control-options.model";

@Pipe({
  name: "multiSelectOption",
})
export class MultiSelectOptionPipe implements PipeTransform {
  transform(optionValue: string, options: SelectItem[]): ExtendedSelectItem {
    return (
      (options.find(
        (option) => option.value === optionValue,
      ) as ExtendedSelectItem) || {
        label: optionValue,
        value: optionValue,
        extraData: undefined,
      }
    );
  }
}
