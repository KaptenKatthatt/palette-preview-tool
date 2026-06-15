export type GenericColorRole =
  | "background"
  | "surface"
  | "surfaceAlt"
  | "text"
  | "textSoft"
  | "textMuted"
  | "border"
  | "borderStrong"
  | "primary"
  | "primaryHover"
  | "secondary"
  | "darkBackground"
  | "darkSurface";

export type EditorialColorRole =
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

export type ColorRole = GenericColorRole | EditorialColorRole;

export type PaletteRoleScheme = "generic" | "editorial";

export type GenericPaletteColors = Record<GenericColorRole, string>;
export type EditorialPaletteColors = Record<EditorialColorRole, string>;

export type PaletteColors = GenericPaletteColors | EditorialPaletteColors;

export type Palette = {
  id: string;
  name: string;
  description: string;
  roleScheme: PaletteRoleScheme;
  colors: PaletteColors;
};

export type PreviewProfile =
  | "landing"
  | "editorial-portfolio"
  | "saas"
  | "ecommerce"
  | "documentation"
  | "dark";

export type PreviewContent = {
  projectTitle: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  featuredItems: [string, string, string];
};

export type Language = "en" | "sv";
