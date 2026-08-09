import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { TooltipModule } from "@openng/optimus-ui/tooltip";

@Component({
  selector: "frm-field-tooltip",
  templateUrl: "./field-tooltip.html",
  imports: [TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldTooltip {
  public readonly value = input.required<string | undefined>();
}
