import { ComponentFixture } from "@angular/core/testing";
import { TableComponent } from "../table.component";
import {
  createHttpCallsMock,
  createTestEntity,
  setupTableTest,
  TestEntity,
  TestWrapperComponent,
  waitForDebounce,
} from "./table.component.spec-helpers";

describe("TableComponent - creation and edition", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: TableComponent<TestEntity>;

  beforeEach(async () => {
    ({ fixture, component } = await setupTableTest());
  });

  it("emits newClicked and opens the creation dialog on onNew()", async () => {
    fixture.detectChanges();
    await waitForDebounce();

    component.onNew();

    expect(fixture.componentInstance.newClicked).toHaveBeenCalled();
    expect(component.isCreation()).toBe(true);
    expect(component.isReadonly()).toBe(false);
    expect(component.isEntryEditionDialogDisplayed()).toBe(true);
    expect(component.editedEntry).toEqual(createTestEntity());
  });

  it("does not open the dialog on onNew() when isDefaultEditionDisabled", async () => {
    fixture.componentInstance.isDefaultEditionDisabled = true;
    fixture.detectChanges();
    await waitForDebounce();

    component.onNew();

    expect(fixture.componentInstance.newClicked).toHaveBeenCalled();
    expect(component.isEntryEditionDialogDisplayed()).toBe(false);
  });

  it("emits rowClicked and opens the edition dialog in write mode on onEdit()", async () => {
    fixture.detectChanges();
    await waitForDebounce();
    const row = createTestEntity({ id: 7, name: "Row 7" });

    component.onEdit(row);

    expect(fixture.componentInstance.rowClicked).toHaveBeenCalledWith(row);
    expect(component.isReadonly()).toBe(false);
    expect(component.isEntryEditionDialogDisplayed()).toBe(true);
    expect(component.editedEntry).toEqual(row);
  });

  it("opens the edition dialog in read-only mode on onView()", async () => {
    fixture.detectChanges();
    await waitForDebounce();
    const row = createTestEntity({ id: 8, name: "Row 8" });

    component.onView(row);

    expect(fixture.componentInstance.rowClicked).toHaveBeenCalledWith(row);
    expect(component.isReadonly()).toBe(true);
    expect(component.isEntryEditionDialogDisplayed()).toBe(true);
  });

  it("calls httpCalls.create and closes the dialog on onEditedEntrySave() for a new entry", async () => {
    const httpCalls = createHttpCallsMock();
    fixture.componentInstance.httpCalls = httpCalls;
    fixture.detectChanges();
    await waitForDebounce();

    const newEntry = createTestEntity({ id: null as unknown as number });
    component.onEditedEntrySave(newEntry);

    expect(httpCalls.create).toHaveBeenCalledWith(newEntry);
    // no FILES-type column is configured, so updateFiles resolves to a no-op
    expect(httpCalls.updateFiles).not.toHaveBeenCalled();
    expect(component.isEntryEditionDialogDisplayed()).toBe(false);
  });

  it("calls httpCalls.update and closes the dialog on onEditedEntrySave() for an existing entry", async () => {
    const httpCalls = createHttpCallsMock();
    fixture.componentInstance.httpCalls = httpCalls;
    fixture.detectChanges();
    await waitForDebounce();

    const existingEntry = createTestEntity({ id: 3 });
    component.onEditedEntrySave(existingEntry);

    expect(httpCalls.update).toHaveBeenCalledWith(existingEntry);
    // no FILES-type column is configured, so updateFiles resolves to a no-op
    expect(httpCalls.updateFiles).not.toHaveBeenCalled();
    expect(component.isEntryEditionDialogDisplayed()).toBe(false);
  });

  it("calls httpCalls.update and closes the dialog on onEditedEntryEdit()", async () => {
    fixture.detectChanges();
    await waitForDebounce();
    const entry = createTestEntity({ id: 4 });

    component.onEditedEntryEdit(entry);

    expect(fixture.componentInstance.httpCalls.update).toHaveBeenCalledWith(
      entry,
    );
    expect(component.isEntryEditionDialogDisplayed()).toBe(false);
  });

  it("does nothing on onEditedEntryEdit(null)", async () => {
    fixture.detectChanges();
    await waitForDebounce();

    component.onEditedEntryEdit(null);

    expect(fixture.componentInstance.httpCalls.update).not.toHaveBeenCalled();
  });

  it("emits editionDialogClosed with the edited entry on hideEditionDialog()", async () => {
    fixture.detectChanges();
    await waitForDebounce();

    component.onEdit(createTestEntity({ id: 9 }));

    component.hideEditionDialog();

    expect(fixture.componentInstance.editionDialogClosed).toHaveBeenCalledWith(
      expect.objectContaining({ id: 9 }),
    );
    expect(component.editedEntry).toBeNull();
    expect(component.selectedEntries).toEqual([]);
  });
});
