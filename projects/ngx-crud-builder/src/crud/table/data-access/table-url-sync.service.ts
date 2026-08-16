import { Injectable, inject } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";

const MIN_PAGE = 1;

/** Reads/writes the `page` and `id` query params used to sync table state with the URL. */
@Injectable({ providedIn: "root" })
export class TableUrlSyncService {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /** Returns the zero-based row index from the `page` query param, or null if absent/invalid. */
  public readInitialFirst(rows: number): number | null {
    const rawPage = this.route.snapshot.queryParamMap.get("page");
    const parsedPage = Number.parseInt(rawPage ?? "", 10);
    if (Number.isNaN(parsedPage) || parsedPage < MIN_PAGE) {
      return null;
    }
    return (parsedPage - 1) * rows;
  }

  /** Returns the entity id from the `id` query param, or null if absent/invalid. */
  public readTargetId(): number | null {
    const rawId = this.route.snapshot.queryParams.id;
    const parsedId = Number.parseInt(rawId, 10);
    return Number.isNaN(parsedId) ? null : parsedId;
  }

  public updateQueryParams(params: Params): void {
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: "merge",
      replaceUrl: true,
    });
  }
}
