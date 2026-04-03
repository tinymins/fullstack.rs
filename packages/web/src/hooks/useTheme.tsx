import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  detectSystemTheme,
  loadThemeMode,
  saveThemeMode,
  type Theme,
  type ThemeMode,
} from "@/lib/preferences";

type ThemeContextValue = {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  themeMode: "dark",
  setThemeMode: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // SSR-safe defaults: must match what the server renders.
  const [themeMode, setThemeModeState] = useState<ThemeMode>("dark");
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // After hydration: read from cookie (default "dark" if unset).
  useEffect(() => {
    const savedMode = loadThemeMode();
    const resolvedTheme =
      savedMode === "auto" ? detectSystemTheme() : savedMode;
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    setThemeModeState(savedMode);
    setTheme(resolvedTheme);
    setMounted(true);
  }, []);

  // Apply + persist on mode change.
  useEffect(() => {
    if (!mounted) return;
    saveThemeMode(themeMode);
    const resolvedTheme =
      themeMode === "auto" ? detectSystemTheme() : themeMode;
    setTheme(resolvedTheme);
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  }, [themeMode, mounted]);

  // System theme listener (only relevant when mode is "auto").
  useEffect(() => {
    if (typeof window === "undefined" || themeMode !== "auto") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      setTheme(media.matches ? "dark" : "light");
      document.documentElement.classList.toggle("dark", media.matches);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [themeMode]);

  return (
    <ThemeContext.Provider
      value={{ theme, themeMode, setThemeMode: setThemeModeState }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
