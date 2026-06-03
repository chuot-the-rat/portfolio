import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { toSentence } from "../../utils/caseStudyCopy";

const FALLBACK_IMAGE_ALT = "Image unavailable";

export const CaseStudyImage = ({
    src,
    alt,
    className,
    loading = "lazy",
    fallbackLabel = "Image unavailable",
}) => {
    const [hasError, setHasError] = useState(false);
    const safeAlt = alt || FALLBACK_IMAGE_ALT;

    useEffect(() => {
        setHasError(false);
    }, [src]);

    if (!src || hasError) {
        return (
            <div className={`case-image-fallback ${className || ""}`.trim()} role="img" aria-label={safeAlt}>
                <span className="case-image-fallback-label">{fallbackLabel}</span>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={safeAlt}
            className={className}
            loading={loading}
            onError={() => setHasError(true)}
        />
    );
};

const normalizeComparisonItems = (comparisons = []) =>
    (Array.isArray(comparisons) ? comparisons : []).filter(
        (comparison) =>
            comparison?.before?.src &&
            comparison?.after?.src &&
            toSentence(comparison?.label),
    );

const ScrollableMockupFrame = ({ src, alt }) => {
    const [hasInteracted, setHasInteracted] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        setHasInteracted(false);
    }, [src]);

    const markInteracted = () => {
        if (!hasInteracted) setHasInteracted(true);
    };

    const handleKeyDown = (event) => {
        const keys = [
            "ArrowDown",
            "ArrowUp",
            "PageDown",
            "PageUp",
            "Home",
            "End",
            " ",
        ];
        if (keys.includes(event.key)) {
            markInteracted();
        }
    };

    const safeAlt = toSentence(alt) || "Case study preview";

    return (
        <div className="mockup-frame" data-interacted={hasInteracted}>
            <div className="mockup-frame-bar" aria-hidden="true">
                <span />
                <span />
                <span />
            </div>

            <div className="mockup-frame-screen">
                <div
                    className="mockup-scroll-viewport"
                    tabIndex={0}
                    role="region"
                    aria-label={`Scrollable screen preview: ${safeAlt}`}
                    onScroll={markInteracted}
                    onWheel={markInteracted}
                    onTouchStart={markInteracted}
                    onKeyDown={handleKeyDown}
                >
                    <CaseStudyImage src={src} alt={safeAlt} loading="lazy" />
                </div>

                <div className="mockup-fade mockup-fade-top" aria-hidden="true" />
                <div
                    className="mockup-fade mockup-fade-bottom"
                    aria-hidden="true"
                />
            </div>

            {!hasInteracted && !shouldReduceMotion && (
                <p className="mockup-scroll-hint" aria-live="polite">
                    Scroll to view
                </p>
            )}
        </div>
    );
};

export const BeforeAfterComparisons = ({ comparisons = [] }) => {
    const stableComparisons = normalizeComparisonItems(comparisons);
    if (stableComparisons.length === 0) return null;

    return (
        <div className="before-after-list" aria-label="Before and after comparisons">
            {stableComparisons.map((comparison, index) => (
                <motion.article
                    key={comparison.id || index}
                    className="before-after-row"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                >
                    <header className="before-after-header">
                        <h3 className="before-after-title">{comparison.label}</h3>
                    </header>

                    <div className="before-after-grid">
                        <figure className="before-after-card">
                            <figcaption className="before-after-tag">Before</figcaption>
                            <ScrollableMockupFrame
                                src={comparison.before.src}
                                alt={comparison.before.alt}
                            />
                            {comparison.before.caption && (
                                <p className="before-after-caption">
                                    {comparison.before.caption}
                                </p>
                            )}
                        </figure>

                        <figure className="before-after-card">
                            <figcaption className="before-after-tag">After</figcaption>
                            <ScrollableMockupFrame
                                src={comparison.after.src}
                                alt={comparison.after.alt}
                            />
                            {comparison.after.caption && (
                                <p className="before-after-caption">
                                    {comparison.after.caption}
                                </p>
                            )}
                        </figure>
                    </div>
                </motion.article>
            ))}
        </div>
    );
};

export const PrototypeTabs = ({ tabs = [] }) => {
    const validTabs = tabs.filter((tab) => tab?.embedUrl || tab?.fallbackUrl);
    const [activeTab, setActiveTab] = useState(validTabs[0]?.id || "");

    if (!validTabs.length) return null;

    const current = validTabs.find((tab) => tab.id === activeTab) || validTabs[0];

    return (
        <motion.section
            className="project-section prototype-tabs-section"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.45 }}
        >
            <h2 className="section-title">Prototypes</h2>
            <p className="section-description">
                Compare low- and high-fidelity prototypes in one focused view.
            </p>

            <div className="prototype-tabs-header" role="tablist" aria-label="Prototype views">
                {validTabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={current.id === tab.id}
                        aria-controls={`prototype-panel-${tab.id}`}
                        id={`prototype-tab-${tab.id}`}
                        className={`prototype-tab ${current.id === tab.id ? "is-active" : ""}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div
                id={`prototype-panel-${current.id}`}
                role="tabpanel"
                aria-labelledby={`prototype-tab-${current.id}`}
                className="prototype-tabs-panel"
            >
                {current.embedUrl ? (
                    <div className="prototype-tabs-iframe-wrap">
                        <iframe
                            src={current.embedUrl}
                            title={current.title || "Prototype embed"}
                            className="prototype-tabs-iframe"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <div className="prototype-tabs-fallback">
                        <p className="prototype-tabs-fallback-text">
                            Preview unavailable for this tab. Open the direct Figma link below.
                        </p>
                    </div>
                )}

                {current.fallbackUrl && (
                    <a
                        href={current.fallbackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="prototype-tabs-link"
                    >
                        Open in Figma ↗
                    </a>
                )}
            </div>
        </motion.section>
    );
};

export const ProjectCredibility = ({ rows = [] }) => {
    const safeRows = rows.filter((row) => toSentence(row?.label) && toSentence(row?.value));
    if (safeRows.length === 0) return null;

    return (
        <section className="project-credibility" aria-label="Case study credibility summary">
            {safeRows.map((row) => (
                <article key={row.label} className="project-credibility-item">
                    <h2 className="project-credibility-label">{row.label}</h2>
                    <p className="project-credibility-value">{row.value}</p>
                </article>
            ))}
        </section>
    );
};
