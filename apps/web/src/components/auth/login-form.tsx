"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginUser } from "@/app/(auth)/login/actions";
import { Field, fieldErrorClass, fieldInputClass, FormError } from "./field";
import { PasswordInput } from "./password-input";
import { SocialRow } from "./social-row";
import Separator from "../separetor";
import { getPasswordRequirements, type PasswordRequirement } from "@flow/shared";
import { Icons } from "@flow/ui";
import { loginResolver, type LoginFormData } from "@/lib/auth-resolvers";
import { refreshSession } from "@/hooks/useAuth";
import { Button } from "@flow/ui";

interface LoginFormProps {
  redirect: string;
}

export function LoginForm({ redirect }: LoginFormProps) {
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
  } = useForm<LoginFormData>({
    resolver: loginResolver as unknown as import("react-hook-form").Resolver<LoginFormData>,
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
    mode: "onBlur",
  });

  const password = watch("password");

  const onSubmit = async (data: LoginFormData) => {
    setSubmitting(true);
    setServerError(undefined);
    clearErrors();

    try {

      const result = await loginUser({ ...data });

      if (result.success) {
        await refreshSession();
        router.push(result.redirect ?? redirect);
        return;
      }

      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof LoginFormData, { type: "server", message });
        });
      }
      if (result.error) {
        setServerError(result.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitting = submitting || isSubmittingRHF;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-auth-form-heading font-extrabold tracking-tight mb-2">Welcome back</h1>
        <p className="text-body text-muted">
          New to FlowBoard?{" "}
          <Link href="/register" className="text-link font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      <SocialRow />

      <Separator>or continue with email</Separator>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <FormError id="login-form-error" message={serverError} />}

        <Field
          label="Email"
          htmlFor="email"
          error={errors.email?.message as string | undefined}
          icon={<Icons.MailIcon className="w-full h-full" />}
        >
          <input
            type="email"
            id="email"
            placeholder="you@company.com"
            autoComplete="email"
            autoFocus
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
            placeholder="Enter your password"
            autoComplete="current-password"
            hasError={!!errors.password}
            ariaInvalid={errors.password ? true : undefined}
            ariaDescribedby={errors.password ? "password-error" : undefined}
            {...register("password", { onBlur: () => setPasswordTouched(true) })}
          />
        </Field>
        {(passwordTouched || errors.password) && (
          <div className="mt-2 space-y-1.5" role="status" aria-live="polite">
            {requirements.map((req) => (
              <div
                key={req.label}
                className="flex items-center gap-2 text-meta-small transition-colors duration-150"
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

        <div className="flex justify-between items-center mb-6">
          <label className="flex items-center gap-2 text-label text-muted cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-primary"
              {...register("remember")}
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-label text-link font-semibold hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          icon={<Icons.ArrowRightIcon className="w-3.5 h-3.5" strokeWidth={2} />}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <span aria-hidden="true" className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Logging in…
            </>
          ) : (
            <>
              Log in
            </>
          )}
        </Button>
      </form>

      <p className="text-meta text-muted-foreground text-center leading-normal">
        By continuing, you agree to FlowBoard&apos;s{" "}
        <Link href="/terms" className="text-link font-semibold">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-link font-semibold">
          Privacy Policy
        </Link>
        .
      </p>
    </>
  );
}