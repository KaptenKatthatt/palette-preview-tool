import { Sparkles } from "lucide-react";
import type { Language, PreviewMode } from "../types";

const copy = {
  en: {
    previewLabel: (mode: PreviewMode) => `${mode} preview`,
    nav: ["Selected Work", "Archive", "Contact"],
    role: "Frontend Developer & Interaction Designer",
    viewWork: "View work",
    about: "About",
    pitch: "Crafting polished interfaces with motion, systems thinking, and a little solar drama.",
    featured: "FEATURED",
    system: "SYSTEM",
    helioDescription: "Orbital WebGL interface for a playful space-adjacent project.",
    doomDescription: "Tooling, maps, and strange little interaction loops.",
    cards: ["Motion Library", "Portfolio CMS", "Design Tokens"],
    notes: "NOTES / 2026",
    editorialTitle: "Subtle Editorial Orbit",
    editorialBody:
      "A quiet portfolio language where warm paper, clear ink, and small orbital accents make the work feel considered.",
    quote: "Less spectacle, more signal. Let the palette carry the atmosphere.",
    deepSpace: "DEEP SPACE",
    darkBody: "Testing whether accent colors still feel luminous in a dark contrast section.",
    darkCards: ["Orbit map", "Signal trace"],
  },
  sv: {
    previewLabel: (mode: PreviewMode) => `${mode} preview`,
    nav: ["Utvalda projekt", "Arkiv", "Kontakt"],
    role: "Frontendutvecklare & interaktionsdesigner",
    viewWork: "Se projekt",
    about: "Om mig",
    pitch: "Bygger polerade gränssnitt med rörelse, systemtänk och lite solig dramatik.",
    featured: "UTVALT",
    system: "SYSTEM",
    helioDescription: "Orbitalt WebGL-gränssnitt för ett lekfullt rymdnära projekt.",
    doomDescription: "Verktyg, kartor och små märkliga interaktionsloopar.",
    cards: ["Motion library", "Portfolio-CMS", "Designtokens"],
    notes: "ANTECKNINGAR / 2026",
    editorialTitle: "Subtil editorial orbit",
    editorialBody:
      "Ett lågmält portfoliospråk där varmt papper, tydlig text och små orbitala accenter får arbetet att kännas genomtänkt.",
    quote: "Mindre spektakel, mer signal. Låt paletten bära atmosfären.",
    deepSpace: "DJUPRYMD",
    darkBody: "Testar om accentfärgerna fortfarande känns lysande i en mörk kontrastsektion.",
    darkCards: ["Orbitkarta", "Signalspår"],
  },
};

export function PortfolioPreview({
  language,
  mode,
}: {
  language: Language;
  mode: PreviewMode;
}) {
  const text = copy[language];

  return (
    <section className={`preview preview--${mode}`} aria-label={text.previewLabel(mode)}>
      {mode === "hero" ? <HeroPreview text={text} /> : null}
      {mode === "projects" ? <ProjectsPreview text={text} /> : null}
      {mode === "editorial" ? <EditorialPreview text={text} /> : null}
      {mode === "dark" ? <DarkPreview text={text} /> : null}
    </section>
  );
}

function HeroPreview({ text }: { text: (typeof copy)[Language] }) {
  return (
    <>
      <div className="mini-nav">
        {text.nav.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="hero-preview">
        <div>
          <p className="mono">HELIO / ORBIT 01</p>
          <h3>Jonas Olson</h3>
          <p>{text.role}</p>
          <div className="button-row">
            <span className="button-primary">{text.viewWork}</span>
            <span className="button-secondary">{text.about}</span>
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
        <p>{text.pitch}</p>
      </div>
    </>
  );
}

function ProjectsPreview({ text }: { text: (typeof copy)[Language] }) {
  return (
    <>
      <div className="project-grid">
        <div className="featured-card">
          <p className="mono">{text.featured}</p>
          <h3>Helio Trip</h3>
          <p>{text.helioDescription}</p>
        </div>
        <div className="featured-card compact">
          <p className="mono">{text.system}</p>
          <h3>Doom Builder</h3>
          <p>{text.doomDescription}</p>
        </div>
      </div>
      <div className="small-card-grid">
        {text.cards.map((card) => (
          <span key={card}>{card}</span>
        ))}
      </div>
    </>
  );
}

function EditorialPreview({ text }: { text: (typeof copy)[Language] }) {
  return (
    <>
      <div className="editorial-rule" />
      <div className="editorial-layout">
        <p className="mono">{text.notes}</p>
        <h3>{text.editorialTitle}</h3>
        <p>{text.editorialBody}</p>
      </div>
      <div className="quote-card">
        <span>01</span>
        <p>{text.quote}</p>
      </div>
    </>
  );
}

function DarkPreview({ text }: { text: (typeof copy)[Language] }) {
  return (
    <div className="dark-preview-inner">
      <p className="mono">{text.deepSpace}</p>
      <h3>Helio Trip</h3>
      <p>{text.darkBody}</p>
      <div className="dark-card-row">
        {text.darkCards.map((card) => (
          <span key={card}>{card}</span>
        ))}
      </div>
    </div>
  );
}
