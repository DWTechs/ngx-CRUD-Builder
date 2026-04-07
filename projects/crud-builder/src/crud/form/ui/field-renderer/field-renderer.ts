import { NgComponentOutlet } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  input,
  OnDestroy,
  output,
  OutputEmitterRef,
  viewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { CONTROL_TYPES } from "../../../core/models/control-type.model";
import { CrudItemOptions } from "../../../core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "../../../core/models/form-field-interaction.event";
import { AutocompleteControlComponent } from "../renderers/autocomplete-control/autocomplete-control.component";
import { CheckboxControlComponent } from "../renderers/checkbox-control/checkbox-control.component";
import { DateControlComponent } from "../renderers/date-control/date-control.component";
import { FileUploadInputComponent } from "../renderers/file-upload-input/file-upload-input.component";
import { InputNumberControlComponent } from "../renderers/inputnumber-control/inputnumber-control.component";
import { InputTextControlComponent } from "../renderers/inputtext-control/inputtext-control.component";
import { MultiSelectControlComponent } from "../renderers/multi-select-control/multi-select-control.component";
import { PicklistControlComponent } from "../renderers/picklist-control/picklist-control.component";
import { RadioGroupComponent } from "../renderers/radiogroup-control/radiogroup-control.component";
import { RichTextEditorComponent } from "../renderers/rich-text-editor/rich-text-editor.component";
import { SelectButtonControlComponent } from "../renderers/select-button-control/select-button-control.component";
import { SelectControlComponent } from "../renderers/select-control/select-control.component";
import { TableControlComponent } from "../renderers/table-control/table-control.component";
import { TextareaControlComponent } from "../renderers/textarea-control/textarea-control.component";
import { Subscription } from "rxjs";

@Component({
  selector: "frm-field-renderer",
  templateUrl: "./field-renderer.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AutocompleteControlComponent,
    CheckboxControlComponent,
    DateControlComponent,
    InputNumberControlComponent,
    InputTextControlComponent,
    MultiSelectControlComponent,
    SelectControlComponent,
    TextareaControlComponent,
    FileUploadInputComponent,
    RichTextEditorComponent,
    TableControlComponent,
    RadioGroupComponent,
    PicklistControlComponent,
    SelectButtonControlComponent,
    NgComponentOutlet,
  ],
})
export class FormFieldRenderer implements AfterViewInit, OnDestroy {
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

  /**
   * CUSTOM CONTROL INTERACTION EVENTS HANDLER
   */
  // Query the custom component instance
  public readonly customComponent = viewChild(NgComponentOutlet);
  private readonly sub = new Subscription();

  // Subscribe to interaction events from the custom component
  ngAfterViewInit() {
    const customComponent = this.customComponent();
    if (this.config().controlType === CONTROL_TYPES.CUSTOM && customComponent) {
      const interaction: OutputEmitterRef<FormFieldInteractionEvent> =
        customComponent.componentInstance.fieldInteraction;
      this.sub.add(
        interaction.subscribe((event) => {
          this.fieldInteraction.emit(event);
        }),
      );
    }
  }

  // Unsubscribe on destroy
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
