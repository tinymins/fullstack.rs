import { Avatar, Button, Input, Modal, Select } from "@acme/components";
import type { User } from "@acme/types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { message } from "@/lib/message";
import { trpc } from "@/lib/trpc";

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
  const [langMode, setLangMode] = useState<"auto" | "zh" | "en">(
    user.settings?.langMode ?? "auto",
  );
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

  const updateMutation = trpc.user.updateProfile.useMutation({
    onSuccess: (updated) => {
      onUpdateUser(updated);
      message.success(t("user.saveSuccess"));
      onClose();
    },
    onError: (err) => {
      message.error(err.message || t("user.saveFailed"));
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
    <Modal open={open} onClose={onClose} title={t("user.profileSettings")}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar upload */}
        <div className="flex items-center gap-4">
          <Avatar
            name={name || user.name}
            email={email || user.email}
            url={avatar.avatarUrl || undefined}
            size="lg"
          />
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
              variant="secondary"
              loading={avatar.uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {t("common.uploadPhoto")}
            </Button>
            {avatar.avatarKey && (
              <Button
                type="button"
                variant="ghost"
                loading={avatar.deleteMutation.isPending}
                onClick={() => avatar.deleteMutation.mutate()}
              >
                {t("common.removePhoto")}
              </Button>
            )}
          </div>
        </div>

        <Input
          label={t("user.name")}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label={t("user.email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Select
          label={t("common.language")}
          value={langMode}
          onChange={(e) => setLangMode(e.target.value as "auto" | "zh" | "en")}
        >
          <option value="auto">{t("common.followSystem")}</option>
          <option value="zh">{t("common.langZh")}</option>
          <option value="en">{t("common.langEn")}</option>
        </Select>

        <Select
          label={t("common.theme")}
          value={themeMode}
          onChange={(e) =>
            setThemeMode(e.target.value as "auto" | "light" | "dark")
          }
        >
          <option value="auto">{t("common.followSystem")}</option>
          <option value="light">{t("common.light")}</option>
          <option value="dark">{t("common.dark")}</option>
        </Select>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
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
