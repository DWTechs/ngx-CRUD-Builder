import { NgComponentOutlet } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  linkedSignal,
  OnChanges,
  OnInit,
  output,
  signal,
  SimpleChanges,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ValidatorFn } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { isArray } from "@dwtechs/checkard";
import { TableLazyLoadEvent } from "primeng/table";
import { debounceTime, Subject, switchMap } from "rxjs";
import { ConfirmService } from "../../core/utils/confirm/confirm.service";
import { SnackbarService } from "../../core/utils/snackbar/snackbar.service";
import { CONTROL_TYPES } from "../core/models/control-type.model";
import { CrudItemBase } from "../core/models/crud-item-base.class";
import { CrudItemFactory } from "../core/models/crud-item-factory.model";
import { CrudItemOptions } from "../core/models/crud-item-options.model";
import { CrdConfirmComponent } from "../core/ui/crd-confirm/crd-confirm.component";
import { CrdProgressComponent } from "../core/ui/crd-progress/crd-progress.component";
import { CrdToastComponent } from "../core/ui/crd-toast/crd-toast.component";
import { EditionDialogComponent } from "../core/ui/edition-dialog/edition-dialog.component";
import { isEqual } from "../core/utils/arrays/is-equal.utils";
import { Calls } from "../core/utils/crud-service/crud.model";
import { CRUD_LABELS } from "../core/utils/i18n/crud-labels.token";
import { TableLoadingService } from "../core/utils/loading/table-loading.service";
import { CrudLoader } from "../core/utils/table/crud-loader.class";
import { ExcelExportMode } from "../core/utils/table/export-mode.model";
import { FilterLevel } from "../core/utils/table/filter-level.model";
import { TableStateService } from "../core/utils/table/table-state.service";
import { FORM_ADAPTER } from "../form/ui/field-renderer/provide-form-field-renderer";
import { FileInfo } from "../form/ui/renderers-primeng/file-upload-input/file-info.class";
import { LabelStrategy } from "../form/utils/label-strategy.model";
import { TableConfigService } from "../table/data-access/table-config.service";
import { ExtendedTableConfig } from "./data-access/table-config.model";
import { ColumnsManagementDialogComponent } from "./ui/columns-management-dialog/columns-management-dialog.component";
import type { TableRegularComponent } from "./ui/table-regular/table-regular.component";
import { TABLE_RENDERER } from "./ui/table-renderer/table-renderer.token";
import { TableToolbarComponent } from "./ui/table-toolbar/table-toolbar.component";
import { ExportOptions, ExportService } from "./utils/excel/export.service";
import { cleanFilters } from "./utils/filters/clean-filters.utils";
import {
  applyDefaultFilters,
  getFilters,
} from "./utils/filters/primeng-filters.builder";
import {
  applyDefaultSort,
  getDefaultSort,
} from "./utils/sort/primeng-sort.builder";
import { TableColumnsStorage } from "./utils/views/table-columns.storage";
import { ColumnResizeEvent } from "./utils/views/table-config.model";

const MIN_PAGE = 1;

/** Resolves the `TABLE_RENDERER` shell, throwing an adapter-aware error when missing
 * (e.g. `provideFormFieldRenderer('material')` was used without a matching table shell). */
function resolveTableRenderer() {
  const tableRenderer = inject(TABLE_RENDERER, { optional: true });
  if (tableRenderer) return tableRenderer;
  const formAdapter = inject(FORM_ADAPTER, { optional: true });
  if (formAdapter && formAdapter !== "primeng") {
    throw new Error(
      `No table available for the '${formAdapter}' adapter (WIP). Provide provideTableRenderer('primeng') to render the table with the PrimeNG shell.`,
    );
  }
  throw new Error(
    "No table renderer provided. Use provideTableRenderer('primeng') or provideCrudRenderer('primeng').",
  );
}

@Component({
  selector: "tbl-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
  providers: [
    CrudLoader,
    TableColumnsStorage,
    TableConfigService,
    TableStateService,
    ExportService,
  ],
  imports: [
    TableToolbarComponent,
    NgComponentOutlet,
    ColumnsManagementDialogComponent,
    EditionDialogComponent,
    CrdProgressComponent,
    CrdConfirmComponent,
    CrdToastComponent,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<TData extends CrudItemBase>
  implements OnInit, OnChanges, AfterViewInit
{
  // Injected services
  private readonly confirmService = inject(ConfirmService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly exportService = inject(ExportService);
  public readonly loader = inject(CrudLoader<TData>);
  private readonly loadingService = inject(TableLoadingService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly state = inject(TableStateService);
  private readonly columnsStorage = inject(TableColumnsStorage);
  private readonly snackbarService = inject(SnackbarService);
  private readonly labels = inject(CRUD_LABELS);

  /** Table shell component resolved from TABLE_RENDERER. Throws at runtime if no
   * provider is configured — use `provideTableRenderer('primeng')` in your app config. */
  protected readonly tableRenderer = resolveTableRenderer();

  // Inputs
  /**
   * Controls whether columns can be hidden/shown through the configuration dialog.
   * When enabled, shows a gear icon in the toolbar allowing users to manage column visibility.
   * Persists user preferences in localStorage based on entityId.
   */
  public readonly areColumnsConfigurable = input(true);

  /** Determines whether table columns can be resized by the user */
  public readonly areColumnsResizable = input(true);

  /**
   * Enables URL synchronization for the current page.
   * When enabled, the page number is written as a query param (e.g. `?page=2`) and restored on init.
   * Can be combined with `shouldSyncIdWithUrl` to also track the opened item.
   */
  public readonly shouldSyncPageWithUrl = input<boolean>(false);

  /**
   * Enables URL synchronization for the opened item.
   * When enabled, editing/viewing an item writes `?id=123` in the URL.
   * On init, if an `id` query param is present, the matching item is fetched and opened.
   * Can be combined with `shouldSyncPageWithUrl` to also track pagination.
   */
  public readonly shouldSyncIdWithUrl = input<boolean>(false);

  /**
   * Determines user interaction mode with table rows.
   * When true, clicking anywhere on a row opens the edition dialog.
   * When false, only action buttons in the actions column trigger edition.
   * Affects user experience and accessibility.
   */
  public readonly clickableRows = input<boolean>(true);

  /**
   * Defines the structure and behavior of table columns and form fields.
   * Each CrudItemOptions object represents a column/field with display rules, validation, and control type.
   * This is the core configuration that drives both table display and form generation.
   */
  public readonly config = input.required<CrudItemOptions[]>();

  /**
   * Custom template for actions in the table's action column.
   * Allows injection of custom buttons or controls
   * The template receives the current row data as context, enabling dynamic action visibility.
   * Actions are displayed in place of the standard CRUD actions (edit, delete) in the actions column.
   */
  public readonly customActionsTemplate = input<TemplateRef<unknown>>();

  /**
   * Applies conditional CSS styles to table rows based on row data.
   * Function receives row data and returns CSS properties object.
   * Useful for highlighting specific rows, status indication, or visual categorization.
   */
  public readonly customRowStyles =
    input<(row: TData) => Record<string, string>>();

  /**
   * Forces read-only mode on the edition dialog when a row matches one of the provided property/value pairs.
   * Each key-value entry is checked against the clicked row: if any matches, the dialog opens in read-only mode instead of edit mode.
   * Takes precedence over the normal edit/write mode resolution.
   * @example { active: false } — opens inactive users in read-only mode
   */
  public readonly additionalReadonlyProperties =
    input<Record<string, unknown>>();

  /**
   * Factory function that creates new entity instances for the creation dialog.
   * Must return an object with default values matching your entity structure.
   * Called when user clicks "New" button to populate the form with initial values.
   */
  public readonly entityFactory = input.required<CrudItemFactory<TData>>();

  /**
   * Unique identifier for the entity type, used for persisting column preferences.
   * Should be consistent across the application for the same entity type.
   * Used as localStorage key for saving column visibility and order preferences.
   */
  public readonly entityId = input.required<string>();

  /**
   * Human-readable label for a single entity instance.
   * Used in dialog titles, confirmation messages, and form labels.
   * Should be singular form (not plural) for grammatical correctness.
   */
  public readonly entityLabel = input<string>("");

  /**
   * Custom title for the edition dialog, overriding the default generated title.
   * When not provided, title is auto-generated as "Creation - {entityLabel}" or "Edition - {entityLabel}".
   * Useful for specific workflows or when default title doesn't fit the context.
   */
  public readonly editionDialogTitle = input<string>("");

  /** Width of the edition dialog
   * Sets the width of the edition/creation dialog modal.
   * Accepts any valid CSS width value (px, %, vw, etc.).
   * Larger dialogs are better for complex forms with many fields.
   * @default undefined
   * @example "50vw"
   * Will override 'editionDialogSize' if specified */
  public readonly editionDialogWidth = input<string>();

  /**
   * Sets the size of the edition/creation dialog modal.
   * Accepts "xs" (1 col), "s" (2 cols), "m" (3 cols), or "l" (4 cols) for small, medium, or large predefined sizes.
   * @default "s"
   * */
  public readonly editionDialogSize = input<"xs" | "s" | "m" | "l">("s");

  /** Height of the edition dialog - defaults to undefined */
  public readonly editionDialogHeight = input<string>();

  /**
   * Determines how Excel export is processed - locally in browser or on server.
   * Local export is faster but limited by browser memory and capabilities.
   * Server export handles large datasets and complex formatting but requires backend support.
   */
  public readonly excelExportMode = input<ExcelExportMode>("server");

  /**
   * Enables/disables column filtering functionality in the table.
   * When enabled, shows filter inputs in column headers allowing users to search/filter data.
   * Filter behavior depends on filterLevel setting.
   */
  public readonly filterable = input(true);

  /**
   * Defines the complexity level of filtering interface.
   * Controls what type of filter controls are shown and how they behave.
   * Higher levels provide more sophisticated filtering options.
   */
  public readonly filterLevel = input<FilterLevel>("basic");

  /**
   * Trigger for forcing table data reload from parent component.
   * Increment this value to trigger a reload. The actual value doesn't matter, only changes.
   * Useful for refreshing data after external operations or on specific events.
   */
  public readonly forceReload = input<number>();

  /**
   * Custom validator function applied to the entire form group in edition dialog.
   * Receives the FormGroup and returns validation errors object or null.
   * Useful for cross-field validation, business rules, or complex validation logic.
   */
  public readonly groupValidator = input<ValidatorFn | undefined>();

  /**
   * Configuration object containing all HTTP operations for CRUD functionality.
   * Defines how the table communicates with your backend API for data operations.
   * Each operation is optional - omit unsupported operations to hide related UI elements.
   */
  public readonly httpCalls = input.required<Calls<TData>>();

  /**
   * Enables the context menu on right-clicking table rows.
   * When enabled, right-clicking a row shows a context menu with actions like View and Edit.
   * Context menu actions emit the same events as clicking the row or action buttons.
   * Useful for providing quick access to common actions without cluttering the UI.
   * @default false
   */
  public readonly isContextMenuEnabled = input(false);

  /**
   * Enables CSV export functionality in the table toolbar.
   * When enabled, shows a CSV export button allowing users to download table data as CSV file.
   * Export includes all visible columns with current filters and sorting applied.
   */
  public readonly isCsvExportEnabled = input(true);

  /**
   * Disables the default edition modal dialog, allowing custom edition handling.
   * When disabled, clicking edit buttons or rows will only emit events without showing the dialog.
   * Use this when you need custom edit behavior or external editing components.
   */
  public readonly isDefaultEditionDisabled = input(false);

  /**
   * Enables Excel export functionality in the table toolbar.
   * When enabled, shows an Excel export button for downloading data as .xlsx file.
   * Excel export supports better formatting and larger datasets than CSV.
   */
  public readonly isExcelExportEnabled = input(false);

  /**
   * Enables preferences mode for the table.
   * When enabled, will query configured views from backend and allow user to switch and add new ones.
   * When disabled, only the default view is used without any view management options.
   */
  public readonly isPreferencesModeEnabled = input(false);

  /** Strategy for generating labels for form controls */
  public readonly labelStrategy = input<LabelStrategy>("ifta");

  /** Variant for the label strategy. Will be applied for float labels */
  public readonly labelStrategyVariant = input<
    "on" | "in" | "over" | undefined
  >("on");

  /**
   * Enables lazy loading mode for large datasets.
   * When true, data is loaded on-demand as user scrolls, sorts, or filters.
   * When false, all data is loaded at once (suitable for smaller datasets).
   * Improves performance for tables with thousands of rows.
   */
  public readonly lazy = input<boolean>(true);

  /**
   * Sets the height of the area outside the table (e.g. toolbar, paginator) to allow proper calculation of scrollable area.
   * Accepts any valid CSS height value (px, %, vh, etc.).
   * When not set, defaults to 200px to fit most screens.
   * Adjust this value based on your layout and available screen space.
   * @default "200px"
   * @example "400px"
   * @example "50vh"
   */
  public readonly outsideTableHeight = input<string>("200px");

  /**
   * Enables pagination controls at the bottom of the table.
   * When enabled, shows page numbers, page size selector, and navigation controls.
   * Helps manage large datasets by splitting them into manageable pages.
   */
  public readonly paginator = input(true);

  /**
   * Number of rows to display per page when pagination is enabled.
   * Should be a positive integer. Common values are 10, 25, 50, etc.
   * Affects how many rows are shown at once and how pagination behaves.
   */
  public readonly rows = input<number>(10);

  /**
   * Options for page size selection in the pagination controls.
   * Should be an array of positive integers representing page size options.
   * The first value is usually the default page size.
   * Allows users to choose how many rows they want to see per page.
   */
  public readonly rowsPerPageOptions = input<number[]>([10, 25, 50]);

  /**
   * Enables row selection with checkboxes for bulk operations.
   * When enabled, adds a checkbox column allowing users to select multiple rows.
   * Selected rows are available via selectedEntries property for bulk actions.
   */
  public readonly selectable = input<boolean>(false);

  /**
   * Enables column sorting functionality in table headers.
   * When enabled, clicking column headers toggles sorting order (asc/desc/none).
   * Individual columns can override this setting via their sortable property.
   */
  public readonly sortable = input(true);

  /**
   * Enables persistence of table state (filters, sorting, pagination) across page reloads.
   * When enabled, state is stored using the storage type defined by `stateStorage`.
   * Disabled by default — set to `true` to opt in to state persistence.
   * @default false
   */
  public readonly persistState = input(false);

  /**
   * Specifies where to store table state (filters, sorting, pagination).
   * Can be "local" for localStorage or "session" for sessionStorage.
   * Persists user preferences across sessions or tabs based on selection.
   * Only applies when `persistState` is `true`.
   * @default "session"
   */
  public readonly stateStorage = input<"local" | "session">("session");

  /**
   * Enables alternating background colors on table rows (zebra striping).
   * When true, odd and even rows will have slightly different background colors,
   * making it easier to visually follow a row across wide tables.
   * When false, all rows share the same background color.
   * Passed down to the underlying TableRegularComponent and its p-table binding.
   * @default true
   */
  public readonly stripedRows = input(true);

  /**
   * Display title shown at the top of the table component.
   * Usually plural form of the entity name, appears in the table header/toolbar.
   * Helps users understand what data they're viewing and provides context.
   */
  public readonly tableTitle = input.required<string>();

  // Outputs
  public readonly editionDialogClosed = output<TData | null>();
  public readonly formChanged = output<TData>();
  public readonly newClicked = output<void>();
  public readonly rowClicked = output<TData>();
  public readonly validityChanged = output<boolean>();

  // template references
  public readonly tableOutlet = viewChild(NgComponentOutlet);

  public readonly columns = this.columnsStorage.activeColumns;

  public readonly data = computed(() => this.state.state().data);

  public readonly features = this.loader.features;

  public readonly isExportingData = this.exportService.isExportingData;

  public readonly isLoading = this.loadingService.isLoading;

  public readonly total = computed(() => this.state.state().total);

  public readonly views = this.columnsStorage.viewsWithColumns;

  public readonly defaultFilters = computed<TableLazyLoadEvent["filters"]>(() =>
    getFilters(this.config(), this.filterLevel()),
  );

  public readonly defaultSort = linkedSignal<{
    field: string;
    order: 1 | -1;
  }>(() => getDefaultSort(this.config()));

  // effects
  readonly forceCloseDialog = effect(() => {
    const _refresh = this.loader.forceCloseEdition();
    this.hideEditionDialog();
  });

  readonly openItemFromUrl = effect(() => {
    const targetId = this.targetIdFromUrl();
    const rows = this.data();

    if (!targetId || !rows.length) return;

    this.targetIdFromUrl.set(null);
    const item = rows.find((row) => row.id === targetId);
    if (item) {
      this.onEdit(item);
    } else {
      this.appendIdToUrl(null);
    }
  });

  // Properties
  public ControlType = CONTROL_TYPES;
  public editedEntry: TData | null = null;
  public readonly isColumnsConfigDialogDisplayed = signal(false);
  public readonly isCreation = signal(false);
  public readonly isEntryEditionDialogDisplayed = signal(false);
  public readonly isReadonly = signal(false);
  public readonly isExportDialogVisible = signal(false);
  public readonly first = signal(0);
  private readonly targetIdFromUrl = signal<number | null>(null);
  private readonly lazyLoad$ = new Subject<TableLazyLoadEvent>();
  public selectedEntries: TData[] = [];

  private readonly debouncedLoad$ = this.lazyLoad$.pipe(
    debounceTime(300),
    takeUntilDestroyed(),
  );

  ngOnInit() {
    if (this.shouldSyncPageWithUrl() && this.paginator()) {
      const rawPage = this.route.snapshot.queryParamMap.get("page");
      const parsedPage = Number.parseInt(rawPage ?? "", 10);
      if (!Number.isNaN(parsedPage) && parsedPage >= MIN_PAGE) {
        this.first.set((parsedPage - 1) * this.rows());
      }
    }

    if (this.shouldSyncIdWithUrl()) {
      const rawId = this.route.snapshot.queryParams.id;
      const parsedId = Number.parseInt(rawId, 10);
      if (!Number.isNaN(parsedId)) {
        this.targetIdFromUrl.set(parsedId);
      }
    }

    this.loader.set(this.httpCalls());
    this.loader.storeConfig(this.config());
    this.loader.enableFeatures();

    this.state.setStaticInformation({
      lazy: this.lazy(),
      entityLabel: this.entityLabel(),
      excelExportMode: this.excelExportMode(),
    });

    if (this.lazy()) {
      this.debouncedLoad$.subscribe((event) => {
        const params = cleanFilters(event);
        this.loader.load({ params, partial: "false" });
      });
      // PrimeNG's own initial lazy-load emission is disabled (lazyLoadOnInit=false)
      // because it fires before the dynamically-rendered table's outputs are
      // subscribed to (see ngAfterViewInit), so the first load is triggered here.
      this.onLazyLoad({
        first: this.first(),
        rows: this.rows(),
        sortField: this.defaultSort().field,
        sortOrder: this.defaultSort().order,
        filters: {},
      });
    } else {
      this.loader.load();
    }
  }

  ngAfterViewInit(): void {
    const instance = this.tableInstance();
    if (!instance) return;
    const subs = [
      instance.lazyLoaded.subscribe((event) => this.onLazyLoad(event)),
      instance.pageChanged.subscribe((event) => this.onPageChanged(event)),
      instance.archived.subscribe((id) => this.onArchive(id)),
      instance.cellClicked.subscribe((event) => this.onCellClick(event)),
      instance.columnResized.subscribe((event) => this.onColumnResized(event)),
      instance.selectedEntries.subscribe((entries) => {
        this.selectedEntries = entries;
      }),
    ];
    this.destroyRef.onDestroy(() => {
      for (const sub of subs) {
        sub.unsubscribe();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Force reload
    const {
      currentValue: reload,
      previousValue: prevReload,
      firstChange,
    } = changes.forceReload ?? {};
    if (firstChange === false && reload !== prevReload) {
      this.loader.load();
    }
    // Config changed
    const { currentValue: config, previousValue: prevConfig } =
      changes.config ?? {};
    if (!isEqual(config, prevConfig)) {
      const isViewSystemEnabled =
        this.isPreferencesModeEnabled() && this.areColumnsConfigurable();
      this.columnsStorage.init(this.entityId(), config, isViewSystemEnabled);
    }
  }

  // Public methods
  public onViewCreated(view: ExtendedTableConfig): void {
    this.columnsStorage.createView(view).subscribe(() => {
      this.clearCachedTableStyles();
    });
  }

  public onViewsUpdated(views: ExtendedTableConfig[]): void {
    this.columnsStorage.updateMany(views).subscribe(() => {
      this.clearCachedTableStyles();
    });
  }

  public onViewDeleted(viewId: number): void {
    this.columnsStorage.deleteView(viewId).subscribe(() => {
      this.clearCachedTableStyles();
    });
  }

  public hideColumnsConfigDialog(): void {
    this.isColumnsConfigDialogDisplayed.set(false);
  }

  public hideEditionDialog(): void {
    this.editionDialogClosed.emit(this.editedEntry);
    this.isEntryEditionDialogDisplayed.set(false);
    this.isCreation.set(false);
    this.editedEntry = null;
    this.selectedEntries = [];
    this.appendIdToUrl(null);
  }

  public onArchive(id: number): void {
    this.handleArchive([id]);
  }

  public onArchiveMany(): void {
    const ids: number[] = this.selectedEntries
      .map((entry) => entry.id)
      .filter((id): id is number => !!id);
    this.handleArchive(ids);
  }

  public onCellClick({
    row,
    mode,
  }: {
    row: TData;
    mode: "read" | "write";
  }): void {
    if (mode === "read") {
      this.onView(row);
    } else {
      this.onEdit(row);
    }
  }

  public onEditedEntryArchive(editedEntry: TData | null): void {
    if (!editedEntry?.id) {
      return;
    }
    this.handleArchive([editedEntry.id]);
  }

  public onEditedEntryRestore(editedEntry: TData | null): void {
    if (!editedEntry?.id) {
      return;
    }
    this.handleRestore([editedEntry.id]);
  }

  public onEditedEntryEdit(entry: TData | null): void {
    if (!entry) {
      return;
    }
    this.loader.update(entry).subscribe(() => {
      this.hideEditionDialog();
    });
  }

  public onEditedEntrySave(entry: TData | null): void {
    if (!entry) {
      return;
    }
    const action$ = entry.id
      ? this.loader.update(entry)
      : this.loader.create(entry);
    action$
      .pipe(
        // TODO: this might not be the only strategy to update files.
        switchMap((res) => {
          const files = this.getFiles(entry);
          const id = res?.rows[0]?.id || entry.id;
          return this.loader.updateFiles(files, id);
        }),
      )
      .subscribe(() => {
        this.hideEditionDialog();
      });
  }

  public onExport(event: ExportOptions): void {
    this.loadingService.start();
    this.exportService
      .export(event, this.loader.getCall)
      .subscribe((success) => {
        this.loadingService.stop();
        this.isExportDialogVisible.set(false);
        if (!success) {
          this.snackbarService.displayError(
            this.labels.table.exportFailedDetail,
            this.labels.table.exportFailedTitle,
          );
        }
      });
  }

  public onFormChanged(editedData: TData) {
    this.formChanged.emit(editedData);
  }

  public onLazyLoad(event: TableLazyLoadEvent): void {
    // Apply default filters if they are not already set
    const defaultFilters = this.defaultFilters();
    event.filters = applyDefaultFilters(event.filters, defaultFilters);
    // Apply default sort if not set
    const defaultSort = this.defaultSort();
    const { field, order } = applyDefaultSort(
      { field: event.sortField, order: event.sortOrder },
      defaultSort,
    );
    event.sortField = field;
    event.sortOrder = order;
    this.defaultSort.set({ field, order });
    this.syncPageToUrl(event.first, event.rows);
    // Emit the event to trigger data loading
    this.lazyLoad$.next(event);
  }

  public onPageChanged(event: {
    first?: number | null;
    rows?: number | null;
  }): void {
    this.first.set(event.first ?? 0);
    this.syncPageToUrl(event.first, event.rows);
  }

  public onColumnResized(event: ColumnResizeEvent) {
    this.columnsStorage.updateOne(event).subscribe();
  }

  public onNew(): void {
    this.newClicked.emit();
    if (this.isDefaultEditionDisabled()) {
      return;
    }
    const factory = this.entityFactory();
    if (!factory) return;
    this.editedEntry = factory();
    this.isCreation.set(true);
    this.isReadonly.set(false);
    this.isEntryEditionDialogDisplayed.set(true);
  }

  public getHistoryForEntry(): Calls<TData>["getHistory"] {
    if (!this.features().update) return undefined;
    const readonlyProperties = this.additionalReadonlyProperties();
    const entry = this.editedEntry;
    if (readonlyProperties && entry) {
      const matches = Object.entries(readonlyProperties).some(
        ([key, value]) => entry[key as keyof TData] === value,
      );
      if (matches) return undefined;
    }
    return this.httpCalls().getHistory;
  }

  public onValidityChanged(validity: boolean) {
    this.validityChanged.emit(validity);
  }

  public refreshData() {
    this.loader.load();
  }

  public showColumnsManagement(): void {
    this.isColumnsConfigDialogDisplayed.set(true);
  }

  public onEdit(rowData: TData): void {
    this.rowClicked.emit(rowData);
    if (this.isDefaultEditionDisabled()) {
      return;
    }
    this.editedEntry = { ...rowData };
    this.isReadonly.set(false);
    this.isEntryEditionDialogDisplayed.set(true);
    this.appendIdToUrl(rowData.id);
  }

  public onView(rowData: TData) {
    this.rowClicked.emit(rowData);
    if (this.isDefaultEditionDisabled()) {
      return;
    }
    this.editedEntry = { ...rowData };
    this.isReadonly.set(true);
    this.isEntryEditionDialogDisplayed.set(true);
    this.appendIdToUrl(rowData.id);
  }

  // Private methods
  private appendIdToUrl(id: number | null): void {
    if (!this.shouldSyncIdWithUrl()) {
      return;
    }
    this.updateQueryParams({ id });
  }

  private syncPageToUrl(first?: number | null, rows?: number | null): void {
    if (!this.shouldSyncPageWithUrl() || !this.paginator()) {
      return;
    }
    const safeRows = Math.max(rows ?? this.rows(), 1);
    const currentFirst = Math.max(first ?? this.first(), 0);
    this.first.set(currentFirst);
    const page = Math.floor(currentFirst / safeRows) + 1;
    this.updateQueryParams({ page });
  }

  private updateQueryParams(params: Params): void {
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: "merge",
      replaceUrl: true,
    });
  }

  private clearCachedTableStyles() {
    this.tableInstance()?.dataTable()?.destroyStyleElement();
  }

  /** Resolves the dynamically-rendered `TABLE_RENDERER` instance. */
  private tableInstance(): TableRegularComponent<TData> | undefined {
    return this.tableOutlet()?.componentInstance as
      | TableRegularComponent<TData>
      | undefined;
  }

  private getFiles(entry: TData): File[] {
    // TODO: test if multiple files controls. Tested only with one for now.
    const fileControls = this.config().filter(
      (item) => item.controlType === CONTROL_TYPES.FILES,
    );
    const files = fileControls.flatMap((control) => {
      const key = control.key as keyof TData;
      const value = entry[key] as FileInfo[];
      if (isArray(value)) {
        return value
          .map((v) => v.file)
          .filter((v): v is File => v instanceof File);
      }
      return [];
    });
    return files;
  }

  private handleArchive(ids: number[]) {
    const count = ids.length;
    const message =
      count === 1
        ? this.labels.table.deleteConfirmationSingle
        : this.labels.table.deleteConfirmationMultiple(count);
    const acceptFn = () => {
      this.loader.archive(ids).subscribe(() => {
        this.hideEditionDialog();
      });
    };
    this.confirm(message, acceptFn);
  }

  private handleRestore(ids: number[]) {
    const count = ids.length;
    const message =
      count === 1
        ? this.labels.table.restoreConfirmationSingle
        : this.labels.table.restoreConfirmationMultiple(count);
    const acceptFn = () => {
      this.loader.restore(ids).subscribe(() => {
        this.hideEditionDialog();
      });
    };
    this.confirm(message, acceptFn);
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
