import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormFieldBaseComponent } from "../../renderers-optimus-ui/form-field-base.component";

@Component({
  selector: "frm-native-checkbox-control",
  template: `
    <input
      type="checkbox"
      [formControl]="control()"
      (change)="emitInteractionEvent('valueChange')"
      (focus)="emitInteractionEvent('focus')"
      (blur)="emitInteractionEvent('blur')"
    />
  `,
  imports: [ReactiveFormsModule],
  styleUrls: [
    "../native-control.scss",
    "./native-checkbox-control.component.scss",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeCheckboxControlComponent extends FormFieldBaseComponent {}
