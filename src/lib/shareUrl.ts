import type { Palette } from "../types";

export const encodePalette = (palette: Palette) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(palette))));

export const decodePalette = (value: string) =>
  JSON.stringify(JSON.parse(decodeURIComponent(escape(atob(value)))), null, 2);

export const createShareUrl = (palette: Palette) =>
  `${window.location.origin}${window.location.pathname}#palette=${encodePalette(palette)}`;
