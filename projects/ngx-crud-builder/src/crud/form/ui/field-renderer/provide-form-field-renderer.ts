import { Provider } from "@angular/core";
import { FormFieldRenderer } from "./field-renderer";
import { FORM_FIELD_COMPONENT } from "./form-field-component.token";
import { FORM_FIELD_RENDERER } from "./form-field-renderer.token";
import { NativeFormFieldRenderer } from "./native/native-form-field-renderer";
import { NativeFormFieldComponent } from "./native/native-form-field.component";
import { PrimengFormFieldComponent } from "./primeng/primeng-form-field.component";

export type FormFieldAdapterType = "primeng" | "native";

/**
 * Provides the form field renderer for the given adapter type.
 *
 * Registers both:
 * - `FORM_FIELD_COMPONENT` — the full field component (label + control) used by `FormSimpleElement`
 * - `FORM_FIELD_RENDERER` — the bare control renderer used by `FormArrayElement`
 *
 * @param adapter `"primeng"` for PrimeNG controls, `"native"` for plain HTML controls.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [...provideFormFieldRenderer('primeng')]
 * };
 */
export function provideFormFieldRenderer(
  adapter: FormFieldAdapterType,
): Provider[] {
  if (adapter === "primeng") {
    return [
      { provide: FORM_FIELD_RENDERER, useValue: FormFieldRenderer },
      { provide: FORM_FIELD_COMPONENT, useValue: PrimengFormFieldComponent },
    ];
  }
  return [
    { provide: FORM_FIELD_RENDERER, useValue: NativeFormFieldRenderer },
    { provide: FORM_FIELD_COMPONENT, useValue: NativeFormFieldComponent },
  ];
}
