import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ChipModule } from "primeng/chip";
import { IftaLabelModule } from "primeng/iftalabel";
import { MultiSelectModule } from "primeng/multiselect";
import { FormFieldBaseComponent } from "../form-field-base.component";
import { MultiSelectOptionPipe } from "./multi-select-option.pipe";

@Component({
  standalone: true,
  imports: [
    MultiSelectModule,
    ReactiveFormsModule,
    IftaLabelModule,
    MultiSelectOptionPipe,
    ChipModule,
  ],
  selector: "frm-multi-select-control",
  templateUrl: "./multi-select-control.component.html",
  styleUrls: ["./multi-select-control.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiSelectControlComponent extends FormFieldBaseComponent {}
