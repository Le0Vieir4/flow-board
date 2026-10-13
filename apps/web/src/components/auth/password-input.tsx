"use client";

import { useState, type InputHTMLAttributes, forwardRef, useRef, useImperativeHandle } from "react";
import { fieldErrorClass, fieldInputClass } from "./field";
import { Icons } from "@flow/ui";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  hasError?: boolean;
  ariaInvalid?: boolean;
  ariaDescribedby?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement | null, PasswordInputProps>(
  ({ id, placeholder, autoComplete, hasError = false, onChange, ariaInvalid, ariaDescribedby, ...rest }, ref) => {
    const [show, setShow] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!, []);

    return (
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={onChange}
          required
          aria-invalid={hasError || ariaInvalid || undefined}
          aria-describedby={hasError ? `${id}-error` : ariaDescribedby}
          className={`${hasError ? fieldErrorClass : fieldInputClass} pr-10`}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer bg-transparent border-none p-0 flex items-center justify-center transition-colors duration-150"
        >
          {show ? (
            <Icons.EyeOffIcon className="w-3.5 h-3.5" strokeWidth={1.6} />
          ) : (
            <Icons.EyeIcon className="w-3.5 h-3.5" strokeWidth={1.6} />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
