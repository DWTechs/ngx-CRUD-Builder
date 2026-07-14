import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideAnimations } from "@angular/platform-browser/animations";
import { CONTROL_TYPES } from "../../../core/models/control-type.model";
import { TableColumn } from "../../../core/utils/table/table-column.model";
import { ExtendedTableConfig } from "../../data-access/table-config.model";
import { ColumnsManagementDialogComponent } from "./columns-management-dialog.component";

describe("ColumnsManagementDialogComponent", () => {
  let component: ColumnsManagementDialogComponent;
  let fixture: ComponentFixture<ColumnsManagementDialogComponent>;

  const createColumn = (
    key: string,
    isVisible: boolean,
    defaultWidth?: string,
  ): TableColumn => ({
    key,
    label: key,
    controlType: CONTROL_TYPES.INPUT,
    isVisible,
    defaultWidth,
  });

  const createView = (
    overrides: Partial<ExtendedTableConfig> = {},
  ): ExtendedTableConfig => ({
    id: 1,
    name: "Default",
    component: "routes",
    conf: [],
    isActive: true,
    locked: true,
    columns: [
      createColumn("core", true, "60px"),
      createColumn("name", true, "200px"),
    ],
    ...overrides,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnsManagementDialogComponent],
      providers: [provideAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnsManagementDialogComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("views", [createView()]);
    fixture.componentRef.setInput("isPreferencesModeEnabled", true);
    fixture.detectChanges();
  });

  it("should preserve each column's defaultWidth when saving without any other change", () => {
    let emitted: ExtendedTableConfig[] | undefined;
    component.saved.subscribe((views) => (emitted = views));

    component.onSaved();

    const savedView = emitted?.find((v) => v.id === 1);
    expect(savedView?.conf).toEqual([
      { key: "core", isVisible: true, defaultWidth: "60px" },
      { key: "name", isVisible: true, defaultWidth: "200px" },
    ]);
  });

  it("should keep defaultWidth for untouched columns while updating isVisible for the toggled one", () => {
    let emitted: ExtendedTableConfig[] | undefined;
    component.saved.subscribe((views) => (emitted = views));

    component.onSelectedColumnsKeysChange(["name"]);
    component.onSaved();

    const savedView = emitted?.find((v) => v.id === 1);
    expect(savedView?.conf).toEqual([
      { key: "core", isVisible: false, defaultWidth: "60px" },
      { key: "name", isVisible: true, defaultWidth: "200px" },
    ]);
  });
});
