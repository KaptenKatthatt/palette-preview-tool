import type {
  EditorialColorRole,
  EditorialPaletteColors,
  GenericColorRole,
  GenericPaletteColors,
  Palette,
  PaletteRoleScheme,
} from "../types";

export const genericRoles: GenericColorRole[] = [
  "background",
  "surface",
  "surfaceAlt",
  "text",
  "textSoft",
  "textMuted",
  "border",
  "borderStrong",
  "primary",
  "primaryHover",
  "secondary",
  "darkBackground",
  "darkSurface",
];

export const editorialRoles: EditorialColorRole[] = [
  "paper",
  "paperSoft",
  "paperWarm",
  "ink",
  "inkSoft",
  "inkMuted",
  "line",
  "lineStrong",
  "solar",
  "solarBright",
  "copper",
  "deepSpace",
  "spaceBlue",
];

const editorialToGenericMap: Record<EditorialColorRole, GenericColorRole> = {
  paper: "background",
  paperSoft: "surface",
  paperWarm: "surfaceAlt",
  ink: "text",
  inkSoft: "textSoft",
  inkMuted: "textMuted",
  line: "border",
  lineStrong: "borderStrong",
  solar: "primary",
  solarBright: "primaryHover",
  copper: "secondary",
  deepSpace: "darkBackground",
  spaceBlue: "darkSurface",
};

const genericToEditorialMap: Record<GenericColorRole, EditorialColorRole> = {
  background: "paper",
  surface: "paperSoft",
  surfaceAlt: "paperWarm",
  text: "ink",
  textSoft: "inkSoft",
  textMuted: "inkMuted",
  border: "line",
  borderStrong: "lineStrong",
  primary: "solar",
  primaryHover: "solarBright",
  secondary: "copper",
  darkBackground: "deepSpace",
  darkSurface: "spaceBlue",
};

export const detectRoleScheme = (
  colors: Record<string, unknown>,
): PaletteRoleScheme => {
  const hasGeneric = genericRoles.some(
    (role) => typeof colors[role] === "string",
  );
  const hasEditorial = editorialRoles.some(
    (role) => typeof colors[role] === "string",
  );

  if (hasGeneric && !hasEditorial) return "generic";
  if (hasEditorial && !hasGeneric) return "editorial";
  if (hasGeneric) return "generic";
  return "editorial";
};

export const editorialToGeneric = (
  colors: EditorialPaletteColors,
): GenericPaletteColors => {
  const normalized = {} as GenericPaletteColors;
  for (const [editorialRole, genericRole] of Object.entries(
    editorialToGenericMap,
  ) as [EditorialColorRole, GenericColorRole][]) {
    normalized[genericRole] = colors[editorialRole];
  }
  return normalized;
};

export const genericToEditorial = (
  colors: GenericPaletteColors,
): EditorialPaletteColors => {
  const mapped = {} as EditorialPaletteColors;
  for (const [genericRole, editorialRole] of Object.entries(
    genericToEditorialMap,
  ) as [GenericColorRole, EditorialColorRole][]) {
    mapped[editorialRole] = colors[genericRole];
  }
  return mapped;
};

export const normalizePaletteColors = (
  palette: Palette,
): GenericPaletteColors => {
  if (palette.roleScheme === "generic") {
    return palette.colors as GenericPaletteColors;
  }
  return editorialToGeneric(palette.colors as EditorialPaletteColors);
};

export const getRequiredRoles = (scheme: PaletteRoleScheme) =>
  scheme === "generic" ? genericRoles : editorialRoles;
