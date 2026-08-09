import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormFieldBaseComponent } from "../../renderers-primeng/form-field-base.component";

@Component({
  selector: "frm-material-checkbox-control",
  template: `
    <mat-checkbox
      [attr.aria-label]="label()"
      [formControl]="control()"
      (change)="emitInteractionEvent('valueChange')"
      (focus)="emitInteractionEvent('focus')"
      (blur)="emitInteractionEvent('blur')"
    ></mat-checkbox>
  `,
  imports: [ReactiveFormsModule, MatCheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialCheckboxControlComponent extends FormFieldBaseComponent {}
