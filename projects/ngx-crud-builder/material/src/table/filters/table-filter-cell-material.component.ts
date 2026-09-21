import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output,
} from "@angular/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import {
  CONTROL_TYPES,
  CRUD_LABELS,
  TableColumn,
} from "@dwtechs/ngx-crud-builder";
import { filterMatchMode, MaterialFilterMetadata } from "./table-filters.model";

/**
 * Angular Material equivalent of the Optimus UI basic filter row cell.
 *
 * Renders the filter widget matching `col.filterType` and emits the resulting
 * `{ value, matchMode }` pair; applying it is left to the host table.
 */
@Component({
  selector: "crd-table-filter-cell-material",
  template: `
    @switch (col().filterType) {
      @case (ControlType.DATE) {
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-date-range-input [rangePicker]="picker">
            <input
              matStartDate
              [value]="dateFrom()"
              (dateChange)="emitRange($event.value, dateTo())" />
            <input
              matEndDate
              [value]="dateTo()"
              (dateChange)="emitRange(dateFrom(), $event.value)" />
          </mat-date-range-input>
          <mat-datepicker-toggle matIconSuffix [for]="picker" />
          <mat-date-range-picker #picker />
        </mat-form-field>
      }
      @case (ControlType.CHECKBOX) {
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-select [value]="value()" (selectionChange)="emit($event.value)">
            <mat-option [value]="null">---</mat-option>
            <mat-option [value]="true">{{ labels.checkbox.yes }}</mat-option>
            <mat-option [value]="false">{{ labels.checkbox.no }}</mat-option>
          </mat-select>
        </mat-form-field>
      }
      @case (ControlType.SELECT) {
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-select [value]="value()" (selectionChange)="emit($event.value)">
            <mat-option [value]="null">---</mat-option>
            @for (option of options(); track option.value) {
              <mat-option [value]="option.value">{{ option.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      }
      @case (ControlType.MULTISELECT) {
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <mat-select
            multiple
            [value]="multiValue()"
            (selectionChange)="emit($event.value)">
            @for (option of options(); track option.value) {
              <mat-option [value]="option.value">{{ option.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      }
      @case (ControlType.FILES) {
        <!-- no filter widget for file columns -->
      }
      @default {
        <mat-form-field appearance="outline" subscriptSizing="dynamic">
          <input
            matInput
            [type]="isNumberColumn() ? 'number' : 'text'"
            [value]="value() ?? ''"
            (input)="emitFromInput($any($event.target).value)" />
        </mat-form-field>
      }
    }
  `,
  styles: `
    /* Material density -5, so the filter row stays close to a single line of text */
    :host {
      display: block;
      width: 100%;
      --mat-form-field-container-height: 32px;
      --mat-form-field-container-vertical-padding: 6px;
    }
    mat-form-field {
      width: 100%;
      font-size: 13px;
    }
    :host ::ng-deep .mat-mdc-form-field-icon-suffix .mat-mdc-icon-button {
      width: 32px;
      height: 32px;
      padding: 4px;
    }
    :host ::ng-deep .mat-mdc-form-field-icon-suffix .mat-mdc-icon-button svg {
      width: 20px;
      height: 20px;
    }
  `,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableFilterCellMaterialComponent {
  protected readonly labels = inject(CRUD_LABELS);
  protected readonly ControlType = CONTROL_TYPES;

  public readonly col = input.required<TableColumn>();
  public readonly value = input<unknown>(null);

  public readonly filterChanged = output<MaterialFilterMetadata>();

  protected readonly options = computed(() => this.col().options ?? []);

  protected readonly isNumberColumn = computed(
    () =>
      this.col().filterType === CONTROL_TYPES.INPUT &&
      this.col().type === "number",
  );

  protected readonly multiValue = linkedSignal<unknown[]>(() => {
    const value = this.value();
    return Array.isArray(value) ? value : [];
  });

  protected readonly dateFrom = linkedSignal<Date | null>(
    () => this.dateRange()[0],
  );
  protected readonly dateTo = linkedSignal<Date | null>(
    () => this.dateRange()[1],
  );

  protected emit(value: unknown): void {
    this.filterChanged.emit({
      value,
      matchMode: filterMatchMode(this.col()),
    });
  }

  protected emitFromInput(raw: string): void {
    if (this.isNumberColumn()) {
      this.emit(raw === "" ? null : Number(raw));
      return;
    }
    this.emit(raw === "" ? null : raw);
  }

  protected emitRange(from: Date | null, to: Date | null): void {
    this.dateFrom.set(from);
    this.dateTo.set(to);
    this.emit(from ? [from, to] : null);
  }

  private dateRange(): [Date | null, Date | null] {
    const value = this.value();
    return Array.isArray(value)
      ? [(value[0] as Date) ?? null, (value[1] as Date) ?? null]
      : [null, null];
  }
}
