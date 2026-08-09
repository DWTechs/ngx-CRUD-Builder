import { DatePipe } from "@angular/common";
import {
  Component,
  effect,
  inject,
  input,
  output,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { SharedModule } from "@openng/optimus-ui/api";
import { ButtonModule } from "@openng/optimus-ui/button";
import { TableModule } from "@openng/optimus-ui/table";
import { CrudItemOptions } from "../../models/crud-item-options.model";
import { isEqual } from "../../utils/arrays/is-equal.utils";
import { DATE_WITH_SECONDS_FORMAT } from "../../utils/dates/dates.utils";
import { CRUD_LABELS } from "../../utils/i18n/crud-labels.token";
import { TableCellComponent } from "../table-cell/table-cell.component";
import { FullHistoryRow, HistorizedData } from "./history.model";

@Component({
  selector: "crd-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"],
  imports: [
    TableModule,
    SharedModule,
    DatePipe,
    ButtonModule,
    TableCellComponent,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HistoryComponent<TData> {
  protected readonly labels = inject(CRUD_LABELS);
  public readonly data = input.required<{
    rows: HistorizedData<TData>[];
    total: number | undefined;
  } | null>();

  public readonly config = input.required<CrudItemOptions[]>();
  public readonly showOldValue = input(false);

  public readonly selected = output<HistorizedData<TData>>();

  public readonly rows = signal<FullHistoryRow<TData>[]>([]);
  public readonly selectedDate = signal<string | null>(null);

  public readonly dateFormat = DATE_WITH_SECONDS_FORMAT;

  public expandedRows: Record<string, boolean> = {};

  // Build the history table when the data is set, and set the selected date to the most recent entry
  // this effects will be destroyed after the first run, since we only want to set the rows and selected date once
  protected readonly setRowsEffect = effect(
    () => {
      const historyData = this.buildHistoryTable();
      this.selectedDate.set(historyData[0]?.tstamp ?? null);
      this.rows.set(historyData);
      this.setRowsEffect.destroy();
    },
    { manualCleanup: true },
  );

  public showVersion(entry: HistorizedData<TData>) {
    this.selectedDate.set(entry.tstamp);
    this.selected.emit(entry);
  }

  private buildHistoryTable() {
    const rows = [...(this.data()?.rows ?? [])].sort(
      (a, b) => new Date(b.tstamp).getTime() - new Date(a.tstamp).getTime(),
    );
    return rows.map((row, rowIndex) => {
      const currentRow = row.record;
      const lastRow = rows[rowIndex + 1]?.record;
      const changes = [];
      for (const confItem of this.config()) {
        const change = this.buildChangesTable(
          confItem.key as keyof TData,
          currentRow,
          lastRow,
        );
        if (change) {
          changes.push(change);
        }
      }
      return { ...row, changes };
    });
  }

  private buildChangesTable(
    propKey: keyof TData,
    currentRow: TData,
    lastRow: TData,
  ): FullHistoryRow<TData>["changes"][number] | null {
    const confItem = this.config().find((c) => c.key === propKey);
    const isHidden = confItem?.controlOptions?.hidden;
    if (!isHidden && confItem) {
      const label = confItem.label;
      const newValue = currentRow[propKey];
      const oldValue = lastRow ? lastRow[propKey] : undefined;
      return {
        propKey,
        label,
        oldValue,
        newValue,
        hasChanged: !isEqual(oldValue, newValue),
        confItem,
      };
    }
    return null;
  }
}
