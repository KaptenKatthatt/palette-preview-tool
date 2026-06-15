import { genericRoles, normalizePaletteColors } from "./paletteNormalize";
import type { Palette } from "../types";
import { slugify } from "./paletteImportUtils";

const cssVarName = (role: string) =>
  role.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

export const paletteToGenericCss = (palette: Palette) => {
  const colors = normalizePaletteColors(palette);
  const vars = genericRoles
    .map((role) => `  --color-${cssVarName(role)}: ${colors[role]};`)
    .join("\n");
  return `:root[data-palette="${slugify(palette.name)}"] {\n${vars}\n}`;
};

export const paletteToOriginalCss = (palette: Palette) => {
  const roles = Object.keys(palette.colors);
  const vars = roles
    .map(
      (role) =>
        `  --color-${cssVarName(role)}: ${palette.colors[role as keyof typeof palette.colors]};`,
    )
    .join("\n");
  return `:root[data-palette="${slugify(palette.name)}"] {\n${vars}\n}`;
};

/** @deprecated Use paletteToGenericCss */
export const paletteToCss = paletteToGenericCss;

export const paletteToOriginalJson = (palette: Palette) =>
  JSON.stringify(
    {
      name: palette.name,
      description: palette.description,
      roleScheme: palette.roleScheme,
      colors: palette.colors,
    },
    null,
    2,
  );
