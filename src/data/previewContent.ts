import type { PreviewContent } from "../types";

export const defaultGenericContent: PreviewContent = {
  projectTitle: "Northline Studio",
  subtitle: "Design systems and product interfaces for growing teams.",
  primaryCta: "Get started",
  secondaryCta: "View features",
  featuredItems: ["Analytics", "Workflows", "Integrations"],
};

export const defaultEditorialContent: PreviewContent = {
  projectTitle: "Jonas Olson",
  subtitle: "Frontend Developer & Interaction Designer",
  primaryCta: "View work",
  secondaryCta: "About",
  featuredItems: ["Helio Trip", "Doom Builder", "Design Tokens"],
};

export const editorialPortfolioExtras = {
  en: {
    nav: ["Selected Work", "Archive", "Contact"],
    pitch:
      "Crafting polished interfaces with motion, systems thinking, and a little solar drama.",
    featured: "FEATURED",
    system: "SYSTEM",
    helioDescription:
      "Orbital WebGL interface for a playful space-adjacent project.",
    doomDescription: "Tooling, maps, and strange little interaction loops.",
    notes: "NOTES / 2026",
    editorialTitle: "Subtle Editorial Orbit",
    editorialBody:
      "A quiet portfolio language where warm paper, clear ink, and small orbital accents make the work feel considered.",
    quote: "Less spectacle, more signal. Let the palette carry the atmosphere.",
    deepSpace: "DEEP SPACE",
    darkBody:
      "Testing whether accent colors still feel luminous in a dark contrast section.",
    darkCards: ["Orbit map", "Signal trace"],
  },
  sv: {
    nav: ["Utvalda projekt", "Arkiv", "Kontakt"],
    pitch:
      "Bygger polerade gränssnitt med rörelse, systemtänk och lite solig dramatik.",
    featured: "UTVALT",
    system: "SYSTEM",
    helioDescription:
      "Orbitalt WebGL-gränssnitt för ett lekfullt rymdnära projekt.",
    doomDescription: "Verktyg, kartor och små märkliga interaktionsloopar.",
    notes: "ANTECKNINGAR / 2026",
    editorialTitle: "Subtil editorial orbit",
    editorialBody:
      "Ett lågmält portfoliospråk där varmt papper, tydlig text och små orbitala accenter får arbetet att kännas genomtänkt.",
    quote: "Mindre spektakel, mer signal. Låt paletten bära atmosfären.",
    deepSpace: "DJUPRYMD",
    darkBody:
      "Testar om accentfärgerna fortfarande känns lysande i en mörk kontrastsektion.",
    darkCards: ["Orbitkarta", "Signalspår"],
  },
};
