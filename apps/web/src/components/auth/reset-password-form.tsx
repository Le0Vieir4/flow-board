"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpcFetch } from "@/lib/api";
import { Field, FormError } from "./field";
import { PasswordInput } from "./password-input";
import { Icons } from "@flow/ui";
import { Button } from "@flow/ui";

const ResetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;

export function ResetPasswordForm({ token }: { token: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>();
  const [reset, setReset] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onBlur",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setSubmitting(true);
    setServerError(undefined);
    clearErrors();

    try {
      await trpcFetch("auth.reset-password", { token, password: data.password });
      setReset(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Cannot reach the server. Is the API running?";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (reset) {
    return (
      <div className="text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-success/10 text-success mx-auto mb-6">
          <Icons.CheckCircleIcon className="w-7 h-7" strokeWidth={2} />
        </div>
        <h1 className="text-auth-form-heading font-extrabold tracking-tight mb-2">Password reset</h1>
        <p className="text-body text-muted max-w-sm mx-auto mb-8">
          Your password has been reset successfully. You can now log in with your new password.
        </p>
        <Link href="/login" className="inline-flex items-center gap-1.5 text-link font-semibold hover:underline">
          <Icons.ArrowLeftIcon className="w-3.5 h-3.5" strokeWidth={1.8} />
          Log in
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-auth-form-heading font-extrabold tracking-tight mb-2">Reset password</h1>
        <p className="text-body text-muted">
          Choose a new password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <FormError id="reset-password-form-error" message={serverError} />}

        <Field
          label="New password"
          htmlFor="password"
          error={errors.password?.message as string | undefined}
          icon={<Icons.LockIcon className="w-full h-full" />}
        >
          <PasswordInput
            id="password"
            placeholder="Create a new password"
            autoComplete="new-password"
            autoFocus
            hasError={!!errors.password}
            ariaInvalid={errors.password ? true : undefined}
            ariaDescribedby={errors.password ? "password-error" : undefined}
            {...register("password")}
          />
        </Field>

        <Field
          label="Confirm password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message as string | undefined}
          icon={<Icons.LockIcon className="w-full h-full" />}
        >
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm your new password"
            autoComplete="new-password"
            hasError={!!errors.confirmPassword}
            ariaInvalid={errors.confirmPassword ? true : undefined}
            ariaDescribedby={errors.confirmPassword ? "confirm-password-error" : undefined}
            {...register("confirmPassword")}
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
              Resetting…
            </>
          ) : (
            <>
              Reset password
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
