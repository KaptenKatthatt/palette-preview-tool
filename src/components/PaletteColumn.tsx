import type { CSSProperties, KeyboardEvent } from "react";
import { ColorRoleList } from "./ColorRoleList";
import { ContrastList } from "./ContrastList";
import { PortfolioPreview } from "./PortfolioPreview";
import type { Palette, PreviewMode } from "../types";

export function PaletteColumn({
  palette,
  mode,
  isSelected,
  onSelect,
}: {
  palette: Palette;
  mode: PreviewMode;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const styles = {
    "--paper": palette.colors.paper,
    "--paper-soft": palette.colors.paperSoft,
    "--paper-warm": palette.colors.paperWarm,
    "--ink": palette.colors.ink,
    "--ink-soft": palette.colors.inkSoft,
    "--ink-muted": palette.colors.inkMuted,
    "--line": palette.colors.line,
    "--line-strong": palette.colors.lineStrong,
    "--solar": palette.colors.solar,
    "--solar-bright": palette.colors.solarBright,
    "--copper": palette.colors.copper,
    "--deep-space": palette.colors.deepSpace,
    "--space-blue": palette.colors.spaceBlue,
  } as CSSProperties;

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <article
      aria-label={`Select ${palette.name} palette`}
      aria-pressed={isSelected}
      className={`palette-column ${isSelected ? "is-selected" : ""}`}
      role="button"
      style={styles}
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      <header className="palette-header">
        <div>
          <p className="section-label">Palette</p>
          <h2>{palette.name}</h2>
        </div>
        {isSelected ? <span className="selected-pill">Selected</span> : null}
      </header>
      <p className="palette-description">{palette.description}</p>

      <PortfolioPreview mode={mode} />
      <ColorRoleList palette={palette} />
      <ContrastList palette={palette} />
    </article>
  );
}
