import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  signal,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { startWith, switchMap } from "rxjs";
import { FormFieldBaseComponent } from "../../renderers-optimus-ui/form-field-base.component";

@Component({
  selector: "frm-native-multiselect-control",
  templateUrl: "./native-multiselect-control.component.html",
  styleUrls: [
    "../native-control.scss",
    "./native-multiselect-control.component.scss",
  ],
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeMultiselectControlComponent extends FormFieldBaseComponent {
  private readonly elementRef = inject(ElementRef);

  protected readonly isPanelOpen = signal(false);

  protected readonly filterControl = new FormControl("");

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closePanel();
    }
  }

  protected togglePanel(): void {
    if (this.isDisabled() || this.isFormReadonly()) return;
    this.isPanelOpen.update((open) => !open);
    if (this.isPanelOpen()) {
      this.emitInteractionEvent("focus");
    } else {
      this.filterControl.setValue("");
      this.emitInteractionEvent("blur");
    }
  }

  protected closePanel(): void {
    if (!this.isPanelOpen()) return;
    this.isPanelOpen.set(false);
    this.filterControl.setValue("");
    this.emitInteractionEvent("blur");
  }

  private readonly filterQuery = toSignal(this.filterControl.valueChanges, {
    initialValue: "",
  });

  protected readonly areOptionsFilterable = computed(
    () => this.options().areOptionsFilterable ?? true,
  );

  protected readonly isSelectAllEnabled = computed(
    () => this.options().isSelectAllEnabled ?? true,
  );

  protected readonly filteredOptions = computed(() => {
    const query = (this.filterQuery() ?? "").toLowerCase();
    if (!query) return this.selectOptions();
    return this.selectOptions().filter((o) =>
      String(o.label).toLowerCase().includes(query),
    );
  });

  private readonly selectedValues = toSignal(
    toObservable(this.control).pipe(
      switchMap((ctrl) => ctrl.valueChanges.pipe(startWith(ctrl.value))),
    ),
    { initialValue: [] as unknown[] },
  );

  protected readonly hasValue = computed(
    () => (this.selectedValues() ?? []).length > 0,
  );

  protected readonly selectedDisplay = computed<string[]>(() =>
    this.selectOptions()
      .filter((o) => (this.selectedValues() ?? []).includes(o.value))
      .map((o) => String(o.label)),
  );

  protected isSelected(value: unknown): boolean {
    return (this.selectedValues() ?? []).includes(value);
  }

  protected readonly allSelected = computed(
    () =>
      this.filteredOptions().length > 0 &&
      this.filteredOptions().every((o) => this.isSelected(o.value)),
  );

  protected readonly someSelected = computed(
    () =>
      !this.allSelected() &&
      this.filteredOptions().some((o) => this.isSelected(o.value)),
  );

  protected toggleOption(value: unknown, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current: unknown[] = [...(this.selectedValues() ?? [])];
    const next = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    this.control().setValue(next);
    this.control().markAsDirty();
    this.emitInteractionEvent("valueChange");
  }

  protected toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const current: unknown[] = [...(this.selectedValues() ?? [])];
    if (checked) {
      const toAdd = this.filteredOptions()
        .map((o) => o.value)
        .filter((v) => !current.includes(v));
      this.control().setValue([...current, ...toAdd]);
    } else {
      const filtered = this.filteredOptions().map((o) => o.value);
      this.control().setValue(current.filter((v) => !filtered.includes(v)));
    }
    this.control().markAsDirty();
    this.emitInteractionEvent("valueChange");
  }

  protected clearSelection(): void {
    this.control().setValue([]);
    this.control().markAsDirty();
    this.emitInteractionEvent("clear");
  }

  protected stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
