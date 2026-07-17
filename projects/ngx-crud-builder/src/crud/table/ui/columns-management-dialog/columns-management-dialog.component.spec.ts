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
    let emitted: ExtendedTableConfig | undefined;
    component.viewsUpdated.subscribe((views) => (emitted = views[0]));

    component.onSaved();

    expect(emitted?.conf).toEqual([
      { key: "core", isVisible: true, defaultWidth: "60px" },
      { key: "name", isVisible: true, defaultWidth: "200px" },
    ]);
  });

  it("should keep defaultWidth for untouched columns while updating isVisible for the toggled one", () => {
    let emitted: ExtendedTableConfig | undefined;
    component.viewsUpdated.subscribe((views) => (emitted = views[0]));

    component.onSelectedColumnsKeysChange(["name"]);
    component.onSaved();

    expect(emitted?.conf).toEqual([
      { key: "core", isVisible: false, defaultWidth: "60px" },
      { key: "name", isVisible: true, defaultWidth: "200px" },
    ]);
  });

  it("should emit viewDeleted and fall back to another view as active when deleting the active saved view", () => {
    fixture.componentRef.setInput("views", [
      createView({ id: 1, name: "Archive", isActive: true }),
      createView({
        id: 2,
        name: "Archive (copy)",
        isActive: false,
        locked: false,
      }),
    ]);
    fixture.detectChanges();

    let deletedId: number | undefined;
    component.viewDeleted.subscribe((id) => (deletedId = id));

    component.onDeleteView(1);

    expect(deletedId).toBe(1);
    const remaining = component.editedViews();
    const first = remaining[0];
    expect(first.id).toBe(2);
    // wait for the effect to run and update the active view
    setTimeout(() => {
      expect(first.isActive).toBe(true);
    }, 100);
  });

  it("should not emit viewDeleted for a view that was created but never saved", () => {
    fixture.componentRef.setInput("views", [
      createView({ id: 1, name: "Archive", isActive: true }),
      createView({
        id: 2,
        name: "New view",
        isActive: false,
        locked: false,
        isCreation: true,
      }),
    ]);
    fixture.detectChanges();

    let deletedId: number | undefined;
    component.viewDeleted.subscribe((id) => (deletedId = id));

    component.onDeleteView(2);

    expect(deletedId).toBeUndefined();
    expect(component.editedViews().map((v) => v.id)).toEqual([1]);
  });
});
