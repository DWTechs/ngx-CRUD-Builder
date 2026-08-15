import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ConfirmService } from "../../../core/utils/confirm/confirm.service";
import { TableComponent } from "../table.component";
import {
  createTestEntity,
  setupTableTest,
  TestEntity,
  TestWrapperComponent,
  waitForDebounce,
} from "./table.component.spec-helpers";

describe("TableComponent - archive and restore", () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: TableComponent<TestEntity>;
  let confirmService: ConfirmService;

  beforeEach(async () => {
    ({ fixture, component } = await setupTableTest());
    fixture.detectChanges();
    await waitForDebounce();
    confirmService = TestBed.inject(ConfirmService);
  });

  it("asks for confirmation before archiving a single row via onArchive()", () => {
    component.onArchive(5);

    expect(confirmService.current()).toBeTruthy();
    expect(fixture.componentInstance.httpCalls.archive).not.toHaveBeenCalled();
  });

  it("calls httpCalls.archive with the row id once the confirmation is accepted", () => {
    component.onArchive(5);
    confirmService.accept();

    expect(fixture.componentInstance.httpCalls.archive).toHaveBeenCalledWith([
      5,
    ]);
  });

  it("archives every selected entry via onArchiveMany()", () => {
    component.selectedEntries = [
      createTestEntity({ id: 1 }),
      createTestEntity({ id: 2 }),
    ];

    component.onArchiveMany();
    confirmService.accept();

    expect(fixture.componentInstance.httpCalls.archive).toHaveBeenCalledWith([
      1, 2,
    ]);
  });

  it("archives the currently edited entry via onEditedEntryArchive()", () => {
    const entry = createTestEntity({ id: 9 });

    component.onEditedEntryArchive(entry);
    confirmService.accept();

    expect(fixture.componentInstance.httpCalls.archive).toHaveBeenCalledWith([
      9,
    ]);
  });

  it("does nothing on onEditedEntryArchive(null) or an entry without id", () => {
    component.onEditedEntryArchive(null);
    component.onEditedEntryArchive(
      createTestEntity({ id: null as unknown as number }),
    );

    expect(confirmService.current()).toBeNull();
  });

  it("calls httpCalls.restore with the entry id once confirmed via onEditedEntryRestore()", () => {
    const entry = createTestEntity({ id: 11 });

    component.onEditedEntryRestore(entry);
    confirmService.accept();

    expect(fixture.componentInstance.httpCalls.restore).toHaveBeenCalledWith([
      11,
    ]);
  });

  it("does nothing on onEditedEntryRestore(null)", () => {
    component.onEditedEntryRestore(null);

    expect(confirmService.current()).toBeNull();
  });

  it("closes the edition dialog once the archive request resolves", () => {
    component.onEdit(createTestEntity({ id: 5 }));

    component.onArchive(5);
    confirmService.accept();

    expect(component.isEntryEditionDialogDisplayed()).toBe(false);
  });
});
