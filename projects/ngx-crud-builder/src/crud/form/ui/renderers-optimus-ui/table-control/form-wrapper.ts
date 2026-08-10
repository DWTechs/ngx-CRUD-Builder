import { Component, inject } from "@angular/core";
import { ValidatorFn } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "@openng/optimus-ui/dynamicdialog";
import { CrudItemOptions } from "../../../../core/models/crud-item-options.model";
import { CrdButtonComponent } from "../../../../core/ui/crd-button/crd-button.component";
import { FormComponent } from "../../../form/form.component";

interface DialogData {
  config: CrudItemOptions[];
  model: Record<string, unknown>;
  groupValidator: ValidatorFn;
}

@Component({
  selector: "frm-table-form-wrapper",
  imports: [FormComponent, CrdButtonComponent],
  template: `
        <frm-form
            [config]="config"
            [model]="model"
            [groupValidator]="groupValidator"
            (modelChange)="onModelChange($event)"
        />
        <div class="p-dialog-footer">
            <crd-button
                type="cancel"
                (clicked)="close()"
            />  
            <crd-button
                type="validate"
                (clicked)="save()"
            />
        </div>
    `,
})
export class TableFormWrapperComponent {
  private readonly dialogConfig = inject(DynamicDialogConfig<DialogData>);
  private readonly dialogRef = inject(DynamicDialogRef);

  private readonly dialogData = this.dialogConfig.data;

  public readonly config: CrudItemOptions[] = this.dialogData.config;

  public readonly model: Record<string, unknown> = this.dialogData.model;

  public readonly groupValidator: ValidatorFn = this.dialogData.groupValidator;

  private updatedModel: Record<string, unknown> = { ...this.model };

  public onModelChange(updatedModel: Record<string, unknown>): void {
    this.updatedModel = updatedModel;
  }

  public save(): void {
    this.dialogRef.close(this.updatedModel);
  }

  public close(): void {
    this.dialogRef.close();
  }
}
