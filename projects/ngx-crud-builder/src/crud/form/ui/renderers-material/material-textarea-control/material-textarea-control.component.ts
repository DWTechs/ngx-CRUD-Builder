import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormFieldBaseComponent } from "../../renderers-primeng/form-field-base.component";

@Component({
  selector: "frm-material-textarea-control",
  template: `
    <mat-form-field appearance="outline" style="width: 100%;">
      <mat-label>{{ label() }}</mat-label>
      <textarea
        matInput
        [placeholder]="placeholder()"
        [formControl]="control()"
        (input)="emitInteractionEvent('keyup')"
        (focus)="emitInteractionEvent('focus')"
        (blur)="emitInteractionEvent('blur')"
      ></textarea>
    </mat-form-field>
  `,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialTextareaControlComponent extends FormFieldBaseComponent {}
