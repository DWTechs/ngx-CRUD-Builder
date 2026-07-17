import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { vi } from "vitest";
import { ExtendedTableConfig } from "../../data-access/table-config.model";
import { TableConfigService } from "../../data-access/table-config.service";
import { TableColumnsStorage } from "./table-columns.storage";

const COMPONENT_ID = "test-component";

const makeView = (
  partial: Partial<ExtendedTableConfig> = {},
): ExtendedTableConfig => ({
  id: 1,
  name: "View 1",
  component: COMPONENT_ID,
  conf: [],
  isActive: true,
  locked: false,
  columns: [],
  ...partial,
});

describe("TableColumnsStorage", () => {
  let storage: TableColumnsStorage;
  let preferencesMock: Record<string, ReturnType<typeof vi.fn>>;

  beforeEach(() => {
    preferencesMock = {
      getViews: vi.fn().mockReturnValue(of([])),
      createOne: vi.fn().mockReturnValue(of({ rows: [] })),
      updateOne: vi.fn().mockReturnValue(of({ rows: [] })),
      updateMany: vi.fn().mockReturnValue(of({ rows: [] })),
      deleteOne: vi.fn().mockReturnValue(of(null)),
    };

    TestBed.configureTestingModule({
      providers: [
        TableColumnsStorage,
        { provide: TableConfigService, useValue: preferencesMock },
      ],
    });

    storage = TestBed.inject(TableColumnsStorage);
  });

  // ── createView ─────────────────────────────────────────────────────────────

  describe("createView", () => {
    it("returns null and does not call createOne when componentId is not set", () => {
      const view = makeView({ id: Date.now(), isCreation: true });
      let result: unknown = "sentinel";

      storage.createView(view).subscribe((v) => (result = v));

      expect(result).toBeNull();
      expect(preferencesMock.createOne).not.toHaveBeenCalled();
    });

    it("calls createOne stripping columns, isCreation and id from the payload", () => {
      storage.init(COMPONENT_ID, [], true);
      const fakeId = Date.now();
      const view = makeView({ id: fakeId, isCreation: true, columns: [] });
      preferencesMock.createOne.mockReturnValue(
        of({ rows: [{ ...view, id: 42 }] }),
      );

      storage.createView(view).subscribe();

      const [calledComponentId, calledView] =
        preferencesMock.createOne.mock.calls.at(-1) ?? [];
      expect(calledComponentId).toBe(COMPONENT_ID);
      expect((calledView as Record<string, unknown>).id).toBeUndefined();
      expect((calledView as Record<string, unknown>).columns).toBeUndefined();
      expect(
        (calledView as Record<string, unknown>).isCreation,
      ).toBeUndefined();
    });

    it("replaces the fake id with the real id returned by the backend", () => {
      storage.init(COMPONENT_ID, [], true);
      const fakeId = 999_999;
      const view = makeView({ id: fakeId, isCreation: true });
      storage.viewsWithColumns.set([view]);
      preferencesMock.createOne.mockReturnValue(
        of({ rows: [{ ...view, id: 42 }] }),
      );

      storage.createView(view).subscribe();

      const views = storage.viewsWithColumns();
      expect(views?.find((v) => v.id === 42)).toBeTruthy();
      expect(views?.find((v) => v.id === fakeId)).toBeUndefined();
    });

    it("removes the isCreation flag from the patched view", () => {
      storage.init(COMPONENT_ID, [], true);
      const fakeId = 999_999;
      const view = makeView({ id: fakeId, isCreation: true });
      storage.viewsWithColumns.set([view]);
      preferencesMock.createOne.mockReturnValue(
        of({ rows: [{ ...view, id: 42 }] }),
      );

      storage.createView(view).subscribe();

      const updated = storage.viewsWithColumns()?.find((v) => v.id === 42);
      expect(updated?.isCreation).toBeUndefined();
    });

    it("leaves other views untouched when patching the created view", () => {
      storage.init(COMPONENT_ID, [], true);
      const otherView = makeView({ id: 1, name: "Existing" });
      const newView = makeView({ id: 999_999, isCreation: true, name: "New" });
      storage.viewsWithColumns.set([otherView, newView]);
      preferencesMock.createOne.mockReturnValue(
        of({ rows: [{ ...newView, id: 42 }] }),
      );

      storage.createView(newView).subscribe();

      expect(storage.viewsWithColumns()?.length).toBe(2);
      expect(storage.viewsWithColumns()?.find((v) => v.id === 1)).toBeTruthy();
    });
  });

  // ── deleteView ─────────────────────────────────────────────────────────────

  describe("deleteView", () => {
    it("does not throw when deleteOne is not defined on the service", () => {
      delete preferencesMock.deleteOne;
      storage.init(COMPONENT_ID, [], true);

      expect(() => storage.deleteView(1)).not.toThrow();
    });

    it("calls deleteOne with componentId and viewId", () => {
      storage.init(COMPONENT_ID, [], true);

      storage.deleteView(1).subscribe();

      expect(preferencesMock.deleteOne).toHaveBeenCalledWith(COMPONENT_ID, 1);
    });
  });
});
