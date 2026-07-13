import { ChangeDetectionStrategy, Component } from "@angular/core";
import { LabelWrapperComponent } from "../../label-wrapper/label-wrapper";
import { FormFieldRenderer } from "../field-renderer";
import { FormFieldComponentBase } from "../form-field-component-base";

/**
 * Default PrimeNG full form field component.
 *
 * Composes `LabelWrapperComponent` (float/ifta/normal label strategies,
 * icon field) with `FormFieldRenderer` (PrimeNG control components).
 * Provided by `providePrimengFormFieldRenderer()`.
 */
@Component({
  selector: "frm-primeng-form-field",
  templateUrl: "./primeng-form-field.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LabelWrapperComponent, FormFieldRenderer],
})
export class PrimengFormFieldComponent extends FormFieldComponentBase {}
