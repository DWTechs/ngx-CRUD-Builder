import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from "@angular/core";
import { ConfigHelper } from "@crud/core/utils/crud-service/config.helper";
import { filterCalls } from "@crud/core/utils/crud-service/filter-calls";
import { TableComponent } from "@crud/table/table.component";
import { RequestsService } from "../data-access/requests.service";

@Component({
  selector: "adm-requests",
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfigHelper],
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
        [canAccessItemFromUrl]="table.canAccessItemFromUrl"
        [isExcelExportEnabled]="table.isExcelExportEnabled"
        [editionDialogSize]="table.editionDialogSize"
        [rows]="table.rows"
        [rowsPerPageOptions]="table.rowsPerPageOptions"
        [outsideTableHeight]="table.outsideTableHeight"
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

  public readonly config = this.configHelper.getConfig(this.requestsService);

  public readonly entityFactory = this.requestsService.entityFactory;

  public readonly groupValidator = this.requestsService.groupValidator;

  // Replace the permission signals with your actual ACL service
  public readonly httpCalls = computed(() =>
    filterCalls(this.requestsService.httpCalls, {
      canCreate: true, // e.g. this.acls.canWrite()
      canUpdate: true, // e.g. this.acls.canWrite()
      canArchive: false, // e.g. this.acls.canArchive()
      canRestore: false, // e.g. this.acls.canRestore()
    }),
  );

  public readonly table = {
    label: "Demandes IT",
    title: "Gestion des demandes IT",
    key: "it-requests",
    selectable: true,
    isExcelExportEnabled: true,
    lazy: true,
    clickableRows: true,
    canAccessItemFromUrl: false,
    filterLevel: "advanced" as const,
    editionDialogSize: "m" as const,
    rows: 20,
    rowsPerPageOptions: [10, 25, 50],
    outsideTableHeight: "200px",
  };
}
