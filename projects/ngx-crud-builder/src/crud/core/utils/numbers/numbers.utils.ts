/** Default `digitsInfo` used by Angular's `DecimalPipe`/`CurrencyPipe`/`PercentPipe` */
export const NUMBER_FORMAT = "1.0-2";

export const NUMBER_STYLES = {
  DECIMAL: "decimal",
  CURRENCY: "currency",
  PERCENT: "percent",
} as const;

export type NumberStyle = (typeof NUMBER_STYLES)[keyof typeof NUMBER_STYLES];
