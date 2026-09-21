import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  viewChild,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { SelectItem } from "@openng/optimus-ui/api";
import { startWith, switchMap } from "rxjs";
import { CRUD_LABELS } from "../../../../core/utils/i18n/crud-labels.token";
import { FormFieldBaseComponent } from "../../renderers-optimus-ui/form-field-base.component";

@Component({
  selector: "frm-native-picklist-control",
  templateUrl: "./native-picklist-control.component.html",
  styleUrls: [
    "../native-control.scss",
    "./native-picklist-control.component.scss",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativePicklistControlComponent extends FormFieldBaseComponent {
  protected readonly labels = inject(CRUD_LABELS);

  private readonly sourceList =
    viewChild<ElementRef<HTMLSelectElement>>("sourceList");
  private readonly targetList =
    viewChild<ElementRef<HTMLSelectElement>>("targetList");

  private readonly controlValue = toSignal(
    toObservable(this.control).pipe(
      switchMap((ctrl) => ctrl.valueChanges.pipe(startWith(ctrl.value))),
    ),
    { initialValue: [] as unknown },
  );

  private readonly selectedValues = computed<unknown[]>(() => {
    const value = this.controlValue();
    return Array.isArray(value) ? value : [];
  });

  protected readonly isReadonly = computed(
    () => this.isDisabled() || !!this.isFormReadonly(),
  );

  protected readonly sources = computed(() =>
    this.selectOptions().filter(
      (opt) => !this.selectedValues().includes(opt.value),
    ),
  );

  protected readonly targets = computed(() =>
    this.selectOptions().filter((opt) =>
      this.selectedValues().includes(opt.value),
    ),
  );

  protected moveToTarget(): void {
    const picked = this.pickedValues(this.sourceList(), this.sources());
    if (!picked.length) return;
    this.sync([...this.selectedValues(), ...picked]);
  }

  protected moveAllToTarget(): void {
    this.sync(this.selectOptions().map((opt) => opt.value));
  }

  protected moveToSource(): void {
    const picked = this.pickedValues(this.targetList(), this.targets());
    if (!picked.length) return;
    this.sync(this.selectedValues().filter((v) => !picked.includes(v)));
  }

  protected moveAllToSource(): void {
    this.sync([]);
  }

  /** `<option value>` holds the index of the option in its own list, since DOM values are strings */
  private pickedValues(
    list: ElementRef<HTMLSelectElement> | undefined,
    options: SelectItem[],
  ): unknown[] {
    const select = list?.nativeElement;
    if (!select) return [];
    return Array.from(select.selectedOptions)
      .map((opt) => options[Number(opt.value)])
      .filter((opt): opt is SelectItem => !!opt)
      .map((opt) => opt.value);
  }

  /** Update the form control with the current target values */
  private sync(values: unknown[]): void {
    this.deselectAll(this.sourceList());
    this.deselectAll(this.targetList());
    this.control().setValue(values);
    this.control().markAsDirty();
    this.emitInteractionEvent("valueChange");
  }

  private deselectAll(list: ElementRef<HTMLSelectElement> | undefined): void {
    if (list) list.nativeElement.selectedIndex = -1;
  }
}
