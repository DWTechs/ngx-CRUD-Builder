import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Calls } from "@crud/core/utils/crud-service/crud.model";
import { CrudRepository } from "@crud/core/utils/crud-service/crud.repository";
import { map, of } from "rxjs";
import { budgetValidator } from "./request-group.validator";
import { REQUEST_CONF } from "./request.conf";
import { ItRequest, itRequestFactory } from "./request.model";
import {
  accessoryTypes,
  itRequests,
  osTypes,
  requestTypes,
} from "./requests-data";

@Injectable({ providedIn: "root" })
export class RequestsService {
  private readonly crud = new CrudRepository<ItRequest>().with({
    endpoint: "it-requests",
  });

  public readonly httpCalls: Calls<ItRequest> = {
    get: (e) =>
      this.crud
        .get(e)
        .pipe(map(() => ({ rows: itRequests, total: itRequests.length }))),
    // get: this.crud.get, // Commented out for demo purposes, since we don't have a real backend
    create: this.crud.create,
    update: this.crud.update,
    archive: this.crud.archive,
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
