import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormFieldBaseComponent } from "../../renderers-optimus-ui/form-field-base.component";

@Component({
  selector: "frm-native-inputnumber-control",
  template: `
    <input
      type="number"
      [placeholder]="placeholder()"
      [formControl]="control()"
      (input)="emitInteractionEvent('keyup')"
      (focus)="emitInteractionEvent('focus')"
      (blur)="emitInteractionEvent('blur')"
    />
  `,
  imports: [ReactiveFormsModule],
  styles: [
    ":host { display: block; } input { width: 100%; box-sizing: border-box; }",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeInputNumberControlComponent extends FormFieldBaseComponent {}
