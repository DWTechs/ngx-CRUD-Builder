import { NgStyle, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  viewChild,
} from "@angular/core";
import { FilterMetadata } from "@openng/optimus-ui/api";
import { ContextMenuModule } from "@openng/optimus-ui/contextmenu";
import {
  Table,
  TableColResizeEvent,
  TableLazyLoadEvent,
  TableModule,
  TablePageEvent,
} from "@openng/optimus-ui/table";
import { Tooltip } from "@openng/optimus-ui/tooltip";
import { CONTROL_TYPES } from "../../../core/models/control-type.model";
import { TableCellComponent } from "../../../core/ui/table-cell/table-cell.component";
import { TableFilterCellComponent } from "../../../core/ui/table-filter-cell/table-filter-cell.component";
import { TableFilterCellPrimeComponent } from "../../../core/ui/table-filter-cell-prime/table-filter-cell-prime.component";
import { CRUD_LABELS } from "../../../core/utils/i18n/crud-labels.token";
import { CrudFeatures } from "../../../core/utils/table/crud-table-loader.class";
import { FilterLevel } from "../../../core/utils/table/filter-level.model";
import { TableColumn } from "../../../core/utils/table/table-column.model";
import { FirstRowPipe } from "../../utils/pipes/first-row.pipe";
import { HasTooltipContentPipe } from "../../utils/pipes/has-tooltip-content.pipe";
import { LastRowPipe } from "../../utils/pipes/last-row.pipe";
import { ColumnResizeEvent } from "../../utils/views/table-config.model";
import { TableActionsCellComponent } from "../table-actions-cell/table-actions-cell.component";
import { TableCellTooltipComponent } from "../table-cell-tooltip/table-cell-tooltip.component";
import { TableHeaderCellComponent } from "../table-header-cell/table-header-cell.component";
import { ColWidthPipe } from "./col-width.pipe";
import { buildContextMenu } from "./context-menu.builder";

@Component({
  selector: "tbl-table-regular",
  templateUrl: "./table-regular.component.html",
  imports: [
    TableModule,
    FirstRowPipe,
    HasTooltipContentPipe,
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
    TableHeaderCellComponent,
    Tooltip,
  ],
  host: {
    "[class.p-table-no-paginator]": "!paginator()",
  },
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
  public readonly persistState = input.required<boolean>();
  public readonly areColumnsResizable = input.required<boolean>();
  public readonly rows = input.required<number>();
  public readonly rowsPerPageOptions = input.required<number[]>();
  public readonly first = input<number>(0);
  public readonly outsideTableHeight = input.required<string>();
  public readonly stripedRows = input.required<boolean>();
  public readonly additionalReadonlyProperties = input.required<
    Record<string, unknown> | undefined
  >();

  readonly lazyLoaded = output<TableLazyLoadEvent>();
  readonly pageChanged = output<TablePageEvent>();
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

  public onPage(event: TablePageEvent): void {
    this.pageChanged.emit(event);
  }

  public onCellClick(rowData: TData, col: TableColumn) {
    if (!this.clickableRows() || col.controlType === CONTROL_TYPES.CUSTOM) {
      return;
    }
    let mode: "read" | "write" = this.features().update ? "write" : "read";
    const readonlyProperties = this.additionalReadonlyProperties();
    if (readonlyProperties) {
      const match = Object.entries(readonlyProperties).find(([key, value]) => {
        return rowData[key as keyof TData] === value;
      });
      if (match) {
        mode = "read";
      }
    }
    this.cellClicked.emit({ row: rowData, mode });
  }

  public onActionClick(rowData: TData, mode: "read" | "write") {
    this.cellClicked.emit({ row: rowData, mode });
  }

  public resolvedRowStyles(rowData: TData): Record<string, string> {
    const base = this.customRowStyles()?.(rowData) ?? {};
    const isArchived = (rowData as Record<string, unknown>).archived === true;
    const readonlyProperties = this.additionalReadonlyProperties();
    const matchesReadonly = readonlyProperties
      ? Object.entries(readonlyProperties).some(
          ([key, value]) => rowData[key as keyof TData] === value,
        )
      : false;
    const noUpdate = !this.features().update;
    return isArchived || matchesReadonly || noUpdate
      ? { ...base, opacity: "0.5" }
      : base;
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
