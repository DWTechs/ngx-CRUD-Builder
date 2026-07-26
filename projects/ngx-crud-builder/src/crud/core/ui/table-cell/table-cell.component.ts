import { NgComponentOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { CONTROL_TYPES } from "../../models/control-type.model";
import { CrudItemOptions } from "../../models/crud-item-options.model";
import { INPUT_TYPES } from "../../models/input-type.model";
import { CheckboxCellRendererComponent } from "./cell-renderers/checkbox-renderer";
import { DateCellRendererComponent } from "./cell-renderers/date-renderer";
import { FilesCellRendererComponent } from "./cell-renderers/files-renderer";
import { GroupCellRendererComponent } from "./cell-renderers/group-renderer";
import { MultiselectCellRendererComponent } from "./cell-renderers/multiselect-renderer";
import { NumberCellRendererComponent } from "./cell-renderers/number-renderer";
import { SelectCellRendererComponent } from "./cell-renderers/select-renderer";
import { WysiwygCellRendererComponent } from "./cell-renderers/wysiwyg-renderer";

@Component({
  selector: "tbl-table-cell",
  templateUrl: "./table-cell.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateCellRendererComponent,
    CheckboxCellRendererComponent,
    FilesCellRendererComponent,
    MultiselectCellRendererComponent,
    NumberCellRendererComponent,
    SelectCellRendererComponent,
    WysiwygCellRendererComponent,
    GroupCellRendererComponent,
    NgComponentOutlet,
  ],
})
export class TableCellComponent {
  public readonly cellValue = input.required<unknown>();
  public readonly options = input.required<CrudItemOptions>();

  public readonly ControlTypes = CONTROL_TYPES;
  public readonly InputTypes = INPUT_TYPES;

  public readonly customCellRenderer = computed(
    () => this.options().columnOptions?.customCellRenderer,
  );

  public readonly isNumberInput = computed(
    () =>
      this.options().controlType === CONTROL_TYPES.INPUT &&
      this.options().type === INPUT_TYPES.NUMBER,
  );

  public readonly customRenderedValue = computed(() => {
    const renderer = this.customCellRenderer();
    if (!renderer) return null;
    return renderer(this.cellValue());
  });
}
