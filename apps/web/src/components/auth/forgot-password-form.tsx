"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { forgotPassword } from "@/app/(auth)/forgot-password/actions";
import { Field, fieldErrorClass, fieldInputClass, FormError } from "./field";
import { Icons } from "@flow/ui";
import { Button } from "@flow/ui";

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<{ email: string }>({
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  const onSubmit = async (data: { email: string }) => {
    setSubmitting(true);
    setServerError(undefined);
    clearErrors();

    try {
      const result = await forgotPassword(data);

      if (result.success) {
        setSent(true);
        return;
      }

      if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof { email: string }, { type: "server", message });
        });
      }
      if (result.error) {
        setServerError(result.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-success/10 text-success mx-auto mb-6">
          <Icons.MailIcon className="w-7 h-7" strokeWidth={2} />
        </div>
        <h1 className="text-auth-form-heading font-extrabold tracking-tight mb-2">Check your email</h1>
        <p className="text-body text-muted max-w-sm mx-auto mb-8">
          We&apos;ve sent a password reset link to your inbox. If you don&apos;t see it soon, check your spam folder.
        </p>
        <Link href="/login" className="inline-flex items-center gap-1.5 text-link font-semibold hover:underline">
          <Icons.ArrowLeftIcon className="w-3.5 h-3.5" strokeWidth={1.8} />
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-auth-form-heading font-extrabold tracking-tight mb-2">Forgot password</h1>
        <p className="text-body text-muted">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <FormError id="forgot-password-form-error" message={serverError} />}

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

        <Button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          icon={<Icons.ArrowRightIcon className="w-3.5 h-3.5" strokeWidth={2} />}
          className="w-full"
        >
          {submitting ? (
            <>
              <span aria-hidden="true" className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send reset link
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center">
        Remember your password?{" "}
        <Link href="/login" className="text-link font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
