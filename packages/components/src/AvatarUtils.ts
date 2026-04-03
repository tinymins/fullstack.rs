const avatarColors = [
  "#60a5fa",
  "#34d399",
  "#f97316",
  "#a78bfa",
  "#f43f5e",
  "#14b8a6",
  "#eab308",
  "#ec4899",
  "#06b6d4",
  "#8b5cf6",
];

export function getAvatarColor(name?: string | null): string {
  if (!name) return avatarColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export function getAvatarInitial(
  name?: string | null,
  email?: string | null,
): string {
  if (name) {
    const trimmed = name.trim();
    if (/^[\u4e00-\u9fff]/.test(trimmed)) {
      return trimmed.slice(-2);
    }
    return trimmed.charAt(0).toUpperCase();
  }
  if (email) return email.charAt(0).toUpperCase();
  return "?";
}
