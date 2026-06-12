import { Component, signal } from "@angular/core";
import { FormsModule, Validators } from "@angular/forms";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { hexColor } from "@crud/form/utils/common.validators";
import { FormComponent } from "@form/form/form.component";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";

@Component({
  selector: "frm-color-picker-tab",
  imports: [
    FormComponent,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
  ],
  template: `
    <div class="config-panel">
      <h3>Configuration</h3>

      <div class="demo-controls">
        <div class="demo-control">
          <label>Field Label</label>
          <input pInputText [(ngModel)]="label" placeholder="Label" />
        </div>

        <div class="demo-control">
          <label>Placeholder</label>
          <input pInputText [(ngModel)]="placeholder" placeholder="#RRGGBB" />
        </div>

        <div class="demo-control">
          <label>Default Value</label>
          <input
            pInputText
            [(ngModel)]="defaultValue"
            placeholder="#3b82f6"
          />
        </div>

        <div class="checkboxes">
          <div class="demo-control">
            <p-checkbox [(ngModel)]="required" binary="true" />
            <label>Required</label>
          </div>

          <div class="demo-control">
            <p-checkbox [(ngModel)]="validateHex" binary="true" />
            <label>Validate hex format</label>
          </div>

          <div class="demo-control">
            <p-checkbox [(ngModel)]="disabled" binary="true" />
            <label>Disabled</label>
          </div>
        </div>

        <p-button label="Apply" (click)="applyConfig()" class="apply-btn" />
      </div>
    </div>

    <div class="live-demo">
      <h3>Preview</h3>
      <frm-form
        [model]="{}"
        [config]="config()"
        labelStrategy="ifta"
        [forceReload]="forceReload()"
        [showDebug]="true"
      />
    </div>
  `,
})
export class ColorPickerTabComponent {
  protected readonly label = signal("Brand color");
  protected readonly placeholder = signal("");
  protected readonly defaultValue = signal("#3b82f6");
  protected readonly required = signal(false);
  protected readonly validateHex = signal(true);
  protected readonly disabled = signal(false);

  protected readonly config = signal<CrudItemOptions[]>([
    {
      key: "brandColor",
      controlType: CONTROL_TYPES.COLOR,
      label: "Brand color",
      controlOptions: {
        defaultValue: "#3b82f6",
        validators: [hexColor],
      },
    },
  ]);
  protected readonly forceReload = signal(0);

  protected applyConfig(): void {
    const validators = [];
    if (this.required()) validators.push(Validators.required);
    if (this.validateHex()) validators.push(hexColor);

    this.config.set([
      {
        key: "brandColor",
        controlType: CONTROL_TYPES.COLOR,
        label: this.label(),
        controlOptions: {
          defaultValue: this.defaultValue() || undefined,
          disabled: this.disabled(),
          placeholder: this.placeholder() || undefined,
          validators,
        },
      },
    ]);
    this.forceReload.update((v) => v + 1);
  }
}
