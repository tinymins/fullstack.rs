/**
 * Resolve a storage key (e.g. "userId/1234.jpg") to a full public URL.
 * The base URL is read from VITE_STORAGE_PUBLIC_URL at build time.
 * Returns undefined if key is empty/nullish.
 */
export const resolveAvatarUrl = (
  key: string | null | undefined,
): string | undefined => {
  if (!key) return undefined;
  const base = (
    import.meta.env.VITE_STORAGE_PUBLIC_URL as string | undefined
  )?.replace(/\/$/, "");
  if (!base) return undefined;
  return `${base}/${key}`;
};
