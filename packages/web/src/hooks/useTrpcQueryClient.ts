import { QueryClient } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { useMemo, useRef } from "react";
import i18n from "@/lib/i18n";
import { message } from "@/lib/message";

/**
 * Creates a stable QueryClient with global tRPC error handling.
 * Redirects to /login on UNAUTHORIZED, /unauthorized on FORBIDDEN.
 */
export function useTrpcQueryClient() {
  const handleErrorRef = useRef<(error: unknown) => void>(() => {});
  handleErrorRef.current = (error: unknown) => {
    if (error instanceof TRPCClientError) {
      const code = error.data?.code;
      const route = error.data?.path ? `POST ${error.data.path}` : undefined;
      if (code === "UNAUTHORIZED") {
        message.error({
          content: error.message || i18n.t("errors.common.unauthorized"),
          route,
        });
        if (
          typeof window !== "undefined" &&
          !["/login", "/register"].includes(window.location.pathname)
        ) {
          const redirect = `${window.location.pathname}${window.location.search}`;
          window.location.assign(`/login?${new URLSearchParams({ redirect })}`);
        }
        return;
      }
      if (code === "FORBIDDEN") {
        message.error({
          content: error.message || i18n.t("errors.common.forbidden"),
          route,
        });
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/unauthorized"
        ) {
          window.location.assign("/unauthorized");
        }
        return;
      }
      message.error({
        content: error.message || i18n.t("errors.common.requestFailed"),
        route,
      });
      return;
    }
    if (error instanceof Error) {
      message.error(error.message || i18n.t("errors.common.requestFailed"));
    }
  };

  return useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1 },
          mutations: { onError: (error) => handleErrorRef.current(error) },
        },
      }),
    [],
  );
}
