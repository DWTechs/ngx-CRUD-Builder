/** ALPHABETICAL */

const alphabeticalCaracters = "a-zA-Zàâçéèêëîïôûùüÿñæœ'";
export const nameWithDashes = (message = "") => ({
  pattern: `^[${alphabeticalCaracters} —-]+$`,
  message,
});

export const lettersWithSpaces = (message = "") => ({
  pattern: `^[${alphabeticalCaracters} ]+$`,
  message,
});

export const lettersWithoutSpaces = (message = "") => ({
  pattern: `^[${alphabeticalCaracters}]+$`,
  message,
});

/** ALPHANUMERICAL */

export const alphanumericalWithSpaces = (message = "") => ({
  pattern: /^[\p{L}0-9 ]+$/u,
  message,
});

export const alphanumericalWithoutSpaces = (message = "") => ({
  pattern: /^[\p{L}0-9]+$/u,
  message,
});

export const onlyCaps = (message = "") => ({
  pattern: /^[A-Z0-9]+$/,
  message,
});

/** NUMERICAL */

export const integer = (message = "") => ({
  pattern: /^[0-9]+$/,
  message,
});

/** OTHERS */
export const phoneNumber = (message = "") => ({
  pattern:
    /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
  message,
});

export const withExtension = (message = "") => ({
  pattern: /[^\\]*\.(\w+)$/,
  message,
});
