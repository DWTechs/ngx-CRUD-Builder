import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ReactiveFormsModule } from "@angular/forms";
import { startWith, switchMap } from "rxjs";
import { FormFieldBaseComponent } from "../../renderers-optimus-ui/form-field-base.component";

@Component({
  selector: "frm-native-select-button-control",
  templateUrl: "./native-select-button-control.component.html",
  styleUrls: [
    "../native-control.scss",
    "./native-select-button-control.component.scss",
  ],
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeSelectButtonControlComponent extends FormFieldBaseComponent {
  protected readonly isMultiple = computed(
    () => this.options().multipleSelectButton ?? false,
  );

  // true (default) = clicking the selected option deselects it
  protected readonly canDeselect = computed(
    () => this.options().isSelectButtonOptionToggleable ?? true,
  );

  private readonly currentValue = toSignal(
    toObservable(this.control).pipe(
      switchMap((ctrl) => ctrl.valueChanges.pipe(startWith(ctrl.value))),
    ),
    { initialValue: null as unknown },
  );

  protected isSelected(value: unknown): boolean {
    const current = this.currentValue();
    if (this.isMultiple()) {
      return Array.isArray(current) && current.includes(value);
    }
    return current === value;
  }

  protected selectOption(value: unknown): void {
    if (this.isDisabled() || this.isFormReadonly()) return;

    if (this.isMultiple()) {
      const current: unknown[] = Array.isArray(this.currentValue())
        ? [...(this.currentValue() as unknown[])]
        : [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      this.control().setValue(next);
    } else {
      if (this.isSelected(value) && this.canDeselect()) {
        this.control().setValue(null);
      } else {
        this.control().setValue(value);
      }
    }

    this.control().markAsDirty();
    this.emitInteractionEvent("valueChange");
  }
}
