import { inject, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { ColumnResizeEvent } from "@crud/table/utils/views/table-config.model";
import {
  combineLatest,
  filter,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from "rxjs";
import { CrudItemOptions } from "../../../core/models/crud-item-options.model";
import { Rows } from "../../../core/utils/crud-service/dto.model";
import { CRUD_LABELS } from "../../../core/utils/i18n/crud-labels.token";
import { crudItemToColumn } from "../../../core/utils/table/crud-item-to-column";
import { TableColumn } from "../../../core/utils/table/table-column.model";
import {
  ColumnConfig,
  ExtendedTableConfig,
  TableConfig,
} from "../../data-access/table-config.model";
import { TableConfigService } from "../../data-access/table-config.service";
import { LocalTableColumnsStorage } from "./local-table-columns.storage";

@Injectable()
export class TableColumnsStorage {
  private readonly preferencesService = inject(TableConfigService);
  private readonly localTableColumnsStorage = inject(LocalTableColumnsStorage);
  private readonly labels = inject(CRUD_LABELS);

  /**
   * When the service is init, we need to get the views
   * Then we need to compute the full column config for each view
   * Finally we need to know which view is the active view
   * Now we can expose "columns" to the table
   */

  private readonly baseCrudItems = signal<CrudItemOptions[]>([]);
  private readonly componentId = signal<string | null>(null);
  private readonly isViewSystemEnabled = signal<boolean>(true);

  private readonly views$: Observable<TableConfig[]> = combineLatest([
    toObservable(this.componentId),
    toObservable(this.baseCrudItems),
  ]).pipe(
    map(([componentId]) => componentId),
    filter((componentId): componentId is string => !!componentId),
    switchMap((componentId) => this.getMany(componentId)),
    takeUntilDestroyed(),
  );

  private readonly viewsWithColumns$: Observable<ExtendedTableConfig[]> =
    this.views$.pipe(
      map((views) => this.getViewsWithColumns(views)),
      tap((viewsWithColumns) => {
        this.viewsWithColumns.set(viewsWithColumns);
        const activeView = viewsWithColumns.find((view) => view.isActive);
        this.activeColumns.set(activeView ? activeView.columns : []);
      }),
    );

  /**
   * Exposed signals
   */

  public readonly viewsWithColumns = signal<ExtendedTableConfig[] | null>(null);
  public readonly activeColumns = signal<TableColumn[]>([]);

  /**
   * Initialize the table views service
   * @param componentId {string} Component identifier to query and post stored configurations
   * @param baseCrudItems {CrudItemOptions[]} Base columns configuration from CRUD definition
   * @param isViewSystemEnabled {boolean} Whether the view system is enabled or not
   * This method must be called by the table component in order to initialize the columns
   */
  public init(
    componentId: string,
    baseCrudItems: CrudItemOptions[],
    isViewSystemEnabled: boolean,
  ) {
    this.componentId.set(componentId);
    this.baseCrudItems.set(baseCrudItems);
    this.isViewSystemEnabled.set(isViewSystemEnabled);

    this.viewsWithColumns$.subscribe();
  }

  /*** Backend communication ***/

  /** Called when a single column is resized */
  public updateOne(updatedColumn: ColumnResizeEvent) {
    const componentViews = this.viewsWithColumns()?.map((view) => {
      if (view.isActive) {
        const updatedConf: ColumnConfig[] = view.conf.map((col) =>
          col.key === updatedColumn.colKey
            ? { ...col, defaultWidth: `${updatedColumn.newWidthPx}px` }
            : col,
        );
        return { ...view, conf: updatedConf };
      }
      return view;
    });
    if (!componentViews) {
      return of([]);
    }
    return this.updateMany(componentViews);
  }

  public updateMany(views: ExtendedTableConfig[]) {
    const componentId = this.componentId();
    if (!componentId) return of([]);
    const defaultView = views[0];
    if (!this.isViewSystemEnabled() && defaultView) {
      this.localTableColumnsStorage.set(componentId, defaultView.columns);
      this.activeColumns.set(defaultView.columns);
      return of(views);
    }
    const cleanViews = views.map((view) => ({
      ...view,
      id: view.isCreation || view.id === null ? undefined : view.id,
      isCreation: undefined,
      columns: undefined,
    }));
    return this.preferencesService
      .updateMany(componentId, cleanViews)
      .pipe(switchMap(() => this.viewsWithColumns$));
  }

  /** Creates a single view on the backend */
  public createView(
    view: ExtendedTableConfig,
  ): Observable<Rows<TableConfig> | null> {
    const componentId = this.componentId();
    if (!componentId) return of(null);
    const { columns: _columns, isCreation: _isCreation, ...cleanView } = view;
    return this.preferencesService
      .createOne(componentId, { ...cleanView, id: undefined })
      .pipe(
        tap((res) => {
          const createdView = res.rows[0];
          if (!createdView) return;
          this.viewsWithColumns.update((views) => {
            if (!views) return null;
            const idx = views.findIndex((v) => v.id === view.id);
            if (idx !== -1) {
              // Replace the temporary fake id with the real id from the backend,
              // and deactivate all other views so the new one stays active.
              return views.map((v) =>
                v.id === view.id
                  ? { ...v, id: createdView.id, isCreation: undefined }
                  : { ...v, isActive: false },
              );
            }
            // The view was created locally in the dialog and was never added to
            // viewsWithColumns. Append it now with the real id from the backend,
            // and deactivate all other views so the new one stays active.
            return [
              ...views.map((v) => ({ ...v, isActive: false })),
              { ...view, id: createdView.id, isCreation: undefined },
            ];
          });
        }),
      );
  }

  /** Called immediately when the user confirms deleting a view, independently of Save */
  public deleteView(viewId: number) {
    const componentId = this.componentId();
    if (!componentId) return of([]);

    const deleteOne = this.preferencesService.deleteOne;
    if (typeof deleteOne !== "function") {
      return of([]);
    }

    return deleteOne
      .call(this.preferencesService, componentId, viewId)
      .pipe(switchMap(() => this.viewsWithColumns$));
  }

  private getMany(componentId: string): Observable<TableConfig[]> {
    if (!this.isViewSystemEnabled()) {
      return of([]);
    }
    return this.preferencesService.getViews(componentId);
  }

  /**
   * Full columns computation
   */
  private getViewsWithColumns(views: TableConfig[]): ExtendedTableConfig[] {
    const baseCrudItems = this.baseCrudItems();
    if (!baseCrudItems) {
      return [];
    }
    const componentId = this.componentId();
    if (!componentId) {
      return [];
    }
    // Retrieve local storage config if view system is disabled

    const localConfig = this.localTableColumnsStorage.getColumns(
      componentId,
      baseCrudItems,
    );
    const columns = this.getOrderedColumns(baseCrudItems, localConfig);
    this.activeColumns.set(columns);
    const defaultView = {
      ...new TableConfig(componentId, this.labels.table.defaultViewName),
      columns,
      isActive: true,
    };

    if (!this.isViewSystemEnabled()) {
      return [defaultView];
    }
    if (views.length === 0) {
      return [{ ...defaultView, locked: true }];
    }
    // Otherwise, the config will come from the view preferences
    const userViews: ExtendedTableConfig[] = views
      .toSorted((a, b) => a.name.localeCompare(b.name))
      .map((view) => {
        const userConf = view.conf ?? [];
        const isObsoleteConf = userConf.length !== baseCrudItems.length;
        const columns: TableColumn[] = isObsoleteConf
          ? baseCrudItems.map((item) => crudItemToColumn(item, userConf))
          : this.getOrderedColumns(baseCrudItems, userConf);
        return {
          ...view,
          columns,
        };
      });
    return userViews;
  }

  private getOrderedColumns(
    baseColumns: CrudItemOptions[],
    userConfig: ColumnConfig[],
  ): TableColumn[] {
    return userConfig
      .map((col) => {
        const fullColumn = baseColumns.find(
          // biome-ignore lint/suspicious/noDoubleEquals: key may be number or string
          (colConfig) => colConfig.key == col.key,
        );
        if (!fullColumn) {
          return null;
        }
        return crudItemToColumn(fullColumn, userConfig);
      })
      .filter((col): col is TableColumn => col !== null);
  }
}
