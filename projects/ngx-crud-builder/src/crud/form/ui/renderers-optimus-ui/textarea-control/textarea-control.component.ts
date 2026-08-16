import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TextareaModule } from "@openng/optimus-ui/textarea";
import { FormFieldBaseComponent } from "../form-field-base.component";

@Component({
  selector: "frm-textarea-control",
  templateUrl: "./textarea-control.component.html",
  imports: [TextareaModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaControlComponent extends FormFieldBaseComponent {}
