export type ColorRole =
  | "paper"
  | "paperSoft"
  | "paperWarm"
  | "ink"
  | "inkSoft"
  | "inkMuted"
  | "line"
  | "lineStrong"
  | "solar"
  | "solarBright"
  | "copper"
  | "deepSpace"
  | "spaceBlue";

export type PaletteColors = Record<ColorRole, string>;

export type Palette = {
  id: string;
  name: string;
  description: string;
  colors: PaletteColors;
};

export type PreviewMode = "hero" | "projects" | "editorial" | "dark";

export type Language = "en" | "sv";
