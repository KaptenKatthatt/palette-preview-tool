import type {
  EditorialPaletteColors,
  GenericPaletteColors,
  Palette,
  PreviewProfile,
} from "../types";

export const genericRoleLabels: Record<
  keyof GenericPaletteColors,
  { label: string; use: string }
> = {
  background: { label: "background", use: "Page background" },
  surface: { label: "surface", use: "Cards and panels" },
  surfaceAlt: { label: "surface alt", use: "Alternate surfaces" },
  text: { label: "text", use: "Primary text" },
  textSoft: { label: "text soft", use: "Secondary headings" },
  textMuted: { label: "text muted", use: "Metadata and captions" },
  border: { label: "border", use: "Subtle borders" },
  borderStrong: { label: "border strong", use: "Rules and dividers" },
  primary: { label: "primary", use: "Primary accent" },
  primaryHover: { label: "primary hover", use: "Hover and glow" },
  secondary: { label: "secondary", use: "Secondary accent" },
  darkBackground: { label: "dark background", use: "Dark sections" },
  darkSurface: { label: "dark surface", use: "Dark cards" },
};

export const editorialRoleLabels: Record<
  keyof EditorialPaletteColors,
  { label: string; use: string }
> = {
  paper: { label: "paper", use: "Page background" },
  paperSoft: { label: "paper soft", use: "Cards and panels" },
  paperWarm: { label: "paper warm", use: "Soft surfaces" },
  ink: { label: "ink", use: "Primary text" },
  inkSoft: { label: "ink soft", use: "Secondary headings" },
  inkMuted: { label: "ink muted", use: "Metadata and captions" },
  line: { label: "line", use: "Subtle borders" },
  lineStrong: { label: "line strong", use: "Rules and dividers" },
  solar: { label: "solar", use: "Primary accent" },
  solarBright: { label: "solar bright", use: "Hover and glow" },
  copper: { label: "copper", use: "Secondary accent" },
  deepSpace: { label: "deep space", use: "Dark sections" },
  spaceBlue: { label: "space blue", use: "Dark cards" },
};

const editorialColors = (
  colors: EditorialPaletteColors,
): EditorialPaletteColors => colors;

export const starterPalettes: Palette[] = [
  {
    id: "editorial-orbit",
    name: "Editorial Orbit",
    description: "Warm editorial palette, main candidate",
    roleScheme: "editorial",
    colors: editorialColors({
      paper: "#F4EFE6",
      paperSoft: "#FBF7EF",
      paperWarm: "#EFE3D2",
      ink: "#071827",
      inkSoft: "#243444",
      inkMuted: "#5E6873",
      line: "rgba(7, 24, 39, 0.14)",
      lineStrong: "rgba(7, 24, 39, 0.24)",
      solar: "#C87918",
      solarBright: "#F2A23A",
      copper: "#9D5B1C",
      deepSpace: "#07111C",
      spaceBlue: "#102033",
    }),
  },
  {
    id: "cool-editorial",
    name: "Cool Editorial",
    description: "Slightly cooler, more technical editorial palette",
    roleScheme: "editorial",
    colors: editorialColors({
      paper: "#F2F4F1",
      paperSoft: "#FBFBF6",
      paperWarm: "#E6EBE7",
      ink: "#071B2C",
      inkSoft: "#26394A",
      inkMuted: "#65727D",
      line: "rgba(7, 27, 44, 0.14)",
      lineStrong: "rgba(7, 27, 44, 0.24)",
      solar: "#C76A1F",
      solarBright: "#F09A36",
      copper: "#8F5424",
      deepSpace: "#06111D",
      spaceBlue: "#10253A",
    }),
  },
  {
    id: "soft-magazine",
    name: "Soft Magazine",
    description: "Lighter, softer, more paper-like test palette",
    roleScheme: "editorial",
    colors: editorialColors({
      paper: "#F7F1E7",
      paperSoft: "#FFF9F0",
      paperWarm: "#E8D8C1",
      ink: "#101820",
      inkSoft: "#303A42",
      inkMuted: "#6F6A63",
      line: "rgba(16, 24, 32, 0.14)",
      lineStrong: "rgba(16, 24, 32, 0.24)",
      solar: "#B96E22",
      solarBright: "#E9A13A",
      copper: "#8A4F25",
      deepSpace: "#101722",
      spaceBlue: "#18283A",
    }),
  },
  {
    id: "neutral-product",
    name: "Neutral Product",
    description: "Balanced generic palette for SaaS and landing pages",
    roleScheme: "generic",
    colors: {
      background: "#F6F7F9",
      surface: "#FFFFFF",
      surfaceAlt: "#EEF1F5",
      text: "#0F172A",
      textSoft: "#334155",
      textMuted: "#64748B",
      border: "rgba(15, 23, 42, 0.12)",
      borderStrong: "rgba(15, 23, 42, 0.22)",
      primary: "#2563EB",
      primaryHover: "#3B82F6",
      secondary: "#0D9488",
      darkBackground: "#0B1220",
      darkSurface: "#162033",
    },
  },
];

export const previewProfiles: Array<{ id: PreviewProfile; label: string }> = [
  { id: "landing", label: "Generic Landing Page" },
  { id: "editorial-portfolio", label: "Editorial Portfolio" },
  { id: "saas", label: "SaaS / App UI" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "documentation", label: "Documentation" },
  { id: "dark", label: "Dark Section" },
];
