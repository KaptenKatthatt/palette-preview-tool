import { Sparkles } from "lucide-react";
import type { PreviewMode } from "../types";

export function PortfolioPreview({ mode }: { mode: PreviewMode }) {
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
