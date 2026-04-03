import { Avatar, Dropdown, type DropdownMenuItem } from "@acme/components";
import type { User } from "@acme/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { resolveAvatarUrl } from "@/lib/avatar";
import ProfileSettingsModal from "./ProfileSettingsModal";
import SystemSettingsModal from "./SystemSettingsModal";

type UserMenuProps = {
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
  showDashboardLink?: boolean;
};

export default function UserMenu({
  user,
  onUpdateUser,
  onLogout,
  showDashboardLink = false,
}: UserMenuProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [systemSettingsOpen, setSystemSettingsOpen] = useState(false);
  const displayName = user.name || user.email;
  const isAdmin = user.role === "admin" || user.role === "superadmin";

  const items: DropdownMenuItem[] = [
    {
      key: "header",
      type: "label",
      label: (
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
            {displayName}
          </p>
          <p className="text-xs text-[var(--text-muted)] truncate">
            {user.email}
          </p>
        </div>
      ),
    },
    { type: "divider" },
    ...(showDashboardLink
      ? [
          {
            key: "dashboard",
            label: t("landing.nav.dashboard"),
            onClick: () => {
              setOpen(false);
              navigate("/dashboard");
            },
          },
        ]
      : []),
    {
      key: "profile",
      label: t("user.profileSettings"),
      onClick: () => {
        setOpen(false);
        setSettingsOpen(true);
      },
    },
    ...(isAdmin
      ? [
          {
            key: "admin",
            label: t("userMenu.admin"),
            onClick: () => {
              setOpen(false);
              setSystemSettingsOpen(true);
            },
          },
        ]
      : []),
    {
      key: "logout",
      label: t("user.signOut"),
      danger: true,
      onClick: () => {
        setOpen(false);
        onLogout();
      },
    },
  ];

  return (
    <>
      <Dropdown
        open={open}
        onOpenChange={setOpen}
        trigger={["click"]}
        placement="bottomRight"
        menu={{ items }}
      >
        <button
          type="button"
          className="cursor-pointer w-full flex items-center gap-2 rounded px-2 py-1.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-glass-hover)] transition-colors"
        >
          <Avatar
            src={resolveAvatarUrl(user.settings?.avatarKey)}
            alt={user.name}
            size="small"
          >
            {(user.name || "?").charAt(0).toUpperCase()}
          </Avatar>
          <span className="flex-1 text-left truncate font-medium">
            {displayName}
          </span>
        </button>
      </Dropdown>

      <ProfileSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        onUpdateUser={onUpdateUser}
      />

      {isAdmin && (
        <SystemSettingsModal
          open={systemSettingsOpen}
          onClose={() => setSystemSettingsOpen(false)}
          user={user}
        />
      )}
    </>
  );
}
