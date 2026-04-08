/**
 * Base error messages for form validation.
 * Strings are provided via the CRUD_LABELS injection token.
 * This object is kept for backwards compatibility with customErrorMessages override.
 */
export const BASE_FORM_ERROR_MESSAGES: Record<string, string> = {
  pattern: "{expected}",
};
