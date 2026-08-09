import { Pipe } from "@angular/core";
import { SelectItem } from "@openng/optimus-ui/api";

@Pipe({
  standalone: true,
  name: "toSelectItem",
})
export class ToSelectItemPipe {
  public transform(
    value: number | string,
    options: SelectItem[],
  ): SelectItem | undefined {
    return options.find((opt) => opt.value === value);
  }
}
