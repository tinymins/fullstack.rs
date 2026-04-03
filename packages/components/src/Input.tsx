import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-md border px-3 py-2 text-sm transition-colors
          bg-[var(--ui-bg)] text-[var(--ui-text)]
          border-[var(--ui-border)] placeholder:text-[var(--ui-text-subtle)]
          focus:outline-none focus:ring-2 focus:ring-[var(--ui-ring)] focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:ring-red-500" : ""}
          ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
