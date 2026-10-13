import * as z from "zod";

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,128}$/;

export const passwordSchema = z.string().min(8).max(128).regex(passwordRegex, {
  message: "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character",
});

export const optionalPasswordSchema = z.string().min(8).max(128).regex(passwordRegex, {
  message: "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character",
}).optional();

export const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;

export const usernameSchema = z.string().regex(usernameRegex, {
  message: "Username must be 3-30 characters and contain only letters, numbers, and underscores",
});

export const emailSchema = z.string().email().toLowerCase();

export interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "At least 1 uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "At least 1 lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "At least 1 number", test: (p) => /\d/.test(p) },
  { label: "At least 1 special character", test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
  { label: "Maximum 128 characters", test: (p) => p.length <= 128 },
];

export function validatePassword(password: string): boolean {
  return passwordRegex.test(password);
}

export function getPasswordErrors(password: string): string[] {
  return PASSWORD_REQUIREMENTS
    .filter((req) => !req.test(password))
    .map((req) => req.label);
}

export function getPasswordRequirements(): PasswordRequirement[] {
  return PASSWORD_REQUIREMENTS;
}