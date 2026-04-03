import { Toaster, type ToastMessage, type ToastType } from "@acme/components";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { registerToastCallback } from "@/lib/message";

let _nextId = 0;

export function MessageProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    registerToastCallback(({ type, content, route }) => {
      _nextId += 1;
      const id = String(_nextId);
      setToasts((prev) => [
        ...prev,
        { id, type: type as ToastType, content, route },
      ]);
    });
  }, []);

  const handleClose = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <>
      {children}
      <Toaster items={toasts} onClose={handleClose} />
    </>
  );
}
