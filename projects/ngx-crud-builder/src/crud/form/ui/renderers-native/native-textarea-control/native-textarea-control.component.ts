import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormFieldBaseComponent } from "../../renderers-optimus-ui/form-field-base.component";

@Component({
  selector: "frm-native-textarea-control",
  template: `
    <textarea
      [placeholder]="placeholder()"
      [formControl]="control()"
      (input)="emitInteractionEvent('keyup')"
      (focus)="emitInteractionEvent('focus')"
      (blur)="emitInteractionEvent('blur')"
    ></textarea>
  `,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["../native-control.scss"],
})
export class NativeTextareaControlComponent extends FormFieldBaseComponent {}
