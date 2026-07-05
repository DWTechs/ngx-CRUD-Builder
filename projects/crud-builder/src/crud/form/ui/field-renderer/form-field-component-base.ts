import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { ControlOptions } from "../../../core/models/control-options.model";
import { CrudItemOptions } from "../../../core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "../../../core/models/form-field-interaction.event";
import { required, requiredTrue } from "../../utils/common.validators";
import { LabelStrategy } from "../../utils/label-strategy.model";

/**
 * Base class for full form field components (label + control).
 *
 * Defines the input/output contract consumed by `FormSimpleElement` via
 * `NgComponentOutlet`, and provides shared computed signals used by adapter
 * implementations (e.g. `isRequired`, `label`).
 *
 * Extend this class in each adapter's full field component to satisfy the
 * `FORM_FIELD_COMPONENT` token contract.
 */
@Component({
  selector: "frm-form-field-base",
  template: "",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponentBase {
  config = input.required<CrudItemOptions>();
  control = input.required<FormControl>();
  isFormReadonly = input.required<boolean | undefined>();
  syncValueInc = input.required<number>();
  labelStrategy = input.required<LabelStrategy>();
  labelVariant = input<"on" | "in" | "over" | undefined>();

  fieldInteraction = output<FormFieldInteractionEvent>();

  protected readonly isRequired = computed<boolean>(() => {
    return (
      !!this.config().key &&
      (this.control().hasValidator(required) ||
        this.control().hasValidator(requiredTrue))
    );
  });

  protected readonly options = computed<Partial<ControlOptions>>(() => {
    return this.config().controlOptions ?? {};
  });

  protected readonly label = computed<string>(() => {
    return this.options().label ?? this.config().label ?? "";
  });
}
