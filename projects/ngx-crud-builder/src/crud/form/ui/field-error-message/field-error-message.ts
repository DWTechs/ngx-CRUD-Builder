import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { CRUD_LABELS } from "../../../core/utils/i18n/crud-labels.token";
import { supplant } from "../../../core/utils/supplant/supplant.utils";
import { APP_FORM_CONFIG } from "../../utils/form.injection-token";
import { BASE_FORM_ERROR_MESSAGES } from "../../utils/form-error-messages";

@Component({
  selector: "frm-error-message",
  template: `    
    @let message = errorMessage();
    <small class="control-error" [title]="message">
        {{ message }}
    </small>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorMessage {
  public readonly controlErrors = input.required<FormControl["errors"]>();

  private readonly customErrorMessages =
    inject(APP_FORM_CONFIG).customErrorMessages;
  private readonly labels = inject(CRUD_LABELS);

  public readonly errorMessage = computed(() => {
    const controlErrors = this.controlErrors() ?? {};
    const errorKeys = Object.keys(controlErrors);
    // No error keys: no errors to show
    if (!errorKeys.length) return "";
    // If control has errors, we show the first error
    const firstError = errorKeys[0];
    const errorContent = controlErrors[firstError];
    // errorContent is like: { requiredLength: 3, actualLength: 1 }
    if (errorContent) {
      const message = this.getMessage(firstError);
      // Enriches error message with error actual content
      return supplant(message, errorContent);
    }
    // Fallback to default message
    return this.getDefaultMessage();
  });

  // Merge base messages with custom messages
  private readonly messages: Record<string, string> = {
    ...BASE_FORM_ERROR_MESSAGES,
    ...this.labels.validators,
    ...this.customErrorMessages,
  };

  private getMessage(key: string): string {
    return this.messages[key] ?? this.getDefaultMessage();
  }

  private getDefaultMessage(): string {
    return this.messages["invalid"] ?? "";
  }
}
