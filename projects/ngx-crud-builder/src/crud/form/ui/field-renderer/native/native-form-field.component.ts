import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormFieldComponentBase } from "../form-field-component-base";
import { NativeFormFieldRenderer } from "./native-form-field-renderer";

/**
 * Native HTML full form field component.
 *
 * Renders a plain `<label>` + `NativeFormFieldRenderer` (native HTML controls).
 * No Optimus UI dependency. Provided by `provideNativeFormFieldRenderer()`.
 */
@Component({
  selector: "frm-native-form-field",
  templateUrl: "./native-form-field.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NativeFormFieldRenderer],
  host: {
    style: "display: flex; flex-direction: column; gap: 0.25rem;",
  },
})
export class NativeFormFieldComponent extends FormFieldComponentBase {}
