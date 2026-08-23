import { A11yModule } from "@angular/cdk/a11y";
import { AsyncPipe } from "@angular/common";
import {
  Component,
  computed,
  inject,
  input,
  model,
  output,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { FormsModule, ValidatorFn } from "@angular/forms";
import { CardModule } from "@openng/optimus-ui/card";
import { CheckboxModule } from "@openng/optimus-ui/checkbox";
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  switchMap,
} from "rxjs";
import { FormComponent } from "../../../form/form/form.component";
import { LabelStrategy } from "../../../form/utils/label-strategy.model";
import { CrudItemBase } from "../../models/crud-item-base.class";
import { CrudItemOptions } from "../../models/crud-item-options.model";
import { NO_ROWS_AND_COUNT } from "../../utils/crud-service/no-rows";
import { CRUD_LABELS } from "../../utils/i18n/crud-labels.token";
import { CrudFeatures } from "../../utils/table/crud-table-loader.class";
import { CrdButtonComponent } from "../crd-button/crd-button.component";
import { CrdModalComponent } from "../crd-modal/crd-modal.component";
import { HISTORY_MAPPER } from "../history/history-mapper.token";
import { HistoryComponent } from "../history/history.component";
import { HistorizedData } from "../history/history.model";

@Component({
  selector: "crd-edition-dialog",
  templateUrl: "./edition-dialog.component.html",
  styleUrls: ["./edition-dialog.component.scss"],
  imports: [
    A11yModule,
    CrdModalComponent,
    FormComponent,
    CardModule,
    HistoryComponent,
    CheckboxModule,
    FormsModule,
    AsyncPipe,
    CrdButtonComponent,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class EditionDialogComponent<TData extends CrudItemBase> {
  protected readonly labels = inject(CRUD_LABELS);
  private readonly globalHistoryMapper = inject(HISTORY_MAPPER, {
    optional: true,
  });
  // Inputs
  /** Configuration array that defines the structure and behavior of form fields */
  public readonly config = input<CrudItemOptions[]>([]);

  /** CRUD features configuration that defines available operations */
  public readonly features = input<CrudFeatures>({} as CrudFeatures);

  /** Function to retrieve history data for an entry by ID */
  public readonly getHistory =
    input<
      (id: number) => Observable<{ rows: unknown[]; total: number | undefined }>
    >();

  /**
   * Optional mapper to transform raw history rows from the API into `HistorizedData<TData>`.
   * Use this when the API response shape differs from the expected `HistorizedData` contract.
   */
  public readonly historyMapper =
    input<(raw: unknown) => HistorizedData<TData>>();

  /** Custom validator applied to the entire form group */
  public readonly groupValidator = input<ValidatorFn>();

  /** Dialog header title text */
  public readonly customHeader = input("");

  /** Displayed entity label */
  public readonly entityLabel = input("");

  /** Dialog height (CSS value) */
  public readonly height = input<string | undefined>();

  /** Whether the dialog is in creation mode (vs edit mode) */
  public readonly isCreation = input(false);

  /** Whether the dialog is in readonly mode */
  public readonly isReadonly = input(false);

  /** Controls dialog visibility state */
  public readonly isVisible = input(false);

  /** Dialog width (CSS value) */
  public readonly width = input<string | undefined>(undefined);

  /**
   * Optional option to configure the default size of the dialog
   * @param "xs" | "s" | "m" | "l"
   * @default "s"
   * */
  public readonly size = input<"xs" | "s" | "m" | "l">("s");

  /** Is something loading */
  public readonly isLoading = input(false);

  /** Strategy for generating labels for form controls */
  public readonly labelStrategy = input<LabelStrategy>("ifta");

  /** Variant for the label strategy. Will be applied for float labels */
  public readonly labelStrategyVariant = input<
    "on" | "in" | "over" | undefined
  >("on");

  // Model inputs
  /** The data object being edited (two-way binding) */
  public readonly editedEntry = model.required<TData>();

  // Outputs
  /** Emitted when entry is archived/deleted */
  public readonly archived = output<TData | null>();

  /** Emitted when entry is restored */
  public readonly restored = output<TData | null>();

  /** Emitted when entry is edited (value changes) */
  public readonly edited = output<TData | null>();

  /** Emitted when form values change */
  public readonly formChanged = output<TData>();

  /** Emitted when dialog should be hidden */
  public readonly hide = output();

  /** Emitted when entry is saved */
  public readonly saved = output<TData | null>();

  /** Emitted when form validation state changes */
  public readonly validityChanged = output<boolean>();

  // Public properties
  /** Whether the form is currently invalid */
  public invalidForm = true;

  /** Timestamp to force form reload */
  public forceReloadTime = signal(0);

  /** Whether to show the previous value column in history */
  public readonly showOldValue = signal(false);

  // Computed
  /** ID of the currently edited entry */
  private readonly editedEntryId = computed(() => this.editedEntry()?.id);

  /** Calculated width of the dialog based on size or fixed width */
  public readonly calculatedWidth = computed(() => {
    const size = this.size();
    const fixedWidth = this.width();
    if (fixedWidth) {
      return fixedWidth;
    }
    switch (size) {
      case "xs":
        return "400px";
      case "s":
        return "50vw";
      case "m":
        return "70vw";
      case "l":
        return "90vw";
      default:
        return "50vw";
    }
  });

  public readonly formColumnsCount = computed(() => {
    const size = this.size();
    switch (size) {
      case "xs":
        return 1;
      case "s":
        return 2;
      case "m":
        return 3;
      case "l":
        return 4;
      default:
        return 1;
    }
  });

  /** Dialog header label */
  public readonly dialogTitle = computed(() => {
    if (this.customHeader()) {
      return this.customHeader();
    }
    let action: string;
    if (this.isCreation()) {
      action = this.labels.editionDialog.modeCreate;
    } else if (this.isReadonly()) {
      action = this.labels.editionDialog.modeConsult;
    } else {
      action = this.labels.editionDialog.modeEdit;
    }
    return `${action} - ${this.entityLabel()}`;
  });

  private readonly canArchiveRestore = computed(() => {
    if (!this.canInteract()) return false;
    if (this.isCreation()) return false;
    return true;
  });

  public readonly isArchiveBtnDisplayed = computed(() => {
    return (
      this.features().archive &&
      this.canArchiveRestore() &&
      !this.editedEntry()?.archived
    );
  });

  public readonly isRestoreBtnDisplayed = computed(() => {
    return (
      this.features().restore &&
      this.canArchiveRestore() &&
      this.editedEntry()?.archived
    );
  });

  /** Observable stream of history data for the current entry */
  public readonly history$ = toObservable(this.editedEntryId).pipe(
    distinctUntilChanged(),
    filter((id): id is number => !!id),
    switchMap((id) => {
      const getHistory = this.getHistory();
      if (this.features().getHistory && getHistory) {
        return getHistory(id).pipe(
          map(({ rows, total }) => {
            const mapper =
              this.historyMapper() ??
              (this.globalHistoryMapper as
                | ((raw: unknown) => HistorizedData<TData>)
                | null);
            return {
              rows: mapper
                ? rows.map(mapper)
                : (rows as HistorizedData<TData>[]),
              total,
            };
          }),
        );
      }
      return of(NO_ROWS_AND_COUNT);
    }),
  );

  /** Whether the save button should be displayed based on form state and permissions */
  public readonly canInteract = computed(() => {
    if (this.isReadonly()) return false;
    if (this.isCreation()) return true;
    if (!this.features().update) return false;

    const areAllFieldsReadonly = this.config().every(
      (ctrl) => ctrl.controlOptions?.disabled || ctrl.controlOptions?.hidden,
    );
    return !areAllFieldsReadonly;
  });

  public readonly closeButtonLabel = computed(() => {
    return this.canInteract()
      ? this.labels.editionDialog.cancel
      : this.labels.editionDialog.close;
  });

  // Public methods
  /**
   * Handles form value changes and updates the edited entry
   * @param value - The new form values
   */
  public onFormChanged(value: TData): void {
    this.editedEntry.set(value);

    // if (this.canOnlyCloseEditionModal()) {
    //   this.edited.emit(this.editedEntry());
    // }
  }

  /**
   * Handles form validation state changes
   * @param valid - Whether the form is currently valid
   */
  public onValidityChange(valid: boolean): void {
    this.invalidForm = !valid;
  }

  /**
   * Handles selection of a history entry to restore
   * @param entry - The history entry to restore
   */
  public onHistorySelect(entry: HistorizedData<TData>) {
    this.editedEntry.set(entry.record);
    this.invalidForm = false;
    this.forceReloadTime.set(Date.now());
  }

  /**
   * Handles save action and emits the current entry
   */
  public onSave(): void {
    this.saved.emit(this.editedEntry());
  }

  /**
   * Handles dialog hide action
   */
  public onHide(): void {
    this.hide.emit();
  }

  /**
   * Handles delete/archive action and emits the current entry
   */
  public onArchive() {
    this.archived.emit(this.editedEntry());
  }

  public onRestore() {
    this.restored.emit(this.editedEntry());
  }
}
