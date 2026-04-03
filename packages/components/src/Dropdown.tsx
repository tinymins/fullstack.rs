import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const DropdownContext = createContext<{ close: () => void }>({
  close: () => {},
});

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}

export function Dropdown({
  trigger,
  children,
  align = "right",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <DropdownContext.Provider value={{ close: () => setOpen(false) }}>
      <div ref={ref} className="relative inline-block">
        <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
        {open && (
          <div
            className={`absolute z-50 mt-2 min-w-[12rem] rounded-lg border border-[var(--ui-border)]
              bg-[var(--ui-bg)] py-1 shadow-lg
              ${align === "right" ? "right-0" : "left-0"}`}
          >
            {children}
          </div>
        )}
      </div>
    </DropdownContext.Provider>
  );
}

interface DropdownItemProps {
  onClick?: () => void;
  danger?: boolean;
  children: ReactNode;
}

export function DropdownItem({ onClick, danger, children }: DropdownItemProps) {
  const { close } = useContext(DropdownContext);
  return (
    <button
      className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors
        ${
          danger
            ? "text-red-500 hover:bg-red-500/10"
            : "text-[var(--ui-text)] hover:bg-[var(--ui-bg-subtle)]"
        }`}
      onClick={() => {
        onClick?.();
        close();
      }}
    >
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="my-1 border-t border-[var(--ui-border)]" />;
}
