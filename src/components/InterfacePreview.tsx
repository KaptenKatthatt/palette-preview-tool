import { Sparkles, ShoppingCart, BookOpen, LayoutDashboard } from "lucide-react";
import { editorialPortfolioExtras } from "../data/previewContent";
import type { Language, PreviewContent, PreviewProfile } from "../types";

type InterfacePreviewProps = {
  language: Language;
  profile: PreviewProfile;
  content: PreviewContent;
};

export function InterfacePreview({
  language,
  profile,
  content,
}: InterfacePreviewProps) {
  return (
    <section
      className={`preview preview--${profile}`}
      aria-label={`${profile} preview`}
    >
      {profile === "landing" ? (
        <LandingPreview content={content} />
      ) : null}
      {profile === "editorial-portfolio" ? (
        <EditorialPortfolioPreview language={language} content={content} />
      ) : null}
      {profile === "saas" ? <SaasPreview content={content} /> : null}
      {profile === "ecommerce" ? <EcommercePreview content={content} /> : null}
      {profile === "documentation" ? (
        <DocumentationPreview content={content} />
      ) : null}
      {profile === "dark" ? <DarkPreview content={content} /> : null}
    </section>
  );
}

function LandingPreview({ content }: { content: PreviewContent }) {
  return (
    <>
      <div className="mini-nav">
        <span>Product</span>
        <span>Pricing</span>
        <span>Docs</span>
      </div>
      <div className="hero-preview">
        <div>
          <p className="mono">LANDING / 01</p>
          <h3>{content.projectTitle}</h3>
          <p>{content.subtitle}</p>
          <div className="button-row">
            <span className="button-primary">{content.primaryCta}</span>
            <span className="button-secondary">{content.secondaryCta}</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="pitch-card">
        <Sparkles size={15} />
        <p>
          Preview how your palette reads in a hero, navigation, and supporting
          card surfaces.
        </p>
      </div>
    </>
  );
}

function EditorialPortfolioPreview({
  language,
  content,
}: {
  language: Language;
  content: PreviewContent;
}) {
  const text = editorialPortfolioExtras[language];

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
          <h3>{content.projectTitle}</h3>
          <p>{content.subtitle}</p>
          <div className="button-row">
            <span className="button-primary">{content.primaryCta}</span>
            <span className="button-secondary">{content.secondaryCta}</span>
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
      <div className="project-grid">
        <div className="featured-card">
          <p className="mono">{text.featured}</p>
          <h3>{content.featuredItems[0]}</h3>
          <p>{text.helioDescription}</p>
        </div>
        <div className="featured-card compact">
          <p className="mono">{text.system}</p>
          <h3>{content.featuredItems[1]}</h3>
          <p>{text.doomDescription}</p>
        </div>
      </div>
      <div className="editorial-rule" />
      <div className="editorial-layout editorial-layout--compact">
        <p className="mono">{text.notes}</p>
        <h3>{text.editorialTitle}</h3>
        <p>{text.editorialBody}</p>
      </div>
    </>
  );
}

function SaasPreview({ content }: { content: PreviewContent }) {
  return (
    <div className="saas-preview">
      <div className="saas-sidebar">
        <p className="mono">APP</p>
        <span className="is-active">Dashboard</span>
        <span>Projects</span>
        <span>Settings</span>
      </div>
      <div className="saas-main">
        <div className="saas-topbar">
          <h3>{content.projectTitle}</h3>
          <span className="button-primary">{content.primaryCta}</span>
        </div>
        <p className="saas-subtitle">{content.subtitle}</p>
        <div className="saas-metrics">
          {content.featuredItems.map((item) => (
            <div className="saas-metric-card" key={item}>
              <LayoutDashboard size={14} />
              <strong>{item}</strong>
              <small>Active module</small>
            </div>
          ))}
        </div>
        <div className="saas-panel">
          <p className="mono">WORKFLOW</p>
          <p>Surface, border, and accent colors in a typical app shell.</p>
          <span className="button-secondary">{content.secondaryCta}</span>
        </div>
      </div>
    </div>
  );
}

function EcommercePreview({ content }: { content: PreviewContent }) {
  return (
    <div className="ecommerce-preview">
      <div className="ecommerce-header">
        <h3>{content.projectTitle}</h3>
        <span className="ecommerce-cart">
          <ShoppingCart size={14} />
          Cart
        </span>
      </div>
      <p className="ecommerce-tagline">{content.subtitle}</p>
      <div className="ecommerce-grid">
        {content.featuredItems.map((item, index) => (
          <div className="ecommerce-card" key={item}>
            <div className="ecommerce-image" />
            <strong>{item}</strong>
            <small>From $4{index + 9}.00</small>
            <span className="button-primary">Add to cart</span>
          </div>
        ))}
      </div>
      <div className="ecommerce-promo">
        <span className="button-secondary">{content.secondaryCta}</span>
        <span className="button-primary">{content.primaryCta}</span>
      </div>
    </div>
  );
}

function DocumentationPreview({ content }: { content: PreviewContent }) {
  return (
    <div className="docs-preview">
      <div className="docs-sidebar">
        <p className="mono">
          <BookOpen size={13} /> DOCS
        </p>
        <span className="is-active">Getting started</span>
        <span>Components</span>
        <span>Theming</span>
      </div>
      <div className="docs-main">
        <p className="mono">GUIDE / 01</p>
        <h3>{content.projectTitle}</h3>
        <p>{content.subtitle}</p>
        <div className="docs-callout">
          <strong>Tip</strong>
          <p>
            Documentation pages lean on background, surface, and muted text for
            long-form readability.
          </p>
        </div>
        <div className="docs-links">
          {content.featuredItems.map((item) => (
            <a href="#" key={item} onClick={(e) => e.preventDefault()}>
              {item}
            </a>
          ))}
        </div>
        <span className="button-primary">{content.primaryCta}</span>
      </div>
    </div>
  );
}

function DarkPreview({ content }: { content: PreviewContent }) {
  return (
    <div className="dark-preview-inner">
      <p className="mono">DARK SECTION</p>
      <h3>{content.projectTitle}</h3>
      <p>
        Testing whether accent colors still feel luminous on dark backgrounds
        and elevated surfaces.
      </p>
      <div className="dark-card-row">
        {content.featuredItems.slice(0, 2).map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="button-row">
        <span className="button-primary">{content.primaryCta}</span>
        <span className="button-secondary">{content.secondaryCta}</span>
      </div>
    </div>
  );
}
