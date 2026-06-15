import { Check, Clipboard, Download } from "lucide-react";
import {
  paletteToOriginalCss,
  paletteToOriginalJson,
} from "../lib/paletteExport";
import type { Language, Palette } from "../types";

const copy = {
  en: {
    aria: "Export selected palette",
    label: "Selected export",
    copyGenericCss: "Copy generic CSS",
    copyOriginalCss: "Copy original CSS",
    copyJson: "Copy original JSON",
  },
  sv: {
    aria: "Exportera vald palett",
    label: "Vald export",
    copyGenericCss: "Kopiera generisk CSS",
    copyOriginalCss: "Kopiera original CSS",
    copyJson: "Kopiera original JSON",
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
  const originalCss = paletteToOriginalCss(palette);

  return (
    <section className="export-band" aria-label={text.aria}>
      <div>
        <p className="section-label">{text.label}</p>
        <h2>{palette.name}</h2>
        <p>{palette.description}</p>
      </div>
      <pre>{exportText}</pre>
      <div className="export-actions">
        <button
          type="button"
          onClick={() => onCopy("css-generic", exportText)}
        >
          {copied === "css-generic" ? (
            <Check size={16} />
          ) : (
            <Clipboard size={16} />
          )}
          {text.copyGenericCss}
        </button>
        <button
          type="button"
          onClick={() => onCopy("css-original", originalCss)}
        >
          {copied === "css-original" ? (
            <Check size={16} />
          ) : (
            <Clipboard size={16} />
          )}
          {text.copyOriginalCss}
        </button>
        <button
          type="button"
          onClick={() =>
            onCopy("json-original", paletteToOriginalJson(palette))
          }
        >
          {copied === "json-original" ? (
            <Check size={16} />
          ) : (
            <Download size={16} />
          )}
          {text.copyJson}
        </button>
      </div>
    </section>
  );
}
