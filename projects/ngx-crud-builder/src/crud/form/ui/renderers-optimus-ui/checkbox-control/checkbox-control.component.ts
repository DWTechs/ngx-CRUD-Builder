import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CheckboxModule } from "@openng/optimus-ui/checkbox";
import { FormFieldBaseComponent } from "../form-field-base.component";

@Component({
  selector: "frm-checkbox-control",
  templateUrl: "./checkbox-control.component.html",
  styleUrls: ["./checkbox-control.component.scss"],
  imports: [ReactiveFormsModule, CheckboxModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CheckboxControlComponent extends FormFieldBaseComponent {}
