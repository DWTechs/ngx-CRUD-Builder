import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { CONTROL_TYPES } from "../../../../core/models/control-type.model";
import { CrudItemOptions } from "../../../../core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "../../../../core/models/form-field-interaction.event";
import { MaterialAutocompleteControlComponent } from "../../renderers-material/material-autocomplete-control/material-autocomplete-control.component";
import { MaterialCheckboxControlComponent } from "../../renderers-material/material-checkbox-control/material-checkbox-control.component";
import { MaterialDateControlComponent } from "../../renderers-material/material-date-control/material-date-control.component";
import { MaterialInputNumberControlComponent } from "../../renderers-material/material-inputnumber-control/material-inputnumber-control.component";
import { MaterialInputTextControlComponent } from "../../renderers-material/material-inputtext-control/material-inputtext-control.component";
import { MaterialMultiselectControlComponent } from "../../renderers-material/material-multiselect-control/material-multiselect-control.component";
import { MaterialRadiogroupControlComponent } from "../../renderers-material/material-radiogroup-control/material-radiogroup-control.component";
import { MaterialSelectButtonControlComponent } from "../../renderers-material/material-select-button-control/material-select-button-control.component";
import { MaterialSelectControlComponent } from "../../renderers-material/material-select-control/material-select-control.component";
import { MaterialTextareaControlComponent } from "../../renderers-material/material-textarea-control/material-textarea-control.component";

@Component({
  selector: "frm-material-field-renderer",
  templateUrl: "./material-form-field-renderer.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  // hides the reserved hint/error space Material adds below every form field
  styles: `
    :host ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
  `,
  imports: [
    MaterialAutocompleteControlComponent,
    MaterialCheckboxControlComponent,
    MaterialDateControlComponent,
    MaterialInputNumberControlComponent,
    MaterialInputTextControlComponent,
    MaterialMultiselectControlComponent,
    MaterialRadiogroupControlComponent,
    MaterialSelectButtonControlComponent,
    MaterialSelectControlComponent,
    MaterialTextareaControlComponent,
  ],
})
export class MaterialFormFieldRenderer {
  /** Field configuration object */
  config = input.required<CrudItemOptions>();
  /** Form control instance */
  control = input.required<FormControl>();
  /** Readonly state of the form */
  isFormReadonly = input.required<boolean | undefined>();
  /** Incremental value to trigger change detection on the form field */
  syncValueInc = input.required<number>();

  /** Emits when the field is interacted with */
  fieldInteraction = output<FormFieldInteractionEvent>();

  /** ControlType enum for template use */
  ControlType = CONTROL_TYPES;
}
