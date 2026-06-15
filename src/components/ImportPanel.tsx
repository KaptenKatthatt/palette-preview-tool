import { Plus, X } from "lucide-react";
import { sampleJson } from "../lib/paletteImport";
import type { Language } from "../types";

const copy = {
  en: {
    label: "AI input",
    title: "Paste AI palette JSON",
    description: (
      <>
        Accepts one palette, an array of palettes, or an object with a
        <code> palettes </code> array.
      </>
    ),
    textareaLabel: "Paste AI palette JSON",
    clear: "Clear imported",
    add: "Add palette",
  },
  sv: {
    label: "AI-input",
    title: "Klistra in AI-palett-JSON",
    description: (
      <>
        Tar emot en palett, en lista med paletter eller ett objekt med en
        <code> palettes </code>-lista.
      </>
    ),
    textareaLabel: "Klistra in AI-palett-JSON",
    clear: "Rensa importerade",
    add: "Lägg till palett",
  },
};

export function ImportPanel({
  importedCount,
  language,
  jsonInput,
  notice,
  onClearImported,
  onImport,
  onJsonInputChange,
}: {
  importedCount: number;
  language: Language;
  jsonInput: string;
  notice: string;
  onClearImported: () => void;
  onImport: () => void;
  onJsonInputChange: (value: string) => void;
}) {
  const text = copy[language];
  const isGoodNotice =
    notice.startsWith("Added") ||
    notice.startsWith("Loaded") ||
    notice.startsWith("Lade") ||
    notice.startsWith("Laddade");

  return (
    <div className="import-panel">
      <div className="import-panel__copy">
        <p className="section-label">{text.label}</p>
        <h2>{text.title}</h2>
        <p>{text.description}</p>
      </div>
      <textarea
        aria-label={text.textareaLabel}
        placeholder={sampleJson}
        value={jsonInput}
        onChange={(event) => onJsonInputChange(event.target.value)}
      />
      <div className="import-panel__footer">
        <span className={isGoodNotice ? "notice good" : "notice"}>{notice}</span>
        <div className="import-panel__footer-actions">
          <button
            className="secondary-action"
            disabled={importedCount === 0}
            type="button"
            onClick={onClearImported}
          >
            <X size={16} />
            {text.clear}
          </button>
          <button className="primary-action" type="button" onClick={onImport}>
            <Plus size={16} />
            {text.add}
          </button>
        </div>
      </div>
    </div>
  );
}
