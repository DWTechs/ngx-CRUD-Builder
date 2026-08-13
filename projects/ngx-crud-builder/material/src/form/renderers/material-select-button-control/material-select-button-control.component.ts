import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { FormFieldBaseComponent } from "@dwtechs/ngx-crud-builder";

@Component({
  selector: "frm-material-select-button-control",
  template: `
    <mat-button-toggle-group
      [attr.aria-label]="label()"
      [multiple]="isMultiple()"
      [formControl]="control()"
      (change)="emitInteractionEvent('valueChange')"
    >
      @for (option of selectOptions(); track option.value) {
        <mat-button-toggle [value]="option.value">{{ option.label }}</mat-button-toggle>
      }
    </mat-button-toggle-group>
  `,
  imports: [ReactiveFormsModule, MatButtonToggleModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialSelectButtonControlComponent extends FormFieldBaseComponent {
  protected readonly isMultiple = computed(
    () => this.options().multipleSelectButton ?? false,
  );
}
