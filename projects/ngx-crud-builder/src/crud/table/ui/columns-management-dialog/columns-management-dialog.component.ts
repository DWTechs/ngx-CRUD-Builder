import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  model,
  output,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { isArray } from "@dwtechs/checkard";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { CRUD_LABELS } from "../../../core/utils/i18n/crud-labels.token";
import { TableColumn } from "../../../core/utils/table/table-column.model";
import { ExtendedTableConfig } from "../../data-access/table-config.model";
import { ColumnsManagementComponent } from "../columns-management/columns-management.component";
import { ColumnsViewsComponent } from "../columns-views/columns-views.component";

@Component({
  selector: "tbl-columns-management-dialog",
  templateUrl: "./columns-management-dialog.component.html",
  styleUrls: ["./columns-management-dialog.component.scss"],
  imports: [
    DialogModule,
    ButtonModule,
    ColumnsManagementComponent,
    ColumnsViewsComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColumnsManagementDialogComponent {
  protected readonly labels = inject(CRUD_LABELS);
  public readonly views = input.required<ExtendedTableConfig[]>();
  public readonly isPreferencesModeEnabled = input.required<boolean>();
  public readonly visible = model(false);

  public readonly closed = output();
  public readonly viewCreated = output<ExtendedTableConfig>();
  public readonly viewsUpdated = output<ExtendedTableConfig[]>();
  public readonly viewDeleted = output<number>();

  public readonly editedViews = linkedSignal(() => this.views());
  public readonly activeView = computed(
    () =>
      this.editedViews().find((view) => view.isActive) ?? this.editedViews()[0],
  );
  private readonly localColumns = linkedSignal<TableColumn[]>(
    () => this.activeView().columns,
  );

  // Ensures that there is always an active view
  protected readonly alwaysKeepActiveView = effect(() => {
    this.editedViews.update((views) => this.ensureActiveView(views));
  });

  public readonly isViewCreation = signal(false);

  public onSelectView(viewId: number): void {
    if (!this.editedViews().find((v) => v.id === viewId)) return;
    // Save current columns state in the active view before switching
    this.setColumnsInView(this.activeView().id as number, this.localColumns());
    // Set new active view
    this.editedViews.update((views) =>
      views.map((v) => ({ ...v, isActive: v.id === viewId })),
    );
  }

  public onSelectedColumnsKeysChange(selectedColumnsKeys: string[]): void {
    const columns = this.localColumns().map((col) => {
      return { ...col, isVisible: selectedColumnsKeys.includes(col.key) };
    });
    this.localColumns.set(columns);
  }

  public onColumnsReordered(event: CdkDragDrop<string[]>): void {
    const columns = [...this.localColumns()];
    moveItemInArray(columns, event.previousIndex, event.currentIndex);
    this.localColumns.set(columns);
  }

  public onDeleteView(viewId: number): void {
    const target = this.editedViews().find((v) => v.id === viewId);
    if (!target) return;

    this.editedViews.update((views) => views.filter((v) => v.id !== viewId));

    // Views that were created but never saved only exist client-side, so
    // there is nothing to delete on the backend.
    if (!target.isCreation) {
      this.viewDeleted.emit(viewId);
    }
  }

  public onViewCreationDone(name: string | null): void {
    this.isViewCreation.set(false);
    if (name) {
      this.onCreateView(name);
    }
  }

  public onCreateView(name: string): void {
    const activeView = this.activeView();
    const conf = isArray(activeView.conf, ">", 0)
      ? activeView.conf
      : activeView.columns.map((col) => ({
          key: col.key,
          isVisible: col.isVisible,
          defaultWidth: col.defaultWidth,
        }));
    const newView: ExtendedTableConfig = {
      id: Date.now(),
      name,
      isActive: true,
      columns: activeView.columns,
      conf,
      component: activeView.component,
      locked: false,
      isCreation: true,
    };
    const currentViews = this.editedViews().map((v) => ({
      ...v,
      isActive: false,
    }));
    this.editedViews.update(() => [...currentViews, newView]);
    this.viewCreated.emit(newView);
  }

  public onSaved(): void {
    this.setColumnsInView(this.activeView().id as number, this.localColumns());
    this.viewsUpdated.emit(this.editedViews().filter((v) => !v.isCreation));
    this.closed.emit();
  }

  public onCancel(): void {
    this.closed.emit();
  }

  private ensureActiveView(
    views: ExtendedTableConfig[],
  ): ExtendedTableConfig[] {
    const hasActiveView = views.some((view) => view.isActive);
    if (!hasActiveView && views.length > 0) {
      const firstView = views[0];
      if (firstView) {
        return views.map((view) => ({
          ...view,
          isActive: view.id === firstView.id,
        }));
      }
    }

    return views;
  }

  private setColumnsInView(viewId: number, columns: TableColumn[]): void {
    const conf = columns.map((col) => ({
      key: col.key,
      isVisible: col.isVisible,
      defaultWidth: col.defaultWidth,
    }));
    this.editedViews.update((views) => {
      return views.map((v) => {
        if (v.id === viewId) {
          return {
            ...v,
            columns,
            conf,
          };
        }
        return v;
      });
    });
  }
}
