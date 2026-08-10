import { Component, inject } from "@angular/core";
import { ConfirmService } from "../../../../core/utils/confirm/confirm.service";
import { CrdButtonComponent } from "../crd-button/crd-button.component";
import { CrdModalComponent } from "../crd-modal/crd-modal.component";

/**
 * Framework-agnostic confirmation dialog for `ConfirmService`. Plain HTML/CSS — no
 * Optimus UI/Material dependency, used regardless of the form field / table adapter chosen.
 */
@Component({
  selector: "crd-confirm",
  templateUrl: "./crd-confirm.component.html",
  styleUrls: ["./crd-confirm.component.scss"],
  imports: [CrdModalComponent, CrdButtonComponent],
})
export class CrdConfirmComponent {
  private readonly confirmService = inject(ConfirmService);

  protected readonly current = this.confirmService.current;

  protected onAccept(): void {
    this.confirmService.accept();
  }

  protected onReject(): void {
    this.confirmService.reject();
  }
}
