import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  viewChild,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ReactiveFormsModule } from "@angular/forms";
import { startWith, switchMap } from "rxjs";
import { FormFieldBaseComponent } from "../../renderers-optimus-ui/form-field-base.component";

@Component({
  selector: "frm-native-colorpicker-control",
  templateUrl: "./native-colorpicker-control.component.html",
  styleUrls: [
    "../native-control.scss",
    "./native-colorpicker-control.component.scss",
  ],
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeColorpickerControlComponent extends FormFieldBaseComponent {
  private readonly nativeColorInput =
    viewChild<ElementRef<HTMLInputElement>>("nativeColorInput");

  /** Reactive signal that tracks the FormControl value changes */
  private readonly controlValue = toSignal(
    toObservable(this.control).pipe(
      switchMap((ctrl) => ctrl.valueChanges.pipe(startWith(ctrl.value))),
    ),
    { initialValue: "" },
  );

  /** Safe color value for the swatch — falls back to white for empty/invalid values */
  protected readonly safeColor = computed<string>(() => {
    const val = this.controlValue() as string;
    return this.isValidHex(val) ? this.normalizeHex(val) : "#ffffff";
  });

  protected onSwatchClick(): void {
    if (this.isDisabled() || this.isFormReadonly()) return;
    this.nativeColorInput()?.nativeElement.click();
  }

  protected onNativeColorChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.control().setValue(value);
    this.control().markAsDirty();
    this.emitInteractionEvent("valueChange");
  }

  private isValidHex(value: unknown): boolean {
    if (typeof value !== "string") return false;
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
  }

  /** Ensure the hex string is in #RRGGBB format required by <input type="color"> */
  private normalizeHex(value: string): string {
    if (value.length === 4) {
      const r = value[1];
      const g = value[2];
      const b = value[3];
      return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
    }
    return value.toLowerCase();
  }
}
