import { ComponentFixture } from "@angular/core/testing";
import { of } from "rxjs";
import { TableComponent } from "../table.component";
import {
  createTestEntity,
  RouterMock,
  setupTableTest,
  TestEntity,
  TestWrapperComponent,
  waitForDebounce,
} from "./table.component.spec-helpers";

describe("TableComponent - URL synchronization", () => {
  it("restores the current page from the `page` query param on init", async () => {
    const { fixture, component } = await setupTableTest({
      queryParams: { page: "3" },
    });
    fixture.componentInstance.shouldSyncPageWithUrl = true;
    fixture.detectChanges();
    await waitForDebounce();

    // page 3 with the default 10 rows per page starts at row index 20
    expect(component.first()).toBe(20);
  });

  it("pushes the page query param via Router.navigate when a page loads", async () => {
    const {
      fixture,
      router,
    }: {
      fixture: ComponentFixture<TestWrapperComponent>;
      component: TableComponent<TestEntity>;
      router: RouterMock;
    } = await setupTableTest();
    fixture.componentInstance.shouldSyncPageWithUrl = true;
    fixture.detectChanges();
    await waitForDebounce();

    expect(router.navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({ queryParams: { page: 1 } }),
    );
  });

  it("appends the row id to the url when opening the edition dialog and shouldSyncIdWithUrl is enabled", async () => {
    const { fixture, component, router } = await setupTableTest();
    fixture.componentInstance.shouldSyncIdWithUrl = true;
    fixture.detectChanges();
    await waitForDebounce();

    component.onEdit(createTestEntity({ id: 42 }));

    expect(router.navigate).toHaveBeenCalledWith(
      [],
      expect.objectContaining({ queryParams: { id: 42 } }),
    );
  });

  it("does not touch the url when shouldSyncIdWithUrl is disabled", async () => {
    const { fixture, component, router } = await setupTableTest();
    fixture.detectChanges();
    await waitForDebounce();
    router.navigate.mockClear();

    component.onEdit(createTestEntity({ id: 42 }));

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("opens the matching row once data is loaded, based on the `id` query param", async () => {
    const { fixture, component } = await setupTableTest({
      queryParams: { id: "2" },
    });
    fixture.componentInstance.shouldSyncIdWithUrl = true;
    fixture.componentInstance.httpCalls = {
      get: () =>
        of({
          rows: [createTestEntity({ id: 1 }), createTestEntity({ id: 2 })],
          total: 2,
        }),
    };
    fixture.detectChanges();
    await waitForDebounce();
    // flushes the `openItemFromUrl` effect scheduled after data() updates
    fixture.detectChanges();

    expect(component.isEntryEditionDialogDisplayed()).toBe(true);
    expect(component.editedEntry?.id).toBe(2);
  });
});
