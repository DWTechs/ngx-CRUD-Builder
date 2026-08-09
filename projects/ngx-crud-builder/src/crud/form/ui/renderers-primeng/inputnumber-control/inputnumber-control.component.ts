import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormFieldBaseComponent } from "../form-field-base.component";
import { InputNumberModule } from "@openng/optimus-ui/inputnumber";

@Component({
  selector: "frm-inputnumber-control",
  templateUrl: "./inputnumber-control.component.html",
  imports: [InputNumberModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberControlComponent extends FormFieldBaseComponent {

  public readonly currency = computed(() => this.options().numberCurrency);
  public readonly mode = computed(() => this.currency() ? 'currency' : undefined);
}
