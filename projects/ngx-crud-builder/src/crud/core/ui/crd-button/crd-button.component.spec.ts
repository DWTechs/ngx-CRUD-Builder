import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  ButtonType,
  CrdButtonComponent,
  CrdButtonSeverity,
} from "./crd-button.component";

@Component({
  template: `<crd-button
      [type]="type"
      [disabled]="disabled"
      [loading]="loading"
      [label]="label"
      [icon]="icon"
      [severity]="severity"
      (clicked)="onButtonClick()"
    />`,
  standalone: true,
  imports: [CrdButtonComponent],
})
class TestWrapperComponent {
  type: ButtonType = "validate";
  disabled = false;
  loading = false;
  label = "";
  icon = "";
  severity: CrdButtonSeverity | undefined = undefined;
  onButtonClick = vi.fn();
}

describe("CrdButtonComponent", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;

  const getButton = (type: ButtonType): HTMLButtonElement | null => {
    return fixture.nativeElement.querySelector(
      `button[data-testid="${type}-button"]`,
    );
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
  });

  it("should create and render validate button", () => {
    fixture.detectChanges();
    expect(fixture).toBeTruthy();
    const button = getButton("validate");
    expect(button).toBeTruthy();
    expect(button?.textContent?.trim()).toBe("Valider");
  });

  describe("Button Types", () => {
    it("should render validate button with correct text", () => {
      fixture.componentInstance.type = "validate";
      fixture.detectChanges();
      expect(getButton("validate")?.textContent?.trim()).toBe("Valider");
    });

    it("should render cancel button with correct text", () => {
      fixture.componentInstance.type = "cancel";
      fixture.detectChanges();
      expect(getButton("cancel")?.textContent?.trim()).toBe("Annuler");
    });

    it("should render delete button with correct text", () => {
      fixture.componentInstance.type = "delete";
      fixture.detectChanges();
      expect(getButton("delete")?.textContent?.trim()).toBe("Supprimer");
    });

    it("should render restore button with correct text", () => {
      fixture.componentInstance.type = "restore";
      fixture.detectChanges();
      expect(getButton("restore")?.textContent?.trim()).toBe("Restaurer");
    });

    it("should render edit button with correct text", () => {
      fixture.componentInstance.type = "edit";
      fixture.detectChanges();
      expect(getButton("edit")?.textContent?.trim()).toBe("Modifier");
    });
  });

  describe("Button Properties", () => {
    it("should use custom label when provided", () => {
      fixture.componentInstance.type = "validate";
      fixture.componentInstance.label = "Custom Label";
      fixture.detectChanges();
      expect(getButton("validate")?.textContent?.trim()).toBe("Custom Label");
    });

    it("should apply disabled state", () => {
      fixture.componentInstance.type = "validate";
      fixture.componentInstance.disabled = true;
      fixture.detectChanges();
      expect(getButton("validate")?.disabled).toBe(true);
    });

    it("should apply loading state and disable the button", () => {
      fixture.componentInstance.type = "validate";
      fixture.componentInstance.loading = true;
      fixture.detectChanges();
      const button = getButton("validate");
      expect(button?.disabled).toBe(true);
      expect(button?.querySelector("crd-progress")).toBeTruthy();
    });

    it("should not show loading state when loading is false", () => {
      fixture.componentInstance.type = "validate";
      fixture.componentInstance.loading = false;
      fixture.detectChanges();
      const button = getButton("validate");
      expect(button?.disabled).toBe(false);
      expect(button?.querySelector("crd-progress")).toBeFalsy();
    });

    it("should apply custom severity", () => {
      fixture.componentInstance.type = "validate";
      fixture.componentInstance.severity = "danger";
      fixture.detectChanges();
      expect(getButton("validate")?.getAttribute("data-severity")).toBe(
        "danger",
      );
    });
  });

  describe("Button Events", () => {
    it("should emit clicked event when clicked", () => {
      fixture.componentInstance.type = "validate";
      fixture.detectChanges();
      getButton("validate")?.click();
      expect(fixture.componentInstance.onButtonClick).toHaveBeenCalled();
    });

    it("should not emit clicked event when disabled", () => {
      fixture.componentInstance.type = "validate";
      fixture.componentInstance.disabled = true;
      fixture.detectChanges();
      getButton("validate")?.click();
      expect(fixture.componentInstance.onButtonClick).not.toHaveBeenCalled();
    });

    it("should emit clicked event for simple-icon button when clicked", () => {
      fixture.componentInstance.type = "simple-icon";
      fixture.componentInstance.icon = "pi pi-check";
      fixture.detectChanges();
      getButton("simple-icon")?.click();
      expect(fixture.componentInstance.onButtonClick).toHaveBeenCalled();
    });
  });
});
