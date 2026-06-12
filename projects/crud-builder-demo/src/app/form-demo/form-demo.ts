import { Component, ViewEncapsulation } from "@angular/core";
import { TabsModule } from "primeng/tabs";
import { AutocompleteInputTabComponent } from "./ui/autocomplete-input-tab.component";
import { CheckboxInputTabComponent } from "./ui/checkbox-input-tab.component";
import { ColorPickerTabComponent } from "./ui/color-picker-tab.component";
import { DateInputTabComponent } from "./ui/date-input-tab.component";
import { FileUploadTabComponent } from "./ui/file-upload-tab.component";
import { FormGeneralTabComponent } from "./ui/form-general-tab.component";
import { InputTextTabComponent } from "./ui/input-text-tab.component";
import { MultiSelectInputTabComponent } from "./ui/multi-select-input-tab.component";
import { NumberInputTabComponent } from "./ui/number-input-tab.component";
import { PicklistInputTabComponent } from "./ui/picklist-input-tab.component";
import { RadioGroupInputTabComponent } from "./ui/radiogroup-input-tab.component";
import { RichTextEditorTabComponent } from "./ui/rich-text-editor-tab.component";
import { SelectButtonInputTabComponent } from "./ui/select-button-input-tab.component";
import { SelectInputTabComponent } from "./ui/select-input-tab.component";
import { TableControlTabComponent } from "./ui/table-control-tab.component";
import { TextareaInputTabComponent } from "./ui/textarea-input-tab.component";
@Component({
  selector: "frm-demo",
  templateUrl: "./form-demo.html",
  styleUrls: ["./form-demo.scss"],
  encapsulation: ViewEncapsulation.None,
  imports: [
    TabsModule,
    FormGeneralTabComponent,
    InputTextTabComponent,
    NumberInputTabComponent,
    CheckboxInputTabComponent,
    ColorPickerTabComponent,
    DateInputTabComponent,
    AutocompleteInputTabComponent,
    FileUploadTabComponent,
    MultiSelectInputTabComponent,
    SelectInputTabComponent,
    PicklistInputTabComponent,
    RadioGroupInputTabComponent,
    SelectButtonInputTabComponent,
    TextareaInputTabComponent,
    RichTextEditorTabComponent,
    TableControlTabComponent,
  ],
})
export class FormDemo {}
