import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { TableLazyLoadEvent } from "@openng/optimus-ui/table";
import { APP_CONFIG } from "../../../../core/app-config/app-config.token";
import { Repository } from "./crud.model";
import { CrudRepository } from "./crud.repository";
import { NO_ROWS, NO_ROWS_AND_COUNT } from "./no-rows";

interface TestEntity {
  id: number;
  name: string;
}

describe("CrudRepository", () => {
  let httpMock: HttpTestingController;
  let repository: CrudRepository<TestEntity>;
  let ops: Repository<TestEntity>;

  const API_PREFIX = "/api/";
  const ENDPOINT = "entities";
  const API_URL = `${API_PREFIX}${ENDPOINT}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: APP_CONFIG, useValue: { apiPrefix: API_PREFIX } },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    repository = TestBed.inject(CrudRepository<TestEntity>);
    ops = repository.with({ endpoint: ENDPOINT });
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ── get / getAll / getById ───────────────────────────────────────────────

  describe("get", () => {
    it("returns NO_ROWS_AND_COUNT without an HTTP call when the event is falsy", () => {
      let result: unknown;
      ops.get(null as unknown as TableLazyLoadEvent).subscribe((res) => {
        result = res;
      });

      expect(result).toEqual(NO_ROWS_AND_COUNT);
      httpMock.expectNone(() => true);
    });

    it("POSTs the event to the search endpoint and returns the response", () => {
      const event: TableLazyLoadEvent = { first: 0, rows: 10 };
      let result: unknown;
      ops.get(event).subscribe((res) => {
        result = res;
      });

      const req = httpMock.expectOne(`${API_URL}/search`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(event);

      const response = { rows: [{ id: 1, name: "A" }], total: 1 };
      req.flush(response);

      expect(result).toEqual(response);
    });

    it("returns NO_ROWS_AND_COUNT when the request errors out", () => {
      let result: unknown;
      ops.get({}).subscribe((res) => {
        result = res;
      });

      httpMock
        .expectOne(`${API_URL}/search`)
        .flush("error", { status: 500, statusText: "Server Error" });

      expect(result).toEqual(NO_ROWS_AND_COUNT);
    });

    it("getAll() delegates to get({})", () => {
      ops.getAll().subscribe();

      const req = httpMock.expectOne(`${API_URL}/search`);
      expect(req.request.body).toEqual({});
      req.flush(NO_ROWS_AND_COUNT);
    });

    it("getById() delegates to get() with an `id` equals filter", () => {
      ops.getById(42).subscribe();

      const req = httpMock.expectOne(`${API_URL}/search`);
      expect(req.request.body).toEqual({
        filters: { id: { value: 42, matchMode: "equals" } },
      });
      req.flush(NO_ROWS_AND_COUNT);
    });
  });

  // ── create / update ──────────────────────────────────────────────────────

  describe("create", () => {
    it("POSTs the item wrapped in `{ rows: [item] }` by default", () => {
      const item = { id: 0, name: "New" };
      ops.create(item).subscribe();

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual({ rows: [item] });
      req.flush({ rows: [item] });
    });

    it("uses fileOperationsConfig.serializer to build the request body when provided", () => {
      const serializer = vi.fn().mockReturnValue(new FormData());
      ops = repository.with({
        endpoint: ENDPOINT,
        fileOperationsConfig: { serializer },
      });
      const item = { id: 0, name: "New" };

      ops.create(item).subscribe();

      expect(serializer).toHaveBeenCalledWith(item);
      const req = httpMock.expectOne(API_URL);
      req.flush({ rows: [item] });
    });
  });

  describe("update", () => {
    it("PUTs the item wrapped in `{ rows: [item] }` by default", () => {
      const item = { id: 1, name: "Updated" };
      ops.update(item).subscribe();

      const req = httpMock.expectOne(API_URL);
      expect(req.request.method).toBe("PUT");
      expect(req.request.body).toEqual({ rows: [item] });
      req.flush({ rows: [item] });
    });
  });

  // ── archive / restore ────────────────────────────────────────────────────

  describe("archive", () => {
    it("POSTs the ids to the archive endpoint", () => {
      ops.archive([1, 2, 3]).subscribe();

      const req = httpMock.expectOne(`${API_URL}/archive`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual({ rows: [1, 2, 3] });
      req.flush(null);
    });
  });

  describe("restore", () => {
    it("POSTs the ids to the restore endpoint", () => {
      ops.restore([4, 5]).subscribe();

      const req = httpMock.expectOne(`${API_URL}/restore`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual({ rows: [4, 5] });
      req.flush(null);
    });
  });

  // ── getHistory ───────────────────────────────────────────────────────────

  describe("getHistory", () => {
    it("GETs the entity history endpoint", () => {
      ops.getHistory(7).subscribe();

      const req = httpMock.expectOne(`${API_URL}/7/history`);
      expect(req.request.method).toBe("GET");
      req.flush(NO_ROWS_AND_COUNT);
    });
  });

  // ── updateFiles ──────────────────────────────────────────────────────────

  describe("updateFiles", () => {
    it("POSTs a FormData payload with the files under the `pictures` key by default", () => {
      const file = new File(["content"], "photo.png", { type: "image/png" });

      ops.updateFiles([file], 3).subscribe();

      const req = httpMock.expectOne(`${API_URL}/3/pictures`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toBeInstanceOf(FormData);
      expect((req.request.body as FormData).getAll("pictures")).toEqual([file]);
      req.flush({ rows: [] });
    });

    it("returns NO_ROWS when the request errors out", () => {
      const file = new File(["content"], "photo.png", { type: "image/png" });
      let result: unknown;

      ops.updateFiles([file], 3).subscribe((res) => {
        result = res;
      });

      httpMock
        .expectOne(`${API_URL}/3/pictures`)
        .flush("error", { status: 500, statusText: "Server Error" });

      expect(result).toEqual(NO_ROWS);
    });
  });

  // ── cache (getAndCacheAll / invalidateCache) ────────────────────────────

  describe("getAndCacheAll / cache invalidation", () => {
    it("only performs one HTTP call for concurrent getAndCacheAll() subscriptions", () => {
      ops.getAndCacheAll().subscribe();
      ops.getAndCacheAll().subscribe();

      const req = httpMock.expectOne(`${API_URL}/search`);
      req.flush({ rows: [{ id: 1, name: "A" }], total: 1 });
    });

    it("re-fetches after a write operation invalidates the cache", () => {
      ops.getAndCacheAll().subscribe();
      httpMock
        .expectOne(`${API_URL}/search`)
        .flush({ rows: [{ id: 1, name: "A" }], total: 1 });

      // create() invalidates the cache as a side effect
      ops.create({ id: 0, name: "New" }).subscribe();
      httpMock.expectOne(API_URL).flush({ rows: [{ id: 2, name: "New" }] });

      ops.getAndCacheAll().subscribe();
      httpMock.expectOne(`${API_URL}/search`).flush({
        rows: [
          { id: 1, name: "A" },
          { id: 2, name: "New" },
        ],
        total: 2,
      });
    });
  });
});
