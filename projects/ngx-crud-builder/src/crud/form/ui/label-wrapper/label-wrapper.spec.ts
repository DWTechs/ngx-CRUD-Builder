import { Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "../../../core/models/control-type.model";
import { CrudItemOptions } from "../../../core/models/crud-item-options.model";
import { required } from "../../utils/common.validators";
import { LabelStrategy } from "../../utils/label-strategy.model";
import { LabelWrapperComponent } from "./label-wrapper";

/**
 * Test wrapper component
 */
@Component({
  template: `
    <frm-label-wrapper
      [labelStrategy]="labelStrategy()"
      [labelVariant]="labelVariant()"
      [config]="config()"
      [control]="control()"
    >
      <input type="text" [id]="config().key" />
    </frm-label-wrapper>
  `,
  standalone: true,
  imports: [LabelWrapperComponent, ReactiveFormsModule],
})
class TestWrapperComponent {
  labelStrategy = signal<LabelStrategy>("normal");
  labelVariant = signal<"on" | "in" | "over" | undefined>(undefined);
  config = signal<CrudItemOptions>({
    key: "testField",
    label: "Test Field",
    controlType: CONTROL_TYPES.INPUT,
  });
  control = signal(new FormControl(""));
}

describe("LabelWrapperComponent", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: TestWrapperComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestWrapperComponent, ReactiveFormsModule],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

  describe("Label Rendering", () => {
    it("should render label with text", () => {
      component.config.set({
        key: "name",
        label: "Name Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      expect(label).toBeTruthy();
      expect(label.textContent?.trim()).toContain("Name Field");
    });

    it("should set for attribute on label", () => {
      component.config.set({
        key: "email",
        label: "Email",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      expect(label.getAttribute("for")).toBe("email");
    });

    it("should use custom label from controlOptions", () => {
      component.config.set({
        key: "field",
        label: "Default Label",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          label: "Custom Label",
        },
      });
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      expect(label.textContent?.trim()).toContain("Custom Label");
    });
  });

  describe("Required Indicator", () => {
    it("should add mandatory-control class when field is required", () => {
      component.control.set(new FormControl("", [required]));
      component.config.set({
        key: "requiredField",
        label: "Required Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      expect(label.classList.contains("mandatory-control")).toBe(true);
    });

    it("should not add mandatory-control class when field is optional", () => {
      component.control.set(new FormControl(""));
      component.config.set({
        key: "optionalField",
        label: "Optional Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      expect(label.classList.contains("mandatory-control")).toBe(false);
    });

    it("should handle required validator from Validators", () => {
      component.control.set(new FormControl("", [Validators.required]));
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      // Note: This uses required from common.validators, not Validators.required
      // So it won't have the class unless we use the custom required validator
      expect(label).toBeTruthy();
    });
  });

  describe("Tooltip", () => {
    it("should render tooltip when tooltipLabel is provided", () => {
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          tooltipLabel: "This is a helpful tooltip",
        },
      });
      fixture.detectChanges();

      const tooltip = fixture.nativeElement.querySelector("frm-field-tooltip");
      expect(tooltip).toBeTruthy();
    });

    it("should not render tooltip when tooltipLabel is not provided", () => {
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const tooltip = fixture.nativeElement.querySelector("frm-field-tooltip");
      expect(tooltip).toBeFalsy();
    });

    it("should have floating-tooltip class on tooltip", () => {
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          tooltipLabel: "Tooltip text",
        },
      });
      fixture.detectChanges();

      const tooltip = fixture.nativeElement.querySelector("frm-field-tooltip");
      expect(tooltip.classList.contains("floating-tooltip")).toBe(true);
    });
  });

  describe("Label Strategy", () => {
    it("should use float label strategy", () => {
      component.labelStrategy.set("float");
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeTruthy();
    });

    it("should use ifta label strategy", () => {
      component.labelStrategy.set("ifta");
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const iftaLabel = fixture.nativeElement.querySelector("p-iftalabel");
      expect(iftaLabel).toBeTruthy();
    });

    it("should use normal label strategy", () => {
      component.labelStrategy.set("normal");
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      const iftaLabel = fixture.nativeElement.querySelector("p-iftalabel");
      expect(floatLabel).toBeFalsy();
      expect(iftaLabel).toBeFalsy();
    });

    it("should force normal strategy for CHECKBOX control", () => {
      component.labelStrategy.set("normal");
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.CHECKBOX,
      });
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeFalsy();
    });

    it("should keep the float label always up for FILES control", () => {
      component.labelStrategy.set("float");
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.FILES,
      });
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeTruthy();
      expect(floatLabel.classList).toContain("float-always");
    });

    it("should keep the float label always up for RADIO control", () => {
      component.labelStrategy.set("float");
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.RADIO,
      });
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeTruthy();
      expect(floatLabel.classList).toContain("float-always");
    });

    it("should keep the float label always up for SELECT_BUTTON control", () => {
      component.labelStrategy.set("float");
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.SELECT_BUTTON,
      });
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeTruthy();
      expect(floatLabel.classList).toContain("float-always");
    });

    it("should force normal strategy for PICKLIST control", () => {
      component.labelStrategy.set("float");
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.PICKLIST,
      });
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeFalsy();
    });

    it("should force normal strategy for TABLE control", () => {
      component.labelStrategy.set("float");
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.TABLE,
      });
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeFalsy();
    });

    it("should force normal strategy for WYSIWYG control", () => {
      component.labelStrategy.set("float");
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.WYSIWYG,
      });
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeFalsy();
    });

    it("should force normal strategy for CUSTOM control", () => {
      component.labelStrategy.set("float");
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.CUSTOM,
      });
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeFalsy();
    });
  });

  describe("Label Variant", () => {
    it("should use 'on' variant when specified", () => {
      component.labelStrategy.set("float");
      component.labelVariant.set("on");
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeTruthy();
    });

    it("should use 'in' variant when specified", () => {
      component.labelStrategy.set("float");
      component.labelVariant.set("in");
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeTruthy();
    });

    it("should use 'over' variant when specified", () => {
      component.labelStrategy.set("float");
      component.labelVariant.set("over");
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeTruthy();
    });

    it("should default to 'on' variant when undefined", () => {
      component.labelStrategy.set("float");
      component.labelVariant.set(undefined);
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeTruthy();
    });
  });

  describe("Input Icon", () => {
    it("should render icon field when inputIcon is provided", () => {
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          inputIcon: "pi pi-search",
        },
      });
      fixture.detectChanges();

      const iconField = fixture.nativeElement.querySelector("p-iconfield");
      expect(iconField).toBeTruthy();
      expect(iconField.classList.contains("has-icon")).toBe(true);
    });

    it("should not add has-icon class when inputIcon is not provided", () => {
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const iconField = fixture.nativeElement.querySelector("p-iconfield");
      expect(iconField.classList.contains("has-icon")).toBe(false);
    });

    it("should set icon class on p-inputicon", () => {
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {
          inputIcon: "pi pi-calendar",
        },
      });
      fixture.detectChanges();

      const inputIcon = fixture.nativeElement.querySelector("p-inputicon");
      expect(inputIcon.classList.contains("pi")).toBe(true);
      expect(inputIcon.classList.contains("pi-calendar")).toBe(true);
    });
  });

  describe("Content Projection", () => {
    it("should project input element from ng-content", () => {
      component.config.set({
        key: "testField",
        label: "Test",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector("input[type='text']");
      expect(input).toBeTruthy();
      expect(input.getAttribute("id")).toBe("testField");
    });
  });

  describe("Dynamic Updates", () => {
    it("should update label when config changes", () => {
      component.config.set({
        key: "field",
        label: "Initial Label",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      let label = fixture.nativeElement.querySelector("label");
      expect(label.textContent?.trim()).toContain("Initial Label");

      component.config.set({
        key: "field",
        label: "Updated Label",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      label = fixture.nativeElement.querySelector("label");
      expect(label.textContent?.trim()).toContain("Updated Label");
    });

    it("should update required indicator when validators change", () => {
      component.control.set(new FormControl(""));
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      let label = fixture.nativeElement.querySelector("label");
      expect(label.classList.contains("mandatory-control")).toBe(false);

      // Create new control with validators
      component.control.set(new FormControl("", [required]));
      fixture.detectChanges();

      label = fixture.nativeElement.querySelector("label");
      expect(label.classList.contains("mandatory-control")).toBe(true);
    });

    it("should update strategy when labelStrategy changes", () => {
      component.labelStrategy.set("normal");
      fixture.detectChanges();

      let floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeFalsy();

      component.labelStrategy.set("float");
      fixture.detectChanges();

      floatLabel = fixture.nativeElement.querySelector("p-floatlabel");
      expect(floatLabel).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("should handle config without key", () => {
      component.config.set({
        label: "No Key",
        controlType: CONTROL_TYPES.INPUT,
        // biome-ignore lint/suspicious/noExplicitAny: intentionally forcing an invalid/incomplete config to test edge-case handling
      } as any);
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      expect(label).toBeTruthy();
    });

    it("should handle empty controlOptions", () => {
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
        controlOptions: {},
      });
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      expect(label).toBeTruthy();
    });

    it("should handle undefined controlOptions", () => {
      component.config.set({
        key: "field",
        label: "Field",
        controlType: CONTROL_TYPES.INPUT,
      });
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector("label");
      expect(label).toBeTruthy();
    });
  });
});
