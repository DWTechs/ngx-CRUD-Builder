import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SelectModule } from "@openng/optimus-ui/select";
import { FormFieldBaseComponent } from "../form-field-base.component";

@Component({
  selector: "frm-select-control",
  templateUrl: "./select-control.component.html",
  styleUrls: ["./select-control.component.scss"],
  imports: [SelectModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectControlComponent extends FormFieldBaseComponent {}
