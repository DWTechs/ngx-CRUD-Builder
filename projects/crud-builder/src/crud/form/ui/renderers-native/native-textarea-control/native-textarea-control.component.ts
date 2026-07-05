import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormFieldBaseComponent } from "../../renderers-primeng/form-field-base.component";

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
  styles: [
    `
      textarea {
        width: 100%;
        min-height: 4rem;
        padding: 0.5rem;
        border-radius: 0.25rem;
        border: 1px solid #ced4da;
        font-size: 1rem;
        font-family: inherit;
        resize: none;
      }
    `,
  ],
})
export class NativeTextareaControlComponent extends FormFieldBaseComponent {}
