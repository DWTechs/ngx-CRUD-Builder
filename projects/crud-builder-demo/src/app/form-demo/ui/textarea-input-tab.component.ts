import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CONTROL_TYPES } from "@crud/core/models/control-type.model";
import { CrudItemOptions } from "@crud/core/models/crud-item-options.model";
import {
  maxlength,
  minlength,
  required,
} from "@crud/form/utils/common.validators";
import { FormComponent } from "@form/form/form.component";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";

/**
 * Component for Textarea field configuration tab
 * Provides comprehensive testing of all available options for textarea controls
 */
@Component({
  selector: "frm-textarea-input-tab",
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
    
    <div class="demo-controls">
      <div class="demo-control">
        <label>Field Label</label>
        <input pInputText [(ngModel)]="textareaLabel" placeholder="Label" />
      </div>

      <div class="demo-control">
        <label>Placeholder</label>
        <input pInputText [(ngModel)]="textareaPlaceholder" placeholder="Placeholder" />
      </div>

      <div class="demo-control">
        <label>Icon</label>
        <p-select 
          [options]="iconOptions" 
          [(ngModel)]="textareaIcon"
          placeholder="Choose an icon"
          [showClear]="true" />
      </div>

      <div class="demo-control">
        <label>Width</label>
        <input pInputText 
          [(ngModel)]="textareaWidth"  
          placeholder="Width (ex: 300px, 50%)" />
      </div>

      <div class="demo-control">
        <label>Help text</label>
        <input pInputText 
          [(ngModel)]="textareaHelpText" 
          placeholder="Help text below the field" />
      </div>

      <div class="demo-control">
        <label>Tooltip</label>
        <input pInputText 
          [(ngModel)]="textareaTooltipLabel" 
          placeholder="Hover text" />
      </div>

      <div class="demo-control">
        <label>Label control</label>
        <input pInputText 
          [(ngModel)]="textareaControlLabel" 
          placeholder="Label in controlOptions" />
      </div>

      <div class="demo-control">
        <label>Min Length</label>
        <input pInputText 
          type="number"
          [(ngModel)]="textareaMinLength" 
          placeholder="Minimum number of characters" />
      </div>

      <div class="demo-control">
        <label>Max Length</label>
        <input pInputText 
          type="number"
          [(ngModel)]="textareaMaxLength" 
          placeholder="Maximum number of characters" />
      </div>

      <!-- Checkboxes for boolean options -->
      <div class="checkboxes">
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="textareaRequired"
            binary="true" />
          <label>Required</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="textareaDisabled"
            binary="true" />
          <label>Disabled</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="textareaHidden"
            binary="true" />
          <label>Hidden</label>
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
export class TextareaInputTabComponent {
  // Configuration signals for Textarea
  protected readonly textareaLabel = signal("Test Textarea");
  protected readonly textareaPlaceholder = signal("Enter your text...");
  protected readonly textareaIcon = signal<string | undefined>(undefined);
  protected readonly textareaWidth = signal<string | undefined>(undefined);
  protected readonly textareaHelpText = signal<string | undefined>(undefined);
  protected readonly textareaTooltipLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly textareaControlLabel = signal<string | undefined>(
    undefined,
  );
  protected readonly textareaRequired = signal(false);
  protected readonly textareaDisabled = signal(false);
  protected readonly textareaHidden = signal(false);
  protected readonly textareaReadonly = signal(false);
  protected readonly textareaMinLength = signal<number | undefined>(undefined);
  protected readonly textareaMaxLength = signal<number | undefined>(undefined);

  // Form configuration and reload trigger
  protected readonly config = signal<CrudItemOptions[]>([
    {
      key: "testTextarea",
      controlType: CONTROL_TYPES.TEXTAREA,
      label: this.textareaLabel(),
      controlOptions: {
        disabled: this.textareaDisabled(),
        hidden: this.textareaHidden(),
        validators: [],
        placeholder: this.textareaPlaceholder(),
        inputIcon: this.textareaIcon(),
        helpText: this.textareaHelpText(),
        tooltipLabel: this.textareaTooltipLabel(),
        label: this.textareaControlLabel(),
        minLength: this.textareaMinLength(),
        maxLength: this.textareaMaxLength(),
      },
    },
  ]);
  protected readonly forceReload = signal(0);

  // Icon options for dropdown
  protected readonly iconOptions = [
    { label: "Comment", value: "pi pi-comment" },
    { label: "File Edit", value: "pi pi-file-edit" },
    { label: "Pencil", value: "pi pi-pencil" },
    { label: "Align Left", value: "pi pi-align-left" },
    { label: "Book", value: "pi pi-book" },
    { label: "File", value: "pi pi-file" },
    { label: "List", value: "pi pi-list" },
    { label: "Envelope", value: "pi pi-envelope" },
  ];

  /**
   * Apply the current Textarea configuration to generate the form
   */
  protected applyConfig(): void {
    const validators = [];

    // Add validators
    if (this.textareaRequired()) {
      validators.push(required);
    }
    const textareaMinLength = this.textareaMinLength();
    if (textareaMinLength !== undefined) {
      validators.push(minlength(textareaMinLength));
    }
    const textareaMaxLength = this.textareaMaxLength();
    if (textareaMaxLength !== undefined) {
      validators.push(maxlength(textareaMaxLength));
    }

    const fieldConfig: CrudItemOptions = {
      key: "testTextarea",
      controlType: CONTROL_TYPES.TEXTAREA,
      label: this.textareaLabel(),
      controlOptions: {
        disabled: this.textareaDisabled(),
        hidden: this.textareaHidden(),
        validators: validators.length > 0 ? validators : undefined,
        placeholder: this.textareaPlaceholder(),
        inputIcon: this.textareaIcon(),
        helpText: this.textareaHelpText(),
        tooltipLabel: this.textareaTooltipLabel(),
        label: this.textareaControlLabel(),
        minLength: this.textareaMinLength(),
        maxLength: this.textareaMaxLength(),
      },
    };

    this.config.set([fieldConfig]);
    // Force reload to ensure the form updates
    this.forceReload.set(this.forceReload() + 1);
  }
}
