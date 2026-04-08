import { NgStyle, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { FilterMetadata } from "primeng/api";
import { ContextMenuModule } from "primeng/contextmenu";
import {
  Table,
  TableColResizeEvent,
  TableLazyLoadEvent,
  TableModule,
} from "primeng/table";
import { Tooltip } from "primeng/tooltip";
import { CONTROL_TYPES } from "../../../core/models/control-type.model";
import { TableCellComponent } from "../../../core/ui/table-cell/table-cell.component";
import { TableFilterCellPrimeComponent } from "../../../core/ui/table-filter-cell-prime/table-filter-cell-prime.component";
import { TableFilterCellComponent } from "../../../core/ui/table-filter-cell/table-filter-cell.component";
import { CRUD_LABELS } from "../../../core/utils/i18n/crud-labels.token";
import { CrudFeatures } from "../../../core/utils/table/crud-loader.class";
import { FilterLevel } from "../../../core/utils/table/filter-level.model";
import { TableColumn } from "../../../core/utils/table/table-column.model";
import { FirstRowPipe } from "../../utils/pipes/first-row.pipe";
import { LastRowPipe } from "../../utils/pipes/last-row.pipe";
import { ColumnResizeEvent } from "../../utils/views/table-config.model";
import { TableActionsCellComponent } from "../table-actions-cell/table-actions-cell.component";
import { TableCellTooltipComponent } from "../table-cell-tooltip/table-cell-tooltip.component";
import { ColWidthPipe } from "./col-width.pipe";
import { buildContextMenu } from "./context-menu.builder";

@Component({
  selector: "tbl-table-regular",
  templateUrl: "./table-regular.component.html",
  imports: [
    TableModule,
    FirstRowPipe,
    LastRowPipe,
    NgStyle,
    TableActionsCellComponent,
    TableFilterCellComponent,
    TableFilterCellPrimeComponent,
    ContextMenuModule,
    ColWidthPipe,
    NgTemplateOutlet,
    TableCellComponent,
    TableCellTooltipComponent,
    Tooltip,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRegularComponent<TData> {
  protected readonly labels = inject(CRUD_LABELS);
  public readonly dataTable = viewChild(Table);

  // TODO: rows number could be computed to take all the screen height

  public readonly columns = input.required<TableColumn[]>();
  public readonly data = input.required<TData[]>();
  public readonly total = input.required<number>();
  public readonly selectable = input.required<boolean>();
  public readonly clickableRows = input.required<boolean>();
  public readonly lazy = input.required<boolean>();
  public readonly features = input.required<CrudFeatures>();
  public readonly selectedEntries = model.required<TData[]>();
  public readonly filterable = input.required<boolean>();
  public readonly defaultFilters = input.required({
    transform: (filters) =>
      filters as { [key: string]: FilterMetadata | FilterMetadata[] },
  });
  public readonly sortable = input.required<boolean>();
  public readonly defaultSort = input.required<{
    field: string;
    order: 1 | -1;
  }>();
  public readonly paginator = input.required<boolean>();
  public readonly filterLevel = input.required<FilterLevel>();
  public readonly customRowStyles = input.required<
    ((row: TData) => Record<string, string>) | undefined
  >();
  public readonly customActionsTemplate = input.required<
    TemplateRef<unknown> | undefined
  >();
  public readonly isContextMenuEnabled = input.required<boolean>();
  public readonly entityId = input.required<string>();
  public readonly stateStorage = input.required<"local" | "session">();
  public readonly areColumnsResizable = input.required<boolean>();
  public readonly rows = input.required<number>();
  public readonly rowsPerPageOptions = input.required<number[]>();
  public readonly outsideTableHeight = input.required<string>();

  readonly selectedEntriesChange = output<TData[]>();
  readonly lazyLoaded = output<TableLazyLoadEvent>();
  readonly archived = output<number>();
  readonly cellClicked = output<{
    row: TData;
    mode: "read" | "write";
  }>();
  public readonly columnResized = output<ColumnResizeEvent>();

  public readonly lastUpdateTime = signal(0);

  public readonly totalCount = computed(() => this.total() ?? 0);

  public readonly visibleColumns = computed(() =>
    this.columns().filter((col) => col.isVisible),
  );

  public readonly contextMenuItems = computed(() => buildContextMenu(this));
  public rightClickedEntry: TData | null = null;

  public readonly scrollHeight = computed(() => {
    return `calc(100vh - ${this.outsideTableHeight()})`;
  });

  // Handle sorting manually to be able to synchronize with stateStorage
  readonly sortEffect = effect(() => {
    const table = this.dataTable();
    if (!table) {
      return;
    }
    const { field, order } = this.defaultSort();
    table.sortField = field;
    table.sortOrder = order;
  });

  public trackCol(col: TableColumn) {
    return col;
  }

  public onLazyLoad(event: TableLazyLoadEvent): void {
    this.lazyLoaded.emit(event);
    this.lastUpdateTime.set(Date.now());
  }

  public onCellClick(rowData: TData, col: TableColumn) {
    if (!this.clickableRows() || col.controlType === CONTROL_TYPES.CUSTOM) {
      return;
    }
    const mode = this.features().update ? "write" : "read";
    this.cellClicked.emit({ row: rowData, mode });
  }

  public onActionClick(rowData: TData, mode: "read" | "write") {
    this.cellClicked.emit({ row: rowData, mode });
  }

  public onColumnResized(event: TableColResizeEvent) {
    const colKey = event.element.getAttribute("data-colkey") ?? "";
    if (!colKey) return;
    // Emit the resize event
    const newWidthPx = event.element.offsetWidth;
    const resizeEvent: ColumnResizeEvent = {
      colKey,
      newWidthPx,
    };
    this.columnResized.emit(resizeEvent);
  }
}
