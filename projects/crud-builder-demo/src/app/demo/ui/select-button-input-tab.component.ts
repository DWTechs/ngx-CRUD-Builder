import { Component, signal } from "@angular/core";
import { FormsModule, Validators } from "@angular/forms";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import { FormComponent } from "@form/form/form.component";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";

/**
 * Component for Select Button field configuration tab
 * Provides comprehensive testing of all available options for select button controls
 */
@Component({
  selector: "frm-select-button-input-tab",
  imports: [
    FormComponent,
    FormsModule,
    ButtonModule,
    SelectModule,
    CheckboxModule,
    InputTextModule,
  ],
  template: `
    <h3>Configuration</h3>
    <p class="intro-text">
      Available options for a Select Button field (selection buttons)
    </p>
    
    <div class="demo-controls">
      <div class="demo-control">
        <label>Field Label</label>
        <input pInputText [(ngModel)]="selectButtonLabel" placeholder="Label" />
      </div>

      <div class="demo-control">
        <label>Width</label>
        <input pInputText 
          [(ngModel)]="selectButtonWidth" 
          placeholder="Width (ex: 300px, 50%)" />
      </div>

      <div class="demo-control">
        <label>Help text</label>
        <input pInputText 
          [(ngModel)]="selectButtonHelpText" 
          placeholder="Help text below the field" />
      </div>

      <div class="demo-control">
        <label>Tooltip</label>
        <input pInputText 
          [(ngModel)]="selectButtonTooltipLabel" 
          placeholder="Texte au survol" />
      </div>

      <div class="demo-control">
        <label>Label control</label>
        <input pInputText 
          [(ngModel)]="selectButtonControlLabel" 
          placeholder="Label dans controlOptions" />
      </div>

      <!-- Checkboxes for boolean options -->
      <div class="checkboxes">
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="selectButtonRequired"
            binary="true" />
          <label>Required</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="selectButtonDisabled"
            binary="true" />
          <label>Disabled</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="selectButtonHidden"
            binary="true" />
          <label>Hidden</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="selectButtonMultiple"
            binary="true" />
          <label>Multiple selection</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="selectButtonToggleable"
            binary="true" />
          <label>Deselectable options</label>
        </div>
      </div>

      <p-button 
        label="Apply"
        (click)="applyConfig()"
        class="apply-btn" />
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
export class SelectButtonInputTabComponent {
  // Configuration signals for Select Button
  protected readonly selectButtonLabel = signal("Test Select Button");
  protected readonly selectButtonWidth = signal<string | undefined>(undefined);
  protected readonly selectButtonHelpText = signal<string | undefined>(
    undefined,
  );
  protected readonly selectButtonTooltipLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly selectButtonControlLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly selectButtonRequired = signal(false);
  protected readonly selectButtonDisabled = signal(false);
  protected readonly selectButtonHidden = signal(false);
  protected readonly selectButtonMultiple = signal<boolean>(false);
  protected readonly selectButtonToggleable = signal<boolean>(true);

  // Sample data for select button
  private readonly sampleOptions = [
    { label: "Petit", value: "S", icon: "pi pi-minus" },
    { label: "Moyen", value: "M", icon: "pi pi-equals" },
    { label: "Grand", value: "L", icon: "pi pi-plus" },
    { label: "Extra", value: "XL", icon: "pi pi-plus-circle" },
  ];

  // Form configuration and reload trigger
  protected readonly config = signal<CrudItemOptions[]>([
    {
      key: "testSelectButton",
      controlType: CONTROL_TYPES.SELECT_BUTTON,
      label: this.selectButtonLabel(),
      options: this.sampleOptions,
      controlOptions: {
        disabled: this.selectButtonDisabled(),
        hidden: this.selectButtonHidden(),
        validators: [],
        helpText: this.selectButtonHelpText(),
        tooltipLabel: this.selectButtonTooltipLabel(),
        label: this.selectButtonControlLabel(),
        multipleSelectButton: this.selectButtonMultiple(),
        isSelectButtonOptionToggleable: this.selectButtonToggleable(),
      },
    },
  ]);
  protected readonly forceReload = signal(0);

  /**
   * Apply the current Select Button configuration to generate the form
   */
  protected applyConfig(): void {
    const validators = [];

    // Add required validator if needed
    if (this.selectButtonRequired()) {
      validators.push(Validators.required);
    }

    const fieldConfig: CrudItemOptions = {
      key: "testSelectButton",
      controlType: CONTROL_TYPES.SELECT_BUTTON,
      label: this.selectButtonLabel(),
      options: this.sampleOptions,
      controlOptions: {
        disabled: this.selectButtonDisabled(),
        hidden: this.selectButtonHidden(),
        validators: validators.length > 0 ? validators : undefined,
        helpText: this.selectButtonHelpText(),
        tooltipLabel: this.selectButtonTooltipLabel(),
        label: this.selectButtonControlLabel(),
        multipleSelectButton: this.selectButtonMultiple(),
        isSelectButtonOptionToggleable: this.selectButtonToggleable(),
      },
    };

    this.config.set([fieldConfig]);
    // Force reload to ensure the form updates
    this.forceReload.set(this.forceReload() + 1);
  }
}
