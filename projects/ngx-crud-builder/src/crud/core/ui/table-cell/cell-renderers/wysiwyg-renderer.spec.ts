import { ComponentFixture, TestBed } from "@angular/core/testing";
import { WysiwygCellRendererComponent } from "./wysiwyg-renderer";

describe("WysiwygCellRendererComponent", () => {
  let fixture: ComponentFixture<WysiwygCellRendererComponent>;

  const setCellValue = (value: unknown) => {
    fixture.componentRef.setInput("cellValue", value);
    fixture.detectChanges();
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WysiwygCellRendererComponent],
    });
    fixture = TestBed.createComponent(WysiwygCellRendererComponent);
  });

  it("should render the plain text content of a WYSIWYG value", () => {
    setCellValue("<p>Hello world</p>");

    expect(fixture.nativeElement.textContent).toContain("Hello world");
  });

  it("should strip script tags and their content", () => {
    setCellValue('<p>Safe</p><script>alert("xss")</script>');

    expect(fixture.nativeElement.textContent).toContain("Safe");
    expect(fixture.nativeElement.textContent).not.toContain("alert");
  });

  it("should not execute inline event handler attributes such as onerror", () => {
    const onErrorSpy = vi.fn();
    (globalThis as { __xssSpy?: () => void }).__xssSpy = onErrorSpy;

    setCellValue('<img src="x" onerror="window.__xssSpy()">');

    expect(onErrorSpy).not.toHaveBeenCalled();
  });

  it("should return an empty string for a non-string cell value", () => {
    setCellValue(42);

    expect(fixture.componentInstance.value()).toBe("");
  });

  it("should truncate values longer than 20 characters with an ellipsis span", () => {
    setCellValue("This is a very long wysiwyg content");

    const ellipsis = fixture.nativeElement.querySelector("span");
    expect(ellipsis).toBeTruthy();
    expect(ellipsis?.textContent).toBe("...");
  });
});
