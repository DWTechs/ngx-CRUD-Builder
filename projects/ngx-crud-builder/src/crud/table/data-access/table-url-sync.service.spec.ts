import { TestBed } from "@angular/core/testing";
import { ActivatedRoute, convertToParamMap, Router } from "@angular/router";
import { TableUrlSyncService } from "./table-url-sync.service";

function setup(queryParams: Record<string, string> = {}) {
  const navigate = vi.fn().mockReturnValue(Promise.resolve(true));

  TestBed.configureTestingModule({
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            queryParamMap: convertToParamMap(queryParams),
            queryParams,
          },
        },
      },
      { provide: Router, useValue: { navigate } },
    ],
  });

  return {
    service: TestBed.inject(TableUrlSyncService),
    navigate,
  };
}

describe("TableUrlSyncService", () => {
  describe("readInitialFirst", () => {
    it("should return the zero-based row index computed from the page query param", () => {
      const { service } = setup({ page: "3" });

      expect(service.readInitialFirst(10)).toBe(20);
    });

    it("should return null when the page query param is absent", () => {
      const { service } = setup();

      expect(service.readInitialFirst(10)).toBeNull();
    });

    it("should return null when the page query param is not a number", () => {
      const { service } = setup({ page: "abc" });

      expect(service.readInitialFirst(10)).toBeNull();
    });

    it("should return null when the page query param is below 1", () => {
      const { service } = setup({ page: "0" });

      expect(service.readInitialFirst(10)).toBeNull();
    });
  });

  describe("readTargetId", () => {
    it("should return the parsed id query param", () => {
      const { service } = setup({ id: "42" });

      expect(service.readTargetId()).toBe(42);
    });

    it("should return null when the id query param is absent", () => {
      const { service } = setup();

      expect(service.readTargetId()).toBeNull();
    });
  });

  describe("updateQueryParams", () => {
    it("should navigate with the given params merged into the current URL", () => {
      const { service, navigate } = setup();

      service.updateQueryParams({ page: 2 });

      expect(navigate).toHaveBeenCalledWith([], {
        queryParams: { page: 2 },
        queryParamsHandling: "merge",
        replaceUrl: true,
      });
    });
  });
});
