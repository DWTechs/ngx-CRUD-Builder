import { InjectionToken, Provider } from "@angular/core";
import { FormFieldRenderer } from "./field-renderer";
import { FORM_FIELD_COMPONENT } from "./form-field-component.token";
import { FORM_FIELD_RENDERER } from "./form-field-renderer.token";
import { NativeFormFieldComponent } from "./native/native-form-field.component";
import { NativeFormFieldRenderer } from "./native/native-form-field-renderer";
import { OptimusUiFormFieldComponent } from "./optimus-ui/optimus-ui-form-field.component";

export type FormFieldAdapterType = "optimus-ui" | "native";

/** Also set to `"material"` by `provideMaterialFormFieldRenderer` (`@dwtechs/ngx-crud-builder/material`),
 * which is why the token type is wider than `FormFieldAdapterType`. */
export const FORM_ADAPTER = new InjectionToken<
  FormFieldAdapterType | "material"
>("FORM_ADAPTER");

/**
 * Provides the form field renderer for the given adapter type.
 *
 * Registers both:
 * - `FORM_FIELD_COMPONENT` — the full field component (label + control) used by `FormSimpleElement`
 * - `FORM_FIELD_RENDERER` — the bare control renderer used by `FormArrayElement`
 *
 * @param adapter `"optimus-ui"` for Optimus UI controls, `"native"` for plain HTML controls.
 * For Angular Material controls, use `provideMaterialFormFieldRenderer()` from
 * `@dwtechs/ngx-crud-builder/material` instead — kept in a separate entry point so
 * `@angular/material` is never resolved by apps that don't use it.
 *
 * @example
 * // app.config.ts
 * export const appConfig: ApplicationConfig = {
 *   providers: [...provideFormFieldRenderer('optimus-ui')]
 * };
 */
export function provideFormFieldRenderer(
  adapter: FormFieldAdapterType,
): Provider[] {
  const adapterProvider: Provider = {
    provide: FORM_ADAPTER,
    useValue: adapter,
  };
  if (adapter === "optimus-ui") {
    return [
      adapterProvider,
      { provide: FORM_FIELD_RENDERER, useValue: FormFieldRenderer },
      { provide: FORM_FIELD_COMPONENT, useValue: OptimusUiFormFieldComponent },
    ];
  }
  return [
    adapterProvider,
    { provide: FORM_FIELD_RENDERER, useValue: NativeFormFieldRenderer },
    { provide: FORM_FIELD_COMPONENT, useValue: NativeFormFieldComponent },
  ];
}
