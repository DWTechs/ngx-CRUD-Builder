import { NgStyle, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  model,
  output,
  TemplateRef,
} from "@angular/core";
import { CONTROL_TYPES } from "../../../core/models/control-type.model";
import { TableCellComponent } from "../../../core/ui/table-cell/table-cell.component";
import { CRUD_LABELS } from "../../../core/utils/i18n/crud-labels.token";
import { CrudFeatures } from "../../../core/utils/table/crud-table-loader.class";
import { FilterLevel } from "../../../core/utils/table/filter-level.model";
import { TableColumn } from "../../../core/utils/table/table-column.model";
import {
  compareValues,
  isEmptyFilterValue,
  matchesFilters,
  NativeFilterMetadata,
  NativeTableFilters,
  normalizeFilters,
} from "../../utils/native-table-filters.model";
import { ColumnResizeEvent } from "../../utils/views/table-config.model";
import { TableActionsCellNativeComponent } from "./table-actions-cell-native.component";
import { TableFilterCellNativeComponent } from "./table-filter-cell-native.component";

/**
 * Plain HTML table shell satisfying the `TABLE_RENDERER` contract, with no Optimus UI
 * dependency.
 *
 * Supports pagination, sorting and basic column filtering, applied client-side or
 * delegated to the server in lazy mode (`lazy = true`). Column resizing, state
 * persistence and the context menu are not implemented — the matching inputs are
 * accepted (to satisfy the shared contract) but have no effect.
 *
 * @see TableRegularComponent for the full-featured Optimus UI reference implementation.
 */
@Component({
  selector: "tbl-table-regular-native",
  templateUrl: "./table-regular-native.component.html",
  styleUrls: [
    "../../../form/ui/renderers-native/native-control.scss",
    "./table-regular-native.component.scss",
  ],
  imports: [
    NgStyle,
    NgTemplateOutlet,
    TableCellComponent,
    TableActionsCellNativeComponent,
    TableFilterCellNativeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRegularNativeComponent<TData> {
  protected readonly labels = inject(CRUD_LABELS);

  public readonly columns = input.required<TableColumn[]>();
  public readonly data = input.required<TData[]>();
  public readonly total = input.required<number>();
  public readonly selectable = input.required<boolean>();
  public readonly clickableRows = input.required<boolean>();
  public readonly lazy = input.required<boolean>();
  public readonly features = input.required<CrudFeatures>();
  public readonly selectedEntries = model.required<TData[]>();
  public readonly filterable = input.required<boolean>();
  public readonly defaultFilters = input.required<Record<string, unknown>>();
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

  readonly pageChanged = output<{ first: number; rows: number }>();
  readonly archived = output<number>();
  readonly cellClicked = output<{
    row: TData;
    mode: "read" | "write";
  }>();
  public readonly columnResized = output<ColumnResizeEvent>();

  // Structurally compatible with Optimus UI's `TableLazyLoadEvent`; declared inline so the
  // native shell does not have to depend on the Optimus UI table package.
  readonly lazyLoaded = output<{
    first: number;
    rows: number;
    sortField?: string;
    sortOrder?: 1 | -1;
    filters?: Record<string, unknown>;
  }>();

  public readonly visibleColumns = computed(() =>
    this.columns().filter((col) => col.isVisible),
  );

  public readonly showActionsColumn = computed(
    () => !this.clickableRows() || !!this.customActionsTemplate(),
  );

  public readonly columnCount = computed(
    () =>
      this.visibleColumns().length +
      (this.selectable() ? 1 : 0) +
      (this.showActionsColumn() ? 1 : 0),
  );

  public readonly filters = linkedSignal<NativeTableFilters>(() =>
    normalizeFilters(this.defaultFilters()),
  );

  public readonly pageSize = linkedSignal(() => this.rows());

  public readonly pageIndex = linkedSignal(() =>
    this.rows() > 0 ? Math.floor(this.first() / this.rows()) : 0,
  );

  public readonly sortState = linkedSignal(() => this.defaultSort());

  // In lazy mode the server already returns the filtered, sorted page, so data() is
  // passed through as-is.
  private readonly filteredData = computed(() => {
    const data = this.data();
    const filters = this.filters();
    if (this.lazy() || !this.filterable() || !Object.keys(filters).length) {
      return data;
    }
    return data.filter((row) => matchesFilters(row, filters));
  });

  private readonly sortedData = computed(() => {
    const data = this.filteredData();
    const { field, order } = this.sortState();
    if (this.lazy() || !this.sortable() || !field) return data;
    return [...data].sort(
      (a, b) =>
        compareValues(
          (a as Record<string, unknown>)[field],
          (b as Record<string, unknown>)[field],
        ) * order,
    );
  });

  public readonly displayedTotal = computed(() =>
    this.lazy() ? this.total() : this.filteredData().length,
  );

  public readonly pagedData = computed(() => {
    const data = this.sortedData();
    if (this.lazy() || !this.paginator()) return data;
    const start = this.pageIndex() * this.pageSize();
    return data.slice(start, start + this.pageSize());
  });

  public readonly pageCount = computed(() =>
    Math.max(1, Math.ceil(this.displayedTotal() / this.pageSize())),
  );

  public readonly pageReport = computed(() => {
    const total = this.displayedTotal();
    const firstRow = total ? this.pageIndex() * this.pageSize() + 1 : 0;
    const lastRow = Math.min((this.pageIndex() + 1) * this.pageSize(), total);
    return this.labels.tableRegular.currentPageReport(
      String(firstRow),
      String(lastRow),
      String(total),
    );
  });

  public cellValue(row: TData, key: string): unknown {
    return (row as Record<string, unknown>)[key];
  }

  public isColSortable(col: TableColumn): boolean {
    return this.sortable() && col.sortable !== false;
  }

  public sortIcon(col: TableColumn): string {
    const { field, order } = this.sortState();
    if (field !== col.key) return "↕";
    return order === -1 ? "↓" : "↑";
  }

  public onFilterChanged(col: TableColumn, meta: NativeFilterMetadata): void {
    this.filters.update((current) => {
      const next = { ...current };
      if (isEmptyFilterValue(meta.value)) {
        delete next[col.key];
      } else {
        next[col.key] = meta;
      }
      return next;
    });
    this.pageIndex.set(0);
    if (this.lazy()) {
      this.emitLazyLoad(0, this.pageSize());
    }
  }

  /** Cycles ascending → descending → back to the default sort */
  public onSortClick(col: TableColumn): void {
    if (!this.isColSortable(col)) return;
    const { field, order } = this.sortState();
    if (field !== col.key) {
      this.sortState.set({ field: col.key, order: 1 });
    } else if (order === 1) {
      this.sortState.set({ field: col.key, order: -1 });
    } else {
      this.sortState.set(this.defaultSort());
    }
    this.pageIndex.set(0);
    if (this.lazy()) {
      this.emitLazyLoad(0, this.pageSize());
    }
  }

  public goToPage(index: number): void {
    const pageIndex = Math.min(Math.max(index, 0), this.pageCount() - 1);
    if (pageIndex === this.pageIndex()) return;
    this.pageIndex.set(pageIndex);
    this.emitPageChange();
  }

  public onPageSizeChange(size: string): void {
    this.pageSize.set(Number(size));
    this.pageIndex.set(0);
    this.emitPageChange();
  }

  private emitPageChange(): void {
    const first = this.pageIndex() * this.pageSize();
    this.pageChanged.emit({ first, rows: this.pageSize() });
    if (this.lazy()) {
      this.emitLazyLoad(first, this.pageSize());
    }
  }

  private emitLazyLoad(first: number, rows: number): void {
    const { field, order } = this.sortState();
    this.lazyLoaded.emit({
      first,
      rows,
      sortField: field,
      sortOrder: order,
      filters: this.filters(),
    });
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

  public onArchive(rowData: TData): void {
    this.archived.emit((rowData as Record<string, unknown>).id as number);
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

  public isSelected(rowData: TData): boolean {
    return this.selectedEntries().includes(rowData);
  }

  public toggleRow(rowData: TData): void {
    const current = this.selectedEntries();
    this.selectedEntries.set(
      this.isSelected(rowData)
        ? current.filter((entry) => entry !== rowData)
        : [...current, rowData],
    );
  }

  public isAllSelected(): boolean {
    const data = this.data();
    return data.length > 0 && data.every((row) => this.isSelected(row));
  }

  public isSomeSelected(): boolean {
    return (
      !this.isAllSelected() && this.data().some((row) => this.isSelected(row))
    );
  }

  public toggleAll(checked: boolean): void {
    this.selectedEntries.set(checked ? [...this.data()] : []);
  }
}
