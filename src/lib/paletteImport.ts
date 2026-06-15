import { requiredRoles } from "../data/starterPalettes";
import type { Palette, PaletteColors } from "../types";

export const sampleJson = `[
  {
    "name": "Editorial Orbit",
    "description": "Warm editorial palette for Jonas portfolio",
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

export const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const createPalette = (input: unknown, index: number): Palette => {
  if (!input || typeof input !== "object") {
    throw new Error(`Palette ${index + 1} is not an object.`);
  }

  const maybePalette = input as Partial<Palette>;
  const colors = maybePalette.colors;

  if (!colors || typeof colors !== "object") {
    throw new Error(`Palette ${index + 1} is missing a colors object.`);
  }

  const missing = requiredRoles.filter(
    (role) => typeof (colors as Partial<PaletteColors>)[role] !== "string",
  );

  if (missing.length > 0) {
    throw new Error(
      `${maybePalette.name ?? `Palette ${index + 1}`} is missing: ${missing.join(", ")}.`,
    );
  }

  const name = typeof maybePalette.name === "string" ? maybePalette.name : `AI Palette ${index + 1}`;
  const description =
    typeof maybePalette.description === "string"
      ? maybePalette.description
      : "Imported palette";

  return {
    id: `${slugify(name) || "palette"}-${Date.now()}-${index}`,
    name,
    description,
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
