import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { FormFieldBaseComponent } from "@dwtechs/ngx-crud-builder";

@Component({
  selector: "frm-material-radiogroup-control",
  template: `
    <mat-radio-group
      [formControl]="control()"
      (change)="emitInteractionEvent('valueChange')"
    >
      @for (option of selectOptions(); track option.value) {
        <mat-radio-button [value]="option.value">{{ option.label }}</mat-radio-button>
      }
    </mat-radio-group>
  `,
  imports: [ReactiveFormsModule, MatRadioModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialRadiogroupControlComponent extends FormFieldBaseComponent {}
