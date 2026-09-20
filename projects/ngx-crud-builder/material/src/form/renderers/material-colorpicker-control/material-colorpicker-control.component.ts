import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  viewChild,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormFieldBaseComponent } from "@dwtechs/ngx-crud-builder";
import { startWith, switchMap } from "rxjs";

@Component({
  selector: "frm-material-colorpicker-control",
  template: `
    <mat-form-field appearance="outline" style="width: 100%;">
      <mat-label>{{ label() }}</mat-label>
      <input
        matInput
        type="text"
        [placeholder]="placeholder() || '#RRGGBB'"
        [formControl]="control()"
        (input)="emitInteractionEvent('keyup')"
        (focus)="emitInteractionEvent('focus')"
        (blur)="emitInteractionEvent('blur')"
      />
      <span matIconSuffix class="color-suffix">
        <button
          mat-icon-button
          type="button"
          [disabled]="isReadonly()"
          [attr.aria-label]="label()"
          [title]="control().value || ''"
          (click)="openPicker()"
        >
          <span class="color-swatch" [style.background-color]="safeColor()"></span>
        </button>
        <input
          #nativeColorInput
          type="color"
          class="native-color-input"
          [value]="safeColor()"
          [disabled]="isReadonly()"
          (input)="onNativeColorChange($event)"
        />
      </span>
    </mat-form-field>
  `,
  styles: `
    .color-suffix {
      position: relative;
      display: inline-flex;
    }
    .color-swatch {
      display: block;
      width: 20px;
      height: 20px;
      border-radius: 4px;
      border: 1px solid var(--mat-sys-outline, rgba(0, 0, 0, 0.38));
    }
    .native-color-input {
      position: absolute;
      left: 50%;
      bottom: 0;
      width: 1px;
      height: 1px;
      padding: 0;
      border: 0;
      opacity: 0;
      pointer-events: none;
    }
  `,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialColorpickerControlComponent extends FormFieldBaseComponent {
  private readonly nativeColorInput =
    viewChild<ElementRef<HTMLInputElement>>("nativeColorInput");

  private readonly controlValue = toSignal(
    toObservable(this.control).pipe(
      switchMap((ctrl) => ctrl.valueChanges.pipe(startWith(ctrl.value))),
    ),
    { initialValue: "" },
  );

  protected readonly isReadonly = computed(
    () => this.isDisabled() || !!this.isFormReadonly(),
  );

  /** Safe color value for the swatch — falls back to white for empty/invalid values */
  protected readonly safeColor = computed<string>(() => {
    const val = this.controlValue() as string;
    return this.isValidHex(val) ? this.normalizeHex(val) : "#ffffff";
  });

  protected openPicker(): void {
    if (this.isReadonly()) return;
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
