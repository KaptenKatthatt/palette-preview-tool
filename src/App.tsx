import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Code2, Eye, FileJson, Link } from "lucide-react";
import { ExportPanel } from "./components/ExportPanel";
import { ImportPanel } from "./components/ImportPanel";
import { PaletteColumn } from "./components/PaletteColumn";
import { previewModes, starterPalettes } from "./data/starterPalettes";
import { paletteToCss } from "./lib/paletteExport";
import { parsePalettes } from "./lib/paletteImport";
import { createShareUrl, decodePalette } from "./lib/shareUrl";
import type { Language, Palette, PreviewMode } from "./types";

const IMPORTED_PALETTES_STORAGE_KEY = "palette-preview-lab:imported-palettes";

const translations = {
  en: {
    languageName: "English",
    switchLanguage: "Svenska",
    switchLanguageLabel: "Switch page language to Swedish",
    title: "Compare portfolio palettes in context.",
    copyJson: "Copy selected palette JSON",
    copyCss: "Copy selected palette CSS variables",
    copyShare: "Copy share URL for selected palette",
    introLabel: "How it works",
    introTitle:
      "A small lab for comparing palette ideas before they become design decisions.",
    introBody:
      "Paste palette JSON from your AI, switch between preview modes, and compare how each color system behaves across hero, project, editorial, and dark contexts. Select a palette to copy CSS variables, export JSON, or share a URL with the current palette embedded.",
    introLinkPrefix: "Built for color discussions around",
    promptLabel: "Example prompt",
    promptIntro:
      "Copy this when asking an AI to generate palettes that work in this tool:",
    prompt: `You are generating color palettes for Palette Preview Lab — a comparison tool that previews palette ideas side by side in realistic portfolio UI mockups (hero, projects, editorial, and dark sections).

Return one or more palettes as JSON that can be pasted directly into the import field. Use a JSON array when proposing multiple options.

Each palette object must include:
- name (string)
- description (optional string — mood or intent)
- colors (object with every role below, as hex or rgba)

Required color roles:
- paper — page background
- paperSoft — cards and panels
- paperWarm — warm supporting surfaces
- ink — primary text
- inkSoft — secondary headings
- inkMuted — metadata and captions
- line — subtle borders
- lineStrong — dividers and rules
- solar — primary accent
- solarBright — hover and glow accent
- copper — secondary accent
- deepSpace — dark section background
- spaceBlue — dark cards

Briefly explain what each palette explores so it is easy to compare options.`,
    controlsLabel: "Palette controls",
    previewModeLabel: "Preview mode",
    boardLabel: "Palette comparison board",
    readyNotice: "Ready for AI palette JSON.",
    loadedNotice: (name: string) => `Loaded ${name} from the URL hash.`,
    addedNotice: (count: number) =>
      `Added ${count} palette${count === 1 ? "" : "s"}.`,
    clearedNotice: "Cleared imported palettes.",
    parseError: "Could not parse palette JSON.",
    hashError: "Could not read the palette embedded in the URL hash.",
    clipboardError: "Clipboard access was blocked by the browser.",
    modes: {
      hero: "Hero",
      projects: "Projects",
      editorial: "Editorial",
      dark: "Dark",
    } satisfies Record<PreviewMode, string>,
  },
  sv: {
    languageName: "Svenska",
    switchLanguage: "English",
    switchLanguageLabel: "Växla sidans språk till engelska",
    title: "Jämför färgpaletter i sitt sammanhang.",
    copyJson: "Kopiera vald palett som JSON",
    copyCss: "Kopiera CSS-variabler för vald palett",
    copyShare: "Kopiera delningslänk för vald palett",
    introLabel: "Så funkar det",
    introTitle:
      "Ett litet labb för att jämföra palettidéer innan de blir designbeslut.",
    introBody:
      "Klistra in palett-JSON från din AI, växla mellan preview-lägen och jämför hur varje färgsystem beter sig i hero, projekt, editorial och mörka sektioner. Välj en palett för att kopiera CSS-variabler, exportera JSON eller dela en URL med den aktuella paletten inbäddad.",
    introLinkPrefix: "Byggd för färgdiskussioner kring",
    promptLabel: "Exempelprompt",
    promptIntro:
      "Kopiera den här när du ber en AI generera paletter som fungerar i verktyget:",
    prompt: `Du genererar färgpaletter för Palette Preview Lab — ett jämförelseverktyg som visar palettförslag sida vid sida i realistiska portfolio-UI-mockups (hero, projekt, editorial och mörka sektioner).

Returnera en eller flera paletter som JSON som kan klistras in direkt i importfältet. Använd en JSON-array när du föreslår flera alternativ.

Varje palettobjekt måste innehålla:
- name (sträng)
- description (valfri sträng — stämning eller avsikt)
- colors (objekt med varje roll nedan, som hex eller rgba)

Obligatoriska färgroller:
- paper — sidbakgrund
- paperSoft — kort och paneler
- paperWarm — varma stödytor
- ink — primär text
- inkSoft — sekundära rubriker
- inkMuted — metadata och bildtexter
- line — subtila kanter
- lineStrong — avdelare och linjer
- solar — primär accent
- solarBright — hover- och glöd-accent
- copper — sekundär accent
- deepSpace — bakgrund i mörka sektioner
- spaceBlue — mörka kort

Förklara kort vad varje palett utforskar så att alternativen är lätta att jämföra.`,
    controlsLabel: "Palettkontroller",
    previewModeLabel: "Preview-läge",
    boardLabel: "Jämförelsevy för paletter",
    readyNotice: "Redo för AI-palett-JSON.",
    loadedNotice: (name: string) => `Laddade ${name} från URL-hashen.`,
    addedNotice: (count: number) =>
      `Lade till ${count} palett${count === 1 ? "" : "er"}.`,
    clearedNotice: "Rensade importerade paletter.",
    parseError: "Kunde inte tolka palett-JSON.",
    hashError: "Kunde inte läsa paletten som är inbäddad i URL-hashen.",
    clipboardError: "Webbläsaren blockerade åtkomst till urklipp.",
    modes: {
      hero: "Hero",
      projects: "Projekt",
      editorial: "Editorial",
      dark: "Mörk",
    } satisfies Record<PreviewMode, string>,
  },
};

const getBrowserLanguage = (): Language => {
  const browserLanguage = navigator.languages?.[0] ?? navigator.language;
  return browserLanguage.toLowerCase().startsWith("sv") ? "sv" : "en";
};

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
  const initialLanguage = getBrowserLanguage();
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [importedPalettes, setImportedPalettes] =
    useState<Palette[]>(loadImportedPalettes);
  const [mode, setMode] = useState<PreviewMode>("hero");
  const [selectedId, setSelectedId] = useState(starterPalettes[0].id);
  const [jsonInput, setJsonInput] = useState("");
  const [notice, setNotice] = useState(
    () => translations[initialLanguage].readyNotice,
  );
  const [copied, setCopied] = useState<string | null>(null);
  const hasLoadedHash = useRef(false);
  const t = translations[language];
  const nextLanguage: Language = language === "sv" ? "en" : "sv";

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
    document.documentElement.lang = language;
  }, [language]);

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
      setNotice(t.loadedNotice(imported[0].name));
    } catch {
      setNotice(t.hashError);
    }
  }, [t]);

  const handleImport = () => {
    try {
      const imported = parsePalettes(jsonInput);
      setImportedPalettes((current) => [...current, ...imported]);
      setSelectedId(imported[0].id);
      setJsonInput("");
      setNotice(t.addedNotice(imported.length));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : t.parseError);
    }
  };

  const handleClearImported = () => {
    setImportedPalettes([]);
    setSelectedId(starterPalettes[0].id);
    setNotice(t.clearedNotice);
  };

  const handleCopy = async (label: string, text: string) => {
    try {
      await copyText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setNotice(t.clipboardError);
    }
  };

  const handleShare = async () => {
    await handleCopy("share", createShareUrl(selectedPalette));
  };

  return (
    <main className="app-shell" lang={language}>
      <section className="topbar">
        <div>
          <p className="eyebrow">Palette Preview Lab</p>
          <h1>{t.title}</h1>
        </div>
        <div className="topbar__actions">
          <button
            aria-label={t.switchLanguageLabel}
            aria-pressed={language === "sv"}
            className="language-toggle"
            type="button"
            title={t.switchLanguageLabel}
            onClick={() => {
              setLanguage(nextLanguage);
              setNotice(translations[nextLanguage].readyNotice);
            }}
          >
            {t.switchLanguage}
          </button>
          <button
            aria-label={t.copyJson}
            className="icon-button"
            type="button"
            title={t.copyJson}
            onClick={() =>
              handleCopy("json", JSON.stringify(selectedPalette, null, 2))
            }
          >
            {copied === "json" ? <Check size={18} /> : <FileJson size={18} />}
          </button>
          <button
            aria-label={t.copyCss}
            className="icon-button"
            type="button"
            title={t.copyCss}
            onClick={() => handleCopy("css", exportText)}
          >
            {copied === "css" ? <Check size={18} /> : <Code2 size={18} />}
          </button>
          <button
            aria-label={t.copyShare}
            className="icon-button"
            type="button"
            title={t.copyShare}
            onClick={handleShare}
          >
            {copied === "share" ? <Check size={18} /> : <Link size={18} />}
          </button>
        </div>
      </section>

      <section className="intro-band" aria-labelledby="intro-title">
        <div>
          <p className="section-label">{t.introLabel}</p>
          <h2 id="intro-title">{t.introTitle}</h2>
          <p>{t.introBody}</p>
          <p className="intro-link">
            {t.introLinkPrefix}{" "}
            <a
              href="https://www.jonasolson.se"
              target="_blank"
              rel="noreferrer"
            >
              www.jonasolson.se
            </a>
            .
          </p>
        </div>
        <div className="prompt-example">
          <p className="section-label">{t.promptLabel}</p>
          <p>{t.promptIntro}</p>
          <pre>{t.prompt}</pre>
        </div>
      </section>

      <section className="controls-band" aria-label={t.controlsLabel}>
        <div
          className="mode-switch"
          role="group"
          aria-label={t.previewModeLabel}
        >
          {previewModes.map((previewMode) => (
            <button
              aria-pressed={mode === previewMode.id}
              key={previewMode.id}
              className={mode === previewMode.id ? "is-active" : ""}
              type="button"
              onClick={() => setMode(previewMode.id)}
            >
              <Eye size={15} />
              {t.modes[previewMode.id]}
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
          language={language}
        />
      </section>

      <section className="comparison-board" aria-label={t.boardLabel}>
        {palettes.map((palette) => (
          <PaletteColumn
            key={palette.id}
            palette={palette}
            mode={mode}
            isSelected={palette.id === selectedPalette.id}
            onSelect={() => setSelectedId(palette.id)}
            language={language}
          />
        ))}
      </section>

      <ExportPanel
        copied={copied}
        exportText={exportText}
        palette={selectedPalette}
        onCopy={handleCopy}
        language={language}
      />
    </main>
  );
}

export default App;
