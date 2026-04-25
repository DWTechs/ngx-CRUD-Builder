import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { CrudItemOptions } from "../../../core/models/crud-item-options.model";
import { CRUD_LABELS } from "../../../core/utils/i18n/crud-labels.token";
import { CellTextContent } from "../../../core/utils/table/cell-text-content.class";

@Component({
  selector: "tbl-table-cell-tooltip",
  templateUrl: "./table-cell-tooltip.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class TableCellTooltipComponent {
  private readonly labels = inject(CRUD_LABELS);

  public readonly cellValue = input.required<unknown>();
  public readonly options = input.required<CrudItemOptions>();

  public readonly tooltipValue = computed(() => {
    return new CellTextContent({
      options: this.options(),
      cellValue: this.cellValue(),
      checkboxLabels: this.labels.checkbox,
    }).value;
  });
}
