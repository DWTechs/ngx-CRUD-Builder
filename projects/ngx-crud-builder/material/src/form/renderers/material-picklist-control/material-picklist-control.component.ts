import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  viewChild,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule, MatSelectionList } from "@angular/material/list";
import { CRUD_LABELS, FormFieldBaseComponent } from "@dwtechs/ngx-crud-builder";
import { startWith, switchMap } from "rxjs";

@Component({
  selector: "frm-material-picklist-control",
  template: `
    <div class="picklist">
      <div class="picklist-panel">
        <div class="picklist-header">{{ labels.picklist.sourceHeader }}</div>
        <mat-selection-list #sourceList [disabled]="isReadonly()">
          @for (option of sources(); track option.value) {
            <mat-list-option [value]="option.value">{{ option.label }}</mat-list-option>
          }
        </mat-selection-list>
      </div>

      <div class="picklist-controls">
        <button
          mat-stroked-button
          type="button"
          aria-label="Move selected to target"
          [disabled]="isReadonly() || !sources().length"
          (click)="moveToTarget()"
        >&#8250;</button>
        <button
          mat-stroked-button
          type="button"
          aria-label="Move all to target"
          [disabled]="isReadonly() || !sources().length"
          (click)="moveAllToTarget()"
        >&#187;</button>
        <button
          mat-stroked-button
          type="button"
          aria-label="Move selected to source"
          [disabled]="isReadonly() || !targets().length"
          (click)="moveToSource()"
        >&#8249;</button>
        <button
          mat-stroked-button
          type="button"
          aria-label="Move all to source"
          [disabled]="isReadonly() || !targets().length"
          (click)="moveAllToSource()"
        >&#171;</button>
      </div>

      <div class="picklist-panel">
        <div class="picklist-header">{{ labels.picklist.targetHeader }}</div>
        <mat-selection-list #targetList [disabled]="isReadonly()">
          @for (option of targets(); track option.value) {
            <mat-list-option [value]="option.value">{{ option.label }}</mat-list-option>
          }
        </mat-selection-list>
      </div>
    </div>
  `,
  styles: `
    .picklist {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .picklist-panel {
      flex: 1 1 0;
      min-width: 0;
      border: 1px solid var(--mat-sys-outline, rgba(0, 0, 0, 0.38));
      border-radius: 4px;
      overflow: hidden;
    }
    .picklist-header {
      padding: 8px 16px;
      font-weight: 500;
      border-bottom: 1px solid var(--mat-sys-outline-variant, rgba(0, 0, 0, 0.12));
    }
    .picklist-panel mat-selection-list {
      height: 10rem;
      overflow-y: auto;
    }
    .picklist-controls {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .picklist-controls button {
      min-width: 40px;
      padding: 0;
    }
  `,
  imports: [MatButtonModule, MatListModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialPicklistControlComponent extends FormFieldBaseComponent {
  protected readonly labels = inject(CRUD_LABELS);

  private readonly sourceList = viewChild<MatSelectionList>("sourceList");
  private readonly targetList = viewChild<MatSelectionList>("targetList");

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
    const picked = this.pickedValues(this.sourceList());
    if (!picked.length) return;
    this.sync([...this.selectedValues(), ...picked]);
  }

  protected moveAllToTarget(): void {
    this.sync(this.selectOptions().map((opt) => opt.value));
  }

  protected moveToSource(): void {
    const picked = this.pickedValues(this.targetList());
    if (!picked.length) return;
    this.sync(this.selectedValues().filter((v) => !picked.includes(v)));
  }

  protected moveAllToSource(): void {
    this.sync([]);
  }

  private pickedValues(list: MatSelectionList | undefined): unknown[] {
    return list?.selectedOptions.selected.map((opt) => opt.value) ?? [];
  }

  /** Update the form control with the current target values */
  private sync(values: unknown[]): void {
    this.sourceList()?.deselectAll();
    this.targetList()?.deselectAll();
    this.control().setValue(values);
    this.control().markAsDirty();
    this.emitInteractionEvent("valueChange");
  }
}
