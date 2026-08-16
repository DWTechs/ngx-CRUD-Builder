import { SlicePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { isString } from "@dwtechs/checkard";

@Component({
  selector: "tbl-wysiwyg-cell-renderer",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlicePipe],
  template: `
    {{ value() | slice:0:20 }}
    @if (value().length > 20) {
      <span>...</span>
    }
  `,
})
export class WysiwygCellRendererComponent {
  public readonly cellValue = input.required<unknown>();

  public readonly value = computed(() => {
    const cellValue = this.cellValue();
    if (!isString(cellValue)) {
      return "";
    }
    return this.cleanWysiwygContent(cellValue);
  });

  private cleanWysiwygContent(value: string): string {
    // DOMParser produces an inert document: no scripts run and no resources (img/svg) load,
    // unlike assigning innerHTML on a live/detached element which can still trigger onerror handlers.
    const doc = new DOMParser().parseFromString(value, "text/html");
    for (const script of doc.querySelectorAll("script")) {
      script.remove();
    }
    return doc.body.textContent || "";
  }
}
