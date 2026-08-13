import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
import {
  CONTROL_TYPES,
  FormFieldComponentBase,
} from "@dwtechs/ngx-crud-builder";
import { MaterialFormFieldRenderer } from "./material-form-field-renderer";

/** Control types rendered with their own floating `mat-label` (no outer `<label>` needed). */
const FLOATING_LABEL_CONTROL_TYPES: string[] = [
  CONTROL_TYPES.AUTOCOMPLETE,
  CONTROL_TYPES.DATE,
  CONTROL_TYPES.INPUT,
  CONTROL_TYPES.MULTISELECT,
  CONTROL_TYPES.SELECT,
  CONTROL_TYPES.TEXTAREA,
];

/**
 * Material full form field component.
 *
 * Renders `MaterialFormFieldRenderer` (Angular Material controls). Controls backed by a
 * `mat-form-field` (input, textarea, select, date, autocomplete) carry their own floating
 * `mat-label`; other controls (checkbox, radio, select-button) get a plain `<label>` above them.
 * Provided by `provideMaterialFormFieldRenderer()`.
 *
 * Requires the host app to provide a date adapter (e.g. `provideNativeDateAdapter()`
 * from `@angular/material/core`) for the DATE control type, and an animations
 * provider (`provideAnimationsAsync()` or `provideNoopAnimations()`).
 */
@Component({
  selector: "frm-material-form-field",
  templateUrl: "./material-form-field.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialFormFieldRenderer],
  host: {
    style: "display: flex; flex-direction: column;",
  },
})
export class MaterialFormFieldComponent extends FormFieldComponentBase {
  protected readonly showOuterLabel = computed(
    () => !FLOATING_LABEL_CONTROL_TYPES.includes(this.config().controlType),
  );
}
