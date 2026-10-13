export { RegisterRequest } from "./register";
export { LoginRequest } from "./login";
export { passwordSchema, passwordRegex, emailSchema, usernameSchema, usernameRegex } from "./password";
export { validatePassword, getPasswordErrors, getPasswordRequirements, type PasswordRequirement, PASSWORD_REQUIREMENTS } from "./password";

import { RegisterRequest } from "./register";
import { LoginRequest } from "./login";

export function validateRegister(input: unknown) {
  return RegisterRequest.safeParse(input);
}

export function validateLogin(input: unknown) {
  return LoginRequest.safeParse(input);
}