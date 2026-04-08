import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ConfirmationService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ListboxModule } from "primeng/listbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { CRUD_LABELS } from "../../../core/utils/i18n/crud-labels.token";
import { TableConfig } from "../../data-access/table-config.model";

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
  protected readonly labels = inject(CRUD_LABELS);

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
      message: this.labels.columnsViews.deleteConfirmation,
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
