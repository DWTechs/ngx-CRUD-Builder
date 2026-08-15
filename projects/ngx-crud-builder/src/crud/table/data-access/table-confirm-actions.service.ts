import { Injectable, inject } from "@angular/core";
import { ConfirmService } from "../../../core/utils/confirm/confirm.service";
import { CRUD_LABELS } from "../../core/utils/i18n/crud-labels.token";

/** Builds and displays the archive/restore confirmation dialog for the table. */
@Injectable({ providedIn: "root" })
export class TableConfirmActionsService {
  private readonly confirmService = inject(ConfirmService);
  private readonly labels = inject(CRUD_LABELS);

  public confirmArchive(count: number, onAccept: () => void): void {
    const message =
      count === 1
        ? this.labels.table.deleteConfirmationSingle
        : this.labels.table.deleteConfirmationMultiple(count);
    this.confirm(message, onAccept);
  }

  public confirmRestore(count: number, onAccept: () => void): void {
    const message =
      count === 1
        ? this.labels.table.restoreConfirmationSingle
        : this.labels.table.restoreConfirmationMultiple(count);
    this.confirm(message, onAccept);
  }

  private confirm(message: string, acceptFn: () => void): void {
    this.confirmService.confirm({
      message,
      header: this.labels.table.confirmationHeader,
      rejectLabel: this.labels.table.confirmationCancel,
      acceptLabel: this.labels.table.confirmationConfirm,
      accept: acceptFn,
    });
  }
}
