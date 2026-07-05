import { NgComponentOutlet } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  OutputEmitterRef,
  viewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { isNil } from "@dwtechs/checkard";
import { Subscription } from "rxjs";
import { ControlOptions } from "../../core/models/control-options.model";
import { CONTROL_TYPES } from "../../core/models/control-type.model";
import { CrudItemOptions } from "../../core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "../../core/models/form-field-interaction.event";
import { FormErrorMessage } from "../ui/field-error-message/field-error-message";
import { FORM_FIELD_COMPONENT } from "../ui/field-renderer/form-field-component.token";
import { required } from "../utils/common.validators";
import { LabelStrategy } from "../utils/label-strategy.model";

@Component({
  selector: "frm-simple-element",
  templateUrl: "./simple-element.html",
  styleUrls: ["./simple-element.scss"],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormErrorMessage,
    NgComponentOutlet,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class.display-none]": "!isVisible()",
    "[style.minWidth]": "width() ?? minWidth() ?? defaultControlWidth()",
    "[style.maxWidth]": "width() ?? maxWidth() ?? defaultControlWidth()",
    "[class]": "controlOptions().styleClass",
  },
})
export class FormSimpleElement implements OnInit, AfterViewInit, OnDestroy {
  public readonly config = input.required<CrudItemOptions>();
  public readonly control = input.required<FormControl>();
  public readonly isFormReadonly = input.required<boolean | undefined>();
  public readonly defaultControlWidth = input.required<string>();
  public readonly labelStrategy = input.required<LabelStrategy>();
  public readonly labelStrategyVariant = input.required<
    "on" | "in" | "over" | undefined
  >();
  public readonly syncValueInc = input.required<number>();

  public readonly fieldInteraction = output<FormFieldInteractionEvent>();

  public readonly ControlType = CONTROL_TYPES;

  /** Full field component (label + control) resolved from FORM_FIELD_COMPONENT token.
   * Throws at runtime if no provider is configured — use `providePrimengFormFieldRenderer()`
   * or `provideNativeFormFieldRenderer()` in your application config. */
  protected readonly fieldComponent = inject(FORM_FIELD_COMPONENT);

  private readonly rendererOutlet = viewChild(NgComponentOutlet);
  private sub = new Subscription();

  protected readonly controlOptions = computed<Partial<ControlOptions>>(() => {
    return this.config()?.controlOptions ?? {};
  });

  protected readonly width = computed(() => this.controlOptions().width);
  protected readonly minWidth = computed(() => this.controlOptions().minWidth);
  protected readonly maxWidth = computed(() => this.controlOptions().maxWidth);

  protected readonly isVisible = computed<boolean>(() => {
    return !this.controlOptions().hidden;
  });

  ngOnInit(): void {
    if (
      !isNil(this.control().value) &&
      !this.control().hasValidator(required)
    ) {
      this.control().markAsTouched();
    }
  }

  ngAfterViewInit(): void {
    const outlet = this.rendererOutlet();
    const fieldInteraction = outlet?.componentInstance?.fieldInteraction as
      | OutputEmitterRef<FormFieldInteractionEvent>
      | undefined;
    if (fieldInteraction) {
      this.sub.add(
        fieldInteraction.subscribe((event: FormFieldInteractionEvent) =>
          this.fieldInteraction.emit(event),
        ),
      );
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
