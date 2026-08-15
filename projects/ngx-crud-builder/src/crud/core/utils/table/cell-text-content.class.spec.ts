import { CONTROL_TYPES } from "../../models/control-type.model";
import { CrudItemOptions } from "../../models/crud-item-options.model";
import { CellTextContent } from "./cell-text-content.class";

describe("CellTextContent", () => {
  const createOptions = (
    overrides: Partial<CrudItemOptions> = {},
  ): CrudItemOptions => ({
    key: "content",
    label: "Content",
    controlType: CONTROL_TYPES.WYSIWYG,
    ...overrides,
  });

  it("should render the plain text content of a WYSIWYG value", () => {
    const result = new CellTextContent({
      options: createOptions(),
      cellValue: "<p>Hello world</p>",
    });

    expect(result.value).toBe("Hello world");
  });

  it("should strip script tags and their content from a WYSIWYG value", () => {
    const result = new CellTextContent({
      options: createOptions(),
      cellValue: '<p>Safe</p><script>alert("xss")</script>',
    });

    expect(result.value).toBe("Safe");
  });

  it("should not execute inline event handler attributes such as onerror", () => {
    const onErrorSpy = vi.fn();
    (globalThis as { __xssSpy?: () => void }).__xssSpy = onErrorSpy;

    new CellTextContent({
      options: createOptions(),
      cellValue: '<img src="x" onerror="window.__xssSpy()">',
    });

    expect(onErrorSpy).not.toHaveBeenCalled();
  });

  it("should return an empty string for a non-string WYSIWYG cell value", () => {
    const result = new CellTextContent({
      options: createOptions(),
      cellValue: 42,
    });

    expect(result.value).toBe("");
  });
});
