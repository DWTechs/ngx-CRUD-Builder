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
 * Component for Date field configuration tab
 * Provides comprehensive testing of all available options for date input fields
 */
@Component({
  selector: "frm-date-input-tab",
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
        <label>Main label</label>
        <input pInputText [(ngModel)]="dateLabel" placeholder="Label" />
      </div>

      <div class="demo-control">
        <label>Width</label>
        <input pInputText 
          [(ngModel)]="dateWidth"  
          placeholder="Width (ex: 300px, 50%)" />
      </div>

      <div class="demo-control">
        <label>Help text</label>
        <input pInputText 
          [(ngModel)]="dateHelpText" 
          placeholder="Help text below the field" />
      </div>

      <div class="demo-control">
        <label>Label control</label>
        <input pInputText 
          [(ngModel)]="dateControlLabel" 
          placeholder="Label dans controlOptions" />
      </div>

      <!-- Date specific options -->
      <div class="demo-control">
        <label>Selection mode</label>
        <p-select 
          [options]="selectionModeOptions" 
          [(ngModel)]="dateSelectionMode"
          (ngModelChange)="dateShowTime.set(false)"
          placeholder="Choose a mode" />
      </div>

      <div class="demo-control">
        <label>Date format</label>
        <input pInputText 
          [(ngModel)]="dateFormat" 
          placeholder="Format (ex: dd/mm/yy)" />
      </div>

      <div class="demo-control">
        <label>Overlay width</label>
        <input pInputText 
          [(ngModel)]="dateOverlayWidth" 
          placeholder="Overlay width (ex: 400px)" />
      </div>

      <div class="demo-control">
        <label>Number of months</label>
        <input pInputText 
          type="number"
          [(ngModel)]="dateNumberOfMonths" 
          placeholder="Number of months" />
      </div>

      <div class="demo-control">
        <label>Max number of dates</label>
        <input pInputText 
          type="number"
          [(ngModel)]="dateMaxCount" 
          placeholder="Max number of dates" />
      </div>

      <div class="demo-control">
        <label>Hour step</label>
        <input pInputText 
          type="number"
          [(ngModel)]="dateStepHours" 
          placeholder="Hour increment" />
      </div>

      <div class="demo-control">
        <label>Minute step</label>
        <input pInputText 
          type="number"
          [(ngModel)]="dateStepMinutes" 
          placeholder="Minute increment" />
      </div>

      <div class="demo-control">
        <label>Display mode</label>
        <p-select 
          [options]="viewModeOptions" 
          [(ngModel)]="dateViewMode"
          placeholder="Choose a mode" />
      </div>

      <!-- Checkboxes for boolean options -->
      <div class="checkboxes">
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="dateShowTime"
            binary="true" 
            [disabled]="dateSelectionMode() !== 'single'"
          />
          <label>Time selection</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="dateRequired"
            binary="true" />
          <label>Required</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="dateDisabled"
            binary="true" />
          <label>Disabled</label>
        </div>
        
        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="dateHidden"
            binary="true" />
          <label>Hidden</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="dateReadonlyInput"
            binary="true" />
          <label>Read-only input</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="dateHideOverlayOnSelect"
            binary="true" />
          <label>Hide overlay after selection</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="dateShowSeconds"
            binary="true" />
          <label>Show seconds</label>
        </div>

        <div class="demo-control">
          <p-checkbox 
            [(ngModel)]="dateTimeOnly"
            binary="true" />
          <label>Time only</label>
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
export class DateInputTabComponent {
  // Configuration signals for Date
  protected readonly dateLabel = signal("Test Date");
  protected readonly dateIcon = signal<string | undefined>(undefined);
  protected readonly dateWidth = signal<string | undefined>(undefined);
  protected readonly dateHelpText = signal<string | undefined>(undefined);
  protected readonly dateControlLabel = signal<string | undefined>(undefined);
  protected readonly dateRequired = signal(false);
  protected readonly dateDisabled = signal(false);
  protected readonly dateHidden = signal(false);
  protected readonly dateSelectionMode = signal<
    "single" | "multiple" | "range"
  >("single");
  protected readonly dateShowTime = signal(false);
  protected readonly dateDisabledDates = signal<Date[] | undefined>(undefined);
  protected readonly dateDisabledDays = signal<number[] | undefined>(undefined);
  protected readonly dateFormat = signal<string | undefined>(undefined);
  protected readonly dateMin = signal<Date | undefined>(undefined);
  protected readonly dateMax = signal<Date | undefined>(undefined);
  protected readonly dateHideOverlayOnSelect = signal<boolean | undefined>(
    undefined,
  );
  protected readonly dateMaxCount = signal<number | undefined>(undefined);
  protected readonly dateNumberOfMonths = signal<number | undefined>(undefined);
  protected readonly dateOverlayWidth = signal<string | undefined>(undefined);
  protected readonly dateReadonlyInput = signal<boolean | undefined>(undefined);
  protected readonly dateShowSeconds = signal<boolean | undefined>(undefined);
  protected readonly dateTimeOnly = signal<boolean | undefined>(undefined);
  protected readonly dateStepHours = signal<number | undefined>(undefined);
  protected readonly dateStepMinutes = signal<number | undefined>(undefined);
  protected readonly dateViewMode = signal<
    "date" | "month" | "year" | undefined
  >(undefined);

  // Form configuration and reload trigger
  protected readonly config = signal<CrudItemOptions[]>([
    {
      key: "testDate",
      controlType: CONTROL_TYPES.DATE,
      label: this.dateLabel(),
      controlOptions: {
        disabled: this.dateDisabled(),
        hidden: this.dateHidden(),
        validators: [],
        dateSelectionMode: this.dateSelectionMode(),
        dateShowTime: this.dateShowTime(),
        dateDisabledDates: this.dateDisabledDates(),
        dateDisabledDays: this.dateDisabledDays(),
        dateFormat: this.dateFormat(),
        dateMin: this.dateMin(),
        dateMax: this.dateMax(),
        dateHideOverlayOnSelect: this.dateHideOverlayOnSelect(),
        dateMaxCount: this.dateMaxCount(),
        dateNumberOfMonths: this.dateNumberOfMonths(),
        dateOverlayWidth: this.dateOverlayWidth(),
        dateReadonlyInput: this.dateReadonlyInput(),
        dateShowSeconds: this.dateShowSeconds(),
        dateTimeOnly: this.dateTimeOnly(),
        dateStepHours: this.dateStepHours(),
        dateStepMinutes: this.dateStepMinutes(),
        dateViewMode: this.dateViewMode(),
        label: this.dateControlLabel(),
        helpText: this.dateHelpText(),
      },
    },
  ]);
  protected readonly forceReload = signal(0);

  // Selection mode options
  protected readonly selectionModeOptions = [
    { label: "Single", value: "single" },
    { label: "Multiple", value: "multiple" },
    { label: "Range", value: "range" },
  ];

  // View mode options
  protected readonly viewModeOptions = [
    { label: "Date", value: "date" },
    { label: "Month", value: "month" },
    { label: "Year", value: "year" },
  ];

  /**
   * Apply the current Date configuration to generate the form
   */
  protected applyConfig(): void {
    const validators = [];

    // Add required validator if needed
    if (this.dateRequired()) {
      validators.push(Validators.required);
    }

    const fieldConfig: CrudItemOptions = {
      key: "testDate",
      controlType: CONTROL_TYPES.DATE,
      label: this.dateLabel(),
      controlOptions: {
        disabled: this.dateDisabled(),
        hidden: this.dateHidden(),
        validators: validators.length > 0 ? validators : undefined,
        dateSelectionMode: this.dateSelectionMode(),
        dateShowTime: this.dateShowTime(),
        dateDisabledDates: this.dateDisabledDates(),
        dateDisabledDays: this.dateDisabledDays(),
        dateFormat: this.dateFormat(),
        dateMin: this.dateMin(),
        dateMax: this.dateMax(),
        dateHideOverlayOnSelect: this.dateHideOverlayOnSelect(),
        dateMaxCount: this.dateMaxCount(),
        dateNumberOfMonths: this.dateNumberOfMonths(),
        dateOverlayWidth: this.dateOverlayWidth(),
        dateReadonlyInput: this.dateReadonlyInput(),
        dateShowSeconds: this.dateShowSeconds(),
        dateTimeOnly: this.dateTimeOnly(),
        dateStepHours: this.dateStepHours(),
        dateStepMinutes: this.dateStepMinutes(),
        dateViewMode: this.dateViewMode(),
        label: this.dateControlLabel(),
        helpText: this.dateHelpText(),
      },
    };

    this.config.set([fieldConfig]);
    // Force reload to ensure the form updates
    this.forceReload.set(this.forceReload() + 1);
  }
}
