import { InjectionToken, Type } from "@angular/core";

/**
 * Injection token used to provide a form field renderer component.
 *
 * **Required** — the application will throw a `NullInjectorError` at runtime
 * if this token is not provided. Use `provideFormFieldRenderer('primeng')` to keep
 * the default PrimeNG behaviour, `provideFormFieldRenderer('native')` for native HTML,
 * or `provideFormFieldRenderer('material')` for Angular Material controls.
 *
 * The provided value must be an Angular standalone component class that accepts:
 * - `config: CrudItemOptions` (required input)
 * - `control: FormControl` (required input)
 * - `isFormReadonly: boolean | undefined` (required input)
 * - `syncValueInc: number` (required input)
 * - `fieldInteraction: OutputEmitterRef<FormFieldInteractionEvent>` (output)
 *
 * @example
 * // app.config.ts
 * providers: [providePrimengFormFieldRenderer()]
 */
export const FORM_FIELD_RENDERER = new InjectionToken<Type<unknown>>(
  "FORM_FIELD_RENDERER",
);
