import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import {
  CONTROL_TYPES,
  CRUD_LABELS,
  crudItemToColumn,
  FormFieldBaseComponent,
  required,
  TableCellComponent,
  TableColumn,
} from "@dwtechs/ngx-crud-builder";
import { TableFilterCellMaterialComponent } from "../../../table/filters/table-filter-cell-material.component";
import {
  isEmptyFilterValue,
  matchesFilters,
  MaterialFilterMetadata,
  MaterialTableFilters,
} from "../../../table/filters/table-filters.model";

/** Row of the embedded table, tagged with a client-side key so edits survive re-sorting. */
type TableCtrlRow = Record<string, unknown> & { internal_id: number };

@Component({
  selector: "frm-material-table-control",
  templateUrl: "./material-table-control.component.html",
  styles: `
    .table-control-toolbar {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
    }
    table {
      width: 100%;
    }
    td.editable {
      cursor: pointer;
    }
    td mat-form-field {
      width: 100%;
    }
    tr.filter-row {
      height: auto;
    }
    tr.filter-row th {
      padding-top: 4px;
      padding-bottom: 4px;
      vertical-align: middle;
    }
    .no-data-row td {
      padding: 16px;
      text-align: center;
    }
  `,
  imports: [
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TableCellComponent,
    TableFilterCellMaterialComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialTableControlComponent extends FormFieldBaseComponent {
  protected readonly labels = inject(CRUD_LABELS);
  protected readonly ControlType = CONTROL_TYPES;

  protected readonly rows = linkedSignal<TableCtrlRow[]>(() => {
    const value = this.control().value;
    if (!Array.isArray(value)) return [];
    return value.map((item) => ({ ...item, internal_id: this.nextRowKey() }));
  });

  protected readonly tableCtrlConfig = computed(
    () => this.options().tableCtrlConfig ?? {},
  );

  protected readonly isReadonly = computed(
    () => this.isDisabled() || !!this.isFormReadonly(),
  );

  protected readonly isHeaderHidden = computed(
    () => this.tableCtrlConfig().isHeaderHidden ?? false,
  );

  protected readonly isSelectable = computed(
    () =>
      !!(
        this.tableCtrlConfig().selectable ||
        this.tableCtrlConfig().isDeletionEnabled
      ),
  );

  protected readonly editionMode = computed(
    () => this.tableCtrlConfig().editionMode ?? "cell",
  );

  protected readonly columns = computed<TableColumn[]>(() => {
    const cols = this.options().tableCtrlColumns ?? [];
    const sortedColKeys = this.tableCtrlConfig().sortedColumnKeys ?? [];
    const sortedColumns = sortedColKeys.length
      ? sortedColKeys
          .map((key) => cols.find((item) => item.key === key))
          .filter((item) => !!item)
      : cols;
    return sortedColumns
      .map((col) => crudItemToColumn(col))
      .filter((col) => col.isVisible);
  });

  protected readonly displayedColumns = computed(() => {
    const keys = this.columns().map((col) => col.key);
    if (this.isSelectable()) keys.unshift("select");
    if (this.editionMode() === "row") keys.push("actions");
    return keys;
  });

  protected readonly filterColumns = computed(() =>
    this.displayedColumns().map((key) => `${key}_filter`),
  );

  protected readonly filters = signal<MaterialTableFilters>({});

  protected readonly sortState = signal<{ field: string; order: 1 | -1 }>({
    field: "",
    order: 1,
  });

  protected readonly sortDirection = computed<"asc" | "desc">(() =>
    this.sortState().order === -1 ? "desc" : "asc",
  );

  protected readonly displayRows = computed<TableCtrlRow[]>(() => {
    const filters = this.filters();
    const rows =
      this.tableCtrlConfig().filterable && Object.keys(filters).length
        ? this.rows().filter((row) => matchesFilters(row, filters))
        : this.rows();
    const { field, order } = this.sortState();
    if (!this.tableCtrlConfig().sortable || !field) return rows;
    return [...rows].sort(
      (a, b) => this.compareValues(a[field], b[field]) * order,
    );
  });

  protected readonly selectedIds = signal<number[]>([]);

  protected readonly editingCell = signal<{ id: number; key: string } | null>(
    null,
  );
  protected readonly editingRowId = signal<number | null>(null);

  /** Saved original row in case of cancel (used in **row** edition mode) */
  private clonedRow: TableCtrlRow | null = null;

  protected isColSortable(col: TableColumn): boolean {
    return !!this.tableCtrlConfig().sortable && col.sortable !== false;
  }

  protected isColRequired(col: TableColumn): boolean {
    return (col.controlOptions?.validators ?? []).includes(required);
  }

  protected onSortChange(sort: Sort): void {
    this.sortState.set({
      field: sort.direction ? sort.active : "",
      order: sort.direction === "desc" ? -1 : 1,
    });
  }

  protected onFilterChanged(
    col: TableColumn,
    meta: MaterialFilterMetadata,
  ): void {
    this.filters.update((current) => {
      const next = { ...current };
      if (isEmptyFilterValue(meta.value)) {
        delete next[col.key];
      } else {
        next[col.key] = meta;
      }
      return next;
    });
  }

  protected isSelected(row: TableCtrlRow): boolean {
    return this.selectedIds().includes(row.internal_id);
  }

  protected isAllSelected(): boolean {
    const rows = this.rows();
    return rows.length > 0 && rows.every((row) => this.isSelected(row));
  }

  protected isSomeSelected(): boolean {
    return !this.isAllSelected() && this.selectedIds().length > 0;
  }

  protected toggleRow(row: TableCtrlRow): void {
    this.selectedIds.update((ids) =>
      ids.includes(row.internal_id)
        ? ids.filter((id) => id !== row.internal_id)
        : [...ids, row.internal_id],
    );
    this.onSelectionChanged();
  }

  protected toggleAll(checked: boolean): void {
    this.selectedIds.set(
      checked ? this.rows().map((row) => row.internal_id) : [],
    );
    this.onSelectionChanged();
  }

  protected onAddNewRow(): void {
    const newRow = this.columns().reduce<Record<string, unknown>>(
      (acc, col) => {
        acc[col.key] = null;
        return acc;
      },
      {},
    );
    this.commit([
      ...this.rows(),
      { ...newRow, internal_id: this.nextRowKey() },
    ]);
  }

  protected onDeleteRows(): void {
    const ids = this.selectedIds();
    this.commit(this.rows().filter((row) => !ids.includes(row.internal_id)));
    this.selectedIds.set([]);
  }

  protected isCellEditable(col: TableColumn): boolean {
    return (
      this.editionMode() === "cell" &&
      !this.isReadonly() &&
      !col.isCellEditionDisabled
    );
  }

  protected isCellEditing(row: TableCtrlRow, col: TableColumn): boolean {
    if (this.isReadonly() || col.isCellEditionDisabled) return false;
    if (this.editionMode() === "row") {
      return this.editingRowId() === row.internal_id;
    }
    const editing = this.editingCell();
    return editing?.id === row.internal_id && editing?.key === col.key;
  }

  protected onCellClicked(row: TableCtrlRow, col: TableColumn): void {
    if (this.isDisabled()) return;
    this.emitInteractionEvent("cellClicked", {
      row,
      index: this.indexOfRow(row),
    });
    if (!this.isCellEditable(col)) return;
    this.editingCell.set({ id: row.internal_id, key: col.key });
    this.emitInteractionEvent("cellEditInit");
  }

  protected saveCellValue(
    value: unknown,
    colKey: string,
    row: TableCtrlRow,
  ): void {
    this.editingCell.set(null);
    if (this.editionMode() !== "cell") return;
    const index = this.indexOfRow(row);
    if (index < 0) return;
    const newRows = this.rows().map((r, i) =>
      i === index ? { ...r, [colKey]: value } : r,
    );
    this.commit(newRows);
    this.emitInteractionEvent("cellEditComplete", {
      rowIndex: index,
      colKey,
      value,
    });
  }

  protected onRowEditInit(row: TableCtrlRow): void {
    this.clonedRow = { ...row };
    this.editingRowId.set(row.internal_id);
    this.emitInteractionEvent("rowEditInit", { row });
  }

  protected onRowEditSave(): void {
    this.clonedRow = null;
    this.editingRowId.set(null);
    this.control().setValue(this.rows());
    this.emitInteractionEvent("rowEditComplete", { value: this.rows() });
  }

  protected onRowEditCancel(): void {
    const cloned = this.clonedRow;
    this.clonedRow = null;
    this.editingRowId.set(null);
    if (!cloned) return;
    const newRows = this.rows().map((row) =>
      row.internal_id === cloned.internal_id ? cloned : row,
    );
    this.commit(newRows);
    this.emitInteractionEvent("rowEditCancel", {
      value: newRows,
      clonedRow: null,
    });
  }

  private onSelectionChanged(): void {
    this.emitInteractionEvent("rowsSelectionChange", {
      selectedRows: this.rows().filter((row) => this.isSelected(row)),
    });
  }

  private indexOfRow(row: TableCtrlRow): number {
    return this.rows().findIndex((r) => r.internal_id === row.internal_id);
  }

  private commit(newRows: TableCtrlRow[]): void {
    this.control().setValue(newRows);
    this.rows.set(newRows);
    this.control().markAsDirty();
  }

  private compareValues(a: unknown, b: unknown): number {
    if (a === b) return 0;
    if (a === null || a === undefined) return -1;
    if (b === null || b === undefined) return 1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() - b.getTime();
    }
    return String(a).localeCompare(String(b));
  }

  private nextRowKey(): number {
    return Date.now() + Math.random();
  }
}
