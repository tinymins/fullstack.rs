import { Button, Input } from "@acme/components";
import type { User } from "@acme/types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/hooks";
import { trpc } from "@/lib/trpc";

type LoginPageProps = {
  initialMode?: "login" | "register";
};

export default function AuthPage({ initialMode = "login" }: LoginPageProps) {
  const { t } = useTranslation();
  const { login, isAuthed, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const error = (
    mode === "login" ? loginMutation.error : registerMutation.error
  )?.message;
  const isPending = loginMutation.isPending || registerMutation.isPending;
  const redirect = searchParams.get("redirect");
  // Prevent redirect-effect from firing when handleSubmit already navigated.
  const didNavigate = useRef(false);

  useEffect(() => {
    if (!isLoading && isAuthed && !didNavigate.current) {
      navigate(redirect || "/dashboard");
    }
  }, [isAuthed, isLoading, navigate, redirect]);

  useEffect(() => {
    setMode(initialMode);
    setEmail("");
    setPassword("");
  }, [initialMode]);

  if (isLoading) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mutation = mode === "login" ? loginMutation : registerMutation;
    const result = await mutation.mutateAsync({ email, password });
    login(result.user as User);
    didNavigate.current = true;
    navigate(redirect || `/dashboard/${result.defaultWorkspaceSlug}`);
  };

  const switchMode = () => {
    const next = mode === "login" ? "register" : "login";
    setMode(next);
    setEmail("");
    setPassword("");
    const q = redirect ? `?redirect=${encodeURIComponent(redirect)}` : "";
    navigate(next === "login" ? `/login${q}` : `/register${q}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center px-4 bg-[var(--ui-bg-subtle)]">
      <div className="w-full max-w-sm">
        <div className="rounded-lg border p-8 bg-[var(--ui-bg)] border-[var(--ui-border)]">
          <h1 className="text-xl font-semibold mb-6 text-[var(--ui-text)]">
            {mode === "login" ? t("auth.login") : t("auth.register")}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t("user.email")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="me@example.com"
              required
            />
            <Input
              label={t("auth.password")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {error && (
              <p
                className="rounded-md border px-3 py-2 text-sm
                  text-[var(--ui-danger-text)] bg-[var(--ui-danger-bg)]
                  border-[var(--ui-danger-text)]"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              fullWidth
              loading={isPending}
              className="mt-1"
            >
              {mode === "login" ? t("auth.login") : t("auth.register")}
            </Button>

            <button
              type="button"
              onClick={switchMode}
              className="cursor-pointer w-full text-sm hover:underline text-[var(--ui-text-muted)]"
            >
              {mode === "login"
                ? t("auth.noAccountRegister")
                : t("auth.haveAccountLogin")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
