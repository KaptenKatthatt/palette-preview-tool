import type { Language, PreviewContent } from "../types";

const copy = {
  en: {
    label: "Preview content",
    title: "Edit preview text",
    projectTitle: "Project title",
    subtitle: "Subtitle",
    primaryCta: "Primary CTA",
    secondaryCta: "Secondary CTA",
    featured1: "Featured item 1",
    featured2: "Featured item 2",
    featured3: "Featured item 3",
    reset: "Reset to defaults",
  },
  sv: {
    label: "Preview-innehåll",
    title: "Redigera preview-text",
    projectTitle: "Projekttitel",
    subtitle: "Underrubrik",
    primaryCta: "Primär CTA",
    secondaryCta: "Sekundär CTA",
    featured1: "Utvalt objekt 1",
    featured2: "Utvalt objekt 2",
    featured3: "Utvalt objekt 3",
    reset: "Återställ standard",
  },
};

export function PreviewContentEditor({
  content,
  language,
  onChange,
  onReset,
}: {
  content: PreviewContent;
  language: Language;
  onChange: (content: PreviewContent) => void;
  onReset: () => void;
}) {
  const text = copy[language];

  const update = (patch: Partial<PreviewContent>) => {
    onChange({ ...content, ...patch });
  };

  const updateFeatured = (index: 0 | 1 | 2, value: string) => {
    const featuredItems = [...content.featuredItems] as PreviewContent["featuredItems"];
    featuredItems[index] = value;
    onChange({ ...content, featuredItems });
  };

  return (
    <div className="preview-content-editor">
      <div className="preview-content-editor__copy">
        <p className="section-label">{text.label}</p>
        <h2>{text.title}</h2>
      </div>
      <div className="preview-content-editor__fields">
        <label>
          {text.projectTitle}
          <input
            type="text"
            value={content.projectTitle}
            onChange={(e) => update({ projectTitle: e.target.value })}
          />
        </label>
        <label>
          {text.subtitle}
          <input
            type="text"
            value={content.subtitle}
            onChange={(e) => update({ subtitle: e.target.value })}
          />
        </label>
        <label>
          {text.primaryCta}
          <input
            type="text"
            value={content.primaryCta}
            onChange={(e) => update({ primaryCta: e.target.value })}
          />
        </label>
        <label>
          {text.secondaryCta}
          <input
            type="text"
            value={content.secondaryCta}
            onChange={(e) => update({ secondaryCta: e.target.value })}
          />
        </label>
        <label>
          {text.featured1}
          <input
            type="text"
            value={content.featuredItems[0]}
            onChange={(e) => updateFeatured(0, e.target.value)}
          />
        </label>
        <label>
          {text.featured2}
          <input
            type="text"
            value={content.featuredItems[1]}
            onChange={(e) => updateFeatured(1, e.target.value)}
          />
        </label>
        <label>
          {text.featured3}
          <input
            type="text"
            value={content.featuredItems[2]}
            onChange={(e) => updateFeatured(2, e.target.value)}
          />
        </label>
      </div>
      <button className="secondary-action" type="button" onClick={onReset}>
        {text.reset}
      </button>
    </div>
  );
}
