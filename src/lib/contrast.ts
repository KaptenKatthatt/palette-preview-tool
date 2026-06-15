import type { Palette } from "../types";

const parseColor = (value: string): [number, number, number] | null => {
  const colorValue = value.trim();
  const shortHex = /^#([0-9a-f]{3})$/i.exec(colorValue);
  const longHex = /^#([0-9a-f]{6})$/i.exec(colorValue);
  const rgba = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(colorValue);

  if (shortHex) {
    return shortHex[1].split("").map((part) => parseInt(part + part, 16)) as [
      number,
      number,
      number,
    ];
  }

  if (longHex) {
    const color = longHex[1];
    return [
      parseInt(color.slice(0, 2), 16),
      parseInt(color.slice(2, 4), 16),
      parseInt(color.slice(4, 6), 16),
    ];
  }

  if (rgba) {
    return [Number(rgba[1]), Number(rgba[2]), Number(rgba[3])];
  }

  return null;
};

const luminance = ([r, g, b]: [number, number, number]) => {
  const values = [r, g, b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
};

export const contrastRatio = (foreground: string, background: string) => {
  const fg = parseColor(foreground);
  const bg = parseColor(background);

  if (!fg || !bg) {
    return null;
  }

  const lighter = Math.max(luminance(fg), luminance(bg));
  const darker = Math.min(luminance(fg), luminance(bg));

  return (lighter + 0.05) / (darker + 0.05);
};

export const contrastGrade = (ratio: number | null) => {
  if (!ratio) return "Check";
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "Large";
  return "Low";
};

export const getContrastChecks = (palette: Palette) => [
  { label: "ink / paper", fg: palette.colors.ink, bg: palette.colors.paper },
  { label: "muted / paper", fg: palette.colors.inkMuted, bg: palette.colors.paper },
  { label: "paper / deep", fg: palette.colors.paper, bg: palette.colors.deepSpace },
  { label: "solar / paper", fg: palette.colors.solar, bg: palette.colors.paper },
  { label: "solar / deep", fg: palette.colors.solar, bg: palette.colors.deepSpace },
  { label: "button text", fg: palette.colors.ink, bg: palette.colors.solar },
];
