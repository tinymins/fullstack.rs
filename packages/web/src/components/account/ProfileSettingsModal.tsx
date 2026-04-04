import { Avatar, Button, Input, Modal, Select } from "@acme/components";
import type { User } from "@acme/types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { userApi } from "@/generated/rust-api";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { message } from "@/lib/message";

interface ProfileSettingsModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (user: User) => void;
}

export default function ProfileSettingsModal({
  open,
  onClose,
  user,
  onUpdateUser,
}: ProfileSettingsModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [langMode, setLangMode] = useState<
    "auto" | "zh-CN" | "en-US" | "de-DE" | "ja-JP" | "zh-TW"
  >(user.settings?.langMode ?? "auto");
  const [themeMode, setThemeMode] = useState<"auto" | "light" | "dark">(
    user.settings?.themeMode ?? "auto",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatar = useAvatarUpload(user, onUpdateUser);

  // biome-ignore lint/correctness/useExhaustiveDependencies: syncFromUser is stable (useCallback)
  useEffect(() => {
    if (open) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setLangMode(user.settings?.langMode ?? "auto");
      setThemeMode(user.settings?.themeMode ?? "auto");
      avatar.syncFromUser(user);
    }
  }, [open, user]);

  const updateMutation = userApi.updateProfile.useMutation({
    onSuccess: (updated) => {
      onUpdateUser(updated);
      message.success(t("userMenu.saveSuccess"));
      onClose();
    },
    onError: (err) => {
      message.error(err.message || t("userMenu.saveFailed"));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMutation.mutateAsync({
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      settings: { langMode, themeMode },
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t("userMenu.profileSettings")}
      footer={null}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar upload */}
        <div className="flex items-center gap-4">
          <Avatar
            src={avatar.avatarUrl || undefined}
            alt={name || user.name}
            size="large"
          >
            {(name || user.name || "?").charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={avatar.handleFileChange}
            />
            <Button
              type="button"
              variant="default"
              loading={avatar.uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {t("common.uploadPhoto")}
            </Button>
            {avatar.avatarKey && (
              <Button
                type="button"
                variant="text"
                loading={avatar.deleteMutation.isPending}
                onClick={() => avatar.deleteMutation.mutate()}
              >
                {t("common.removePhoto")}
              </Button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
            {t("userMenu.name")}
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
            {t("userMenu.email")}
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
            {t("common.language")}
          </label>
          <Select
            value={langMode}
            onChange={(val) =>
              setLangMode(
                val as "auto" | "zh-CN" | "en-US" | "de-DE" | "ja-JP" | "zh-TW",
              )
            }
            options={[
              { value: "auto", label: t("common.followSystem") },
              { value: "zh-CN", label: t("common.lang.zhCN") },
              { value: "en-US", label: t("common.lang.enUS") },
              { value: "de-DE", label: t("common.lang.deDE") },
              { value: "ja-JP", label: t("common.lang.jaJP") },
              { value: "zh-TW", label: t("common.lang.zhTW") },
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
            {t("common.theme")}
          </label>
          <Select
            value={themeMode}
            onChange={(val) => setThemeMode(val as "auto" | "light" | "dark")}
            options={[
              { value: "auto", label: t("common.followSystem") },
              { value: "light", label: t("common.light") },
              { value: "dark", label: t("common.dark") },
            ]}
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="text" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={updateMutation.isPending}
          >
            {t("common.save")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
