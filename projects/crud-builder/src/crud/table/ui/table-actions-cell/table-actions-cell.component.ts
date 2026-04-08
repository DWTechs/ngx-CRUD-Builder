import { Component, inject, input, output } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { CRUD_LABELS } from "../../../core/utils/i18n/crud-labels.token";
import { CrudFeatures } from "../../../core/utils/table/crud-loader.class";

@Component({
  selector: "tbl-table-actions-cell",
  templateUrl: "./table-actions-cell.component.html",
  styleUrls: ["./table-actions-cell.component.scss"],
  imports: [ButtonModule, TooltipModule],
})
export class TableActionsCellComponent {
  protected readonly labels = inject(CRUD_LABELS);
  readonly features = input.required<CrudFeatures>();

  readonly editClicked = output();
  readonly deleteClicked = output();

  public onEdit(): void {
    this.editClicked.emit();
  }

  public onDelete(): void {
    this.deleteClicked.emit();
  }
}
