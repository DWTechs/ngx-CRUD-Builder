import { Component, inject } from "@angular/core";
import { SnackbarService } from "../../../../core/utils/snackbar/snackbar.service";

/**
 * Framework-agnostic toast display for `SnackbarService`. Plain HTML/CSS — no
 * Optimus UI/Material dependency, used regardless of the form field / table adapter chosen.
 */
@Component({
  selector: "crd-toast",
  templateUrl: "./crd-toast.component.html",
  styleUrls: ["./crd-toast.component.scss"],
})
export class CrdToastComponent {
  private readonly snackbarService = inject(SnackbarService);

  protected readonly messages = this.snackbarService.messages;

  protected dismiss(id: number): void {
    this.snackbarService.dismiss(id);
  }
}
