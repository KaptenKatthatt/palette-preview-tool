import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Code2, Eye, FileJson, Link } from "lucide-react";
import { ExportPanel } from "./components/ExportPanel";
import { ImportPanel } from "./components/ImportPanel";
import { PaletteColumn } from "./components/PaletteColumn";
import { previewModes, starterPalettes } from "./data/starterPalettes";
import { paletteToCss } from "./lib/paletteExport";
import { parsePalettes } from "./lib/paletteImport";
import { createShareUrl, decodePalette } from "./lib/shareUrl";
import type { Palette, PreviewMode } from "./types";

const IMPORTED_PALETTES_STORAGE_KEY = "palette-preview-lab:imported-palettes";

const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

const loadImportedPalettes = (): Palette[] => {
  try {
    const stored = window.localStorage.getItem(IMPORTED_PALETTES_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsePalettes(JSON.stringify(parsed));
  } catch {
    return [];
  }
};

function App() {
  const [importedPalettes, setImportedPalettes] = useState<Palette[]>(loadImportedPalettes);
  const [mode, setMode] = useState<PreviewMode>("hero");
  const [selectedId, setSelectedId] = useState(starterPalettes[0].id);
  const [jsonInput, setJsonInput] = useState("");
  const [notice, setNotice] = useState("Ready for AI palette JSON.");
  const [copied, setCopied] = useState<string | null>(null);
  const hasLoadedHash = useRef(false);

  const palettes = useMemo(
    () => [...starterPalettes, ...importedPalettes],
    [importedPalettes],
  );

  const selectedPalette =
    palettes.find((palette) => palette.id === selectedId) ?? palettes[0];

  const exportText = useMemo(
    () => (selectedPalette ? paletteToCss(selectedPalette) : ""),
    [selectedPalette],
  );

  useEffect(() => {
    window.localStorage.setItem(
      IMPORTED_PALETTES_STORAGE_KEY,
      JSON.stringify(importedPalettes),
    );
  }, [importedPalettes]);

  useEffect(() => {
    if (hasLoadedHash.current) return;
    hasLoadedHash.current = true;

    const hash = window.location.hash.replace(/^#palette=/, "");
    if (!hash || hash === window.location.hash) return;

    try {
      const decoded = decodePalette(hash);
      const imported = parsePalettes(decoded);
      setImportedPalettes((current) => [...current, ...imported]);
      setSelectedId(imported[0].id);
      setNotice(`Loaded ${imported[0].name} from the URL hash.`);
    } catch {
      setNotice("Could not read the palette embedded in the URL hash.");
    }
  }, []);

  const handleImport = () => {
    try {
      const imported = parsePalettes(jsonInput);
      setImportedPalettes((current) => [...current, ...imported]);
      setSelectedId(imported[0].id);
      setJsonInput("");
      setNotice(`Added ${imported.length} palette${imported.length === 1 ? "" : "s"}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not parse palette JSON.");
    }
  };

  const handleClearImported = () => {
    setImportedPalettes([]);
    setSelectedId(starterPalettes[0].id);
    setNotice("Cleared imported palettes.");
  };

  const handleCopy = async (label: string, text: string) => {
    try {
      await copyText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setNotice("Clipboard access was blocked by the browser.");
    }
  };

  const handleShare = async () => {
    await handleCopy("share", createShareUrl(selectedPalette));
  };

  return (
    <main className="app-shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">Palette Preview Lab</p>
          <h1>Compare portfolio palettes in context.</h1>
        </div>
        <div className="topbar__actions">
          <button
            aria-label="Copy selected palette JSON"
            className="icon-button"
            type="button"
            title="Copy selected palette JSON"
            onClick={() => handleCopy("json", JSON.stringify(selectedPalette, null, 2))}
          >
            {copied === "json" ? <Check size={18} /> : <FileJson size={18} />}
          </button>
          <button
            aria-label="Copy selected palette CSS variables"
            className="icon-button"
            type="button"
            title="Copy selected palette CSS variables"
            onClick={() => handleCopy("css", exportText)}
          >
            {copied === "css" ? <Check size={18} /> : <Code2 size={18} />}
          </button>
          <button
            aria-label="Copy share URL for selected palette"
            className="icon-button"
            type="button"
            title="Copy share URL for selected palette"
            onClick={handleShare}
          >
            {copied === "share" ? <Check size={18} /> : <Link size={18} />}
          </button>
        </div>
      </section>

      <section className="controls-band" aria-label="Palette controls">
        <div className="mode-switch" role="group" aria-label="Preview mode">
          {previewModes.map((previewMode) => (
            <button
              aria-pressed={mode === previewMode.id}
              key={previewMode.id}
              className={mode === previewMode.id ? "is-active" : ""}
              type="button"
              onClick={() => setMode(previewMode.id)}
            >
              <Eye size={15} />
              {previewMode.label}
            </button>
          ))}
        </div>

        <ImportPanel
          importedCount={importedPalettes.length}
          jsonInput={jsonInput}
          notice={notice}
          onClearImported={handleClearImported}
          onImport={handleImport}
          onJsonInputChange={setJsonInput}
        />
      </section>

      <section className="comparison-board" aria-label="Palette comparison board">
        {palettes.map((palette) => (
          <PaletteColumn
            key={palette.id}
            palette={palette}
            mode={mode}
            isSelected={palette.id === selectedPalette.id}
            onSelect={() => setSelectedId(palette.id)}
          />
        ))}
      </section>

      <ExportPanel
        copied={copied}
        exportText={exportText}
        palette={selectedPalette}
        onCopy={handleCopy}
      />
    </main>
  );
}

export default App;
