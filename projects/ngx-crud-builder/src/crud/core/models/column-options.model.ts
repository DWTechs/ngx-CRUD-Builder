import { Type } from "@angular/core";
import { SafeHtml } from "@angular/platform-browser";
import { FilterMetadata } from "@openng/optimus-ui/api";
import { NumberStyle } from "../utils/numbers/numbers.utils";
import { ControlType } from "./control-type.model";

export class ColumnOptions {
  /** Defines if the column is sortable or not */
  sortable?: boolean;
  /** Specifies a default value for the filter*/
  defaultFilter?: FilterMetadata | FilterMetadata[];
  /** Should the column be sorted by default when landing on the table */
  defaultSortField?: boolean;
  /** Should the column be sorted ascending (1) or descending (-1) */
  defaultSortOrder?: -1 | 1;
  /** Defines if the column is filterable or not */
  filterable?: boolean;
  /** Specifies a specific control type for the filter input */
  filterType?: ControlType;
  /** Custom tooltip renderer for the column cells */
  tooltip?: (cellValue: unknown) => SafeHtml;
  /** If set to true, the column will be hidden but can be unhidden in column management */
  isSoftHidden?: boolean;
  /** If set to true, the column will be hidden in the table and in the column management dialog */
  isHardHidden?: boolean;
  /** Specifies a custom renderer for datatable cells
   * TODO: allow to use a custom component as renderer
   * Warning: be careful when using this prop, as it can lead to performance issues
   * Along with xss security issues if the renderer returns unsafe HTML
   */
  customCellRenderer?: (cellValue: unknown) => string;
  /** Specifies a custom HTML renderer for the column header
   * Warning: be careful when using this prop as it can lead to XSS security issues
   * if the renderer returns unsafe HTML
   */
  customHeaderRenderer?: (label: string) => string;
  /** Specifies a custom component for datatable cells -- Works for CUSTOM controlType */
  customComponent?: Type<unknown>;
  /** If true and the value is an array, each item will be displayed as a chip. Default true */
  valueAsChip?: boolean;
  /** Cell will be centered */
  centered?: boolean;
  /** Maximal width of the column. If not defined, will default to 150px */
  defaultWidth?: string;
  /* Should column be frozen (false by default)
    As default is left frozen, the frozen columns should be the first ones
  */
  isFrozen?: boolean;
  /** Specifies if the column should be ignore on export */
  ignoreOnExport?: boolean;
  /** If the column should have a different label that the main label defined in CrudItemOptions */
  label?: string;
  /** Custom tooltip for the column header. Falls back to the column label if not defined */
  headerTooltip?: string;
  /** If the edition of this cell should be disabled in inline-cell edition mode */
  isCellEditionDisabled?: boolean;
  /**
   * Format string passed to Angular's `DatePipe` used to render `date` typed columns.
   * @default 'yyyy-MM-dd' (see `DATE_FORMAT`)
   * @example `dateFormat: 'dd/MM/yyyy'`
   */
  dateFormat?: string;
  /**
   * Applies locale-aware number formatting to `number` typed columns (based on the app's `LOCALE_ID`).
   * - 'decimal' (default): plain locale-formatted number
   * - 'currency': formatted as a currency amount, see `currencyCode`
   * - 'percent': formatted as a percentage
   * @example `numberStyle: 'currency'`
   */
  numberStyle?: NumberStyle;
  /**
   * `digitsInfo` string passed to Angular's `DecimalPipe`/`CurrencyPipe`/`PercentPipe`
   * @default '1.0-2'
   * @example `numberFormat: '1.2-2'` // Always show exactly 2 decimal digits
   */
  numberFormat?: string;
  /**
   * ISO 4217 currency code used when `numberStyle` is 'currency'
   * @default 'USD'
   * @example `currencyCode: 'EUR'`
   */
  currencyCode?: string;
}
