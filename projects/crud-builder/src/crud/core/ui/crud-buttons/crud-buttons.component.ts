import { Component, input, output } from "@angular/core";
import { ButtonModule, ButtonSeverity } from "primeng/button";

export type ButtonType =
  | "validate"
  | "cancel"
  | "delete"
  | "restore"
  | "edit"
  | "simple-icon";

@Component({
  standalone: true,
  imports: [ButtonModule],
  selector: "crd-crud-button",
  templateUrl: "./crud-buttons.component.html",
  host: { style: "margin: 0 0.25rem" },
})
export class CrudButtonComponent {
  /** Template type of the button */
  public readonly type = input.required<ButtonType>();
  /** Is the button disabled */
  public readonly disabled = input(false);
  /** Is the button loading */
  public readonly loading = input(false);
  /** Label of the button, if not provide, the default label will be used */
  public readonly label = input("");
  /** Icons */
  public readonly icon = input<string>();
  /** Optional color for the button */
  public readonly severity = input<ButtonSeverity>();

  /** Event emitted each time the button is clicked */
  public readonly clicked = output();
}
