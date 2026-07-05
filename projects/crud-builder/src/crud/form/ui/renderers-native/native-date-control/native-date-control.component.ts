import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormFieldBaseComponent } from "../../renderers-primeng/form-field-base.component";

@Component({
  selector: "frm-native-date-control",
  template: `
    <input
      type="date"
      [formControl]="control()"
      [min]="minDate()"
      [max]="maxDate()"
      (change)="emitInteractionEvent('valueChange')"
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
export class NativeDateControlComponent extends FormFieldBaseComponent {
  protected readonly minDate = computed<string>(() => {
    const min = this.options().dateMin;
    return min ? this.toIsoDate(min) : "";
  });

  protected readonly maxDate = computed<string>(() => {
    const max = this.options().dateMax;
    return max ? this.toIsoDate(max) : "";
  });

  private toIsoDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
}
