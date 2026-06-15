import { useEffect, useMemo, useState } from "react";
import { Check, Code2, Eye, FileJson, Link } from "lucide-react";
import { ExportPanel } from "./components/ExportPanel";
import { ImportPanel } from "./components/ImportPanel";
import { PaletteColumn } from "./components/PaletteColumn";
import { PreviewContentEditor } from "./components/PreviewContentEditor";
import { previewProfiles, starterPalettes } from "./data/starterPalettes";
import {
  defaultEditorialContent,
  defaultGenericContent,
} from "./data/previewContent";
import { paletteToGenericCss } from "./lib/paletteExport";
import { parsePalettes } from "./lib/paletteImport";
import { createShareUrl, decodePalette } from "./lib/shareUrl";
import type { Language, Palette, PreviewContent, PreviewProfile } from "./types";

const IMPORTED_PALETTES_STORAGE_KEY = "palette-preview-lab:imported-palettes";
const PREVIEW_CONTENT_STORAGE_KEY = "palette-preview-lab:preview-content";

const translations = {
  en: {
    languageName: "English",
    switchLanguage: "Svenska",
    switchLanguageLabel: "Switch page language to Swedish",
    title: "Compare color palettes in real interface contexts.",
    copyJson: "Copy selected palette JSON",
    copyCss: "Copy generic CSS variables",
    copyShare: "Copy share URL for selected palette",
    introLabel: "How it works",
    introTitle:
      "A small lab for comparing palette ideas before they become design decisions.",
    introBody:
      "Paste palette JSON from your AI, switch between preview profiles, and compare how each color system behaves across landing pages, apps, docs, and dark sections. Select a palette to copy generic CSS variables, export the original JSON, or share a URL with the current palette embedded.",
    promptLabel: "Example prompt",
    promptIntro:
      "Copy this when asking an AI to generate palettes that work in this tool:",
    prompt: `You are generating color palettes for Palette Preview Lab — a comparison tool that previews palette ideas side by side in realistic interface mockups (landing pages, SaaS apps, e-commerce, documentation, and dark sections).

Return one or more palettes as JSON that can be pasted directly into the import field. Use a JSON array when proposing multiple options.

Each palette object must include:
- name (string)
- description (optional string — mood or intent)
- colors (object with every role below, as hex or rgba)

Required color roles (generic scheme):
- background — page background
- surface — cards and panels
- surfaceAlt — alternate surfaces
- text — primary text
- textSoft — secondary headings
- textMuted — metadata and captions
- border — subtle borders
- borderStrong — dividers and rules
- primary — primary accent
- primaryHover — hover accent
- secondary — secondary accent
- darkBackground — dark section background
- darkSurface — dark cards

Alternatively, editorial scheme roles are also accepted:
paper, paperSoft, paperWarm, ink, inkSoft, inkMuted, line, lineStrong, solar, solarBright, copper, deepSpace, spaceBlue

Briefly explain what each palette explores so it is easy to compare options.`,
    controlsLabel: "Palette controls",
    previewProfileLabel: "Preview profile",
    boardLabel: "Palette comparison board",
    readyNotice: "Ready for AI palette JSON.",
    loadedNotice: (name: string) => `Loaded ${name} from the URL hash.`,
    addedNotice: (count: number) =>
      `Added ${count} palette${count === 1 ? "" : "s"}.`,
    clearedNotice: "Cleared imported palettes.",
    parseError: "Could not parse palette JSON.",
    hashError: "Could not read the palette embedded in the URL hash.",
    clipboardError: "Clipboard access was blocked by the browser.",
    profiles: {
      landing: "Generic Landing Page",
      "editorial-portfolio": "Editorial Portfolio",
      saas: "SaaS / App UI",
      ecommerce: "E-commerce",
      documentation: "Documentation",
      dark: "Dark Section",
    } satisfies Record<PreviewProfile, string>,
  },
  sv: {
    languageName: "Svenska",
    switchLanguage: "English",
    switchLanguageLabel: "Växla sidans språk till engelska",
    title: "Jämför färgpaletter i verkliga gränssnittskontexter.",
    copyJson: "Kopiera vald palett som JSON",
    copyCss: "Kopiera generiska CSS-variabler",
    copyShare: "Kopiera delningslänk för vald palett",
    introLabel: "Så funkar det",
    introTitle:
      "Ett litet labb för att jämföra palettidéer innan de blir designbeslut.",
    introBody:
      "Klistra in palett-JSON från din AI, växla mellan preview-profiler och jämför hur varje färgsystem beter sig i landningssidor, appar, dokumentation och mörka sektioner. Välj en palett för att kopiera generiska CSS-variabler, exportera original-JSON eller dela en URL med den aktuella paletten inbäddad.",
    promptLabel: "Exempelprompt",
    promptIntro:
      "Kopiera den här när du ber en AI generera paletter som fungerar i verktyget:",
    prompt: `Du genererar färgpaletter för Palette Preview Lab — ett jämförelseverktyg som visar palettförslag sida vid sida i realistiska gränssnittsmockups (landningssidor, SaaS-appar, e-handel, dokumentation och mörka sektioner).

Returnera en eller flera paletter som JSON som kan klistras in direkt i importfältet. Använd en JSON-array när du föreslår flera alternativ.

Varje palettobjekt måste innehålla:
- name (sträng)
- description (valfri sträng — stämning eller avsikt)
- colors (objekt med varje roll nedan, som hex eller rgba)

Obligatoriska färgroller (generiskt schema):
- background — sidbakgrund
- surface — kort och paneler
- surfaceAlt — alternativa ytor
- text — primär text
- textSoft — sekundära rubriker
- textMuted — metadata och bildtexter
- border — subtila kanter
- borderStrong — avdelare och linjer
- primary — primär accent
- primaryHover — hover-accent
- secondary — sekundär accent
- darkBackground — bakgrund i mörka sektioner
- darkSurface — mörka kort

Alternativt accepteras även editorial-schema:
paper, paperSoft, paperWarm, ink, inkSoft, inkMuted, line, lineStrong, solar, solarBright, copper, deepSpace, spaceBlue

Förklara kort vad varje palett utforskar så att alternativen är lätta att jämföra.`,
    controlsLabel: "Palettkontroller",
    previewProfileLabel: "Preview-profil",
    boardLabel: "Jämförelsevy för paletter",
    readyNotice: "Redo för AI-palett-JSON.",
    loadedNotice: (name: string) => `Laddade ${name} från URL-hashen.`,
    addedNotice: (count: number) =>
      `Lade till ${count} palett${count === 1 ? "" : "er"}.`,
    clearedNotice: "Rensade importerade paletter.",
    parseError: "Kunde inte tolka palett-JSON.",
    hashError: "Kunde inte läsa paletten som är inbäddad i URL-hashen.",
    clipboardError: "Webbläsaren blockerade åtkomst till urklipp.",
    profiles: {
      landing: "Generisk landningssida",
      "editorial-portfolio": "Editorial portfolio",
      saas: "SaaS / app-UI",
      ecommerce: "E-handel",
      documentation: "Dokumentation",
      dark: "Mörk sektion",
    } satisfies Record<PreviewProfile, string>,
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

const loadPreviewContent = (): PreviewContent => {
  try {
    const stored = window.localStorage.getItem(PREVIEW_CONTENT_STORAGE_KEY);
    if (!stored) return defaultGenericContent;
    return { ...defaultGenericContent, ...JSON.parse(stored) };
  } catch {
    return defaultGenericContent;
  }
};

type HashLoadResult =
  | { status: "loaded"; palettes: Palette[] }
  | { status: "error" }
  | { status: "none" };

const loadHashPalettes = (): HashLoadResult => {
  const hash = window.location.hash.replace(/^#palette=/, "");
  if (!hash || hash === window.location.hash) return { status: "none" };

  try {
    const decoded = decodePalette(hash);
    const palettes = parsePalettes(decoded);
    return { status: "loaded", palettes };
  } catch {
    return { status: "error" };
  }
};

const getPreviewContentForProfile = (
  profile: PreviewProfile,
  saved: PreviewContent,
): PreviewContent => {
  if (profile === "editorial-portfolio") {
    return {
      ...defaultEditorialContent,
      projectTitle: saved.projectTitle || defaultEditorialContent.projectTitle,
      subtitle: saved.subtitle || defaultEditorialContent.subtitle,
      primaryCta: saved.primaryCta || defaultEditorialContent.primaryCta,
      secondaryCta: saved.secondaryCta || defaultEditorialContent.secondaryCta,
      featuredItems: saved.featuredItems.some(Boolean)
        ? saved.featuredItems
        : defaultEditorialContent.featuredItems,
    };
  }
  return saved;
};

function App() {
  const initialLanguage = getBrowserLanguage();
  const hashLoad = loadHashPalettes();
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [importedPalettes, setImportedPalettes] = useState<Palette[]>(() => {
    const stored = loadImportedPalettes();
    if (hashLoad.status === "loaded") {
      return [...stored, ...hashLoad.palettes];
    }
    return stored;
  });
  const [profile, setProfile] = useState<PreviewProfile>("landing");
  const [previewContent, setPreviewContent] =
    useState<PreviewContent>(loadPreviewContent);
  const [selectedId, setSelectedId] = useState(() =>
    hashLoad.status === "loaded"
      ? hashLoad.palettes[0].id
      : starterPalettes[0].id,
  );
  const [jsonInput, setJsonInput] = useState("");
  const [notice, setNotice] = useState(() => {
    if (hashLoad.status === "loaded") {
      return translations[initialLanguage].loadedNotice(
        hashLoad.palettes[0].name,
      );
    }
    if (hashLoad.status === "error") {
      return translations[initialLanguage].hashError;
    }
    return translations[initialLanguage].readyNotice;
  });
  const [copied, setCopied] = useState<string | null>(null);
  const t = translations[language];
  const nextLanguage: Language = language === "sv" ? "en" : "sv";

  const palettes = useMemo(
    () => [...starterPalettes, ...importedPalettes],
    [importedPalettes],
  );

  const selectedPalette =
    palettes.find((palette) => palette.id === selectedId) ?? palettes[0];

  const activePreviewContent = useMemo(
    () => getPreviewContentForProfile(profile, previewContent),
    [profile, previewContent],
  );

  const exportText = useMemo(
    () => (selectedPalette ? paletteToGenericCss(selectedPalette) : ""),
    [selectedPalette],
  );

  useEffect(() => {
    window.localStorage.setItem(
      IMPORTED_PALETTES_STORAGE_KEY,
      JSON.stringify(importedPalettes),
    );
  }, [importedPalettes]);

  useEffect(() => {
    window.localStorage.setItem(
      PREVIEW_CONTENT_STORAGE_KEY,
      JSON.stringify(previewContent),
    );
  }, [previewContent]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

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

  const handleResetPreviewContent = () => {
    setPreviewContent(
      profile === "editorial-portfolio"
        ? defaultEditorialContent
        : defaultGenericContent,
    );
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
              handleCopy(
                "json",
                JSON.stringify(
                  {
                    name: selectedPalette.name,
                    description: selectedPalette.description,
                    roleScheme: selectedPalette.roleScheme,
                    colors: selectedPalette.colors,
                  },
                  null,
                  2,
                ),
              )
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
          aria-label={t.previewProfileLabel}
        >
          {previewProfiles.map((previewProfile) => (
            <button
              aria-pressed={profile === previewProfile.id}
              key={previewProfile.id}
              className={profile === previewProfile.id ? "is-active" : ""}
              type="button"
              onClick={() => setProfile(previewProfile.id)}
            >
              <Eye size={15} />
              {t.profiles[previewProfile.id]}
            </button>
          ))}
        </div>

        <PreviewContentEditor
          content={activePreviewContent}
          language={language}
          onChange={setPreviewContent}
          onReset={handleResetPreviewContent}
        />

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
            profile={profile}
            previewContent={activePreviewContent}
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
