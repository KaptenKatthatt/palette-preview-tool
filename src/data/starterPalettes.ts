import type { ColorRole, Palette, PreviewMode } from "../types";

export const roleLabels: Record<ColorRole, { label: string; use: string }> = {
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

export const requiredRoles = Object.keys(roleLabels) as ColorRole[];

export const starterPalettes: Palette[] = [
  {
    id: "editorial-orbit",
    name: "Editorial Orbit",
    description: "Warm editorial palette, main candidate",
    colors: {
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
    },
  },
  {
    id: "cool-editorial",
    name: "Cool Editorial",
    description: "Slightly cooler, more technical editorial palette",
    colors: {
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
    },
  },
  {
    id: "soft-magazine",
    name: "Soft Magazine",
    description: "Lighter, softer, more paper-like test palette",
    colors: {
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
    },
  },
];

export const previewModes: Array<{ id: PreviewMode; label: string }> = [
  { id: "hero", label: "Hero" },
  { id: "projects", label: "Projects" },
  { id: "editorial", label: "Editorial" },
  { id: "dark", label: "Dark" },
];
