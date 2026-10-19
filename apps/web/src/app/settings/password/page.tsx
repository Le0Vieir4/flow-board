"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpcFetch } from "@/lib/api";
import { Field, FormError } from "@/components/auth/field";
import { PasswordInput } from "@/components/auth/password-input";
import { Icons } from "@flow/ui";
import { Button } from "@flow/ui";

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

export function ChangePasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>();
  const [changed, setChanged] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    mode: "onBlur",
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setSubmitting(true);
    setServerError(undefined);
    clearErrors();

    try {
      await trpcFetch("auth.change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setChanged(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Cannot reach the server. Is the API running?";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (changed) {
    return (
      <div className="text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-success/10 text-success mx-auto mb-6">
          <Icons.CheckCircleIcon className="w-7 h-7" strokeWidth={2} />
        </div>
        <h1 className="text-auth-form-heading font-extrabold tracking-tight mb-2">Password changed</h1>
        <p className="text-body text-muted max-w-sm mx-auto mb-8">
          Your password has been changed successfully. All other sessions have been signed out.
        </p>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-link font-semibold hover:underline">
          <Icons.ArrowLeftIcon className="w-3.5 h-3.5" strokeWidth={1.8} />
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-auth-form-heading font-extrabold tracking-tight mb-2">Change password</h1>
        <p className="text-body text-muted">
          Update your account password. All other sessions will be signed out.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {serverError && <FormError id="change-password-form-error" message={serverError} />}

        <Field
          label="Current password"
          htmlFor="currentPassword"
          error={errors.currentPassword?.message as string | undefined}
          icon={<Icons.LockIcon className="w-full h-full" />}
        >
          <PasswordInput
            id="currentPassword"
            placeholder="Enter your current password"
            autoComplete="current-password"
            autoFocus
            hasError={!!errors.currentPassword}
            ariaInvalid={errors.currentPassword ? true : undefined}
            ariaDescribedby={errors.currentPassword ? "current-password-error" : undefined}
            {...register("currentPassword")}
          />
        </Field>

        <Field
          label="New password"
          htmlFor="newPassword"
          error={errors.newPassword?.message as string | undefined}
          icon={<Icons.LockIcon className="w-full h-full" />}
        >
          <PasswordInput
            id="newPassword"
            placeholder="Create a new password"
            autoComplete="new-password"
            hasError={!!errors.newPassword}
            ariaInvalid={errors.newPassword ? true : undefined}
            ariaDescribedby={errors.newPassword ? "new-password-error" : undefined}
            {...register("newPassword")}
          />
        </Field>

        <Field
          label="Confirm new password"
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
              Changing…
            </>
          ) : (
            <>
              Change password
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center">
        <Link href="/dashboard" className="text-link font-semibold hover:underline">
          Back to dashboard
        </Link>
      </p>
    </>
  );
}

export default ChangePasswordForm;
