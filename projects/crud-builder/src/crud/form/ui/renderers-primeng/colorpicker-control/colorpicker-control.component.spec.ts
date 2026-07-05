import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "../../../../core/models/control-type.model";
import { CrudItemOptions } from "../../../../core/models/crud-item-options.model";
import { FormFieldInteractionEvent } from "../../../../core/models/form-field-interaction.event";
import { ColorPickerControlComponent } from "./colorpicker-control.component";

describe("ColorPickerControlComponent", () => {
  let component: ColorPickerControlComponent;
  let fixture: ComponentFixture<ColorPickerControlComponent>;

  const createDefaultConfig = (): CrudItemOptions => ({
    key: "testColor",
    label: "Test Color",
    controlType: CONTROL_TYPES.COLOR,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorPickerControlComponent, ReactiveFormsModule],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorPickerControlComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("config", createDefaultConfig());
    fixture.componentRef.setInput("control", new FormControl("#3b82f6"));
    fixture.componentRef.setInput("isFormReadonly", false);
  });

  /**
   * ========================================
   * SECTION 1: COMPONENT CREATION & INITIALIZATION
   * ========================================
   */
  describe("Component Creation & Initialization", () => {
    it("should create the component", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize with default config", () => {
      fixture.detectChanges();
      expect(component.config()).toBeDefined();
      expect(component.control()).toBeDefined();
    });

    it("should extend FormFieldBaseComponent", () => {
      expect(component.config).toBeDefined();
      expect(component.control).toBeDefined();
      expect(component.isFormReadonly).toBeDefined();
    });
  });

  /**
   * ========================================
   * SECTION 2: RENDERING & DOM
   * ========================================
   */
  describe("Rendering & DOM", () => {
    it("should render the text input with pInputText directive", () => {
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector("input[pInputText]");
      expect(input).toBeTruthy();
    });

    it("should render the color swatch element", () => {
      fixture.detectChanges();
      const swatch = fixture.nativeElement.querySelector(".color-swatch");
      expect(swatch).toBeTruthy();
    });

    it("should render the hidden native color input inside the swatch", () => {
      fixture.detectChanges();
      const nativeInput = fixture.nativeElement.querySelector(
        "input.native-color-input",
      );
      expect(nativeInput).toBeTruthy();
      expect(nativeInput.type).toBe("color");
    });
  });

  /**
   * ========================================
   * SECTION 3: SWATCH COLOR DISPLAY
   * ========================================
   */
  describe("Swatch Color Display", () => {
    it("should display the initial hex color on the swatch", () => {
      fixture.detectChanges();
      const swatch: HTMLElement =
        fixture.nativeElement.querySelector(".color-swatch");
      expect(swatch.style.backgroundColor).toBeTruthy();
    });

    it("should update swatch color when control value changes to a valid hex", async () => {
      fixture.detectChanges();
      fixture.componentRef.setInput("control", new FormControl("#ff0000"));
      fixture.detectChanges();
      await fixture.whenStable();

      const swatch: HTMLElement =
        fixture.nativeElement.querySelector(".color-swatch");
      expect(swatch.style.backgroundColor).toBeTruthy();
    });

    it("should fall back to white (#ffffff) when value is empty", () => {
      fixture.componentRef.setInput("control", new FormControl(""));
      fixture.detectChanges();

      const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector(
        "input.native-color-input",
      );
      expect(nativeInput.value).toBe("#ffffff");
    });

    it("should fall back to white (#ffffff) when value is not a valid hex", () => {
      fixture.componentRef.setInput("control", new FormControl("not-a-color"));
      fixture.detectChanges();

      const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector(
        "input.native-color-input",
      );
      expect(nativeInput.value).toBe("#ffffff");
    });

    it("should expand #RGB shorthand to #RRGGBB for the swatch", () => {
      fixture.componentRef.setInput("control", new FormControl("#f0f"));
      fixture.detectChanges();

      const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector(
        "input.native-color-input",
      );
      expect(nativeInput.value).toBe("#ff00ff");
    });
  });

  /**
   * ========================================
   * SECTION 4: NATIVE COLOR PICKER INTERACTION
   * ========================================
   */
  describe("Native Color Picker Interaction", () => {
    it("should update control value when native color input changes", () => {
      fixture.detectChanges();
      const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector(
        "input.native-color-input",
      );

      nativeInput.value = "#abcdef";
      nativeInput.dispatchEvent(new Event("input"));
      fixture.detectChanges();

      expect(component.control().value).toBe("#abcdef");
    });

    it("should mark control as dirty after native color change", () => {
      fixture.detectChanges();
      const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector(
        "input.native-color-input",
      );

      nativeInput.value = "#123456";
      nativeInput.dispatchEvent(new Event("input"));

      expect(component.control().dirty).toBe(true);
    });

    it("should emit valueChange interaction after native color change", () => {
      fixture.detectChanges();
      let emittedEvent: FormFieldInteractionEvent | undefined;
      component.fieldInteraction.subscribe((e) => (emittedEvent = e));

      const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector(
        "input.native-color-input",
      );
      nativeInput.value = "#aabbcc";
      nativeInput.dispatchEvent(new Event("input"));

      expect(emittedEvent?.interactionType).toBe("valueChange");
      expect(emittedEvent?.key).toBe("testColor");
    });
  });

  /**
   * ========================================
   * SECTION 5: TEXT INPUT INTERACTIONS
   * ========================================
   */
  describe("Text Input Interactions", () => {
    it("should emit keyup interaction on text input", () => {
      fixture.detectChanges();
      let emittedEvent: FormFieldInteractionEvent | undefined;
      component.fieldInteraction.subscribe((e) => (emittedEvent = e));

      component.emitInteractionEvent("keyup");
      expect(emittedEvent?.interactionType).toBe("keyup");
    });

    it("should emit focus interaction on text input", () => {
      fixture.detectChanges();
      let emittedEvent: FormFieldInteractionEvent | undefined;
      component.fieldInteraction.subscribe((e) => (emittedEvent = e));

      component.emitInteractionEvent("focus");
      expect(emittedEvent?.interactionType).toBe("focus");
    });

    it("should emit blur interaction on text input", () => {
      fixture.detectChanges();
      let emittedEvent: FormFieldInteractionEvent | undefined;
      component.fieldInteraction.subscribe((e) => (emittedEvent = e));

      component.emitInteractionEvent("blur");
      expect(emittedEvent?.interactionType).toBe("blur");
    });

    it("should display default placeholder when none configured", () => {
      fixture.detectChanges();
      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input[pInputText]");
      expect(input.placeholder).toBe("#RRGGBB");
    });

    it("should display custom placeholder from config", () => {
      const config = createDefaultConfig();
      config.controlOptions = { placeholder: "Enter hex color" };
      fixture.componentRef.setInput("config", config);
      fixture.detectChanges();

      const input: HTMLInputElement =
        fixture.nativeElement.querySelector("input[pInputText]");
      expect(input.placeholder).toBe("Enter hex color");
    });
  });

  /**
   * ========================================
   * SECTION 6: READONLY & DISABLED STATES
   * ========================================
   */
  describe("Readonly & Disabled States", () => {
    it("should add disabled class to swatch when control is disabled", () => {
      const disabledControl = new FormControl({
        value: "#3b82f6",
        disabled: true,
      });
      fixture.componentRef.setInput("control", disabledControl);
      fixture.detectChanges();

      const swatch = fixture.nativeElement.querySelector(".color-swatch");
      expect(swatch.classList).toContain("disabled");
    });

    it("should add disabled class to swatch when form is readonly", () => {
      fixture.componentRef.setInput("isFormReadonly", true);
      fixture.detectChanges();

      const swatch = fixture.nativeElement.querySelector(".color-swatch");
      expect(swatch.classList).toContain("disabled");
    });

    it("should not add disabled class when control is enabled and form is editable", () => {
      fixture.detectChanges();
      const swatch = fixture.nativeElement.querySelector(".color-swatch");
      expect(swatch.classList).not.toContain("disabled");
    });

    it("should disable the native color input when control is disabled", () => {
      const disabledControl = new FormControl({
        value: "#3b82f6",
        disabled: true,
      });
      fixture.componentRef.setInput("control", disabledControl);
      fixture.detectChanges();

      const nativeInput: HTMLInputElement = fixture.nativeElement.querySelector(
        "input.native-color-input",
      );
      expect(nativeInput.disabled).toBe(true);
    });

    it("should reflect isDisabled from control", () => {
      const disabledControl = new FormControl({
        value: "",
        disabled: true,
      });
      fixture.componentRef.setInput("control", disabledControl);
      fixture.detectChanges();

      expect(component.isDisabled()).toBe(true);
    });
  });
});
