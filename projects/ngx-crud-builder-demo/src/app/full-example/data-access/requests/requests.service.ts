import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { FilterMetadata } from "@openng/optimus-ui/api";
import { of } from "rxjs";
import { budgetValidator } from "./request-group.validator";
import { REQUEST_CONF } from "./request.conf";
import { ItRequest, itRequestFactory } from "./request.model";
import {
  accessoryTypes,
  itRequests,
  osTypes,
  requestTypes,
  requestsHistory,
} from "./requests-data";

@Injectable({ providedIn: "root" })
export class RequestsService {
  private readonly crud = new CrudRepository<ItRequest>().with({
    endpoint: "it-requests",
  });

  public readonly httpCalls: Calls<ItRequest> = {
    get: (e) => {
      let rows = itRequests;
      const idFilter = e?.filters?.["id"] as
        | FilterMetadata
        | FilterMetadata[]
        | undefined;
      if (idFilter) {
        const value = Array.isArray(idFilter)
          ? idFilter[0]?.value
          : idFilter.value;
        if (value != null) {
          rows = itRequests.filter((r) => r.id === Number(value));
        }
      }
      return of({ rows, total: rows.length });
    },
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
    restore: this.crud.restore,
    getHistory: (id) => {
      const history = requestsHistory[id] ?? [];
      return of({ rows: history, total: history.length });
    },
  };

  public readonly config = (payload: ActivatedRouteSnapshot) =>
    REQUEST_CONF(payload);

  public readonly entityFactory = itRequestFactory;

  public readonly groupValidator = budgetValidator;

  public getTypes() {
    return of(requestTypes);
  }

  public getOsOptions() {
    return of(osTypes);
  }

  public getAccessoryTypes() {
    return of(accessoryTypes);
  }
}
