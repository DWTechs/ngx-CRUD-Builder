import { Component, input } from "@angular/core";

export type CrdProgressMode = "spinner" | "bar";

/**
 * Framework-agnostic loading indicator (circular spinner or linear bar).
 * Plain CSS animation — no Optimus UI/Material dependency.
 */
@Component({
  selector: "crd-progress",
  templateUrl: "./crd-progress.component.html",
  styleUrls: ["./crd-progress.component.scss"],
  host: {
    role: "progressbar",
    "aria-label": "Loading",
  },
})
export class CrdProgressComponent {
  public readonly mode = input<CrdProgressMode>("spinner");
}
