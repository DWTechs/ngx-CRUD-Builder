import { ChangeDetectionStrategy, Component } from "@angular/core";
import { LabelWrapperComponent } from "../../label-wrapper/label-wrapper";
import { FormFieldRenderer } from "../field-renderer";
import { FormFieldComponentBase } from "../form-field-component-base";

/**
 * Default Optimus UI full form field component.
 *
 * Composes `LabelWrapperComponent` (float/ifta/normal label strategies,
 * icon field) with `FormFieldRenderer` (Optimus UI control components).
 * Provided by `provideFormFieldRenderer('optimus-ui')`.
 */
@Component({
  selector: "frm-optimus-ui-form-field",
  templateUrl: "./optimus-ui-form-field.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LabelWrapperComponent, FormFieldRenderer],
})
export class OptimusUiFormFieldComponent extends FormFieldComponentBase {}
