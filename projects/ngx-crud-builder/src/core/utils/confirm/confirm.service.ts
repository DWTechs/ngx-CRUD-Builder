import { Injectable, signal } from "@angular/core";
import { ConfirmOptions } from "./confirm-options.model";

/**
 * Framework-agnostic confirmation dialog state, rendered by `CrdConfirmComponent`.
 * No Optimus UI/Material dependency, used regardless of the form field / table adapter chosen.
 */
@Injectable({ providedIn: "root" })
export class ConfirmService {
  private readonly _current = signal<ConfirmOptions | null>(null);

  public readonly current = this._current.asReadonly();

  public confirm(options: ConfirmOptions): void {
    this._current.set(options);
  }

  public accept(): void {
    this._current()?.accept();
    this._current.set(null);
  }

  public reject(): void {
    this._current()?.reject?.();
    this._current.set(null);
  }
}
