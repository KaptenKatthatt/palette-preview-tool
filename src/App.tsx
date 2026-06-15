import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Clipboard,
  Code2,
  Download,
  Eye,
  FileJson,
  Link,
  Plus,
  Sparkles,
  X,
} from "lucide-react";

type ColorRole =
  | "paper"
  | "paperSoft"
  | "paperWarm"
  | "ink"
  | "inkSoft"
  | "inkMuted"
  | "line"
  | "lineStrong"
  | "solar"
  | "solarBright"
  | "copper"
  | "deepSpace"
  | "spaceBlue";

type PaletteColors = Record<ColorRole, string>;

type Palette = {
  id: string;
  name: string;
  description: string;
  colors: PaletteColors;
};

type PreviewMode = "hero" | "projects" | "editorial" | "dark";

const roleLabels: Record<ColorRole, { label: string; use: string }> = {
  paper: { label: "paper", use: "Page background" },
  paperSoft: { label: "paper soft", use: "Cards and panels" },
  paperWarm: { label: "paper warm", use: "Soft surfaces" },
  ink: { label: "ink", use: "Primary text" },
  inkSoft: { label: "ink soft", use: "Secondary headings" },
  inkMuted: { label: "ink muted", use: "Metadata and captions" },
  line: { label: "line", use: "Subtle borders" },
  lineStrong: { label: "line strong", use: "Rules and dividers" },
  solar: { label: "solar", use: "Primary accent" },
  solarBright: { label: "solar bright", use: "Hover and glow" },
  copper: { label: "copper", use: "Secondary accent" },
  deepSpace: { label: "deep space", use: "Dark sections" },
  spaceBlue: { label: "space blue", use: "Dark cards" },
};

const requiredRoles = Object.keys(roleLabels) as ColorRole[];

const starterPalettes: Palette[] = [
  {
    id: "editorial-orbit",
    name: "Editorial Orbit",
    description: "Warm editorial palette, main candidate",
    colors: {
      paper: "#F4EFE6",
      paperSoft: "#FBF7EF",
      paperWarm: "#EFE3D2",
      ink: "#071827",
      inkSoft: "#243444",
      inkMuted: "#5E6873",
      line: "rgba(7, 24, 39, 0.14)",
      lineStrong: "rgba(7, 24, 39, 0.24)",
      solar: "#C87918",
      solarBright: "#F2A23A",
      copper: "#9D5B1C",
      deepSpace: "#07111C",
      spaceBlue: "#102033",
    },
  },
  {
    id: "cool-editorial",
    name: "Cool Editorial",
    description: "Slightly cooler, more technical editorial palette",
    colors: {
      paper: "#F2F4F1",
      paperSoft: "#FBFBF6",
      paperWarm: "#E6EBE7",
      ink: "#071B2C",
      inkSoft: "#26394A",
      inkMuted: "#65727D",
      line: "rgba(7, 27, 44, 0.14)",
      lineStrong: "rgba(7, 27, 44, 0.24)",
      solar: "#C76A1F",
      solarBright: "#F09A36",
      copper: "#8F5424",
      deepSpace: "#06111D",
      spaceBlue: "#10253A",
    },
  },
  {
    id: "soft-magazine",
    name: "Soft Magazine",
    description: "Lighter, softer, more paper-like test palette",
    colors: {
      paper: "#F7F1E7",
      paperSoft: "#FFF9F0",
      paperWarm: "#E8D8C1",
      ink: "#101820",
      inkSoft: "#303A42",
      inkMuted: "#6F6A63",
      line: "rgba(16, 24, 32, 0.14)",
      lineStrong: "rgba(16, 24, 32, 0.24)",
      solar: "#B96E22",
      solarBright: "#E9A13A",
      copper: "#8A4F25",
      deepSpace: "#101722",
      spaceBlue: "#18283A",
    },
  },
];

const previewModes: Array<{ id: PreviewMode; label: string }> = [
  { id: "hero", label: "Hero" },
  { id: "projects", label: "Projects" },
  { id: "editorial", label: "Editorial" },
  { id: "dark", label: "Dark" },
];

const sampleJson = `[
  {
    "name": "Editorial Orbit",
    "description": "Warm editorial palette for Jonas portfolio",
    "colors": {
      "paper": "#F4EFE6",
      "paperSoft": "#FBF7EF",
      "paperWarm": "#EFE3D2",
      "ink": "#071827",
      "inkSoft": "#243444",
      "inkMuted": "#5E6873",
      "line": "rgba(7, 24, 39, 0.14)",
      "lineStrong": "rgba(7, 24, 39, 0.24)",
      "solar": "#C87918",
      "solarBright": "#F2A23A",
      "copper": "#9D5B1C",
      "deepSpace": "#07111C",
      "spaceBlue": "#102033"
    }
  }
]`;

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const cssVarName = (role: string) =>
  role.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const paletteToVars = (palette: Palette) =>
  requiredRoles
    .map((role) => `  --color-${cssVarName(role)}: ${palette.colors[role]};`)
    .join("\n");

const paletteToCss = (palette: Palette) =>
  `:root[data-palette="${slugify(palette.name)}"] {\n${paletteToVars(palette)}\n}`;

const createPalette = (input: unknown, index: number): Palette => {
  if (!input || typeof input !== "object") {
    throw new Error(`Palette ${index + 1} is not an object.`);
  }

  const maybePalette = input as Partial<Palette>;
  const colors = maybePalette.colors;

  if (!colors || typeof colors !== "object") {
    throw new Error(`Palette ${index + 1} is missing a colors object.`);
  }

  const missing = requiredRoles.filter(
    (role) => typeof (colors as Partial<PaletteColors>)[role] !== "string",
  );

  if (missing.length > 0) {
    throw new Error(
      `${maybePalette.name ?? `Palette ${index + 1}`} is missing: ${missing.join(", ")}.`,
    );
  }

  const name = typeof maybePalette.name === "string" ? maybePalette.name : `AI Palette ${index + 1}`;
  const description =
    typeof maybePalette.description === "string"
      ? maybePalette.description
      : "Imported palette";

  return {
    id: `${slugify(name) || "palette"}-${Date.now()}-${index}`,
    name,
    description,
    colors: colors as PaletteColors,
  };
};

const parsePalettes = (raw: string): Palette[] => {
  const parsed = JSON.parse(raw) as unknown;
  const items = Array.isArray(parsed)
    ? parsed
    : parsed &&
        typeof parsed === "object" &&
        "palettes" in parsed &&
        Array.isArray((parsed as { palettes: unknown }).palettes)
      ? (parsed as { palettes: unknown[] }).palettes
      : [parsed];

  return items.map(createPalette);
};

const parseColor = (value: string): [number, number, number] | null => {
  const hex = value.trim();
  const shortHex = /^#([0-9a-f]{3})$/i.exec(hex);
  const longHex = /^#([0-9a-f]{6})$/i.exec(hex);
  const rgba = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(hex);

  if (shortHex) {
    return shortHex[1].split("").map((part) => parseInt(part + part, 16)) as [
      number,
      number,
      number,
    ];
  }

  if (longHex) {
    const color = longHex[1];
    return [
      parseInt(color.slice(0, 2), 16),
      parseInt(color.slice(2, 4), 16),
      parseInt(color.slice(4, 6), 16),
    ];
  }

  if (rgba) {
    return [Number(rgba[1]), Number(rgba[2]), Number(rgba[3])];
  }

  return null;
};

const luminance = ([r, g, b]: [number, number, number]) => {
  const values = [r, g, b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
};

const contrastRatio = (foreground: string, background: string) => {
  const fg = parseColor(foreground);
  const bg = parseColor(background);

  if (!fg || !bg) {
    return null;
  }

  const lighter = Math.max(luminance(fg), luminance(bg));
  const darker = Math.min(luminance(fg), luminance(bg));

  return (lighter + 0.05) / (darker + 0.05);
};

const contrastGrade = (ratio: number | null) => {
  if (!ratio) return "Check";
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "Large";
  return "Low";
};

const getContrastChecks = (palette: Palette) => [
  { label: "ink / paper", fg: palette.colors.ink, bg: palette.colors.paper },
  { label: "muted / paper", fg: palette.colors.inkMuted, bg: palette.colors.paper },
  { label: "paper / deep", fg: palette.colors.paper, bg: palette.colors.deepSpace },
  { label: "solar / paper", fg: palette.colors.solar, bg: palette.colors.paper },
  { label: "solar / deep", fg: palette.colors.solar, bg: palette.colors.deepSpace },
  { label: "button text", fg: palette.colors.paperSoft, bg: palette.colors.solar },
];

const copyText = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

const encodePalette = (palette: Palette) =>
  btoa(unescape(encodeURIComponent(JSON.stringify(palette))));

const decodePalette = (value: string) =>
  JSON.stringify(JSON.parse(decodeURIComponent(escape(atob(value)))), null, 2);

function App() {
  const [palettes, setPalettes] = useState<Palette[]>(starterPalettes);
  const [mode, setMode] = useState<PreviewMode>("hero");
  const [selectedId, setSelectedId] = useState(starterPalettes[0].id);
  const [jsonInput, setJsonInput] = useState("");
  const [notice, setNotice] = useState("Ready for AI palette JSON.");
  const [copied, setCopied] = useState<string | null>(null);

  const selectedPalette =
    palettes.find((palette) => palette.id === selectedId) ?? palettes[0];

  const exportText = useMemo(
    () => (selectedPalette ? paletteToCss(selectedPalette) : ""),
    [selectedPalette],
  );

  useEffect(() => {
    const hash = window.location.hash.replace(/^#palette=/, "");
    if (!hash || hash === window.location.hash) return;

    try {
      const decoded = decodePalette(hash);
      const imported = parsePalettes(decoded);
      setPalettes((current) => [...current, ...imported]);
      setSelectedId(imported[0].id);
      setNotice(`Loaded ${imported[0].name} from the URL hash.`);
    } catch {
      setNotice("Could not read the palette embedded in the URL hash.");
    }
  }, []);

  const handleImport = () => {
    try {
      const imported = parsePalettes(jsonInput);
      setPalettes((current) => [...current, ...imported]);
      setSelectedId(imported[0].id);
      setJsonInput("");
      setNotice(`Added ${imported.length} palette${imported.length === 1 ? "" : "s"}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not parse palette JSON.");
    }
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
    const url = `${window.location.origin}${window.location.pathname}#palette=${encodePalette(
      selectedPalette,
    )}`;
    await handleCopy("share", url);
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
            className="icon-button"
            type="button"
            title="Copy selected palette JSON"
            onClick={() => handleCopy("json", JSON.stringify(selectedPalette, null, 2))}
          >
            {copied === "json" ? <Check size={18} /> : <FileJson size={18} />}
          </button>
          <button
            className="icon-button"
            type="button"
            title="Copy selected palette CSS variables"
            onClick={() => handleCopy("css", exportText)}
          >
            {copied === "css" ? <Check size={18} /> : <Code2 size={18} />}
          </button>
          <button
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
        <div className="mode-switch" role="tablist" aria-label="Preview mode">
          {previewModes.map((previewMode) => (
            <button
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
            value={jsonInput}
            onChange={(event) => setJsonInput(event.target.value)}
            placeholder={sampleJson}
            aria-label="Paste AI palette JSON"
          />
          <div className="import-panel__footer">
            <span className={notice.startsWith("Added") || notice.startsWith("Loaded") ? "notice good" : "notice"}>
              {notice}
            </span>
            <button className="primary-action" type="button" onClick={handleImport}>
              <Plus size={16} />
              Add palette
            </button>
          </div>
        </div>
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

      <section className="export-band" aria-label="Export selected palette">
        <div>
          <p className="section-label">Selected export</p>
          <h2>{selectedPalette.name}</h2>
          <p>{selectedPalette.description}</p>
        </div>
        <pre>{exportText}</pre>
        <div className="export-actions">
          <button type="button" onClick={() => handleCopy("css-bottom", exportText)}>
            {copied === "css-bottom" ? <Check size={16} /> : <Clipboard size={16} />}
            Copy CSS
          </button>
          <button
            type="button"
            onClick={() =>
              handleCopy("json-bottom", JSON.stringify(selectedPalette, null, 2))
            }
          >
            {copied === "json-bottom" ? <Check size={16} /> : <Download size={16} />}
            Copy JSON
          </button>
        </div>
      </section>
    </main>
  );
}

function PaletteColumn({
  palette,
  mode,
  isSelected,
  onSelect,
}: {
  palette: Palette;
  mode: PreviewMode;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const styles = {
    "--paper": palette.colors.paper,
    "--paper-soft": palette.colors.paperSoft,
    "--paper-warm": palette.colors.paperWarm,
    "--ink": palette.colors.ink,
    "--ink-soft": palette.colors.inkSoft,
    "--ink-muted": palette.colors.inkMuted,
    "--line": palette.colors.line,
    "--line-strong": palette.colors.lineStrong,
    "--solar": palette.colors.solar,
    "--solar-bright": palette.colors.solarBright,
    "--copper": palette.colors.copper,
    "--deep-space": palette.colors.deepSpace,
    "--space-blue": palette.colors.spaceBlue,
  } as React.CSSProperties;

  return (
    <article
      className={`palette-column ${isSelected ? "is-selected" : ""}`}
      style={styles}
      onClick={onSelect}
    >
      <header className="palette-header">
        <div>
          <p className="section-label">Palette</p>
          <h2>{palette.name}</h2>
        </div>
        {isSelected ? <span className="selected-pill">Selected</span> : null}
      </header>
      <p className="palette-description">{palette.description}</p>

      <PortfolioPreview mode={mode} />
      <ColorRoleList palette={palette} />
      <ContrastList palette={palette} />
    </article>
  );
}

function PortfolioPreview({ mode }: { mode: PreviewMode }) {
  return (
    <section className={`preview preview--${mode}`} aria-label={`${mode} preview`}>
      {mode === "hero" ? <HeroPreview /> : null}
      {mode === "projects" ? <ProjectsPreview /> : null}
      {mode === "editorial" ? <EditorialPreview /> : null}
      {mode === "dark" ? <DarkPreview /> : null}
    </section>
  );
}

function HeroPreview() {
  return (
    <>
      <div className="mini-nav">
        <span>Selected Work</span>
        <span>Archive</span>
        <span>Contact</span>
      </div>
      <div className="hero-preview">
        <div>
          <p className="mono">HELIO / ORBIT 01</p>
          <h3>Jonas Olson</h3>
          <p>Frontend Developer & Interaction Designer</p>
          <div className="button-row">
            <span className="button-primary">View work</span>
            <span className="button-secondary">About</span>
          </div>
        </div>
        <div className="orbit-visual" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="pitch-card">
        <Sparkles size={15} />
        <p>Crafting polished interfaces with motion, systems thinking, and a little solar drama.</p>
      </div>
    </>
  );
}

function ProjectsPreview() {
  return (
    <>
      <div className="project-grid">
        <div className="featured-card">
          <p className="mono">FEATURED</p>
          <h3>Helio Trip</h3>
          <p>Orbital WebGL interface for a playful space-adjacent project.</p>
        </div>
        <div className="featured-card compact">
          <p className="mono">SYSTEM</p>
          <h3>Doom Builder</h3>
          <p>Tooling, maps, and strange little interaction loops.</p>
        </div>
      </div>
      <div className="small-card-grid">
        <span>Motion Library</span>
        <span>Portfolio CMS</span>
        <span>Design Tokens</span>
      </div>
    </>
  );
}

function EditorialPreview() {
  return (
    <>
      <div className="editorial-rule" />
      <div className="editorial-layout">
        <p className="mono">NOTES / 2026</p>
        <h3>Subtle Editorial Orbit</h3>
        <p>
          A quiet portfolio language where warm paper, clear ink, and small orbital accents
          make the work feel considered.
        </p>
      </div>
      <div className="quote-card">
        <span>01</span>
        <p>Less spectacle, more signal. Let the palette carry the atmosphere.</p>
      </div>
    </>
  );
}

function DarkPreview() {
  return (
    <div className="dark-preview-inner">
      <p className="mono">DEEP SPACE</p>
      <h3>Helio Trip</h3>
      <p>Testing whether accent colors still feel luminous in a dark contrast section.</p>
      <div className="dark-card-row">
        <span>Orbit map</span>
        <span>Signal trace</span>
      </div>
    </div>
  );
}

function ColorRoleList({ palette }: { palette: Palette }) {
  return (
    <div className="role-list">
      {requiredRoles.map((role) => (
        <div className="role-row" key={role}>
          <span className="swatch" style={{ background: palette.colors[role] }} />
          <div>
            <strong>{roleLabels[role].label}</strong>
            <small>{roleLabels[role].use}</small>
          </div>
          <code>{palette.colors[role]}</code>
        </div>
      ))}
    </div>
  );
}

function ContrastList({ palette }: { palette: Palette }) {
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

export default App;
