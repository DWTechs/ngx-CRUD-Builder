import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from "@angular/core";
import { CRUD_LABELS } from "../../../core/utils/i18n/crud-labels.token";
import { CrudFeatures } from "../../../core/utils/table/crud-table-loader.class";

@Component({
  selector: "tbl-table-actions-cell-native",
  template: `
    @if (features().update) {
      <button
        type="button"
        class="action-btn"
        [title]="labels.tableActions.edit"
        (click)="editClicked.emit()"
      >&#9998;</button>
    }
    @if (features().archive) {
      <button
        type="button"
        class="action-btn danger"
        [title]="labels.tableActions.delete"
        (click)="deleteClicked.emit()"
      >&#10005;</button>
    }
  `,
  styles: `
    :host {
      display: flex;
      gap: 0.25rem;
      justify-content: flex-end;
    }
    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      padding: 0;
      background: Field;
      color: FieldText;
      border: 1px solid ButtonBorder;
      border-radius: 4px;
      font: inherit;
      line-height: 1;
      cursor: pointer;
    }
    .action-btn:hover {
      background: ButtonFace;
    }
    .action-btn.danger:hover {
      background: #c00;
      color: HighlightText;
      border-color: #c00;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableActionsCellNativeComponent {
  protected readonly labels = inject(CRUD_LABELS);

  readonly features = input.required<CrudFeatures>();

  readonly editClicked = output();
  readonly deleteClicked = output();
}
