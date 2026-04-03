import { useTranslation } from "react-i18next";
import { useAuth, useWorkspace } from "@/hooks";

export default function WorkspaceRoute() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const workspace = useWorkspace();

  return (
    <div className="p-8">
      <div className="rounded-lg border bg-[var(--ui-bg)] border-[var(--ui-border)] p-8 text-center space-y-3">
        <h2 className="text-2xl font-semibold text-[var(--ui-text)]">
          {t("workspace.placeholder")}
        </h2>
        <p className="text-[var(--ui-text-muted)]">
          {t("workspace.currentWorkspace")}
          <code className="text-[var(--ui-focus)]">{workspace.name}</code>
          <span className="ml-2 text-xs text-[var(--ui-text-subtle)]">
            /{workspace.slug}
          </span>
        </p>
        {user && (
          <p className="text-sm text-[var(--ui-text-subtle)]">
            {t("workspace.userLabel")}
            {user.name || user.email}
          </p>
        )}
      </div>
    </div>
  );
}
