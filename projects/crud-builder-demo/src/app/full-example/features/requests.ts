import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ACL_ADAPTER } from "@crud/core/utils/crud-service/acl-adapter";
import { ConfigHelper } from "@crud/core/utils/crud-service/config.helper";
import { filterCalls } from "@crud/core/utils/crud-service/filter-calls";
import { TableComponent } from "@crud/table/table.component";
import { TableConfig } from "@table/data-access/table-config.model";
import { TableConfigService } from "@table/data-access/table-config.service";
import { of } from "rxjs";
import { REQUESTS_VIEWS } from "../data-access/requests/requests-views";
import { RequestsService } from "../data-access/requests/requests.service";

@Component({
  selector: "adm-requests",
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ConfigHelper,
    {
      provide: TableConfigService,
      useFactory: () => {
        let views = REQUESTS_VIEWS;
        return {
          getViews: () => of(views),
          updateMany: (_: string, updated: TableConfig[]) => {
            views = updated;
            return of({ rows: updated });
          },
        };
      },
    },
  ],
  template: `
    <tbl-table 
        [config]="config"
        [httpCalls]="httpCalls()"
        [groupValidator]="groupValidator"
        [entityFactory]="entityFactory"
        [entityId]="table.key"
        [entityLabel]="table.label"
        [tableTitle]="table.title"
        [filterLevel]="table.filterLevel"
        [lazy]="table.lazy"
        [selectable]="table.selectable"
        [clickableRows]="table.clickableRows"
        [shouldSyncPageWithUrl]="table.shouldSyncPageWithUrl"
        [shouldSyncIdWithUrl]="table.shouldSyncIdWithUrl"
        [isExcelExportEnabled]="table.isExcelExportEnabled"
        [editionDialogSize]="table.editionDialogSize"
        [rows]="table.rows"
        [rowsPerPageOptions]="table.rowsPerPageOptions"
        [outsideTableHeight]="table.outsideTableHeight"
        [isPreferencesModeEnabled]="table.isPreferencesModeEnabled"
    />
  `,
  host: {
    style: `
      display: block;
      height: calc(100vh - 100px);
      overflow: auto;
    `,
  },
})
export class RequestsComponent {
  private readonly requestsService = inject(RequestsService);
  private readonly configHelper = inject(ConfigHelper<RequestsService>);
  private readonly acls = inject(ACL_ADAPTER);
  private readonly functionalityKey = inject(ActivatedRoute).snapshot.data
    .functionalityKey as string;

  public readonly config = this.configHelper.getConfig(this.requestsService);
  public readonly entityFactory = this.requestsService.entityFactory;
  public readonly groupValidator = this.requestsService.groupValidator;

  public readonly httpCalls = computed(() =>
    filterCalls(
      this.requestsService.httpCalls,
      this.acls.permissionsFor(this.functionalityKey),
    ),
  );

  public readonly table = {
    label: "Demandes IT",
    title: "Gestion des demandes IT",
    key: "it-requests",
    selectable: true,
    isExcelExportEnabled: true,
    lazy: true,
    clickableRows: true,
    shouldSyncPageWithUrl: true,
    shouldSyncIdWithUrl: true,
    filterLevel: "advanced" as const,
    editionDialogSize: "m" as const,
    rows: 20,
    rowsPerPageOptions: [10, 25, 50],
    outsideTableHeight: "200px",
    isPreferencesModeEnabled: true,
  };
}
