import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { TableColumn } from "../../../core/utils/table/table-column.model";

@Component({
  selector: "tbl-table-header-cell",
  templateUrl: "./table-header-cell.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: "display: contents;",
  },
})
export class TableHeaderCellComponent {
  public readonly col = input.required<TableColumn>();

  public readonly customRenderedHeader = computed(() => {
    const renderer = this.col().columnOptions?.customHeaderRenderer;
    if (!renderer) return null;
    return renderer(this.col().label ?? this.col().key);
  });
}
