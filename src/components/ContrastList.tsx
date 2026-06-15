import { contrastGrade, contrastRatio, getContrastChecks } from "../lib/contrast";
import type { Language, Palette } from "../types";

const copy = {
  en: {
    label: "Contrast",
  },
  sv: {
    label: "Kontrast",
  },
};

export function ContrastList({
  language,
  palette,
}: {
  language: Language;
  palette: Palette;
}) {
  const text = copy[language];

  return (
    <div className="contrast-list">
      <div className="contrast-list__header">
        <p className="section-label">{text.label}</p>
      </div>
      {getContrastChecks(palette).map((check) => {
        const ratio = contrastRatio(check.fg, check.bg);
        const grade = contrastGrade(ratio);
        return (
          <div className="contrast-row" key={check.label}>
            <span
              className="contrast-sample"
              style={{ color: check.fg, background: check.bg }}
            >
              Aa
            </span>
            <span>{check.label}</span>
            <strong className={grade === "Low" ? "is-low" : ""}>
              {ratio ? ratio.toFixed(1) : "-"} {grade}
            </strong>
          </div>
        );
      })}
    </div>
  );
}
