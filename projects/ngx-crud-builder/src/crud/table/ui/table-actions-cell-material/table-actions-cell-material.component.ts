import { Component, inject, input, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CRUD_LABELS } from "../../../core/utils/i18n/crud-labels.token";
import { CrudFeatures } from "../../../core/utils/table/crud-loader.class";

@Component({
  selector: "tbl-table-actions-cell-material",
  templateUrl: "./table-actions-cell-material.component.html",
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
})
export class TableActionsCellMaterialComponent {
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
