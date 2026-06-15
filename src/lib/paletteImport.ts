import { getRequiredRoles, detectRoleScheme } from "./paletteNormalize";
import type { Palette, PaletteColors, PaletteRoleScheme } from "../types";
import { slugify } from "./paletteImportUtils";

export { slugify } from "./paletteImportUtils";

export const sampleJson = `[
  {
    "name": "Neutral Product",
    "description": "Balanced palette for SaaS and landing pages",
    "colors": {
      "background": "#F6F7F9",
      "surface": "#FFFFFF",
      "surfaceAlt": "#EEF1F5",
      "text": "#0F172A",
      "textSoft": "#334155",
      "textMuted": "#64748B",
      "border": "rgba(15, 23, 42, 0.12)",
      "borderStrong": "rgba(15, 23, 42, 0.22)",
      "primary": "#2563EB",
      "primaryHover": "#3B82F6",
      "secondary": "#0D9488",
      "darkBackground": "#0B1220",
      "darkSurface": "#162033"
    }
  }
]`;

export const sampleEditorialJson = `[
  {
    "name": "Editorial Orbit",
    "description": "Warm editorial palette",
    "colors": {
      "paper": "#F4EFE6",
      "paperSoft": "#FBF7EF",
      "paperWarm": "#EFE3D2",
      "ink": "#071827",
      "inkSoft": "#243444",
      "inkMuted": "#5E6873",
      "line": "rgba(7, 24, 39, 0.14)",
      "lineStrong": "rgba(7, 24, 39, 0.24)",
      "solar": "#C87918",
      "solarBright": "#F2A23A",
      "copper": "#9D5B1C",
      "deepSpace": "#07111C",
      "spaceBlue": "#102033"
    }
  }
]`;

const createPalette = (input: unknown, index: number): Palette => {
  if (!input || typeof input !== "object") {
    throw new Error(`Palette ${index + 1} is not an object.`);
  }

  const maybePalette = input as Partial<Palette>;
  const colors = maybePalette.colors;

  if (!colors || typeof colors !== "object") {
    throw new Error(`Palette ${index + 1} is missing a colors object.`);
  }

  const roleScheme: PaletteRoleScheme =
    maybePalette.roleScheme === "generic" ||
    maybePalette.roleScheme === "editorial"
      ? maybePalette.roleScheme
      : detectRoleScheme(colors as Record<string, unknown>);

  const required = getRequiredRoles(roleScheme);
  const missing = required.filter(
    (role) => typeof (colors as Record<string, unknown>)[role] !== "string",
  );

  if (missing.length > 0) {
    throw new Error(
      `${maybePalette.name ?? `Palette ${index + 1}`} is missing: ${missing.join(", ")}.`,
    );
  }

  const name =
    typeof maybePalette.name === "string"
      ? maybePalette.name
      : `AI Palette ${index + 1}`;
  const description =
    typeof maybePalette.description === "string"
      ? maybePalette.description
      : "Imported palette";

  return {
    id: `${slugify(name) || "palette"}-${Date.now()}-${index}`,
    name,
    description,
    roleScheme,
    colors: colors as PaletteColors,
  };
};

export const parsePalettes = (raw: string): Palette[] => {
  const parsed = JSON.parse(raw) as unknown;
  const items = Array.isArray(parsed)
    ? parsed
    : parsed &&
        typeof parsed === "object" &&
        "palettes" in parsed &&
        Array.isArray((parsed as { palettes: unknown }).palettes)
      ? (parsed as { palettes: unknown[] }).palettes
      : [parsed];

  return items.map(createPalette);
};
