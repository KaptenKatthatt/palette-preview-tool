import type { CSSProperties, KeyboardEvent } from "react";
import {
  editorialRoleLabels,
  genericRoleLabels,
} from "../data/starterPalettes";
import { normalizePaletteColors } from "../lib/paletteNormalize";
import { ColorRoleList } from "./ColorRoleList";
import { ContrastList } from "./ContrastList";
import { InterfacePreview } from "./InterfacePreview";
import type { Language, Palette, PreviewContent, PreviewProfile } from "../types";

const copy = {
  en: {
    aria: (name: string) => `Select ${name} palette`,
    label: "Palette",
    selected: "Selected",
  },
  sv: {
    aria: (name: string) => `Välj paletten ${name}`,
    label: "Palett",
    selected: "Vald",
  },
};

const genericCssVars = (palette: Palette): CSSProperties => {
  const colors = normalizePaletteColors(palette);
  return {
    "--background": colors.background,
    "--surface": colors.surface,
    "--surface-alt": colors.surfaceAlt,
    "--text": colors.text,
    "--text-soft": colors.textSoft,
    "--text-muted": colors.textMuted,
    "--border": colors.border,
    "--border-strong": colors.borderStrong,
    "--primary": colors.primary,
    "--primary-hover": colors.primaryHover,
    "--secondary": colors.secondary,
    "--dark-background": colors.darkBackground,
    "--dark-surface": colors.darkSurface,
  } as CSSProperties;
};

export function PaletteColumn({
  palette,
  language,
  profile,
  previewContent,
  isSelected,
  onSelect,
}: {
  palette: Palette;
  language: Language;
  profile: PreviewProfile;
  previewContent: PreviewContent;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const text = copy[language];
  const roleLabels =
    palette.roleScheme === "generic" ? genericRoleLabels : editorialRoleLabels;

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <article
      aria-label={text.aria(palette.name)}
      aria-pressed={isSelected}
      className={`palette-column ${isSelected ? "is-selected" : ""}`}
      role="button"
      style={genericCssVars(palette)}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      <header className="palette-header">
        <div>
          <p className="section-label">{text.label}</p>
          <h2>{palette.name}</h2>
        </div>
        {isSelected ? <span className="selected-pill">{text.selected}</span> : null}
      </header>
      <p className="palette-description">{palette.description}</p>

      <InterfacePreview
        profile={profile}
        language={language}
        content={previewContent}
      />
      <ColorRoleList palette={palette} roleLabels={roleLabels} />
      <ContrastList palette={palette} language={language} />
    </article>
  );
}
