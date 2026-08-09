import { NgStyle, NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  model,
  output,
  TemplateRef,
} from "@angular/core";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { CONTROL_TYPES } from "../../../core/models/control-type.model";
import { TableCellComponent } from "../../../core/ui/table-cell/table-cell.component";
import { CRUD_LABELS } from "../../../core/utils/i18n/crud-labels.token";
import { CrudFeatures } from "../../../core/utils/table/crud-loader.class";
import { FilterLevel } from "../../../core/utils/table/filter-level.model";
import { TableColumn } from "../../../core/utils/table/table-column.model";
import { ColumnResizeEvent } from "../../utils/views/table-config.model";
import { TableActionsCellMaterialComponent } from "../table-actions-cell-material/table-actions-cell-material.component";

/**
 * Minimal Angular Material table shell satisfying the `TABLE_RENDERER` contract.
 *
 * Only supports non-lazy mode (`lazy = false`): all rows are fetched once and
 * paginated client-side. Filtering, sorting, column resizing, state persistence
 * and the context menu are not implemented yet — the matching inputs are accepted
 * (to satisfy the shared contract) but have no effect.
 *
 * @see TableRegularComponent for the full-featured PrimeNG reference implementation.
 */
@Component({
  selector: "tbl-table-regular-material",
  templateUrl: "./table-regular-material.component.html",
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    NgStyle,
    NgTemplateOutlet,
    TableCellComponent,
    TableActionsCellMaterialComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRegularMaterialComponent<TData> {
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

  // No lazy-loading support yet: this shell always fetches everything upfront,
  // so lazyLoaded is only declared to satisfy TableComponent's generic subscription.
  readonly lazyLoaded = output<{
    first: number;
    rows: number;
  }>();

  public readonly visibleColumns = computed(() =>
    this.columns().filter((col) => col.isVisible),
  );

  public readonly showActionsColumn = computed(
    () => !this.clickableRows() || !!this.customActionsTemplate(),
  );

  public readonly displayedColumns = computed(() => {
    const keys = this.visibleColumns().map((col) => col.key);
    if (this.selectable()) keys.unshift("select");
    if (this.showActionsColumn()) keys.push("actions");
    return keys;
  });

  public readonly pageIndex = linkedSignal(() =>
    this.rows() > 0 ? Math.floor(this.first() / this.rows()) : 0,
  );

  public readonly pagedData = computed(() => {
    const data = this.data();
    if (!this.paginator()) return data;
    const pageSize = this.rows();
    const start = this.pageIndex() * pageSize;
    return data.slice(start, start + pageSize);
  });

  // Fail fast: this shell only supports non-lazy mode for now.
  private readonly lazyGuard = effect(() => {
    if (this.lazy()) {
      throw new Error(
        "The Material table shell only supports non-lazy mode (lazy = false) for now.",
      );
    }
  });

  public trackCol(col: TableColumn) {
    return col;
  }

  public onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageChanged.emit({
      first: event.pageIndex * event.pageSize,
      rows: event.pageSize,
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
