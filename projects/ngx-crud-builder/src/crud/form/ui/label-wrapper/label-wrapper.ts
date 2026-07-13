import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { FloatLabelModule } from "primeng/floatlabel";
import { IconFieldModule } from "primeng/iconfield";
import { IftaLabelModule } from "primeng/iftalabel";
import { InputIconModule } from "primeng/inputicon";
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
      CONTROL_TYPES.FILES,
      CONTROL_TYPES.PICKLIST,
      CONTROL_TYPES.TABLE,
      CONTROL_TYPES.WYSIWYG,
      CONTROL_TYPES.CUSTOM,
    ];
    return normalLabelControls.includes(this.config().controlType);
  });

  protected readonly fieldLabelStrategy = computed<LabelStrategy>(() => {
    const defaultStrategy = this.labelStrategy();
    if (this.isForcedNormalLabel()) {
      return "normal";
    }
    if (
      defaultStrategy === "float" &&
      (this.config().controlType === CONTROL_TYPES.RADIO ||
        this.config().controlType === CONTROL_TYPES.SELECT_BUTTON)
    ) {
      return "normal";
    }
    return defaultStrategy;
  });
}
