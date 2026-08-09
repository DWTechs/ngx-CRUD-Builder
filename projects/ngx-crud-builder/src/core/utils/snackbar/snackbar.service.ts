import { TitleCasePipe } from "@angular/common";
import { Injectable, signal } from "@angular/core";
import { ToastMessage, ToastSeverity } from "./toast-message.model";

const DEFAULT_LIFE = 3000;

/**
 * Framework-agnostic toast queue, rendered by `CrdToastComponent`. No PrimeNG/Material
 * dependency, used regardless of the form field / table adapter chosen.
 */
@Injectable({ providedIn: "root" })
export class SnackbarService {
  private readonly _messages = signal<ToastMessage[]>([]);
  private nextId = 0;

  public readonly messages = this._messages.asReadonly();

  public displayError(
    message = "Une erreur est survenue",
    summary?: string,
  ): void {
    this.show({ severity: "error", detail: message, summary });
  }

  public displaySuccess(): void {
    this.show({ severity: "success" });
  }

  public displayInfo(message: string): void {
    this.show({ severity: "info", detail: message });
  }

  public dismiss(id: number): void {
    this._messages.update((messages) => messages.filter((m) => m.id !== id));
  }

  private show(
    message: Partial<Pick<ToastMessage, "summary" | "detail" | "life">> & {
      severity: ToastSeverity;
    },
  ): void {
    const id = this.nextId++;
    const summary =
      message.summary ?? TitleCasePipe.prototype.transform(message.severity);
    const life = message.life ?? DEFAULT_LIFE;
    this._messages.update((messages) => [
      ...messages,
      { ...message, id, summary, life },
    ]);
    setTimeout(() => this.dismiss(id), life);
  }
}
