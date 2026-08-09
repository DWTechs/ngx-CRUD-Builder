import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "@openng/optimus-ui/button";
import { InputText, InputTextModule } from "@openng/optimus-ui/inputtext";
import { ListboxModule } from "@openng/optimus-ui/listbox";
import { RadioButtonModule } from "@openng/optimus-ui/radiobutton";
import { ConfirmService } from "../../../../core/utils/confirm/confirm.service";
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
  encapsulation: ViewEncapsulation.None,
})
export class ColumnsViewsComponent {
  private readonly confirmService = inject(ConfirmService);
  protected readonly labels = inject(CRUD_LABELS);

  public readonly views = input.required<TableConfig[]>();

  public readonly deleteView = output<number>();
  public readonly addView = output<string>();
  public readonly renameView = output<{ id: number; name: string }>();
  public readonly viewSelected = output<number>();
  public readonly viewCreationClicked = output<void>();
  public readonly viewCreationDone = output<string | null>();

  private readonly nameInputElt = viewChild("name", { read: InputText });
  private readonly renameInputElt = viewChild("renameInput", {
    read: InputText,
  });

  public readonly activeViewId = computed(() => {
    return this.views().find((view) => view.isActive)?.id ?? null;
  });

  public isNewFieldDisplayed = false;
  public readonly renamingViewId = signal<number | null>(null);
  public readonly renamingViewName = signal("");

  public onSelectView(viewId: number): void {
    this.viewSelected.emit(viewId);
  }

  public onDeleteView(event: Event, viewId: number | null): void {
    event.stopPropagation();
    if (!viewId) {
      return;
    }
    this.confirmService.confirm({
      header: this.labels.columnsViews.deleteConfirmationHeader,
      message: this.labels.columnsViews.deleteConfirmation,
      accept: () => this.deleteView.emit(viewId),
    });
  }

  public startRenameView(event: Event, view: TableConfig): void {
    event.stopPropagation();
    this.renamingViewId.set(view.id as number);
    this.renamingViewName.set(view.name);
    setTimeout(() => {
      this.renameInputElt()?.el.nativeElement.focus();
    }, 0);
  }

  public cancelRename(): void {
    this.renamingViewId.set(null);
    this.renamingViewName.set("");
  }

  public submitRename(viewId: number | null | undefined): void {
    const name = this.renamingViewName().trim();
    if (name && viewId != null) {
      this.renameView.emit({ id: viewId, name });
    }
    this.renamingViewId.set(null);
    this.renamingViewName.set("");
  }

  public showNewViewField(): void {
    this.isNewFieldDisplayed = true;
    this.viewCreationClicked.emit();

    // Focus the input field after it has been displayed
    setTimeout(() => {
      this.nameInputElt()?.el.nativeElement.focus();
    }, 0);
  }

  public hideNewViewField(): void {
    this.isNewFieldDisplayed = false;
    this.viewCreationDone.emit(null);
  }

  public submitNewView(name?: string): void {
    if (name) {
      this.isNewFieldDisplayed = false;
      this.viewCreationDone.emit(name);
    }
  }
}
