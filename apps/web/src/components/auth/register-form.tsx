"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerUser } from "@/app/(auth)/register/actions";
import { Field, fieldErrorClass, fieldInputClass, FormError } from "./field";
import { PasswordInput } from "./password-input";
import { SocialRow } from "./social-row";
import { getPasswordRequirements, type PasswordRequirement } from "@flow/shared";
import { Icons } from "@flow/ui";
import Separator from "../separetor";
import { RegisterRequest } from "@flow/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RegisterFormData } from "@/lib/auth-resolvers";
import { refreshSession } from "@/hooks/useAuth";

interface RegisterFormProps {
  redirect: string;
}

export function RegisterForm({ redirect }: RegisterFormProps) {
  const router = useRouter();
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>();

  const requirements: PasswordRequirement[] = getPasswordRequirements();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting: isSubmittingRHF },
    setError,
    clearErrors,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterRequest),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      terms: false,
    },
    mode: "onBlur",
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitting(true);
    setServerError(undefined);
    clearErrors();

    try {
      const result = await registerUser({ ...data })

      if (result.success) {
        await refreshSession();
        router.push(result.redirect ?? redirect);
        return;
      }

      if (!result.success) {
        if (result.fieldErrors) {
          for (const [field, message] of Object.entries(result.fieldErrors)) {
            setError(field as keyof RegisterFormData, { type: "server", message  });
          }
        } else if (result.error) {
          setServerError(result.error);
        }
        return;
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitting = submitting || isSubmittingRHF;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-[-0.02em] mb-2">Create your account</h1>
        <p className="text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-link font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>

      <SocialRow />

      <Separator>or sign up with email</Separator>

      <form onSubmit={handleSubmit(onSubmit)}>
        {serverError && <FormError id="register-form-error" message={serverError} />}

        <Field
          label="Full name"
          htmlFor="name"
          error={errors.name?.message as string | undefined}
          icon={<Icons.UsersIcon className="w-full h-full" />}
        >
          <input
            type="text"
            id="name"
            placeholder="Maria Chen"
            autoComplete="name"
            autoFocus
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={errors.name ? fieldErrorClass : fieldInputClass}
            {...register("name")}
          />
        </Field>

        <Field
          label="Username"
          htmlFor="username"
          error={errors.username?.message as string | undefined}
          icon={<Icons.UserCircleIcon className="w-full h-full" />}
        >
          <input
            type="text"
            id="username"
            placeholder="johndoe"
            autoComplete="username"
            aria-invalid={errors.username ? true : undefined}
            aria-describedby={errors.username ? "username-error" : undefined}
            className={errors.username ? fieldErrorClass : fieldInputClass}
            {...register("username")}
          />
        </Field>

        <Field
          label="Work email"
          htmlFor="email"
          error={errors.email?.message as string | undefined}
          icon={<Icons.MailIcon className="w-full h-full" />}
        >
          <input
            type="email"
            id="email"
            placeholder="you@company.com"
            autoComplete="email"
            required
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={errors.email ? fieldErrorClass : fieldInputClass}
            {...register("email")}
          />
        </Field>

        <Field
          label="Password"
          htmlFor="password"
          error={errors.password?.message as string | undefined}
          icon={<Icons.LockIcon className="w-full h-full" />}
        >
          <PasswordInput
            id="password"
            placeholder="Create a password"
            autoComplete="new-password"
            hasError={!!errors.password}
            ariaInvalid={errors.password ? true : undefined}
            ariaDescribedby={errors.password ? "password-error" : undefined}
            {...register("password", {
              onBlur: () => setPasswordTouched(true),
            })}
          />
        </Field>
        {(passwordTouched || errors.password) && (
          <div className="mt-2 space-y-1.5" role="status" aria-live="polite">
            {requirements.map((req) => (
              <div
                key={req.label}
                className="flex items-center gap-2 text-xs transition-colors duration-150"
                style={{
                  color: passwordTouched
                    ? req.test(password)
                      ? "var(--color-success)"
                      : "var(--color-error)"
                    : "var(--color-muted-foreground)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`w-3 h-3 shrink-0 ${passwordTouched && req.test(password) ? "text-success" : passwordTouched && !req.test(password) ? "text-error" : "text-muted-foreground"}`}
                  aria-hidden="true"
                >
                  {passwordTouched && req.test(password) ? (
                    <Icons.CheckIcon className="w-3 h-3" strokeWidth={2} />
                  ) : passwordTouched && !req.test(password) ? (
                    <Icons.CloseIcon className="w-3 h-3" strokeWidth={1.6} />
                  ) : (
                    <Icons.CircleIcon className="w-3 h-3" strokeWidth={1.6} />
                  )}
                </svg>
                <span>{req.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mb-5">
          <label className="flex items-start gap-2 text-sm text-muted leading-normal cursor-pointer">
            <input
              type="checkbox"
              aria-invalid={errors.terms ? true : undefined}
              aria-describedby={errors.terms ? "terms-error" : undefined}
              className="w-4 h-4 accent-primary mt-0.5 shrink-0"
              {...register("terms")}
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="text-link font-semibold">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-link font-semibold">
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.terms && (
            <p id="terms-error" className="flex items-start gap-1.5 text-xs text-error leading-[1.45] mt-1.5">
              <Icons.AlertCircleIcon className="w-3 h-3 shrink-0 mt-0.5" />
              {errors.terms.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 font-bold text-sm py-3 rounded-field border-none cursor-pointer text-white bg-linear-to-br from-[#5b76ff] to-[#3f56e8] shadow-lg hover:-translate-y-px hover:shadow-xl transition-all duration-150 mb-5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <span aria-hidden="true" className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Create account
              <Icons.ArrowRightIcon className="w-3.5 h-3.5" strokeWidth={2} />
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-muted-foreground text-center leading-normal">
        No credit card required · Free for teams up to 10
      </p>
    </>
  );
}