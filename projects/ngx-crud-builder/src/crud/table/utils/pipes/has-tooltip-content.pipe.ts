import { inject, Pipe, PipeTransform } from "@angular/core";
import { CrudItemOptions } from "../../../core/models/crud-item-options.model";
import { CRUD_LABELS } from "../../../core/utils/i18n/crud-labels.token";
import { CellTextContent } from "../../../core/utils/table/cell-text-content.class";

@Pipe({
  name: "hasTooltipContent",
  standalone: true,
})
export class HasTooltipContentPipe implements PipeTransform {
  private readonly labels = inject(CRUD_LABELS);

  transform(cellValue: unknown, options: CrudItemOptions): boolean {
    return (
      new CellTextContent({
        options,
        cellValue,
        checkboxLabels: this.labels.checkbox,
      }).value !== ""
    );
  }
}
