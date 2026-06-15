import { Check, Clipboard, Download } from "lucide-react";
import type { Palette } from "../types";

export function ExportPanel({
  copied,
  exportText,
  palette,
  onCopy,
}: {
  copied: string | null;
  exportText: string;
  palette: Palette;
  onCopy: (label: string, text: string) => void;
}) {
  return (
    <section className="export-band" aria-label="Export selected palette">
      <div>
        <p className="section-label">Selected export</p>
        <h2>{palette.name}</h2>
        <p>{palette.description}</p>
      </div>
      <pre>{exportText}</pre>
      <div className="export-actions">
        <button type="button" onClick={() => onCopy("css-bottom", exportText)}>
          {copied === "css-bottom" ? <Check size={16} /> : <Clipboard size={16} />}
          Copy CSS
        </button>
        <button type="button" onClick={() => onCopy("json-bottom", JSON.stringify(palette, null, 2))}>
          {copied === "json-bottom" ? <Check size={16} /> : <Download size={16} />}
          Copy JSON
        </button>
      </div>
    </section>
  );
}
