import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
} from "@angular/core";
import { CONTROL_TYPES } from "../../../../core/models/control-type.model";
import { TableCellComponent } from "../../../../core/ui/table-cell/table-cell.component";
import { CRUD_LABELS } from "../../../../core/utils/i18n/crud-labels.token";
import { crudItemToColumn } from "../../../../core/utils/table/crud-item-to-column";
import { TableColumn } from "../../../../core/utils/table/table-column.model";
import { TableFilterCellNativeComponent } from "../../../../table/ui/table-regular-native/table-filter-cell-native.component";
import {
  compareValues,
  isEmptyFilterValue,
  matchesFilters,
  NativeFilterMetadata,
  NativeTableFilters,
} from "../../../../table/utils/native-table-filters.model";
import { required } from "../../../utils/common.validators";
import { FormFieldBaseComponent } from "../../renderers-optimus-ui/form-field-base.component";

/** Row of the embedded table, tagged with a client-side key so edits survive re-sorting. */
type TableCtrlRow = Record<string, unknown> & { internal_id: number };

@Component({
  selector: "frm-native-table-control",
  templateUrl: "./native-table-control.component.html",
  styleUrls: [
    "../native-control.scss",
    "./native-table-control.component.scss",
  ],
  imports: [TableCellComponent, TableFilterCellNativeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeTableControlComponent extends FormFieldBaseComponent {
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

  protected readonly columnCount = computed(
    () =>
      this.columns().length +
      (this.isSelectable() ? 1 : 0) +
      (this.editionMode() === "row" ? 1 : 0),
  );

  protected readonly filters = signal<NativeTableFilters>({});

  protected readonly sortState = signal<{ field: string; order: 1 | -1 }>({
    field: "",
    order: 1,
  });

  protected readonly displayRows = computed<TableCtrlRow[]>(() => {
    const filters = this.filters();
    const rows =
      this.tableCtrlConfig().filterable && Object.keys(filters).length
        ? this.rows().filter((row) => matchesFilters(row, filters))
        : this.rows();
    const { field, order } = this.sortState();
    if (!this.tableCtrlConfig().sortable || !field) return rows;
    return [...rows].sort((a, b) => compareValues(a[field], b[field]) * order);
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

  protected sortIcon(col: TableColumn): string {
    const { field, order } = this.sortState();
    if (field !== col.key) return "↕";
    return order === -1 ? "↓" : "↑";
  }

  /** Cycles ascending → descending → unsorted */
  protected onSortClick(col: TableColumn): void {
    if (!this.isColSortable(col)) return;
    const { field, order } = this.sortState();
    if (field !== col.key) {
      this.sortState.set({ field: col.key, order: 1 });
    } else if (order === 1) {
      this.sortState.set({ field: col.key, order: -1 });
    } else {
      this.sortState.set({ field: "", order: 1 });
    }
  }

  protected onFilterChanged(
    col: TableColumn,
    meta: NativeFilterMetadata,
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

  /** In **row** mode the edited row is mutated in place and committed on save */
  protected onCellValueChanged(
    row: TableCtrlRow,
    col: TableColumn,
    value: unknown,
  ): void {
    if (this.editionMode() === "row") {
      row[col.key] = value;
      return;
    }
    this.saveCellValue(value, col.key, row);
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

  protected parseCellValue(col: TableColumn, raw: string): unknown {
    if (raw === "") return null;
    return col.type === "number" ? Number(raw) : raw;
  }

  protected optionValue(col: TableColumn, index: string): unknown {
    return index === "" ? null : (col.options ?? [])[Number(index)]?.value;
  }

  protected pickedOptionValues(col: TableColumn, event: Event): unknown[] {
    const options = col.options ?? [];
    return Array.from((event.target as HTMLSelectElement).selectedOptions).map(
      (opt) => options[Number(opt.value)]?.value,
    );
  }

  protected isOptionSelected(
    row: TableCtrlRow,
    col: TableColumn,
    value: unknown,
  ): boolean {
    const cell = row[col.key];
    return Array.isArray(cell) ? cell.includes(value) : cell === value;
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
    this.control().markAsDirty();
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

  private nextRowKey(): number {
    return Date.now() + Math.random();
  }
}
