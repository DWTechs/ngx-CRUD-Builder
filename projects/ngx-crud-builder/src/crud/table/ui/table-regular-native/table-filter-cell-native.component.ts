import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output,
} from "@angular/core";
import { CONTROL_TYPES } from "../../../core/models/control-type.model";
import { CRUD_LABELS } from "../../../core/utils/i18n/crud-labels.token";
import { TableColumn } from "../../../core/utils/table/table-column.model";
import {
  filterMatchMode,
  NativeFilterMetadata,
} from "../../utils/native-table-filters.model";

/**
 * Plain HTML equivalent of the Optimus UI basic filter row cell.
 *
 * Renders the filter widget matching `col.filterType` and emits the resulting
 * `{ value, matchMode }` pair; applying it is left to the host table.
 */
@Component({
  selector: "crd-table-filter-cell-native",
  template: `
    @switch (col().filterType) {
      @case (ControlType.DATE) {
        <div class="date-range">
          <input
            type="date"
            [value]="dateFrom()"
            (change)="emitRange($any($event.target).value, dateTo())"
          />
          <input
            type="date"
            [value]="dateTo()"
            (change)="emitRange(dateFrom(), $any($event.target).value)"
          />
        </div>
      }
      @case (ControlType.CHECKBOX) {
        <select (change)="emitFromSelect($any($event.target).value)">
          <option value="" [selected]="value() === null || value() === undefined">---</option>
          <option value="true" [selected]="value() === true">{{ labels.checkbox.yes }}</option>
          <option value="false" [selected]="value() === false">{{ labels.checkbox.no }}</option>
        </select>
      }
      @case (ControlType.SELECT) {
        <select (change)="emitFromOptionIndex($any($event.target).value)">
          <option value="" [selected]="value() === null || value() === undefined">---</option>
          @for (option of options(); track option.value) {
            <option [value]="$index" [selected]="value() === option.value">{{ option.label }}</option>
          }
        </select>
      }
      @case (ControlType.MULTISELECT) {
        <select multiple size="2" (change)="emitFromMultiSelect($event)">
          @for (option of options(); track option.value) {
            <option [value]="$index" [selected]="isPicked(option.value)">{{ option.label }}</option>
          }
        </select>
      }
      @case (ControlType.FILES) {
        <!-- no filter widget for file columns -->
      }
      @default {
        <input
          [type]="isNumberColumn() ? 'number' : 'text'"
          [value]="value() ?? ''"
          (input)="emitFromInput($any($event.target).value)"
        />
      }
    }
  `,
  styleUrls: [
    "../../../form/ui/renderers-native/native-control.scss",
    "./table-filter-cell-native.component.scss",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableFilterCellNativeComponent {
  protected readonly labels = inject(CRUD_LABELS);
  protected readonly ControlType = CONTROL_TYPES;

  public readonly col = input.required<TableColumn>();
  public readonly value = input<unknown>(null);

  public readonly filterChanged = output<NativeFilterMetadata>();

  protected readonly options = computed(() => this.col().options ?? []);

  protected readonly isNumberColumn = computed(
    () =>
      this.col().filterType === CONTROL_TYPES.INPUT &&
      this.col().type === "number",
  );

  protected readonly dateFrom = linkedSignal(() => this.dateRange()[0]);
  protected readonly dateTo = linkedSignal(() => this.dateRange()[1]);

  protected isPicked(optionValue: unknown): boolean {
    const value = this.value();
    return Array.isArray(value) && value.includes(optionValue);
  }

  protected emitFromInput(raw: string): void {
    if (this.isNumberColumn()) {
      this.emit(raw === "" ? null : Number(raw));
      return;
    }
    this.emit(raw === "" ? null : raw);
  }

  protected emitFromSelect(raw: string): void {
    this.emit(raw === "" ? null : raw === "true");
  }

  /** `<option value>` holds the option index, since DOM values are always strings */
  protected emitFromOptionIndex(raw: string): void {
    this.emit(raw === "" ? null : this.options()[Number(raw)]?.value);
  }

  protected emitFromMultiSelect(event: Event): void {
    const picked = Array.from(
      (event.target as HTMLSelectElement).selectedOptions,
    ).map((opt) => this.options()[Number(opt.value)]?.value);
    this.emit(picked.length ? picked : null);
  }

  protected emitRange(from: string, to: string): void {
    this.dateFrom.set(from);
    this.dateTo.set(to);
    this.emit(from ? [new Date(from), to ? new Date(to) : null] : null);
  }

  private emit(value: unknown): void {
    this.filterChanged.emit({ value, matchMode: filterMatchMode(this.col()) });
  }

  private dateRange(): [string, string] {
    const value = this.value();
    if (!Array.isArray(value)) return ["", ""];
    return [this.toIsoDate(value[0]), this.toIsoDate(value[1])];
  }

  private toIsoDate(value: unknown): string {
    if (!value) return "";
    const date = value instanceof Date ? value : new Date(value as string);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
  }
}
