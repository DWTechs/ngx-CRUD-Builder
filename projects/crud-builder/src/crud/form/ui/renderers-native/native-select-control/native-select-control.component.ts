import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormFieldBaseComponent } from "../../renderers-primeng/form-field-base.component";

@Component({
  selector: "frm-native-select-control",
  template: `
    <select
      [formControl]="control()"
      (change)="emitInteractionEvent('valueChange')"
      (focus)="emitInteractionEvent('focus')"
      (blur)="emitInteractionEvent('blur')"
    >
      @if (showClear()) {
        <option value="">--</option>
      }
      @for (option of selectOptions(); track option.value) {
        <option [value]="option.value">{{ option.label }}</option>
      }
    </select>
  `,
  imports: [ReactiveFormsModule],
  styles: [
    ":host { display: block; } select { width: 100%; box-sizing: border-box; }",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeSelectControlComponent extends FormFieldBaseComponent {}
