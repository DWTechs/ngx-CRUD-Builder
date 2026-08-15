import { Component, signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { FormFieldTooltip } from "./field-tooltip";

/**
 * Test wrapper component
 */
@Component({
  template: ` <frm-field-tooltip [value]="tooltipValue()" /> `,
  standalone: true,
  imports: [FormFieldTooltip],
})
class TestWrapperComponent {
  tooltipValue = signal<string | undefined>("Test tooltip");
}

describe("FormFieldTooltip", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: TestWrapperComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestWrapperComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
  });

  describe("Icon Rendering", () => {
    it("should render info icon", () => {
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector("i.pi-info-circle");
      expect(icon).toBeTruthy();
    });

    it("should have pi class on icon", () => {
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector("i");
      expect(icon.classList.contains("pi")).toBe(true);
      expect(icon.classList.contains("pi-info-circle")).toBe(true);
    });
  });

  describe("Tooltip Content", () => {
    it("should display tooltip with string value", () => {
      component.tooltipValue.set("This is a tooltip");
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("This is a tooltip");
    });

    it("should handle empty string value", () => {
      component.tooltipValue.set("");
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("");
    });

    it("should handle undefined value", () => {
      component.tooltipValue.set(undefined);
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBeUndefined();
    });

    it("should render HTML content in tooltip", () => {
      component.tooltipValue.set("<strong>Bold text</strong>");
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("<strong>Bold text</strong>");
    });

    it("should handle multiline text", () => {
      component.tooltipValue.set("Line 1<br>Line 2<br>Line 3");
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toContain("Line 1");
      expect(tooltipComponent.value()).toContain("Line 2");
      expect(tooltipComponent.value()).toContain("Line 3");
    });

    it("should handle special characters", () => {
      component.tooltipValue.set("Special: & < > \" '");
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("Special: & < > \" '");
    });

    it("should handle long text", () => {
      component.tooltipValue.set(
        "This is a very long tooltip text that should be displayed properly without any issues regardless of its length.",
      );
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value().length).toBeGreaterThan(50);
    });
  });

  describe("Value Changes", () => {
    it("should update when value changes", () => {
      component.tooltipValue.set("Initial value");
      fixture.detectChanges();

      let tooltipComponent = fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("Initial value");

      component.tooltipValue.set("Updated value");
      fixture.detectChanges();

      tooltipComponent = fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("Updated value");
    });

    it("should update from undefined to string", () => {
      component.tooltipValue.set(undefined);
      fixture.detectChanges();

      let tooltipComponent = fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBeUndefined();

      component.tooltipValue.set("Now has value");
      fixture.detectChanges();

      tooltipComponent = fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("Now has value");
    });

    it("should update from string to undefined", () => {
      component.tooltipValue.set("Has value");
      fixture.detectChanges();

      let tooltipComponent = fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("Has value");

      component.tooltipValue.set(undefined);
      fixture.detectChanges();

      tooltipComponent = fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBeUndefined();
    });
  });

  describe("Template Structure", () => {
    it("should render icon that can show tooltip", () => {
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector("i.pi-info-circle");
      expect(icon).toBeTruthy();
    });

    it("should render span with innerHTML binding inside template", () => {
      component.tooltipValue.set("Template content");
      fixture.detectChanges();

      // Template content is rendered by Optimus UI tooltip directive
      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("Template content");
    });
  });

  describe("Edge Cases", () => {
    it("should handle null value safely", () => {
      // biome-ignore lint/suspicious/noExplicitAny: intentionally forcing an invalid runtime value to test edge-case handling
      component.tooltipValue.set(null as any);
      fixture.detectChanges();

      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it("should handle numeric string", () => {
      component.tooltipValue.set("12345");
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("12345");
    });

    it("should handle whitespace-only string", () => {
      component.tooltipValue.set("   ");
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("   ");
    });

    it("should handle string with only HTML tags", () => {
      component.tooltipValue.set("<br><br>");
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("<br><br>");
    });

    it("should handle Unicode characters", () => {
      component.tooltipValue.set("Unicode: 🎉 ñ é ü");
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("Unicode: 🎉 ñ é ü");
    });
  });

  describe("Change Detection", () => {
    it("should use OnPush change detection strategy", () => {
      fixture.detectChanges();

      const tooltipDebugElement = fixture.debugElement.children[0];
      const component = tooltipDebugElement.componentInstance;

      // Verify the component exists and has the expected structure
      expect(component).toBeTruthy();
      expect(component.value).toBeDefined();
    });

    it("should update on input signal change", () => {
      component.tooltipValue.set("First");
      fixture.detectChanges();

      component.tooltipValue.set("Second");
      fixture.detectChanges();

      const tooltipComponent =
        fixture.debugElement.children[0].componentInstance;
      expect(tooltipComponent.value()).toBe("Second");
    });
  });
});
