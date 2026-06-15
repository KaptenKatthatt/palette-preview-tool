import { Plus, X } from "lucide-react";
import { sampleJson } from "../lib/paletteImport";

export function ImportPanel({
  importedCount,
  jsonInput,
  notice,
  onClearImported,
  onImport,
  onJsonInputChange,
}: {
  importedCount: number;
  jsonInput: string;
  notice: string;
  onClearImported: () => void;
  onImport: () => void;
  onJsonInputChange: (value: string) => void;
}) {
  const isGoodNotice = notice.startsWith("Added") || notice.startsWith("Loaded");

  return (
    <div className="import-panel">
      <div className="import-panel__copy">
        <p className="section-label">AI input</p>
        <h2>Paste AI palette JSON</h2>
        <p>
          Accepts one palette, an array of palettes, or an object with a
          <code> palettes </code> array.
        </p>
      </div>
      <textarea
        aria-label="Paste AI palette JSON"
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
            Clear imported
          </button>
          <button className="primary-action" type="button" onClick={onImport}>
            <Plus size={16} />
            Add palette
          </button>
        </div>
      </div>
    </div>
  );
}
