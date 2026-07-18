import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { APP_CONFIG } from "../../../core/app-config/app-config.token";
import { Rows, RowsAndCount } from "../../core/utils/crud-service/dto.model";
import { TableConfig } from "./table-config.model";

@Injectable({ providedIn: "root" })
export class TableConfigService {
  private readonly api = `${inject(APP_CONFIG).apiPrefix}preferences`;
  private readonly http = inject(HttpClient);

  public getViews(componentId: string): Observable<TableConfig[]> {
    return this.http
      .get<RowsAndCount<TableConfig>>(`${this.api}/${componentId}`)
      .pipe(
        map((res) => res.rows),
        catchError(() => of([])),
      );
  }

  public createOne(
    componentId: string,
    view: TableConfig,
  ): Observable<Rows<TableConfig>> {
    return this.http.post<Rows<TableConfig>>(`${this.api}/${componentId}`, {
      rows: [view],
    });
  }

  public updateOne(
    componentId: string,
    view: TableConfig,
  ): Observable<Rows<TableConfig>> {
    return this.updateMany(componentId, [view]);
  }

  // "conf" is optional here: a row can be re-sent to only update other fields
  // (e.g. "isActive") without echoing back an unchanged "conf" as a real edit.
  public updateMany(
    componentId: string,
    views: (Omit<TableConfig, "conf"> & { conf?: TableConfig["conf"] })[],
  ) {
    return this.http.put<Rows<TableConfig>>(`${this.api}/${componentId}`, {
      rows: views,
    });
  }

  public deleteOne(componentId: string, id: number): Observable<unknown> {
    return this.http.delete(`${this.api}/${componentId}/${id}`);
  }
}
