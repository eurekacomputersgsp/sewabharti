import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteData";

// Converts a hex string to an oklch() value via a temp DOM element + getComputedStyle
function hexToOklch(hex: string): string | null {
  if (typeof window === "undefined" || !hex) return null;
  try {
    const el = document.createElement("div");
    el.style.color = hex;
    document.body.appendChild(el);
    const rgb = getComputedStyle(el).color;
    el.remove();
    // Just return as rgb() - browsers accept rgb in oklch-targeted vars
    return rgb;
  } catch {
    return null;
  }
}

export function ThemeInjector() {
  const { data: settings } = useSiteSettings();
  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;
    if (settings.primary_color) {
      const c = hexToOklch(settings.primary_color);
      if (c) root.style.setProperty("--primary", c);
      root.style.setProperty("--ring", settings.primary_color);
    }
    if (settings.accent_color) {
      const c = hexToOklch(settings.accent_color);
      if (c) root.style.setProperty("--accent", c);
    }
  }, [settings]);
  return null;
}
