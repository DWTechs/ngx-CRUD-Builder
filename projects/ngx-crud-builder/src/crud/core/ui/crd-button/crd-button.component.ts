import { Component, computed, input, output } from "@angular/core";
import { CrdProgressComponent } from "../crd-progress/crd-progress.component";

export type ButtonType =
  | "validate"
  | "cancel"
  | "delete"
  | "restore"
  | "edit"
  | "simple-icon";

export type CrdButtonSeverity =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warn"
  | "info"
  | "contrast";

const DEFAULT_LABELS: Record<ButtonType, string> = {
  validate: "Valider",
  cancel: "Annuler",
  delete: "Supprimer",
  restore: "Restaurer",
  edit: "Modifier",
  "simple-icon": "",
};

// Visual treatment per button type — mirrors the previous Optimus UI variants (solid/outlined/ghost/icon-only)
const TYPE_VARIANT: Record<
  ButtonType,
  "solid" | "outlined" | "ghost" | "icon-only"
> = {
  validate: "solid",
  cancel: "ghost",
  delete: "outlined",
  restore: "outlined",
  edit: "outlined",
  "simple-icon": "icon-only",
};

/**
 * Framework-agnostic button used throughout the library's own chrome (toolbar,
 * edition dialog, confirmation actions). Plain HTML/CSS — no Optimus UI/Material
 * dependency, used regardless of the form field / table adapter chosen.
 */
@Component({
  selector: "crd-button",
  templateUrl: "./crd-button.component.html",
  styleUrls: ["./crd-button.component.scss"],
  imports: [CrdProgressComponent],
})
export class CrdButtonComponent {
  public readonly type = input.required<ButtonType>();
  public readonly disabled = input(false);
  public readonly loading = input(false);
  public readonly label = input("");
  public readonly icon = input<string>();
  public readonly severity = input<CrdButtonSeverity>();
  /** When true, marks the native button as the element a cdkTrapFocusAutoCapture ancestor should focus */
  public readonly focusInitial = input(false);

  public readonly clicked = output();

  protected readonly resolvedLabel = computed(
    () => this.label() || DEFAULT_LABELS[this.type()],
  );

  protected readonly resolvedSeverity = computed(
    () => this.severity() ?? "primary",
  );

  protected readonly variant = computed(() => TYPE_VARIANT[this.type()]);

  protected onClick(): void {
    if (this.disabled() || this.loading()) return;
    this.clicked.emit();
  }
}
