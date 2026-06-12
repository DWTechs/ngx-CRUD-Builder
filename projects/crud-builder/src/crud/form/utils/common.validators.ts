import { AbstractControl, ValidationErrors, Validators } from "@angular/forms";

/** Validator to check if the value is required */
export const required = Validators.required;
/** Validator to check if the value is true */
export const requiredTrue = Validators.requiredTrue;
/** Validator to check if the value is greater than x */
export const min = (x: number) => Validators.min(x);
/** Validator to check if the value is less than x */
export const max = (x: number) => Validators.max(x);
/** Validator to check if the value has a length greater than x */
export const minlength = (x: number) => Validators.minLength(x);
/** Validator to check if the value has a length less than x */
export const maxlength = (x: number) => Validators.maxLength(x);
/** Validator to check if the value is a valid CSS hex color (#RGB or #RRGGBB) */
export const hexColor = (control: AbstractControl): ValidationErrors | null => {
  const val = control.value;
  if (!val) return null;
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)
    ? null
    : { hexColor: true };
};
