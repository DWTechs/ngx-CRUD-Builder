import { InjectionToken, Provider } from "@angular/core";
import { FormFieldRenderer } from "./field-renderer";
import { FORM_FIELD_COMPONENT } from "./form-field-component.token";
import { FORM_FIELD_RENDERER } from "./form-field-renderer.token";
import { MaterialFormFieldRenderer } from "./material/material-form-field-renderer";
import { MaterialFormFieldComponent } from "./material/material-form-field.component";
import { NativeFormFieldRenderer } from "./native/native-form-field-renderer";
import { NativeFormFieldComponent } from "./native/native-form-field.component";
import { OptimusUiFormFieldComponent } from "./optimus-ui/optimus-ui-form-field.component";

export type FormFieldAdapterType = "optimus-ui" | "native" | "material";

/** The form field adapter registered via `provideFormFieldRenderer`, used e.g. by
 * `TableComponent` to give an adapter-aware error when no table shell is available. */
export const FORM_ADAPTER = new InjectionToken<FormFieldAdapterType>(
  "FORM_ADAPTER",
);

/**
 * Provides the form field renderer for the given adapter type.
 *
 * Registers both:
 * - `FORM_FIELD_COMPONENT` — the full field component (label + control) used by `FormSimpleElement`
 * - `FORM_FIELD_RENDERER` — the bare control renderer used by `FormArrayElement`
 *
 * @param adapter `"optimus-ui"` for Optimus UI controls, `"native"` for plain HTML controls,
 * `"material"` for Angular Material controls. The `"material"` adapter requires
 * `@angular/material` and `@angular/animations` to be installed, and leaves controls
 * with no Material equivalent (color, files, picklist, table, custom, wysiwyg) unsupported.
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
  if (adapter === "material") {
    return [
      adapterProvider,
      { provide: FORM_FIELD_RENDERER, useValue: MaterialFormFieldRenderer },
      { provide: FORM_FIELD_COMPONENT, useValue: MaterialFormFieldComponent },
    ];
  }
  return [
    adapterProvider,
    { provide: FORM_FIELD_RENDERER, useValue: NativeFormFieldRenderer },
    { provide: FORM_FIELD_COMPONENT, useValue: NativeFormFieldComponent },
  ];
}
