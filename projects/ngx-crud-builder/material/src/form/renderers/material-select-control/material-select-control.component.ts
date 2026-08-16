import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { FormFieldBaseComponent } from "@dwtechs/ngx-crud-builder";

@Component({
  selector: "frm-material-select-control",
  template: `
    <mat-form-field appearance="outline" style="width: 100%;">
      <mat-label>{{ label() }}</mat-label>
      <mat-select
        [formControl]="control()"
        (selectionChange)="emitInteractionEvent('valueChange')"
        (openedChange)="$event ? emitInteractionEvent('focus') : emitInteractionEvent('blur')"
      >
        @if (showClear()) {
          <mat-option [value]="null">--</mat-option>
        }
        @for (option of selectOptions(); track option.value) {
          <mat-option [value]="option.value">{{ option.label }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialSelectControlComponent extends FormFieldBaseComponent {}
