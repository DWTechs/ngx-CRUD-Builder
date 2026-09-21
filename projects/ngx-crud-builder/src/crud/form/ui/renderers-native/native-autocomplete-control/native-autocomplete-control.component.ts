import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  effect,
  HostListener,
  inject,
  signal,
  untracked,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { startWith, switchMap } from "rxjs";
import { FormFieldBaseComponent } from "../../renderers-optimus-ui/form-field-base.component";

@Component({
  selector: "frm-native-autocomplete-control",
  templateUrl: "./native-autocomplete-control.component.html",
  styleUrls: [
    "../native-control.scss",
    "./native-autocomplete-control.component.scss",
  ],
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeAutocompleteControlComponent extends FormFieldBaseComponent {
  private readonly elementRef = inject(ElementRef);

  protected readonly isPanelOpen = signal(false);
  protected readonly filterQuery = signal("");
  protected readonly inputControl = new FormControl<string>("", {
    nonNullable: true,
  });

  protected readonly isMultiple = computed(
    () => this.options().autocompleteMultiple ?? false,
  );
  protected readonly isDropdown = computed(
    () => this.options().autocompleteDropdown ?? false,
  );
  protected readonly minQueryLength = computed(
    () => this.options().autocompleteMinQueryLength ?? 0,
  );
  protected readonly scrollHeight = computed(
    () => this.options().autocompleteScrollHeight ?? "200px",
  );

  private readonly currentValue = toSignal(
    toObservable(this.control).pipe(
      switchMap((ctrl) => ctrl.valueChanges.pipe(startWith(ctrl.value))),
    ),
    { initialValue: null as unknown },
  );

  protected readonly displayText = computed<string>(() => {
    const val = this.currentValue();
    if (val == null || val === "") return "";
    const match = this.selectOptions().find((o) => o.value === val);
    return match ? String(match.label) : "";
  });

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

  protected readonly hasValue = computed(() => {
    if (this.isMultiple()) return this.selectedValues().length > 0;
    const val = this.currentValue();
    return val != null && val !== "";
  });

  protected readonly filteredOptions = computed(() => {
    const query = this.filterQuery().toLowerCase().trim();
    const min = this.minQueryLength();
    // Le bouton dropdown bypass le minQueryLength (affiche tout si aucune saisie)
    const bypassMin =
      this.isDropdown() && this.isPanelOpen() && query.length === 0;
    if (!bypassMin && query.length < min) return [];
    if (!query) return this.selectOptions();
    return this.selectOptions().filter((o) =>
      String(o.label).toLowerCase().includes(query),
    );
  });

  constructor() {
    super();
    // Sync le label affiché dans l'input quand la valeur change depuis l'extérieur
    effect(() => {
      const text = this.displayText();
      const isMultiple = this.isMultiple();
      untracked(() => {
        if (!isMultiple && !this.isPanelOpen()) {
          this.inputControl.setValue(text, { emitEvent: false });
          this.filterQuery.set("");
        }
      });
    });
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closePanel();
    }
  }

  protected onInputFocus(): void {
    if (this.isDisabled() || this.isFormReadonly()) return;
    if (this.minQueryLength() === 0) {
      if (!this.isMultiple()) {
        this.inputControl.setValue("", { emitEvent: false });
        this.filterQuery.set("");
      }
      this.isPanelOpen.set(true);
      this.emitInteractionEvent("focus");
    }
  }

  protected onInput(): void {
    const query = this.inputControl.value ?? "";
    this.filterQuery.set(query);
    const shouldOpen = query.length >= this.minQueryLength();
    if (shouldOpen && !this.isPanelOpen()) {
      this.isPanelOpen.set(true);
      this.emitInteractionEvent("focus");
    } else if (!shouldOpen && this.isPanelOpen() && !this.isDropdown()) {
      this.isPanelOpen.set(false);
    }
  }

  protected togglePanel(): void {
    if (this.isDisabled() || this.isFormReadonly()) return;
    if (this.isPanelOpen()) {
      this.closePanel();
    } else {
      if (!this.isMultiple()) {
        this.inputControl.setValue("", { emitEvent: false });
        this.filterQuery.set("");
      }
      this.isPanelOpen.set(true);
      this.emitInteractionEvent("focus");
    }
  }

  protected closePanel(): void {
    if (!this.isPanelOpen()) return;
    this.isPanelOpen.set(false);
    if (!this.isMultiple()) {
      this.inputControl.setValue(this.displayText(), { emitEvent: false });
    } else {
      this.inputControl.setValue("", { emitEvent: false });
    }
    this.filterQuery.set("");
    this.emitInteractionEvent("blur");
  }

  protected selectOption(value: unknown): void {
    if (this.isMultiple()) {
      const current = [...this.selectedValues()];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      this.control().setValue(next);
      this.inputControl.setValue("", { emitEvent: false });
      this.filterQuery.set("");
    } else {
      this.control().setValue(value);
      const match = this.selectOptions().find((o) => o.value === value);
      this.inputControl.setValue(match ? String(match.label) : "", {
        emitEvent: false,
      });
      this.filterQuery.set("");
      this.isPanelOpen.set(false);
      this.emitInteractionEvent("select");
    }
    this.control().markAsDirty();
    this.emitInteractionEvent("valueChange");
  }

  protected removeChip(value: unknown, event: Event): void {
    event.stopPropagation();
    const next = this.selectedValues().filter((v) => v !== value);
    this.control().setValue(next);
    this.control().markAsDirty();
    this.emitInteractionEvent("valueChange");
  }

  protected clearSelection(event: Event): void {
    event.stopPropagation();
    this.control().setValue(this.isMultiple() ? [] : null);
    this.control().markAsDirty();
    this.inputControl.setValue("", { emitEvent: false });
    this.filterQuery.set("");
    this.emitInteractionEvent("clear");
  }

  protected isSelected(value: unknown): boolean {
    if (this.isMultiple()) return this.selectedValues().includes(value);
    return this.currentValue() === value;
  }

  protected stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
