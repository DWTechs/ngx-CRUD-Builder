import { NgComponentOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import {
  CONTROL_TYPES,
  CrudItemOptions,
  FormFieldInteractionEvent,
} from "@dwtechs/ngx-crud-builder";
import { MaterialAutocompleteControlComponent } from "../renderers/material-autocomplete-control/material-autocomplete-control.component";
import { MaterialCheckboxControlComponent } from "../renderers/material-checkbox-control/material-checkbox-control.component";
import { MaterialColorpickerControlComponent } from "../renderers/material-colorpicker-control/material-colorpicker-control.component";
import { MaterialDateControlComponent } from "../renderers/material-date-control/material-date-control.component";
import { MaterialFileUploadInputComponent } from "../renderers/material-file-upload-input/material-file-upload-input.component";
import { MaterialInputNumberControlComponent } from "../renderers/material-inputnumber-control/material-inputnumber-control.component";
import { MaterialInputTextControlComponent } from "../renderers/material-inputtext-control/material-inputtext-control.component";
import { MaterialMultiselectControlComponent } from "../renderers/material-multiselect-control/material-multiselect-control.component";
import { MaterialPicklistControlComponent } from "../renderers/material-picklist-control/material-picklist-control.component";
import { MaterialRadiogroupControlComponent } from "../renderers/material-radiogroup-control/material-radiogroup-control.component";
import { MaterialRichTextEditorComponent } from "../renderers/material-rich-text-editor/material-rich-text-editor.component";
import { MaterialSelectButtonControlComponent } from "../renderers/material-select-button-control/material-select-button-control.component";
import { MaterialSelectControlComponent } from "../renderers/material-select-control/material-select-control.component";
import { MaterialTableControlComponent } from "../renderers/material-table-control/material-table-control.component";
import { MaterialTextareaControlComponent } from "../renderers/material-textarea-control/material-textarea-control.component";

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
    NgComponentOutlet,
    MaterialAutocompleteControlComponent,
    MaterialCheckboxControlComponent,
    MaterialColorpickerControlComponent,
    MaterialDateControlComponent,
    MaterialFileUploadInputComponent,
    MaterialInputNumberControlComponent,
    MaterialInputTextControlComponent,
    MaterialMultiselectControlComponent,
    MaterialPicklistControlComponent,
    MaterialRadiogroupControlComponent,
    MaterialRichTextEditorComponent,
    MaterialSelectButtonControlComponent,
    MaterialSelectControlComponent,
    MaterialTableControlComponent,
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
