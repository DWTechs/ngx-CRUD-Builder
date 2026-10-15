import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { FloatLabelModule } from "@openng/optimus-ui/floatlabel";
import { IconFieldModule } from "@openng/optimus-ui/iconfield";
import { IftaLabelModule } from "@openng/optimus-ui/iftalabel";
import { InputIconModule } from "@openng/optimus-ui/inputicon";
import { ControlOptions } from "../../../core/models/control-options.model";
import {
  CONTROL_TYPES,
  ControlType,
} from "../../../core/models/control-type.model";
import { CrudItemOptions } from "../../../core/models/crud-item-options.model";
import { required, requiredTrue } from "../../utils/common.validators";
import { LabelStrategy } from "../../utils/label-strategy.model";
import { FormFieldTooltip } from "../field-tooltip/field-tooltip";

@Component({
  selector: "frm-label-wrapper",
  imports: [
    IftaLabelModule,
    FloatLabelModule,
    NgTemplateOutlet,
    IconFieldModule,
    InputIconModule,
    FormFieldTooltip,
  ],
  templateUrl: "./label-wrapper.html",
  styleUrls: ["./label-wrapper.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelWrapperComponent {
  public readonly labelStrategy = input.required<LabelStrategy>();
  public readonly labelVariant = input.required<
    "on" | "in" | "over" | undefined
  >();
  public readonly config = input.required<CrudItemOptions>();
  public readonly control = input.required<FormControl>();

  protected readonly isRequired = computed<boolean>(() => {
    return (
      !!this.config().key &&
      (this.control().hasValidator(required) ||
        this.control().hasValidator(requiredTrue))
    );
  });

  protected readonly options = computed<ControlOptions>(() => {
    return this.config().controlOptions ?? {};
  });

  protected readonly label = computed(() => {
    return this.options().label ?? this.config().label ?? "";
  });

  protected readonly inputIcon = computed<string | null>(() => {
    return this.options().inputIcon ?? null;
  });

  protected readonly isForcedNormalLabel = computed(() => {
    const normalLabelControls: ControlType[] = [
      // CONTROL_TYPES.CHECKBOX,
      CONTROL_TYPES.PICKLIST,
      CONTROL_TYPES.TABLE,
      CONTROL_TYPES.WYSIWYG,
      CONTROL_TYPES.CUSTOM,
    ];
    return normalLabelControls.includes(this.config().controlType);
  });

  protected readonly fieldLabelStrategy = computed<LabelStrategy>(() => {
    if (this.isForcedNormalLabel()) {
      return "normal";
    }
    return this.labelStrategy();
  });

  // No focus/filled state to trigger the float animation: keep the label up
  protected readonly isAlwaysFloated = computed(() => {
    const alwaysFloatedControls: ControlType[] = [
      CONTROL_TYPES.RADIO,
      CONTROL_TYPES.SELECT_BUTTON,
      CONTROL_TYPES.FILES,
    ];
    return alwaysFloatedControls.includes(this.config().controlType);
  });
}
