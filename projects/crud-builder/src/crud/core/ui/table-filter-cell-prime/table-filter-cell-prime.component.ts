import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CONTROL_TYPES } from "../../models/control-type.model";
import { INPUT_TYPES } from "../../models/input-type.model";
import { DATE_FORMAT_CALENDAR } from "../../utils/dates/dates.utils";
import { TableColumn } from "../../utils/table/table-column.model";
import { DatePickerModule } from "primeng/datepicker";
import { MultiSelectModule } from "primeng/multiselect";
import { TableModule } from "primeng/table";

@Component({
  selector: "crd-table-filter-cell-prime",
  templateUrl: "./table-filter-cell-prime.component.html",
  imports: [
    TableModule,
    FormsModule,
    NgTemplateOutlet,
    MultiSelectModule,
    DatePickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableFilterCellPrimeComponent {
  public readonly col = input.required<TableColumn>();

  public readonly ControlType = CONTROL_TYPES;
  public readonly InputType = INPUT_TYPES;
  public readonly DATE_FORMAT = DATE_FORMAT_CALENDAR;

  public readonly options = computed(() => {
    return this.col().options ?? [];
  });

  // TODO: handle default filter value

  public onSelectDate(event: Date, filter: (date: string) => void) {
    const date = new Date(event).toDateString();
    filter(date);
  }
}
