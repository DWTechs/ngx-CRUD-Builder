import { InjectionToken, Type } from "@angular/core";

/**
 * Injection token used to provide a full form field component (label + control).
 *
 * **Required** — the application will throw a `NullInjectorError` at runtime
 * if this token is not provided. Use `provideFormFieldRenderer('primeng')` to keep
 * the default PrimeNG behaviour, `provideFormFieldRenderer('native')` for native HTML,
 * or `provideFormFieldRenderer('material')` for Angular Material controls.
 *
 * The provided component must accept the following inputs:
 * - `config: CrudItemOptions` (required)
 * - `control: FormControl` (required)
 * - `isFormReadonly: boolean | undefined` (required)
 * - `syncValueInc: number` (required)
 * - `labelStrategy: LabelStrategy` (required)
 * - `labelVariant: "on" | "in" | "over" | undefined` (optional)
 *
 * And emit:
 * - `fieldInteraction: OutputEmitterRef<FormFieldInteractionEvent>`
 *
 * @see FormFieldComponentBase for the base class implementing this contract.
 */
export const FORM_FIELD_COMPONENT = new InjectionToken<Type<unknown>>(
  "FORM_FIELD_COMPONENT",
);
