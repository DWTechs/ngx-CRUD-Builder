import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "@openng/optimus-ui/inputtext";
import { FormFieldBaseComponent } from "../form-field-base.component";

@Component({
  selector: "frm-inputtext-control",
  templateUrl: "./inputtext-control.component.html",
  imports: [InputTextModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextControlComponent extends FormFieldBaseComponent {
  public readonly maxLength = computed<number | null>(() => {
    return this.options().maxLength || null;
  });

  public readonly minLength = computed<number | null>(() => {
    return this.options().minLength || null;
  });
}
