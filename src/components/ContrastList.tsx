import { contrastGrade, contrastRatio, getContrastChecks } from "../lib/contrast";
import type { Palette } from "../types";

export function ContrastList({ palette }: { palette: Palette }) {
  return (
    <div className="contrast-list">
      <div className="contrast-list__header">
        <p className="section-label">Contrast</p>
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
