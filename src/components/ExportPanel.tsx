import { Check, Clipboard, Download } from "lucide-react";
import type { Language, Palette } from "../types";

const copy = {
  en: {
    aria: "Export selected palette",
    label: "Selected export",
    copyCss: "Copy CSS",
    copyJson: "Copy JSON",
  },
  sv: {
    aria: "Exportera vald palett",
    label: "Vald export",
    copyCss: "Kopiera CSS",
    copyJson: "Kopiera JSON",
  },
};

export function ExportPanel({
  copied,
  exportText,
  language,
  palette,
  onCopy,
}: {
  copied: string | null;
  exportText: string;
  language: Language;
  palette: Palette;
  onCopy: (label: string, text: string) => void;
}) {
  const text = copy[language];

  return (
    <section className="export-band" aria-label={text.aria}>
      <div>
        <p className="section-label">{text.label}</p>
        <h2>{palette.name}</h2>
        <p>{palette.description}</p>
      </div>
      <pre>{exportText}</pre>
      <div className="export-actions">
        <button type="button" onClick={() => onCopy("css-bottom", exportText)}>
          {copied === "css-bottom" ? <Check size={16} /> : <Clipboard size={16} />}
          {text.copyCss}
        </button>
        <button type="button" onClick={() => onCopy("json-bottom", JSON.stringify(palette, null, 2))}>
          {copied === "json-bottom" ? <Check size={16} /> : <Download size={16} />}
          {text.copyJson}
        </button>
      </div>
    </section>
  );
}
