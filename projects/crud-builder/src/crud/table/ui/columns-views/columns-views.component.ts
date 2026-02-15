import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TableConfig } from "@table/data-access/table-config.model";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ListboxModule } from "primeng/listbox";
import { RadioButtonModule } from "primeng/radiobutton";

const deleteConfirmationMessage = $localize`:@@Table_ColumnsViews_DeleteConfirmationMessage:Êtes-vous sûr de vouloir supprimer cette vue ?`;

@Component({
  selector: "tbl-columns-views",
  templateUrl: "./columns-views.component.html",
  styleUrls: ["./columns-views.component.scss"],
  imports: [
    RadioButtonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ListboxModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnsViewsComponent {
  private readonly confirmationService = inject(ConfirmationService);

  public readonly views = input.required<TableConfig[]>();

  public readonly deleteView = output<number>();
  public readonly addView = output<string>();
  public readonly viewSelected = output<number>();
  public readonly viewCreationClicked = output<void>();
  public readonly viewCreationDone = output<void>();

  public readonly activeViewId = computed(() => {
    return this.views().find((view) => view.isActive)?.id ?? null;
  });

  public isNewFieldDisplayed = false;

  public onSelectView(viewId: number): void {
    this.viewSelected.emit(viewId);
  }

  public onDeleteView(event: Event, viewId: number | null): void {
    event.stopPropagation();
    if (!viewId) {
      return;
    }
    this.confirmationService.confirm({
      message: deleteConfirmationMessage,
      accept: () => this.deleteView.emit(viewId),
    });
  }

  public showNewViewField(): void {
    this.isNewFieldDisplayed = true;
    this.viewCreationClicked.emit();
  }

  public hideNewViewField(): void {
    this.isNewFieldDisplayed = false;
    this.viewCreationDone.emit();
  }

  public submitNewView(name?: string): void {
    if (name) {
      this.hideNewViewField();
      this.addView.emit(name);
    }
  }
}
