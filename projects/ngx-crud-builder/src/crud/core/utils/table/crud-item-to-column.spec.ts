import { CONTROL_TYPES } from "../../models/control-type.model";
import { CrudItemOptions } from "../../models/crud-item-options.model";
import { crudItemToColumn } from "./crud-item-to-column";

describe("crudItemToColumn", () => {
  const createItem = (
    overrides: Partial<CrudItemOptions> = {},
  ): CrudItemOptions => ({
    key: "name",
    label: "Name",
    controlType: CONTROL_TYPES.INPUT,
    ...overrides,
  });

  it("should fall back to the base columnOptions.defaultWidth when no stored config matches", () => {
    const item = createItem({ columnOptions: { defaultWidth: "150px" } });

    const column = crudItemToColumn(item);

    expect(column.defaultWidth).toBe("150px");
    expect(column.isVisible).toBe(true);
  });

  it("should use the stored defaultWidth and isVisible instead of the base config", () => {
    const item = createItem({ columnOptions: { defaultWidth: "150px" } });

    const column = crudItemToColumn(item, [
      { key: "name", isVisible: false, defaultWidth: "300px" },
    ]);

    expect(column.defaultWidth).toBe("300px");
    expect(column.isVisible).toBe(false);
  });

  it("should keep the base defaultWidth when the stored config entry doesn't set one", () => {
    const item = createItem({ columnOptions: { defaultWidth: "150px" } });

    const column = crudItemToColumn(item, [{ key: "name", isVisible: true }]);

    expect(column.defaultWidth).toBe("150px");
  });

  it("should default isVisible to false when hidden by columnOptions and no stored config matches", () => {
    const item = createItem({ columnOptions: { isSoftHidden: true } });

    const column = crudItemToColumn(item);

    expect(column.isVisible).toBe(false);
  });
});
