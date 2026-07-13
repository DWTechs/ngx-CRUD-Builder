import { formatDate } from "@angular/common";
import { SafeHtml } from "@angular/platform-browser";
import { isArray, isNil, isObject, isString } from "@dwtechs/checkard";
import { CONTROL_TYPES, ControlType } from "../../models/control-type.model";
import { CrudItemOptions } from "../../models/crud-item-options.model";
import { canBeDate, DATE_FORMAT } from "../dates/dates.utils";

export class CellTextContent {
  value: string | SafeHtml = "";

  private options: CrudItemOptions | null = null;
  private cellValue: unknown = "";
  private checkboxLabels: { yes: string; no: string } = {
    yes: "Oui",
    no: "Non",
  };

  private readonly defaultRenderer = () => `${this.cellValue}`;

  /**
   * Strategy pattern with specific renderers for complex control types.
   * Types not listed here will automatically fallback to defaultRenderer.
   */
  private readonly SPECIFIC_RENDERERS: Partial<
    Record<ControlType, () => string>
  > = {
    [CONTROL_TYPES.CHECKBOX]: () => this.checkboxCellRenderer(),
    [CONTROL_TYPES.DATE]: () => this.dateCellRenderer(),
    [CONTROL_TYPES.FILES]: () => this.getFileRenderer(),
    [CONTROL_TYPES.MULTISELECT]: () => this.multiselectCellRenderer(),
    [CONTROL_TYPES.PICKLIST]: () => this.multiselectCellRenderer(),
    [CONTROL_TYPES.RADIO]: () => this.selectCellRenderer(),
    [CONTROL_TYPES.SELECT]: () => this.selectCellRenderer(),
    [CONTROL_TYPES.WYSIWYG]: () => this.wysiwygRenderer(),
    [CONTROL_TYPES.GROUP]: () => this.groupCellRenderer(),
  };

  /**
   * Gets the appropriate renderer for the given control type.
   * Fallbacks to defaultRenderer for unhandled types.
   * @param controlType - The control type to get renderer for
   * @returns The renderer function
   */
  private getRenderer(controlType: ControlType): () => string {
    return this.SPECIFIC_RENDERERS[controlType] ?? this.defaultRenderer;
  }

  constructor(config: {
    options: CrudItemOptions;
    cellValue: unknown;
    checkboxLabels?: { yes: string; no: string };
  }) {
    const { options, cellValue, checkboxLabels } = config;

    this.options = options;
    this.cellValue = cellValue;
    if (checkboxLabels) {
      this.checkboxLabels = checkboxLabels;
    }

    if (options.columnOptions?.tooltip) {
      this.value = options.columnOptions.tooltip(this.cellValue);
      return;
    }

    if (cellValue === undefined || cellValue === null) {
      this.value = "";
      return;
    }

    this.value = this.getRenderer(options.controlType)();
  }

  private selectCellRenderer(): string {
    return this.getOption(this.cellValue);
  }

  private multiselectCellRenderer(): string {
    if (this.isCellArray(this.cellValue)) {
      const values: string[] = this.cellValue
        .map((val) => this.getOption(val))
        .filter((val) => Boolean(val));
      return values.join(", ");
    }
    return this.selectCellRenderer();
  }

  private wysiwygRenderer(): string {
    if (!isString(this.cellValue)) {
      return "";
    }
    const tmp = document.createElement("DIV");
    tmp.innerHTML = this.cellValue;
    return tmp.textContent || tmp.innerText || "";
  }

  private dateCellRenderer(): string {
    if (!canBeDate(this.cellValue)) {
      return "";
    }
    return formatDate(this.cellValue, DATE_FORMAT, "fr");
  }

  private checkboxCellRenderer(): string {
    return this.cellValue ? this.checkboxLabels.yes : this.checkboxLabels.no;
  }

  private isCellArray(cellValue: unknown): cellValue is unknown[] {
    return !!cellValue && isArray(cellValue);
  }

  private getOption(val: unknown): string {
    const option = this.options?.options?.find((opt) => opt.value === val);
    if (!option) {
      return "";
    }
    const text = option.label || "";
    return text;
  }

  private getFileRenderer(): string {
    return "file";
  }

  private groupCellRenderer(): string {
    if (!isObject(this.cellValue)) {
      return "";
    }
    const information: string[] = [];
    const entries = Object.entries(this.cellValue);
    for (const [, val] of entries) {
      if (!isNil(val)) {
        information.push(`${val}`);
      }
    }
    const text = information.join(", ");
    return text;
  }
}
