import { CurrencyPipe, DecimalPipe, PercentPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { isNumber, isString } from "@dwtechs/checkard";
import { CrudItemOptions } from "../../../models/crud-item-options.model";
import {
  NUMBER_FORMAT,
  NUMBER_STYLES,
} from "../../../utils/numbers/numbers.utils";

@Component({
  selector: "tbl-number-cell-renderer",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, CurrencyPipe, PercentPipe],
  template: `
    @switch (numberStyle()) {
      @case (NumberStyles.CURRENCY) {
        {{ valueAsNumber() | currency: currencyCode() : "symbol" : numberFormat() }}
      }
      @case (NumberStyles.PERCENT) {
        {{ valueAsNumber() | percent: numberFormat() }}
      }
      @default {
        {{ valueAsNumber() | number: numberFormat() }}
      }
    }
  `,
})
export class NumberCellRendererComponent {
  public readonly cellValue = input.required<unknown>();
  public readonly options = input.required<CrudItemOptions>();

  public readonly NumberStyles = NUMBER_STYLES;

  public readonly valueAsNumber = computed(() => {
    const value = this.cellValue();
    if (isNumber(value)) return value;
    if (isString(value) && value.trim() !== "") return Number(value);
    return null;
  });

  public readonly numberStyle = computed(
    () => this.options().columnOptions?.numberStyle ?? NUMBER_STYLES.DECIMAL,
  );
  public readonly numberFormat = computed(
    () => this.options().columnOptions?.numberFormat ?? NUMBER_FORMAT,
  );
  public readonly currencyCode = computed(
    () => this.options().columnOptions?.currencyCode ?? "USD",
  );
}
