import {
  deDE,
  enUS,
  jaJP,
  type TranslationSchema,
  zhCN,
  zhTW,
} from "@acme/i18n";

export type Language = "zh-CN" | "en-US" | "de-DE" | "ja-JP" | "zh-TW";

const resources = {
  "zh-CN": zhCN,
  "en-US": enUS,
  "de-DE": deDE,
  "ja-JP": jaJP,
  "zh-TW": zhTW,
} as const;

type TranslationRoot = TranslationSchema["translation"];

export const normalizeLanguage = (value?: string): Language => {
  if (!value) return "zh-CN";
  const lower = value.toLowerCase();
  if (lower.startsWith("en")) return "en-US";
  if (lower.startsWith("de")) return "de-DE";
  if (lower.startsWith("ja")) return "ja-JP";
  if (lower === "zh-tw" || lower === "zh_tw" || lower === "zh-hant")
    return "zh-TW";
  if (lower.startsWith("zh")) return "zh-CN";
  return "zh-CN";
};

const getByPath = (root: TranslationRoot, path: string): unknown => {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (!acc || typeof acc !== "object") return undefined;
    if (!(key in acc)) return undefined;
    return (acc as Record<string, unknown>)[key];
  }, root);
};

export const t = (language: Language, key: string): string => {
  const root =
    resources[language]?.translation ?? resources["zh-CN"].translation;
  const value = getByPath(root, key);
  return typeof value === "string" ? value : key;
};

export const getMessage = (
  language: Language,
  key: string,
  fallback?: string,
): string => {
  const value = t(language, key);
  if (value === key && fallback) return fallback;
  return value;
};
