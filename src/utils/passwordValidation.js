const passwordRules = [
  { test: (password) => password.length >= 10, message: 'al menos 10 caracteres' },
  { test: (password) => /[a-z]/.test(password), message: 'una letra minúscula' },
  { test: (password) => /[A-Z]/.test(password), message: 'una letra mayúscula' },
  { test: (password) => /\d/.test(password), message: 'un número' },
  { test: (password) => /[^A-Za-z\d\s]/.test(password), message: 'un carácter especial' },
  { test: (password) => !/\s/.test(password), message: 'no contener espacios' },
];

export function getPasswordValidation(password) {
  return passwordRules.filter(({ test }) => !test(password)).map(({ message }) => message);
}

export function getPasswordError(password) {
  const missingRules = getPasswordValidation(password);
  return missingRules.length > 0
    ? `La contraseña debe tener ${missingRules.join(', ')}.`
    : '';
}
