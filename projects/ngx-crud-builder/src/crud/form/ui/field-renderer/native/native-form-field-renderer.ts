import { NgComponentOutlet } from "@angular/common";
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
import { NativeAutocompleteControlComponent } from "../../renderers-native/native-autocomplete-control/native-autocomplete-control.component";
import { NativeCheckboxControlComponent } from "../../renderers-native/native-checkbox-control/native-checkbox-control.component";
import { NativeColorpickerControlComponent } from "../../renderers-native/native-colorpicker-control/native-colorpicker-control.component";
import { NativeDateControlComponent } from "../../renderers-native/native-date-control/native-date-control.component";
import { NativeFileUploadInputComponent } from "../../renderers-native/native-file-upload-input/native-file-upload-input.component";
import { NativeInputNumberControlComponent } from "../../renderers-native/native-inputnumber-control/native-inputnumber-control.component";
import { NativeInputTextControlComponent } from "../../renderers-native/native-inputtext-control/native-inputtext-control.component";
import { NativeMultiselectControlComponent } from "../../renderers-native/native-multiselect-control/native-multiselect-control.component";
import { NativePicklistControlComponent } from "../../renderers-native/native-picklist-control/native-picklist-control.component";
import { NativeRadiogroupControlComponent } from "../../renderers-native/native-radiogroup-control/native-radiogroup-control.component";
import { NativeRichTextEditorComponent } from "../../renderers-native/native-rich-text-editor/native-rich-text-editor.component";
import { NativeSelectButtonControlComponent } from "../../renderers-native/native-select-button-control/native-select-button-control.component";
import { NativeSelectControlComponent } from "../../renderers-native/native-select-control/native-select-control.component";
import { NativeTextareaControlComponent } from "../../renderers-native/native-textarea-control/native-textarea-control.component";

@Component({
  selector: "frm-native-field-renderer",
  templateUrl: "./native-form-field-renderer.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
    }
    .frm-native-unsupported {
      color: GrayText;
      font-style: italic;
    }
  `,
  imports: [
    NgComponentOutlet,
    NativeAutocompleteControlComponent,
    NativeCheckboxControlComponent,
    NativeColorpickerControlComponent,
    NativeDateControlComponent,
    NativeFileUploadInputComponent,
    NativeInputNumberControlComponent,
    NativeInputTextControlComponent,
    NativeMultiselectControlComponent,
    NativePicklistControlComponent,
    NativeRadiogroupControlComponent,
    NativeRichTextEditorComponent,
    NativeSelectButtonControlComponent,
    NativeSelectControlComponent,
    NativeTextareaControlComponent,
  ],
})
export class NativeFormFieldRenderer {
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
