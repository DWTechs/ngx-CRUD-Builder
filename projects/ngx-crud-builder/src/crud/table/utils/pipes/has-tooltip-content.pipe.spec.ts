import { TestBed } from "@angular/core/testing";
import { CONTROL_TYPES } from "../../../core/models/control-type.model";
import { CrudItemOptions } from "../../../core/models/crud-item-options.model";
import { INPUT_TYPES } from "../../../core/models/input-type.model";
import { HasTooltipContentPipe } from "./has-tooltip-content.pipe";

describe("HasTooltipContentPipe", () => {
  let pipe: HasTooltipContentPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    pipe = TestBed.runInInjectionContext(() => new HasTooltipContentPipe());
  });

  const options: CrudItemOptions = {
    key: "content",
    label: "Content",
    controlType: CONTROL_TYPES.INPUT,
    type: INPUT_TYPES.TEXT,
  };

  it("returns false for an empty array rendered as input text", () => {
    expect(pipe.transform([], options)).toBe(false);
  });

  it("returns true when the formatted value has content", () => {
    expect(pipe.transform(["Hello"], options)).toBe(true);
  });
});
