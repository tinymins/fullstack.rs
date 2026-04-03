import type { Lang, LangMode, Theme, ThemeMode } from "@acme/types";

export type { Lang, LangMode, Theme, ThemeMode };

const THEME_MODE_COOKIE_KEY = "themeMode";
const LANG_MODE_COOKIE_KEY = "langMode";

export const getCookieValue = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

export const setCookieValue = (name: string, value: string) => {
  if (typeof document === "undefined") return;
  // biome-ignore lint/suspicious/noDocumentCookie: intentional cookie management utility
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; path=/; max-age=31536000; samesite=lax`;
};

export const clearCookieValue = (name: string) => {
  if (typeof document === "undefined") return;
  // biome-ignore lint/suspicious/noDocumentCookie: intentional cookie management utility
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
};

export const detectSystemTheme = (): Theme => {
  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
};

export const loadThemeMode = (): ThemeMode => {
  const savedMode = getCookieValue(THEME_MODE_COOKIE_KEY);
  if (savedMode === "auto" || savedMode === "light" || savedMode === "dark") {
    return savedMode;
  }

  const legacy = getCookieValue("theme");
  if (legacy === "light" || legacy === "dark") {
    return legacy;
  }

  return "dark";
};

export const saveThemeMode = (mode: ThemeMode) => {
  setCookieValue(THEME_MODE_COOKIE_KEY, mode);
};

export const loadLangMode = (): LangMode => {
  const savedMode = getCookieValue(LANG_MODE_COOKIE_KEY);
  if (savedMode === "auto" || savedMode === "zh" || savedMode === "en") {
    return savedMode;
  }
  return "auto";
};

export const saveLangMode = (mode: LangMode) => {
  setCookieValue(LANG_MODE_COOKIE_KEY, mode);
};
