import { provideHttpClient } from "@angular/common/http";
import { Component, input, output, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { MessageService } from "primeng/api";
import { CONTROL_TYPES } from "../../../core/models/control-type.model";
import { CrudItemOptions } from "../../../core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "../../../core/models/form-field-interaction.event";
import { FormFieldRenderer } from "./field-renderer";

/**
 * Mock custom component for testing CUSTOM control type
 */
@Component({
  selector: "frm-mock-custom",
  template: `<div class="mock-custom">Custom Component</div>`,
  standalone: true,
})
class MockCustomComponent {
  config = input<CrudItemOptions>();
  control = input<FormControl>(new FormControl());
  isFormReadonly = input<boolean | undefined>(false);
  fieldInteraction = output<FormFieldInteractionEvent>();
}

/**
 * Test wrapper component
 */
@Component({
  template: `
    <frm-field-renderer
      [config]="config()"
      [control]="control()"
      [isFormReadonly]="isFormReadonly()"
      [syncValueInc]="syncValueInc()"
      (fieldInteraction)="onFieldInteraction($event)"
    />
  `,
  standalone: true,
  imports: [FormFieldRenderer],
})
class TestWrapperComponent {
  config = signal<CrudItemOptions>({
    key: "testField",
    label: "Test Field",
    controlType: CONTROL_TYPES.INPUT,
  });
  control = signal(new FormControl(""));
  isFormReadonly = signal<boolean | undefined>(false);
  syncValueInc = signal(0);
  onFieldInteraction = vi.fn();
}

describe("FormFieldRenderer", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: TestWrapperComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestWrapperComponent, ReactiveFormsModule],
      providers: [provideAnimations(), provideHttpClient(), MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

  describe("Control Type Rendering", () => {
    it("should render INPUT text control", () => {
      component.config.set({
        key: "textField",
        label: "Text Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector("input");
      expect(inputElement).toBeTruthy();
    });

    it("should render INPUT number control when type is number", () => {
      component.config.set({
        key: "numberField",
        label: "Number Field",
        controlType: CONTROL_TYPES.INPUT,
        type: "number",
      });
      fixture.detectChanges();

      const numberControl = fixture.nativeElement.querySelector(
        "frm-inputnumber-control",
      );
      expect(numberControl).toBeTruthy();
    });

    it("should render TEXTAREA control", () => {
      component.config.set({
        key: "textareaField",
        label: "Textarea Field",
        controlType: CONTROL_TYPES.TEXTAREA,
      });
      fixture.detectChanges();

      const textareaControl = fixture.nativeElement.querySelector(
        "frm-textarea-control",
      );
      expect(textareaControl).toBeTruthy();
    });

    it("should render SELECT control", () => {
      component.config.set({
        key: "selectField",
        label: "Select Field",
        controlType: CONTROL_TYPES.SELECT,
        options: [
          { label: "Option 1", value: "opt1" },
          { label: "Option 2", value: "opt2" },
        ],
      });
      fixture.detectChanges();

      const selectControl =
        fixture.nativeElement.querySelector("frm-select-control");
      expect(selectControl).toBeTruthy();
    });

    it("should render MULTISELECT control", () => {
      component.config.set({
        key: "multiselectField",
        label: "Multiselect Field",
        controlType: CONTROL_TYPES.MULTISELECT,
        options: [
          { label: "Option 1", value: "opt1" },
          { label: "Option 2", value: "opt2" },
        ],
      });
      fixture.detectChanges();

      const multiselectControl = fixture.nativeElement.querySelector(
        "frm-multi-select-control",
      );
      expect(multiselectControl).toBeTruthy();
    });

    it("should render CHECKBOX control", () => {
      component.config.set({
        key: "checkboxField",
        label: "Checkbox Field",
        controlType: CONTROL_TYPES.CHECKBOX,
      });
      fixture.detectChanges();

      const checkboxControl = fixture.nativeElement.querySelector(
        "frm-checkbox-control",
      );
      expect(checkboxControl).toBeTruthy();
    });

    it("should render RADIO control", () => {
      component.config.set({
        key: "radioField",
        label: "Radio Field",
        controlType: CONTROL_TYPES.RADIO,
        options: [
          { label: "Option 1", value: "opt1" },
          { label: "Option 2", value: "opt2" },
        ],
      });
      fixture.detectChanges();

      const radioControl = fixture.nativeElement.querySelector(
        "frm-radiogroup-control",
      );
      expect(radioControl).toBeTruthy();
    });

    it("should render DATE control", () => {
      component.config.set({
        key: "dateField",
        label: "Date Field",
        controlType: CONTROL_TYPES.DATE,
      });
      fixture.detectChanges();

      const dateControl =
        fixture.nativeElement.querySelector("frm-date-control");
      expect(dateControl).toBeTruthy();
    });

    it("should render AUTOCOMPLETE control", () => {
      component.config.set({
        key: "autocompleteField",
        label: "Autocomplete Field",
        controlType: CONTROL_TYPES.AUTOCOMPLETE,
      });
      fixture.detectChanges();

      const autocompleteControl = fixture.nativeElement.querySelector(
        "frm-autocomplete-control",
      );
      expect(autocompleteControl).toBeTruthy();
    });

    it("should render FILES control", () => {
      component.config.set({
        key: "filesField",
        label: "Files Field",
        controlType: CONTROL_TYPES.FILES,
      });
      fixture.detectChanges();

      const filesControl = fixture.nativeElement.querySelector(
        "frm-file-upload-input",
      );
      expect(filesControl).toBeTruthy();
    });

    it("should render WYSIWYG control", () => {
      component.config.set({
        key: "wysiwygField",
        label: "WYSIWYG Field",
        controlType: CONTROL_TYPES.WYSIWYG,
      });
      fixture.detectChanges();

      const wysiwygControl = fixture.nativeElement.querySelector(
        "frm-rich-text-editor",
      );
      expect(wysiwygControl).toBeTruthy();
    });

    it("should render TABLE control", () => {
      component.config.set({
        key: "tableField",
        label: "Table Field",
        controlType: CONTROL_TYPES.TABLE,
      });
      fixture.detectChanges();

      const tableControl =
        fixture.nativeElement.querySelector("frm-table-control");
      expect(tableControl).toBeTruthy();
    });

    it("should render PICKLIST control", () => {
      component.config.set({
        key: "picklistField",
        label: "Picklist Field",
        controlType: CONTROL_TYPES.PICKLIST,
      });
      fixture.detectChanges();

      const picklistControl = fixture.nativeElement.querySelector(
        "frm-picklist-control",
      );
      expect(picklistControl).toBeTruthy();
    });

    it("should render SELECT_BUTTON control", () => {
      component.config.set({
        key: "selectButtonField",
        label: "Select Button Field",
        controlType: CONTROL_TYPES.SELECT_BUTTON,
        options: [
          { label: "Option 1", value: "opt1" },
          { label: "Option 2", value: "opt2" },
        ],
      });
      fixture.detectChanges();

      const selectButtonControl = fixture.nativeElement.querySelector(
        "frm-select-button-control",
      );
      expect(selectButtonControl).toBeTruthy();
    });
  });

  describe("Custom Control Type", () => {
    it("should render custom component when provided", () => {
      component.config.set({
        key: "customField",
        label: "Custom Field",
        controlType: CONTROL_TYPES.CUSTOM,
        controlOptions: {
          customComponent: MockCustomComponent,
        },
      });
      fixture.detectChanges();

      const customComponent =
        fixture.nativeElement.querySelector(".mock-custom");
      expect(customComponent).toBeTruthy();
      expect(customComponent.textContent?.trim()).toBe("Custom Component");
    });

    it("should render error icon when custom component is not provided", () => {
      component.config.set({
        key: "customField",
        label: "Custom Field",
        controlType: CONTROL_TYPES.CUSTOM,
      });
      fixture.detectChanges();

      const errorIcon = fixture.nativeElement.querySelector(
        "i.pi-exclamation-triangle",
      );
      expect(errorIcon).toBeTruthy();
      expect(errorIcon.getAttribute("title")).toBe(
        "You must provide a custom component",
      );
    });

    it("should render error icon when customComponent is undefined", () => {
      component.config.set({
        key: "customField",
        label: "Custom Field",
        controlType: CONTROL_TYPES.CUSTOM,
        controlOptions: {
          customComponent: undefined,
        },
      });
      fixture.detectChanges();

      const errorIcon = fixture.nativeElement.querySelector(
        "i.pi-exclamation-triangle",
      );
      expect(errorIcon).toBeTruthy();
    });
  });

  describe("Input Propagation", () => {
    it("should pass config to child component", () => {
      component.config.set({
        key: "testField",
        label: "Test Label",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const inputControl = fixture.nativeElement.querySelector(
        "frm-inputtext-control",
      );
      expect(inputControl).toBeTruthy();
    });

    it("should pass control to child component", () => {
      const testControl = new FormControl("test value");
      component.control.set(testControl);
      component.config.set({
        key: "testField",
        label: "Test Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const inputElement = fixture.nativeElement.querySelector("input");
      expect(inputElement.value).toBe("test value");
    });

    it("should pass isFormReadonly to child component", () => {
      component.isFormReadonly.set(true);
      component.config.set({
        key: "testField",
        label: "Test Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const inputControl = fixture.nativeElement.querySelector(
        "frm-inputtext-control",
      );
      expect(inputControl).toBeTruthy();
    });

    it("should pass syncValueInc to DATE control", () => {
      component.syncValueInc.set(5);
      component.config.set({
        key: "dateField",
        label: "Date Field",
        controlType: CONTROL_TYPES.DATE,
      });
      fixture.detectChanges();

      const dateControl =
        fixture.nativeElement.querySelector("frm-date-control");
      expect(dateControl).toBeTruthy();
    });
  });

  describe("Field Interaction Events", () => {
    it("should emit fieldInteraction when child component emits", async () => {
      component.config.set({
        key: "testField",
        label: "Test Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      component.onFieldInteraction = vi
        .fn()
        .mockImplementation((event: FormFieldInteractionEvent) => {
          expect(event.key).toBe("testField");
        });

      const inputElement: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      inputElement.dispatchEvent(new Event("input"));
      fixture.detectChanges();
    });
  });

  describe("Lifecycle Hooks", () => {
    it("should not throw error on destroy", () => {
      component.config.set({
        key: "testField",
        label: "Test Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      expect(() => fixture.destroy()).not.toThrow();
    });
  });

  describe("Edge Cases", () => {
    it("should handle control type changes", () => {
      component.config.set({
        key: "testField",
        label: "Test Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      let inputElement = fixture.nativeElement.querySelector("input");
      expect(inputElement).toBeTruthy();

      component.config.set({
        key: "testField",
        label: "Test Field",
        controlType: CONTROL_TYPES.TEXTAREA,
      });
      fixture.detectChanges();

      const textareaControl = fixture.nativeElement.querySelector(
        "frm-textarea-control",
      );
      expect(textareaControl).toBeTruthy();
      inputElement = fixture.nativeElement.querySelector("input");
      expect(inputElement).toBeFalsy();
    });

    it("should handle control value changes", () => {
      component.control.set(new FormControl("initial"));
      component.config.set({
        key: "testField",
        label: "Test Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      let inputElement: HTMLInputElement =
        fixture.nativeElement.querySelector("input");
      expect(inputElement.value).toBe("initial");

      component.control.set(new FormControl("updated"));
      fixture.detectChanges();

      inputElement = fixture.nativeElement.querySelector("input");
      expect(inputElement.value).toBe("updated");
    });

    it("should handle readonly state changes", () => {
      component.isFormReadonly.set(false);
      component.config.set({
        key: "testField",
        label: "Test Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      let inputControl = fixture.nativeElement.querySelector(
        "frm-inputtext-control",
      );
      expect(inputControl).toBeTruthy();

      component.isFormReadonly.set(true);
      fixture.detectChanges();

      inputControl = fixture.nativeElement.querySelector(
        "frm-inputtext-control",
      );
      expect(inputControl).toBeTruthy();
    });
  });
});
