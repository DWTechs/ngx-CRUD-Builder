import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormFieldBaseComponent } from "@dwtechs/ngx-crud-builder";

@Component({
  selector: "frm-material-inputtext-control",
  template: `
    <mat-form-field appearance="outline" style="width: 100%;">
      <mat-label>{{ label() }}</mat-label>
      <input
        matInput
        type="text"
        [placeholder]="placeholder()"
        [formControl]="control()"
        (input)="emitInteractionEvent('keyup')"
        (focus)="emitInteractionEvent('focus')"
        (blur)="emitInteractionEvent('blur')"
      />
    </mat-form-field>
  `,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialInputTextControlComponent extends FormFieldBaseComponent {}
