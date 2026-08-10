import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  untracked,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { startWith, switchMap } from "rxjs";
import { FormFieldBaseComponent } from "../../renderers-optimus-ui/form-field-base.component";

/** Material autocomplete adapter: single value uses matAutocomplete, multiple uses a mat-chip-grid. */
@Component({
  selector: "frm-material-autocomplete-control",
  templateUrl: "./material-autocomplete-control.component.html",
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialAutocompleteControlComponent extends FormFieldBaseComponent {
  protected readonly isMultiple = computed(
    () => this.options().autocompleteMultiple ?? false,
  );

  protected readonly filterQuery = new FormControl<string>("", {
    nonNullable: true,
  });
  private readonly filterQuerySignal = toSignal(this.filterQuery.valueChanges, {
    initialValue: "",
  });

  private readonly currentValue = toSignal(
    toObservable(this.control).pipe(
      switchMap((ctrl) => ctrl.valueChanges.pipe(startWith(ctrl.value))),
    ),
    { initialValue: null as unknown },
  );

  protected readonly selectedValues = computed<unknown[]>(() => {
    const val = this.currentValue();
    return Array.isArray(val) ? val : [];
  });

  protected readonly selectedChips = computed<
    { label: string; value: unknown }[]
  >(() =>
    this.selectOptions()
      .filter((o) => this.selectedValues().includes(o.value))
      .map((o) => ({ label: String(o.label), value: o.value })),
  );

  protected readonly filteredOptions = computed(() => {
    const query = this.filterQuerySignal().toLowerCase().trim();
    const alreadySelected = this.selectedValues();
    return this.selectOptions()
      .filter((o) => !this.isMultiple() || !alreadySelected.includes(o.value))
      .filter((o) => !query || String(o.label).toLowerCase().includes(query));
  });

  constructor() {
    super();
    // Keep the input text synced with the selected option label in single mode.
    effect(() => {
      const val = this.currentValue();
      const isMultiple = this.isMultiple();
      untracked(() => {
        if (isMultiple) return;
        const match = this.selectOptions().find((o) => o.value === val);
        this.filterQuery.setValue(match ? String(match.label) : "", {
          emitEvent: false,
        });
      });
    });
  }

  protected onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    if (this.isMultiple()) {
      this.control().setValue([...this.selectedValues(), value]);
      this.filterQuery.setValue("", { emitEvent: false });
    } else {
      this.control().setValue(value);
      this.emitInteractionEvent("select");
    }
    this.control().markAsDirty();
    this.emitInteractionEvent("valueChange");
  }

  protected removeChip(value: unknown): void {
    this.control().setValue(this.selectedValues().filter((v) => v !== value));
    this.control().markAsDirty();
    this.emitInteractionEvent("valueChange");
  }
}
