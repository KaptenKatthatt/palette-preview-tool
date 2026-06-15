import { requiredRoles } from "../data/starterPalettes";
import type { Palette } from "../types";
import { slugify } from "./paletteImport";

const cssVarName = (role: string) =>
  role.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const paletteToVars = (palette: Palette) =>
  requiredRoles
    .map((role) => `  --color-${cssVarName(role)}: ${palette.colors[role]};`)
    .join("\n");

export const paletteToCss = (palette: Palette) =>
  `:root[data-palette="${slugify(palette.name)}"] {\n${paletteToVars(palette)}\n}`;
