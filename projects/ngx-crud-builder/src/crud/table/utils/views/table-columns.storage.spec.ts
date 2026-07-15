import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { TableConfigService } from "../../data-access/table-config.service";
import { TableColumnsStorage } from "./table-columns.storage";

describe("TableColumnsStorage", () => {
  let storage: TableColumnsStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TableColumnsStorage,
        {
          provide: TableConfigService,
          useValue: {
            getViews: () => of([]),
            updateMany: () => of({ rows: [] }),
          },
        },
      ],
    });

    storage = TestBed.inject(TableColumnsStorage);
  });

  it("does not throw when the injected preferences service has no deleteOne method", () => {
    storage.init("component-id", [], true);

    expect(() => storage.deleteView(1)).not.toThrow();
  });
});
