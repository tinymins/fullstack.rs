import { forwardRef, type SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className = "", children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full rounded-md border px-3 py-2 text-sm transition-colors appearance-none
          bg-[var(--ui-bg)] text-[var(--ui-text)]
          border-[var(--ui-border)]
          focus:outline-none focus:ring-2 focus:ring-[var(--ui-ring)] focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:ring-red-500" : ""}
          ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";
