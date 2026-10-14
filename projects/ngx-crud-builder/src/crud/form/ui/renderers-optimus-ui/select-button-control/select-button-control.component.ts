import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ViewEncapsulation,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { isNil } from "@dwtechs/checkard";
import { SelectButtonModule } from "@openng/optimus-ui/selectbutton";
import { TooltipModule } from "@openng/optimus-ui/tooltip";
import { FormFieldBaseComponent } from "../form-field-base.component";

@Component({
  selector: "frm-select-button-control",
  templateUrl: "./select-button-control.component.html",
  imports: [SelectButtonModule, ReactiveFormsModule, TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./select-button-control.component.scss"],
})
export class SelectButtonControlComponent extends FormFieldBaseComponent {
  public readonly unselectable = computed(() => {
    const toggleable = this.options().isSelectButtonOptionToggleable;
    return !isNil(toggleable) ? !toggleable : true;
  });
}
