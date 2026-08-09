import { A11yModule } from "@angular/cdk/a11y";
import { Component, HostListener, input, output } from "@angular/core";

/**
 * Framework-agnostic modal shell (backdrop + panel in plain CSS) with CDK-powered
 * focus trapping. Used regardless of the form field / table adapter chosen.
 */
@Component({
  selector: "crd-modal",
  templateUrl: "./crd-modal.component.html",
  styleUrls: ["./crd-modal.component.scss"],
  imports: [A11yModule],
})
export class CrdModalComponent {
  public readonly open = input(false);
  public readonly panelClass = input("");
  public readonly panelStyle = input<Record<string, string>>({});
  public readonly closed = output();

  @HostListener("document:keydown.escape")
  protected onEscape(): void {
    if (this.open()) this.closed.emit();
  }

  protected onBackdropClick(): void {
    this.closed.emit();
  }
}
