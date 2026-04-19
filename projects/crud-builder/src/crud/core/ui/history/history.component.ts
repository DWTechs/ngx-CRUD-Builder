import { DatePipe } from "@angular/common";
import {
  Component,
  computed,
  inject,
  input,
  output,
  ViewEncapsulation,
} from "@angular/core";
import { SharedModule } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { CrudItemOptions } from "../../models/crud-item-options.model";
import { isEqual } from "../../utils/arrays/is-equal.utils";
import { DATE_WITH_SECONDS_FORMAT } from "../../utils/dates/dates.utils";
import { CRUD_LABELS } from "../../utils/i18n/crud-labels.token";
import { FullHistoryRow, HistorizedData } from "./history.model";

@Component({
  selector: "crd-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"],
  imports: [TableModule, SharedModule, DatePipe, ButtonModule],
  encapsulation: ViewEncapsulation.None,
})
export class HistoryComponent<TData> {
  protected readonly labels = inject(CRUD_LABELS);
  public readonly data = input.required<{
    rows: HistorizedData<TData>[];
    total: number | undefined;
  } | null>();

  public readonly config = input.required<CrudItemOptions[]>();

  public readonly rows = computed<FullHistoryRow<TData>[]>(() =>
    this.buildHistoryTable(),
  );

  public readonly selected = output<HistorizedData<TData>>();

  public readonly showOldValue = input(false);

  public readonly dateFormat = DATE_WITH_SECONDS_FORMAT;
  public selectedDate: string | null = null;

  public expandedRows: Record<string, boolean> = {};

  public showVersion(entry: HistorizedData<TData>) {
    this.selectedDate = entry.tstamp;
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
      for (const propKey in currentRow) {
        const change = this.buildChangesTable(
          propKey as keyof TData,
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
      };
    }
    return null;
  }
}
