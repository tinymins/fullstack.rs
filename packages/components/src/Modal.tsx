import { type ReactNode, useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = "max-w-lg",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={`w-full ${width} rounded-lg bg-[var(--ui-bg)] shadow-xl border border-[var(--ui-border)]`}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-[var(--ui-border)] px-6 py-4">
            <h3 className="text-lg font-semibold text-[var(--ui-text)]">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-[var(--ui-text-subtle)] hover:text-[var(--ui-text)] transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-[var(--ui-border)] px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
