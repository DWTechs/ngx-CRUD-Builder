import { Pipe, PipeTransform } from "@angular/core";
import { SelectItem } from "primeng/api";

@Pipe({
  name: "multiSelectOption",
})
export class MultiSelectOptionPipe implements PipeTransform {
  transform(optionValue: string, options: SelectItem[]): SelectItem {
    return (
      options.find((option) => option.value === optionValue) || {
        label: optionValue,
        value: optionValue,
      }
    );
  }
}
