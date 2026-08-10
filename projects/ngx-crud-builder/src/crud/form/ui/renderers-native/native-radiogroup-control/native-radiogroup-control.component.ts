import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormFieldBaseComponent } from "../../renderers-optimus-ui/form-field-base.component";

@Component({
  selector: "frm-native-radiogroup-control",
  template: `
    @for (option of selectOptions(); track option.value) {
      <label>
        <input
          type="radio"
          [value]="option.value"
          [formControl]="control()"
          (change)="emitInteractionEvent('valueChange')"
        />
        {{ option.label }}
      </label>
    }
  `,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeRadiogroupControlComponent extends FormFieldBaseComponent {}
