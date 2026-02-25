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
 * Component for Picklist field configuration tab
 * Provides comprehensive testing of all available options for picklist controls
 */
@Component({
  selector: "frm-picklist-input-tab",
  imports: [
    FormComponent,
    FormsModule,
    ButtonModule,
    SelectModule,
    CheckboxModule,
    InputTextModule,
  ],
  template: `
    <div class="config-panel">
      <h3>Configuration</h3>
      
      <div class="demo-controls">
      <div class="demo-control">
        <label>Field Label</label>
        <input pInputText [(ngModel)]="picklistLabel" placeholder="Label" />
      </div>

      <div class="demo-control">
        <label>Width</label>
        <input pInputText 
          [(ngModel)]="picklistWidth" 
          placeholder="Width (ex: 300px, 50%)" />
      </div>

      <div class="demo-control">
        <label>Help text</label>
        <input pInputText 
          [(ngModel)]="picklistHelpText" 
          placeholder="Help text below the field" />
      </div>

      <div class="demo-control">
        <label>Tooltip</label>
        <input pInputText 
          [(ngModel)]="picklistTooltipLabel" 
          placeholder="Texte au survol" />
      </div>

      <div class="demo-control">
        <label>Label control</label>
        <input pInputText 
          [(ngModel)]="picklistControlLabel" 
          placeholder="Label dans controlOptions" />
      </div>

      <!-- Checkboxes for boolean options -->
      <div class="checkboxes">
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="picklistRequired"
            binary="true" />
          <label>Required</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="picklistDisabled"
            binary="true" />
          <label>Disabled</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="picklistHidden"
            binary="true" />
          <label>Hidden</label>
        </div>
      </div>

      <p-button 
        label="Apply"
        (click)="applyConfig()"
        class="apply-btn" />
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
export class PicklistInputTabComponent {
  // Configuration signals for Picklist
  protected readonly picklistLabel = signal("Test Picklist");
  protected readonly picklistWidth = signal<string | undefined>(undefined);
  protected readonly picklistHelpText = signal<string | undefined>(undefined);
  protected readonly picklistTooltipLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly picklistControlLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly picklistRequired = signal(false);
  protected readonly picklistDisabled = signal(false);
  protected readonly picklistHidden = signal(false);

  // Sample data for picklist
  private readonly sampleOptions = [
    { label: "France", value: "FR", icon: "pi pi-flag" },
    { label: "United States", value: "US", icon: "pi pi-flag" },
    { label: "Allemagne", value: "DE", icon: "pi pi-flag" },
    { label: "Italie", value: "IT", icon: "pi pi-flag" },
    { label: "Espagne", value: "ES", icon: "pi pi-flag" },
    { label: "Royaume-Uni", value: "GB", icon: "pi pi-flag" },
    { label: "Canada", value: "CA", icon: "pi pi-flag" },
    { label: "Japon", value: "JP", icon: "pi pi-flag" },
    { label: "Australie", value: "AU", icon: "pi pi-flag" },
    { label: "Brazil", value: "BR", icon: "pi pi-flag" },
    { label: "Chine", value: "CN", icon: "pi pi-flag" },
    { label: "Inde", value: "IN", icon: "pi pi-flag" },
    { label: "Mexique", value: "MX", icon: "pi pi-flag" },
    { label: "Pays-Bas", value: "NL", icon: "pi pi-flag" },
    { label: "Suisse", value: "CH", icon: "pi pi-flag" },
  ];

  // Form configuration and reload trigger
  protected readonly config = signal<CrudItemOptions[]>([
    {
      key: "testPicklist",
      controlType: CONTROL_TYPES.PICKLIST,
      label: this.picklistLabel(),
      options: this.sampleOptions,
      controlOptions: {
        disabled: this.picklistDisabled(),
        hidden: this.picklistHidden(),
        validators: [],
        helpText: this.picklistHelpText(),
        tooltipLabel: this.picklistTooltipLabel(),
        label: this.picklistControlLabel(),
      },
    },
  ]);
  protected readonly forceReload = signal(0);

  /**
   * Apply the current Picklist configuration to generate the form
   */
  protected applyConfig(): void {
    const validators = [];

    // Add required validator if needed
    if (this.picklistRequired()) {
      validators.push(Validators.required);
    }

    const fieldConfig: CrudItemOptions = {
      key: "testPicklist",
      controlType: CONTROL_TYPES.PICKLIST,
      label: this.picklistLabel(),
      options: this.sampleOptions,
      controlOptions: {
        disabled: this.picklistDisabled(),
        hidden: this.picklistHidden(),
        validators: validators.length > 0 ? validators : undefined,
        helpText: this.picklistHelpText(),
        tooltipLabel: this.picklistTooltipLabel(),
        label: this.picklistControlLabel(),
      },
    };

    this.config.set([fieldConfig]);
    // Force reload to ensure the form updates
    this.forceReload.set(this.forceReload() + 1);
  }
}
