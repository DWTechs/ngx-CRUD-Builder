import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormFieldBaseComponent } from "../../renderers-primeng/form-field-base.component";

@Component({
  selector: "frm-material-date-control",
  template: `
    <mat-form-field appearance="outline" style="width: 100%;">
      <mat-label>{{ label() }}</mat-label>
      <input
        matInput
        [matDatepicker]="picker"
        [min]="minDate()"
        [max]="maxDate()"
        [formControl]="control()"
        (dateChange)="emitInteractionEvent('valueChange')"
        (focus)="emitInteractionEvent('focus')"
        (blur)="emitInteractionEvent('blur')"
      />
      <mat-datepicker-toggle matIconSuffix [for]="picker" />
      <mat-datepicker #picker />
    </mat-form-field>
  `,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialDateControlComponent extends FormFieldBaseComponent {
  protected readonly minDate = computed<Date | null>(
    () => this.options().dateMin ?? null,
  );
  protected readonly maxDate = computed<Date | null>(
    () => this.options().dateMax ?? null,
  );
}
