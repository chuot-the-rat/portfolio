import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { usePageTitle } from "../hooks/usePageTitle";
import ProjectCheckpoint from "../components/passbook/ProjectCheckpoint";
import { getProjectById } from "../utils/projectDataMapper";
import {
    SectionIndex,
    SectionTag,
    ScrollProgress,
    FigLabel,
} from "../components/MicroIndex";
import EvolutionSection from "../components/EvolutionSection";
import FigmaEmbed from "../components/FigmaEmbed";
import SimulationSection from "../features/sim/SimulationSection";
import BackToTop from "../components/BackToTop";
import ReadingProgress from "../components/ReadingProgress";
import ProjectNextPrev from "../components/ProjectNextPrev";
import {
    BrowserMockup,
    DecorativeDivider,
    PrincipleVerdict,
} from "../components/caseStudy";
import { caseStudyMotion } from "../utils/motion/caseStudyMotion";
import { getDisplayProjectMeta } from "../utils/displayProjectMeta";
import "./ProjectDetail.css";

const toSentence = (value) =>
    String(value || "").replace(/\s+/g, " ").trim();

const toConciseLine = (value, maxChars = 140) => {
    const sentence = toSentence(value);
    if (!sentence) return "";
    if (sentence.length <= maxChars) return sentence;
    return `${sentence.slice(0, maxChars).replace(/\s+\S*$/, "").trimEnd()}…`;
};

const toSentenceCaseLine = (value, maxChars = 140) => {
    const line = toConciseLine(value, maxChars);
    if (!line) return "";
    return `${line.charAt(0).toUpperCase()}${line.slice(1)}`;
};

const toLeadingSentence = (value, fallback = "", maxSentences = 2) => {
    const sentence = toSentence(value);
    if (!sentence) return fallback;
    const parts = sentence.split(/(?<=[.!?])\s+/);
    return parts.slice(0, maxSentences).join(" ");
};

const normalizeTextKey = (value) =>
    String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();

const dedupeTextList = (items = []) => {
    const seen = new Set();
    const unique = [];

    for (const item of items) {
        const text = toSentence(item);
        if (!text) continue;
        const key = normalizeTextKey(text);
        if (!key || seen.has(key)) continue;
        seen.add(key);
        unique.push(text);
    }

    return unique;
};

const filterRedundantOutcomes = (description, outcomes = []) => {
    const compactDescription = normalizeTextKey(description);
    const lowValuePatterns = [
        /collaborative turns/i,
        /perfectionism/i,
        /timed turns.*momentum/i,
        /low-pressure.*fun/i,
    ];
    return dedupeTextList(outcomes).filter((outcome) => {
        const outcomeKey = normalizeTextKey(outcome);
        if (!outcomeKey) return false;
        if (lowValuePatterns.some((pattern) => pattern.test(outcome))) return false;
        if (!compactDescription) return true;
        return !(
            compactDescription.includes(outcomeKey) ||
            outcomeKey.includes(compactDescription)
        );
    });
};

const hasConcreteSignal = (value) =>
    /\d|%|hour|hours|week|weeks|month|months|participant|prototype|testing|validated|reduced|improved/i.test(
        String(value || ""),
    );

const CASE_COPY_FALLBACKS = {
    impactSnapshot:
        "Validated through moderated usability sessions with documented outcomes.",
    problem:
        "Defined the user friction and why it blocked progress.",
    constraints:
        "Balanced scope constraints, technical limits, and delivery timing.",
    ownership:
        "Owned end-to-end product design from research to shipped UX.",
    decisions:
        "Prioritized decisions with evidence from user feedback and testing.",
    evidence:
        "Documented impact through validation outcomes and measurable signals.",
    next:
        "Captured next-step hypotheses for the following iteration cycle.",
    heroFraming:
        "This case study traces the key product decisions, why they changed, and what improved in outcomes.",
    pageSummary:
        "Case study detailing role, process, and measurable product outcomes.",
};

const CASE_SECTION_FALLBACKS = {
    default: "This section highlights the key decision, implementation move, and resulting impact.",
    overview:
        "This overview frames the core user problem, context, and project direction.",
    problem:
        "This section defines the user friction and why it blocked progress.",
    research:
        "Research signals clarified user needs, constraints, and the most viable direction.",
    personas:
        "Personas aligned feature priorities with concrete user needs and usage contexts.",
    userFlows:
        "Flow mapping clarified the critical path and removed avoidable decision friction.",
    ia: "Information architecture organized content into a structure users could scan and trust.",
    lofi: "Lo-fi exploration tested interaction logic before visual polish was introduced.",
    styleGuide:
        "The visual system established consistent hierarchy, readability, and component behavior.",
    iterations:
        "Each iteration addressed observed friction, then revalidated the updated interaction.",
    hifi: "High-fidelity execution translated validated flows into a clearer production-ready experience.",
    development:
        "Development decisions balanced implementation constraints with usability and reliability goals.",
    userTesting:
        "Testing evaluated task clarity, identified usability risks, and informed focused refinements.",
    finalPresentation:
        "This presentation summarizes the problem framing, design rationale, and final outcomes.",
    solution:
        "The final solution prioritizes clarity, confidence, and measurable progress through core workflows.",
    finalExperience:
        "The complete experience demonstrates the polished end-to-end flow in one contiguous journey.",
    validation:
        "Validation findings show where the design improved task completion, confidence, and clarity.",
    outcomes:
        "Outcome evidence captures impact with measurable changes and observed behavior shifts.",
    decisionEvidence:
        "This section traces the assumption, evidence, and resulting product decisions.",
};

const CASE_NESTED_FALLBACKS = {
    default: "This detail clarifies the decision and why it mattered.",
    flowDescription:
        "This flow reduces friction on the critical user path from intent to completion.",
    featureDescription:
        "This feature targets a specific friction point and clarifies the next user action.",
    insightDescription:
        "This learning informed subsequent prioritization and design direction.",
    prototypeDescription:
        "This prototype demonstrates the intended interaction model and expected outcomes.",
    screenDescription:
        "This screen documents a key interaction state in the final experience.",
    validationOutcomeLine:
        "This outcome summarizes observed impact from testing and iteration.",
};

const CASE_STUDY_COPY_TARGET_IDS = new Set(["inklink", "prolog", "sidequest"]);

const CASE_PILOT_OVERRIDES = {
    inklink: {
        tagline:
            "Collaborative writing that turns writer's block into shared momentum.",
        framing:
            "InkLink reframed writing as short, turn-based collaboration so users could keep stories moving without perfection pressure.",
        sections: {
            overview:
                "InkLink reframed stalled solo writing into a collaborative flow where each contributor adds one short passage at a time.",
            problem:
                "Writers were not short on ideas; they were blocked by perfection pressure, isolation, and tools optimized for productivity over creative momentum.",
            research:
                "Research confirmed the need for low-friction contribution, stronger onboarding, and layouts that support long-form reading on larger screens.",
            solution:
                "The final experience centered on public and private story chains, low-friction contribution, and clear status cues that sustain creative momentum.",
            validation:
                "Testing showed stronger task completion and higher confidence after onboarding, contribution flow, and interaction hierarchy were refined.",
            outcomes:
                "Measured improvements in task completion and satisfaction, paired with direct user feedback, validated the collaborative turn-based model.",
        },
        nested: {
            flowDescription:
                "Each flow keeps the contribution loop short and legible so users can commit without overthinking.",
            featureDescription:
                "Each feature supports momentum by reducing friction between reading, writing, and passing the story forward.",
            insightDescription:
                "Each insight captured a concrete product principle that informed later iteration decisions.",
            validationOutcomeLine:
                "Testing outcomes showed stronger completion and confidence after interaction hierarchy improvements.",
        },
    },
};

const toEditorialCopy = (
    value,
    { fallback = "", maxSentences = 2, maxChars = 220 } = {},
) => {
    const leading = toLeadingSentence(value, "", maxSentences);
    const compact = toSentenceCaseLine(leading || value || "", maxChars);
    if (compact) return compact;
    return toSentenceCaseLine(fallback, maxChars) || fallback;
};

const getCaseOverrides = (project) =>
    CASE_PILOT_OVERRIDES[String(project?.id || "").toLowerCase()] || null;

const isCaseStudyCopyTarget = (project) =>
    CASE_STUDY_COPY_TARGET_IDS.has(String(project?.id || "").toLowerCase());

const getHeroTaglineCopy = (project) => {
    const overrides = getCaseOverrides(project);
    return toEditorialCopy(overrides?.tagline || project?.tagline || project?.subtitle, {
        fallback: "A product case study focused on clarity, flow, and measurable outcomes.",
        maxSentences: 1,
        maxChars: 98,
    });
};

const getHeroFramingCopy = (project, displaySummary = "") => {
    const overrides = getCaseOverrides(project);
    return toEditorialCopy(
        overrides?.framing ||
            project?.problem?.description ||
            displaySummary ||
            project?.summary ||
            project?.tagline,
        {
            fallback: CASE_COPY_FALLBACKS.heroFraming,
            maxSentences: 1,
            maxChars: 164,
        },
    );
};

const getSectionIntroCopy = (
    project,
    sectionKey,
    value,
    { maxSentences = 2, maxChars = 228, fallback } = {},
) => {
    const overrides = getCaseOverrides(project);
    const overrideText = overrides?.sections?.[sectionKey];
    return toEditorialCopy(overrideText || value, {
        fallback:
            fallback ||
            CASE_SECTION_FALLBACKS[sectionKey] ||
            CASE_SECTION_FALLBACKS.default,
        maxSentences,
        maxChars,
    });
};

const getNestedCopy = (
    project,
    nestedKey,
    value,
    { fallback = "", maxSentences = 1, maxChars = 170 } = {},
) => {
    if (!isCaseStudyCopyTarget(project)) {
        return value || fallback;
    }

    const overrides = getCaseOverrides(project);
    const overrideText = overrides?.nested?.[nestedKey];
    return toEditorialCopy(overrideText || value, {
        fallback:
            fallback ||
            CASE_NESTED_FALLBACKS[nestedKey] ||
            CASE_NESTED_FALLBACKS.default,
        maxSentences,
        maxChars,
    });
};

const dedupeAdjacentCopy = (current, previous = "") =>
    normalizeTextKey(current) === normalizeTextKey(previous) ? "" : current;

const getImpactSnapshot = (project) => {
    if (Array.isArray(project?.outcomes?.metrics) && project.outcomes.metrics.length > 0) {
        return project.outcomes.metrics
            .slice(0, 3)
            .map((metric) => `${metric.value} ${metric.label}`);
    }
    if (Array.isArray(project?.validation?.outcomes) && project.validation.outcomes.length > 0) {
        return project.validation.outcomes.slice(0, 3);
    }
    return [CASE_COPY_FALLBACKS.impactSnapshot];
};

const firstNonEmpty = (...values) => {
    for (const value of values) {
        const text = toSentence(value);
        if (text) return text;
    }
    return "";
};

const toShortActionLine = (value, maxChars = 150) =>
    toSentenceCaseLine(toLeadingSentence(value, "", 1), maxChars);

const getSectionWhyLine = (project, sectionKey) => {
    const sectionMap = {
        research: [
            project?.research?.reflection,
            project?.research?.keyFindings?.[0],
            project?.research?.methods?.[0],
        ],
        userFlows: [
            project?.userFlows?.flows?.[0]?.description,
            project?.userFlows?.description,
        ],
        lofi: [
            project?.lofi?.prototype?.description,
            project?.lofi?.description,
        ],
        iterations: [
            project?.iterations?.improvements?.[0],
            project?.iterations?.description,
        ],
        hifi: [
            project?.hifi?.screens?.[0]?.description,
            project?.hifi?.description,
        ],
        development: [
            project?.development?.technicalDecisions?.[0],
            project?.development?.constraints?.[0],
        ],
        solution: [
            project?.solution?.features?.[0]?.why,
            project?.solution?.features?.[0]?.description,
        ],
        validation: [
            project?.validation?.outcomes?.[0],
            project?.validation?.method,
        ],
    };

    const source = firstNonEmpty(...(sectionMap[sectionKey] || []));
    if (!source) return "";
    return toShortActionLine(source, 156);
};

const getWhatChangedClose = (project) => {
    const sources = [
        project?.outcomes?.description,
        project?.validation?.outcomes?.[0],
        project?.outcomes?.metrics?.[0]
            ? `${project.outcomes.metrics[0].value} ${project.outcomes.metrics[0].label}`
            : "",
    ];
    const source = firstNonEmpty(...sources);
    if (!source) return "";
    return toShortActionLine(source, 172);
};

const getCredibilityRows = (project) => {
    const roleValue = Array.isArray(project?.role)
        ? project.role.join(", ")
        : project?.role || CASE_COPY_FALLBACKS.ownership;

    const constraints =
        project?.development?.constraints?.slice(0, 2) ||
        project?.challenges?.pivots?.slice(0, 2).map((pivot) => pivot.reason) ||
        [];

    const decisions =
        project?.iterations?.improvements?.slice(0, 2) ||
        project?.solution?.features?.slice(0, 2).map((feature) => feature.title) ||
        [];

    const measurable = getImpactSnapshot(project).slice(0, 2);
    const next =
        project?.evolution?.items?.slice(0, 2).map((item) => item.title || item.outcome) ||
        [];

    const evidenceLine = measurable.map(toSentence).join(" • ");

    return [
        {
            label: "Problem that mattered",
            value:
                toLeadingSentence(
                    project?.problem?.description || project?.overview?.description,
                    CASE_COPY_FALLBACKS.problem,
                ) ||
                CASE_COPY_FALLBACKS.problem,
        },
        {
            label: "Approach and constraints",
            value:
                constraints.length > 0
                    ? constraints.map(toSentence).join(" • ")
                    : CASE_COPY_FALLBACKS.constraints,
        },
        { label: "Ownership", value: roleValue },
        {
            label: "Key decisions",
            value:
                decisions.length > 0
                    ? decisions.map(toSentence).join(" • ")
                    : CASE_COPY_FALLBACKS.decisions,
        },
        {
            label: "Evidence of impact",
            value:
                hasConcreteSignal(evidenceLine)
                    ? evidenceLine
                    : CASE_COPY_FALLBACKS.evidence,
        },
        {
            label: "Next iteration",
            value:
                next.length > 0
                    ? next.map(toSentence).join(" • ")
                    : CASE_COPY_FALLBACKS.next,
        },
    ];
};

const getYouTubeEmbedUrl = (url) => {
    const value = String(url || "").trim();
    if (!value) return "";
    if (value.includes("youtube-nocookie.com/embed/")) return value;
    if (value.includes("youtube.com/embed/")) {
        return value.replace("youtube.com/embed/", "youtube-nocookie.com/embed/");
    }
    const shortMatch = value.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch?.[1]) {
        return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}`;
    }
    const longMatch = value.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (longMatch?.[1]) {
        return `https://www.youtube-nocookie.com/embed/${longMatch[1]}`;
    }
    return value;
};

const getLaunchMediaCaption = (launchAd) => {
    const explicitCaption = toSentenceCaseLine(launchAd?.caption, 156);
    if (explicitCaption) return explicitCaption;

    const hasVideo = Boolean(launchAd?.video_url || launchAd?.youtube_url);
    const hasDeck = Boolean(launchAd?.embed_url);

    if (hasVideo && hasDeck) {
        return "Use the walkthrough for flow context, then the deck for full rationale.";
    }

    if (hasVideo) {
        return "A concise walkthrough of the concept and core user flow.";
    }

    if (hasDeck) {
        return "Slide deck summarizing concept, decisions, and final flow.";
    }

    return "";
};

const FALLBACK_IMAGE_ALT = "Image unavailable";

const CaseStudyImage = ({
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

const BeforeAfterComparisons = ({ comparisons = [] }) => {
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

const PrototypeTabs = ({ tabs = [] }) => {
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

const ProjectCredibility = ({ rows = [] }) => {
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

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const pageSummary = toEditorialCopy(project?.summary || project?.tagline, {
        fallback: CASE_COPY_FALLBACKS.pageSummary,
        maxSentences: 1,
        maxChars: 156,
    });
    usePageTitle(project?.title ?? null, {
        description: pageSummary,
        path: id ? `/case-studies/${id}` : "/",
        image: project?.media?.og_image || "https://leanale.com/starfruit.png",
        structuredData: project
            ? {
                  "@context": "https://schema.org",
                  "@type": "CreativeWork",
                  name: project.title,
                  description: pageSummary || "Portfolio case study by Leana Le.",
                  url: `https://leanale.com/case-studies/${project.id}`,
                  author: {
                      "@type": "Person",
                      name: "Leana Le",
                  },
              }
            : null,
    });
    const [loading, setLoading] = useState(true);
    const contentRef = useRef(null);

    useEffect(() => {
        let alive = true;
        const controller = new AbortController();
        setLoading(true);

        // Load project data from centralized case studies
        try {
            const projectData = getProjectById(id);
            if (!projectData) {
                navigate("/");
                return;
            }

            // Try to fetch supplemental data (rich sections from local data.json)
            fetch(`/projects/${id}/data.json`, { signal: controller.signal })
                .then((res) => (res.ok ? res.json() : null))
                .then((localData) => {
                    if (!alive) return;
                    if (localData) {
                        const merged = { ...projectData };
                        // Merge supplemental sections that don't exist in the mapper
                        const extras = [
                            "personas",
                            "userFlows",
                            "informationArchitecture",
                            "styleGuide",
                            "hifi",
                            "prototype",
                            "userTesting",
                            "finalPresentation",
                            "embeds",
                        ];
                        for (const key of extras) {
                            if (!localData[key]) continue;
                            merged[key] = localData[key];
                        }
                        // Merge iterations rounds if present in local data
                        if (localData.iterations?.rounds) {
                            merged.iterations = {
                                ...merged.iterations,
                                ...localData.iterations,
                            };
                        }
                        setProject(merged);
                    } else {
                        setProject(projectData);
                    }
                    setLoading(false);
                })
                .catch(() => {
                    if (!alive) return;
                    setProject(projectData);
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error loading project:", error);
            navigate("/");
        }
        return () => {
            alive = false;
            controller.abort();
        };
    }, [id, navigate]);

    // Favicon swap: active ↔ idle on tab visibility change
    useEffect(() => {
        const link = document.querySelector("link[rel~='icon']");
        if (!link) return;
        const activeFavicon = link.href;
        const idleFavicon =
            "data:image/svg+xml," +
            encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">` +
                `<text y="26" font-size="26">💤</text></svg>`,
            );

        const onVisibility = () => {
            link.href = document.hidden ? idleFavicon : activeFavicon;
        };
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            document.removeEventListener("visibilitychange", onVisibility);
            link.href = activeFavicon;
        };
    }, []);

    if (loading) {
        return (
            <div className="project-detail-loading">
                <motion.div
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>
        );
    }

    if (!project) return null;

    // Hero image: prefer hifi/solution screens over generic overview
    const heroImage =
        project.media?.hero_image ??
        project.iterations?.images?.[0]?.src ??
        project.overview?.images?.[0]?.src ??
        null;

    // Build meta bar items — only show fields that exist
    const {
        displayScope,
        displayRole,
        displayYear,
        displaySummary,
    } = getDisplayProjectMeta(project);

    const toolsValue = Array.isArray(project.tools)
        ? project.tools.slice(0, 3).join(", ")
        : Array.isArray(project.techStack)
          ? project.techStack.slice(0, 3).join(", ")
          : project.tools || project.techStack || "";

    const metaItems = [
        displayScope && {
            label: "Scope",
            value: displayScope,
        },
        displayRole && {
            label: "Role",
            value: displayRole,
        },
        displayYear && { label: "Year", value: displayYear },
        (project.timeline || project.duration) && { label: "Timeline", value: project.timeline || project.duration },
        (project.team || project.teamSize) && {
            label: "Team",
            value: project.team || `${project.teamSize} members`,
        },
        toolsValue && { label: "Tools", value: toolsValue },
    ].filter(Boolean);

    const actionLinks = [
        project.links?.live && { href: project.links.live, label: "Live site" },
        project.links?.prototype && {
            href: project.links.prototype,
            label: "Prototype",
        },
        project.links?.github && { href: project.links.github, label: "GitHub" },
        project.links?.figma && { href: project.links.figma, label: "Figma" },
    ].filter(Boolean);

    const impactSnapshot = getImpactSnapshot(project);
    const credibilityRows = getCredibilityRows(project);
    const heroTagline = getHeroTaglineCopy(project);
    let framingStatement = getHeroFramingCopy(project, displaySummary);
    if (normalizeTextKey(framingStatement) === normalizeTextKey(heroTagline)) {
        framingStatement = CASE_COPY_FALLBACKS.heroFraming;
    }

    const previewLayout = String(project.previewLayout || "").toLowerCase();
    const layoutClass =
        previewLayout === "mobile" || previewLayout === "tablet"
            ? `project-detail--layout-${previewLayout}`
            : "project-detail--layout-tablet";

    return (
        <div
            className={`project-detail project-detail--${project.id || "unknown"} ${layoutClass}`}
        >
            <ReadingProgress />

            {/* Hero — full Sharleen-style header */}
            <motion.section
                className="project-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="container">

                    {/* Breadcrumb */}
                    <motion.nav
                        className="project-breadcrumb"
                        aria-label="Breadcrumb"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        <Link to="/" className="breadcrumb-link">Work</Link>
                        <span className="breadcrumb-sep" aria-hidden>/</span>
                        <span className="breadcrumb-current">{project.title}</span>
                    </motion.nav>

                    {/* Title block */}
                    <motion.div
                        className="project-hero-text"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Eyebrow: category · year */}
                        <span className="project-eyebrow">
                            {project.category}
                            {project.year && <><span aria-hidden> · </span>{project.year}</>}
                        </span>

                        <h1 className="project-hero-title">{project.title}</h1>

                        {heroTagline && (
                            <p className="project-hero-tagline">{heroTagline}</p>
                        )}
                        {framingStatement && (
                            <p className="project-framing-statement">
                                {framingStatement}
                            </p>
                        )}

                        <ul className="project-impact-snapshot" aria-label="Impact snapshot">
                            {impactSnapshot.map((item) => (
                                <li key={item} className="project-impact-item">{item}</li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Meta area — separated informational metadata and actions */}
                    {(metaItems.length > 0 || actionLinks.length > 0) && (
                        <motion.div
                            className="project-meta-bar"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.45, delay: 0.18 }}
                        >
                            {metaItems.length > 0 && (
                                <div className="project-meta-info" aria-label="Case info">
                                    <p className="project-meta-group-title">Case Info</p>
                                    {metaItems.map((item) => (
                                        <div key={item.label} className="project-meta-info-item">
                                            <span className="meta-label">{item.label}</span>
                                            <span className="meta-value">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {actionLinks.length > 0 && (
                                <div className="project-meta-actions" aria-label="Case links">
                                    <p className="project-meta-group-title">Actions</p>
                                    {actionLinks.map((link, index) => (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`project-meta-action-link ${index === 0 ? "is-primary" : ""}`.trim()}
                                        >
                                            {link.label} ↗
                                        </a>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    <DecorativeDivider />

                    {/* Hero image — full width below the header text */}
                    {heroImage && (
                        <motion.div
                            className="project-hero-media"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <CaseStudyImage
                                src={heroImage}
                                alt={`${project.title} preview`}
                                className="project-hero-media-img"
                            />
                        </motion.div>
                    )}
                </div>
            </motion.section>

            {(project.launchAd?.video_url ||
                project.launchAd?.youtube_url ||
                project.launchAd?.embed_url) && (
                <section className="project-launch-media">
                    <div className="container">
                        <div className="launch-media-card">
                            <p className="launch-media-label">Launch Media</p>
                            <h2 className="launch-media-title">
                                {project.launchAd?.title || `${project.title} launch media overview`}
                            </h2>
                            {getLaunchMediaCaption(project.launchAd) && (
                                <p className="launch-media-caption">
                                    {getLaunchMediaCaption(project.launchAd)}
                                </p>
                            )}
                            <div className="launch-media-stack">
                                {project.launchAd?.video_url && (
                                    <div className="launch-media-embed">
                                        <video
                                            controls
                                            preload="metadata"
                                            playsInline
                                            aria-label={project.launchAd.title || `${project.title} promo video`}
                                        >
                                            <source src={project.launchAd.video_url} type="video/mp4" />
                                        </video>
                                    </div>
                                )}

                                {project.launchAd?.youtube_url && (
                                    <div className="launch-media-embed">
                                        <iframe
                                            src={getYouTubeEmbedUrl(project.launchAd.youtube_url)}
                                            title={project.launchAd.title || `${project.title} launch media`}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        />
                                    </div>
                                )}

                                {project.launchAd?.embed_url && (
                                    <div className="launch-media-embed">
                                        <iframe
                                            src={project.launchAd.embed_url}
                                            title={`${project.title} presentation`}
                                            allowFullScreen
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Content Sections */}
            <div
                className="project-content"
                ref={contentRef}
            >
                <div className="container">
                    <ProjectCredibility rows={credibilityRows} />
                    <div className="project-content-layout">
                        <ProjectContentMain project={project} />
                        {/* Micro-index scroll progress sidebar */}
                        <ScrollProgress contentRef={contentRef} />
                    </div>
                </div>
            </div>
            {/* Passbook checkpoint — collect stamp before navigating away */}
            <div className="container">
                <ProjectCheckpoint projectId={project.id} />
            </div>

            {/* Next / Prev project navigation */}
            <div className="container">
                <ProjectNextPrev currentId={project.id} />
            </div>

            <BackToTop />
        </div>
    );
};

/* ═════════════════════════════════════════════════════════════════════
   ProjectContentMain — renders all case study sections
   with auto-incrementing micro-index system.
   Image counter (FIG.XX) resets per case study.
   ═════════════════════════════════════════════════════════════════════ */
const ProjectContentMain = ({ project }) => {
    /* Mutable counters — increment as sections render */
    let sectionNum = 0;
    let imageNum = 0;
    const ci = project.caseIndex || 1;
    const nextSection = () => ++sectionNum;
    const nextImage = () => ++imageNum;
    const hasIterationComparisons =
        Array.isArray(project.iterations?.comparisons) &&
        project.iterations.comparisons.length > 0;
    const comparisonsForLofi = hasIterationComparisons
        ? []
        : project.lofi?.comparisons || [];
    const comparisonsForIterations = hasIterationComparisons
        ? project.iterations.comparisons
        : [];
    const sectionIntro = (sectionKey, value, options) =>
        getSectionIntroCopy(project, sectionKey, value, options);
    const nestedCopy = (nestedKey, value, options) =>
        getNestedCopy(project, nestedKey, value, options);
    const compactProblemDescription = sectionIntro(
        "problem",
        project.problem?.description,
        { maxSentences: 1, maxChars: 170 },
    );
    const compactValidationDescription = sectionIntro(
        "validation",
        project.validation?.description,
        { maxSentences: 1, maxChars: 172 },
    );
    const validationOutcomes = filterRedundantOutcomes(
        compactValidationDescription,
        project.validation?.outcomes || [],
    );
    const normalizedValidationOutcomes = validationOutcomes
        .map((outcome, i, arr) => {
            const current = nestedCopy("validationOutcomeLine", outcome, {
                maxSentences: 1,
                maxChars: 156,
            });
            if (i === 0) return current;
            const previous = nestedCopy("validationOutcomeLine", arr[i - 1], {
                maxSentences: 1,
                maxChars: 156,
            });
            return dedupeAdjacentCopy(current, previous);
        })
        .filter(Boolean);
    const researchWhy = getSectionWhyLine(project, "research");
    const userFlowsWhy = getSectionWhyLine(project, "userFlows");
    const lofiWhy = getSectionWhyLine(project, "lofi");
    const iterationsWhy = getSectionWhyLine(project, "iterations");
    const hifiWhy = getSectionWhyLine(project, "hifi");
    const developmentWhy = getSectionWhyLine(project, "development");
    const solutionWhy = getSectionWhyLine(project, "solution");
    const validationWhy = getSectionWhyLine(project, "validation");
    const whatChangedClose = getWhatChangedClose(project);
    const evidenceNarrative = project.evidenceNarrative || null;
    const hasEvidenceNarrative = Boolean(
        evidenceNarrative &&
            (
                evidenceNarrative.originalAssumption ||
                evidenceNarrative.researchChangedDirection ||
                evidenceNarrative.whatChangedWhy ||
                (Array.isArray(evidenceNarrative.whatWasCut) &&
                    evidenceNarrative.whatWasCut.length > 0) ||
                evidenceNarrative.nextIteration
            ),
    );

    return (
        <div className="project-content-main">
            {/* Overview */}
            {project.overview &&
                (() => {
                    const s = nextSection();
                    return (
                        <IndexedSection
                            caseIndex={ci}
                            sectionIndex={s}
                            name="Overview"
                            title={project.overview.title}
                            description={sectionIntro("overview", project.overview.description)}
                            images={project.overview.images}
                            mediaDemo={project.overview.mediaDemo}
                            verdict={project.overview.verdict}
                            captionContext="Overview"
                            imageStartIndex={imageNum}
                            onImageCount={(n) => {
                                imageNum += n;
                            }}
                        />
                    );
                })()}

            {/* Problem framing */}
            {project.problem &&
                (() => {
                    const s = nextSection();
                    return (
                        <IndexedSection
                            caseIndex={ci}
                            sectionIndex={s}
                            name="Problem"
                            title={project.problem.title}
                            description={compactProblemDescription}
                            images={project.problem.images}
                            mediaDemo={project.problem.mediaDemo}
                            verdict={project.problem.verdict}
                            captionContext="Problem framing"
                            imageStartIndex={imageNum}
                            onImageCount={(n) => {
                                imageNum += n;
                            }}
                        />
                    );
                })()}

            {/* Research */}
            {project.research &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section research-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Approach"
                            />
                            <h2 className="section-title">
                                {project.research.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {sectionIntro("research", project.research.description)}
                            </p>
                            {researchWhy && (
                                <p className="section-why-line">
                                    <strong>Why this choice:</strong> {researchWhy}
                                </p>
                            )}
                            <BrowserMockup mediaDemo={project.research.mediaDemo} />
                            <PrincipleVerdict verdict={project.research.verdict} />

                            {project.research.methods?.length > 0 && (
                                <div className="research-methods">
                                    <h3 className="subsection-title">
                                        Methods
                                    </h3>
                                    <ul className="methods-list">
                                        {project.research.methods.map(
                                            (method, i) => (
                                                <li
                                                    key={i}
                                                    className="method-item"
                                                >
                                                    {method}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            {project.research.keyFindings?.length > 0 && (
                                <div className="research-findings">
                                    <h3 className="subsection-title">
                                        Key Findings
                                    </h3>
                                    <ul className="findings-list">
                                        {project.research.keyFindings.map(
                                            (finding, i) => (
                                                <li
                                                    key={i}
                                                    className="finding-item"
                                                >
                                                    {finding}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            {project.research.participantCount && (
                                <p className="participant-count">
                                    <strong>
                                        {project.research.participantCount}
                                    </strong>{" "}
                                    participants
                                </p>
                            )}

                            {project.research.images?.length > 0 && (
                                <ImageGallery
                                    images={project.research.images}
                                    captionContext="Research evidence"
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* Decision evidence */}
            {hasEvidenceNarrative &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section decision-evidence-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Decision Evidence"
                            />
                            <h2 className="section-title">What changed and why</h2>
                            <SectionTag sectionIndex={s} version="2.0" />
                            <p className="section-description">
                                {sectionIntro(
                                    "decisionEvidence",
                                    evidenceNarrative.whatChangedWhy,
                                )}
                            </p>

                            <div className="decision-evidence-grid">
                                {evidenceNarrative.originalAssumption && (
                                    <article className="decision-evidence-card">
                                        <h3 className="subsection-title">Original assumption</h3>
                                        <p className="decision-evidence-text">
                                            {evidenceNarrative.originalAssumption}
                                        </p>
                                    </article>
                                )}

                                {evidenceNarrative.researchChangedDirection && (
                                    <article className="decision-evidence-card">
                                        <h3 className="subsection-title">Research changed the direction</h3>
                                        <p className="decision-evidence-text">
                                            {evidenceNarrative.researchChangedDirection}
                                        </p>
                                    </article>
                                )}

                                {evidenceNarrative.whatChangedWhy && (
                                    <article className="decision-evidence-card">
                                        <h3 className="subsection-title">Design response</h3>
                                        <p className="decision-evidence-text">
                                            {evidenceNarrative.whatChangedWhy}
                                        </p>
                                    </article>
                                )}

                                {Array.isArray(evidenceNarrative.whatWasCut) &&
                                    evidenceNarrative.whatWasCut.length > 0 && (
                                        <article className="decision-evidence-card">
                                            <h3 className="subsection-title">What was cut</h3>
                                            <ul className="decision-evidence-list">
                                                {evidenceNarrative.whatWasCut.map((item) => (
                                                    <li key={item} className="decision-evidence-item">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </article>
                                    )}

                                {evidenceNarrative.nextIteration && (
                                    <article className="decision-evidence-card">
                                        <h3 className="subsection-title">Next iteration</h3>
                                        <p className="decision-evidence-text">
                                            {evidenceNarrative.nextIteration}
                                        </p>
                                    </article>
                                )}
                            </div>
                        </motion.section>
                    );
                })()}

            {/* ── Personas ── */}
            {project.personas &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section personas-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Personas"
                            />
                            <h2 className="section-title">
                                {project.personas.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {sectionIntro("personas", project.personas.description)}
                            </p>

                            {project.personas.prototypeLink && (
                                <FigmaEmbed
                                    linkOnly
                                    caption="View full personas in Figma"
                                    prototypeLink={
                                        project.personas.prototypeLink
                                    }
                                />
                            )}

                            {project.personas.images?.length > 0 &&
                                project.personas.images.map((img, i) => (
                                    <div
                                        key={i}
                                        className="persona-image"
                                        style={{ position: "relative" }}
                                    >
                                        <FigLabel index={nextImage()} />
                                        <CaseStudyImage
                                            src={img.src}
                                            alt={img.alt}
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                        </motion.section>
                    );
                })()}

            {/* ── User Flows ── */}
            {project.userFlows &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section userflows-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="User Flows"
                            />
                            <h2 className="section-title">
                                {project.userFlows.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {sectionIntro("userFlows", project.userFlows.description)}
                            </p>
                            {userFlowsWhy && (
                                <p className="section-why-line">
                                    <strong>Why this choice:</strong> {userFlowsWhy}
                                </p>
                            )}

                            {project.userFlows.flows?.length > 0 && (
                                <div className="flows-list">
                                    {project.userFlows.flows.map((flow, i) => (
                                        <motion.div
                                            key={i}
                                            className="flow-card"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: 0.5,
                                                delay: i * 0.1,
                                            }}
                                        >
                                            <h3 className="flow-name">
                                                {flow.name}
                                            </h3>
                                            {(() => {
                                                const flowDescription = nestedCopy(
                                                    "flowDescription",
                                                    flow.description,
                                                    { maxSentences: 1, maxChars: 158 },
                                                );
                                                const prevFlowDescription =
                                                    i > 0
                                                        ? nestedCopy(
                                                            "flowDescription",
                                                            project.userFlows?.flows?.[i - 1]
                                                                ?.description,
                                                            { maxSentences: 1, maxChars: 158 },
                                                        )
                                                        : "";
                                                const resolvedFlowDescription =
                                                    i > 0
                                                        ? dedupeAdjacentCopy(
                                                            flowDescription,
                                                            prevFlowDescription,
                                                        )
                                                        : flowDescription;
                                                return resolvedFlowDescription ? (
                                                    <p className="flow-description">
                                                        {resolvedFlowDescription}
                                                    </p>
                                                ) : null;
                                            })()}
                                            {flow.steps?.length > 0 && (
                                                <div className="flow-steps">
                                                    {flow.steps.map(
                                                        (step, j) => (
                                                            <span
                                                                key={j}
                                                                className="flow-step"
                                                            >
                                                                {step}
                                                                {j <
                                                                    flow.steps
                                                                        .length -
                                                                        1 && (
                                                                    <span className="flow-arrow">
                                                                        →
                                                                    </span>
                                                                )}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {project.userFlows.images?.length > 0 && (
                                <ImageGallery
                                    images={project.userFlows.images}
                                    captionContext="User flow evidence"
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* ── Information Architecture ── */}
            {project.informationArchitecture &&
                (() => {
                    const s = nextSection();
                    return (
                        <IndexedSection
                            caseIndex={ci}
                            sectionIndex={s}
                            name="IA"
                            title={project.informationArchitecture.title}
                            description={sectionIntro("ia", project.informationArchitecture.description)}
                            images={project.informationArchitecture.images}
                            mediaDemo={project.informationArchitecture.mediaDemo}
                            verdict={project.informationArchitecture.verdict}
                            captionContext="Information architecture"
                            imageStartIndex={imageNum}
                            onImageCount={(n) => {
                                imageNum += n;
                            }}
                        />
                    );
                })()}

            {/* Lo-Fi Exploration */}
            {project.lofi &&
                (() => {
                    const s = nextSection();
                    return (
                        <IndexedSection
                            caseIndex={ci}
                            sectionIndex={s}
                            name="Lo-Fi Exploration"
                            title={project.lofi.title}
                            description={sectionIntro("lofi", project.lofi.description)}
                            images={project.lofi.images}
                            mediaDemo={project.lofi.mediaDemo}
                            verdict={project.lofi.verdict}
                            comparisons={comparisonsForLofi}
                            captionContext="Lo-fi exploration"
                            imageStartIndex={imageNum}
                            onImageCount={(n) => {
                                imageNum += n;
                            }}
                        />
                    );
                })()}
            {project.lofi && lofiWhy && (
                <p className="section-why-line section-why-line--after-indexed">
                    <strong>Why this choice:</strong> {lofiWhy}
                </p>
            )}

            {/* ── Style Guide ── */}
            {project.styleGuide &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section styleguide-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Style Guide"
                            />
                            <h2 className="section-title">
                                {project.styleGuide.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {sectionIntro("styleGuide", project.styleGuide.description)}
                            </p>

                            {project.styleGuide.embed && (
                                <FigmaEmbed
                                    src={project.styleGuide.embed.src}
                                    title={project.styleGuide.embed.title}
                                    type="figma-design"
                                    caption="Typography, color palette, and component library"
                                />
                            )}

                            {project.styleGuide.principles?.length > 0 && (
                                <div className="styleguide-principles">
                                    <h3 className="subsection-title">
                                        Design Principles
                                    </h3>
                                    <div className="principles-grid">
                                        {project.styleGuide.principles.map(
                                            (p, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="principle-card"
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: i * 0.1,
                                                    }}
                                                >
                                                    <h4 className="principle-name">
                                                        {p.name}
                                                    </h4>
                                                    <p className="principle-description">
                                                        {p.description}
                                                    </p>
                                                </motion.div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {project.styleGuide.typography && (
                                <div className="styleguide-typography">
                                    <h3 className="subsection-title">
                                        Typography
                                    </h3>
                                    {project.styleGuide.typography.scale
                                        ?.length > 0 && (
                                        <div className="type-scale">
                                            {project.styleGuide.typography.scale.map(
                                                (t, i) => (
                                                    <div
                                                        key={i}
                                                        className="type-scale-row"
                                                    >
                                                        <span className="type-scale-name">
                                                            {t.name}
                                                        </span>
                                                        <span className="type-scale-size">
                                                            {t.size} /{" "}
                                                            {t.weight}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {project.styleGuide.colors && (
                                <div className="styleguide-colors">
                                    <h3 className="subsection-title">
                                        Color Palette
                                    </h3>
                                    <div className="color-swatches">
                                        {Object.values(
                                            project.styleGuide.colors,
                                        ).map((color, i) => (
                                            <div
                                                key={i}
                                                className="color-swatch"
                                            >
                                                <div
                                                    className="color-swatch-preview"
                                                    style={{
                                                        backgroundColor:
                                                            color.hex,
                                                    }}
                                                />
                                                <span className="color-swatch-name">
                                                    {color.name}
                                                </span>
                                                <span className="color-swatch-hex">
                                                    {color.hex}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {project.styleGuide.components?.length > 0 && (
                                <div className="styleguide-components">
                                    <h3 className="subsection-title">
                                        Components
                                    </h3>
                                    <div className="components-list">
                                        {project.styleGuide.components.map(
                                            (comp, i) => (
                                                <div
                                                    key={i}
                                                    className="component-item"
                                                >
                                                    <h4 className="component-name">
                                                        {comp.name}
                                                    </h4>
                                                    <p className="component-desc">
                                                        {comp.description}
                                                    </p>
                                                    {comp.variants?.length >
                                                        0 && (
                                                        <div className="component-variants">
                                                            {comp.variants.map(
                                                                (v, j) => (
                                                                    <span
                                                                        key={j}
                                                                        className="variant-tag"
                                                                    >
                                                                        {v}
                                                                    </span>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {project.styleGuide.images?.length > 0 && (
                                <ImageGallery
                                    images={project.styleGuide.images}
                                    captionContext="Style system"
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* Iterations & Refinements (supports both improvements and rounds) */}
            {project.iterations &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Iterations"
                            />
                            <h2 className="section-title">
                                {project.iterations.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.1"
                            />
                            <p className="section-description">
                                {sectionIntro("iterations", project.iterations.description)}
                            </p>
                            {iterationsWhy && (
                                <p className="section-why-line">
                                    <strong>Why this choice:</strong> {iterationsWhy}
                                </p>
                            )}
                            <BrowserMockup mediaDemo={project.iterations.mediaDemo} />
                            <PrincipleVerdict verdict={project.iterations.verdict} />
                            <BeforeAfterComparisons
                                comparisons={comparisonsForIterations}
                            />

                            {/* Rounds-based iterations (from local data) */}
                            {project.iterations.rounds?.length > 0 && (
                                <div className="iteration-rounds">
                                    {project.iterations.rounds.map(
                                        (round, i) => (
                                            <motion.div
                                                key={i}
                                                className="iteration-round"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: i * 0.1,
                                                }}
                                            >
                                                <h3 className="round-title">
                                                    Round {round.round}
                                                    {round.focus && (
                                                        <span className="round-focus">
                                                            {" "}
                                                            — {round.focus}
                                                        </span>
                                                    )}
                                                </h3>
                                                {round.findings?.length > 0 && (
                                                    <div className="round-findings">
                                                        <h4 className="round-sub-label">
                                                            Findings
                                                        </h4>
                                                        <ul className="findings-list">
                                                            {round.findings.map(
                                                                (f, j) => (
                                                                    <li
                                                                        key={j}
                                                                        className="finding-item"
                                                                    >
                                                                        <span className="finding-icon">
                                                                            →
                                                                        </span>
                                                                        <span>
                                                                            {f}
                                                                        </span>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                                {round.changes?.length > 0 && (
                                                    <div className="round-changes">
                                                        <h4 className="round-sub-label">
                                                            Changes Made
                                                        </h4>
                                                        <ul className="objectives-list">
                                                            {round.changes.map(
                                                                (c, j) => (
                                                                    <li
                                                                        key={j}
                                                                        className="objective-item"
                                                                    >
                                                                        <span className="objective-icon">
                                                                            ✓
                                                                        </span>
                                                                        <span className="objective-text">
                                                                            {c}
                                                                        </span>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ),
                                    )}
                                </div>
                            )}

                            {/* Legacy improvements list */}
                            {!project.iterations.rounds &&
                                project.iterations.improvements && (
                                    <ul className="objectives-list">
                                        {project.iterations.improvements.map(
                                            (imp, i) => (
                                                <motion.li
                                                    key={i}
                                                    className="objective-item"
                                                    initial={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: i * 0.1,
                                                    }}
                                                >
                                                    <span className="objective-icon">
                                                        ✓
                                                    </span>
                                                    <span className="objective-text">
                                                        {imp}
                                                    </span>
                                                </motion.li>
                                            ),
                                        )}
                                    </ul>
                                )}

                            {project.iterations.images?.length > 0 && (
                                <ImageGallery
                                    images={project.iterations.images}
                                    captionContext="Iteration decisions"
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}
                            {!project.prototypeTabs?.length &&
                                project.iterations.prototype && (
                                <PrototypeEmbed
                                    project={project}
                                    prototype={project.iterations.prototype}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {project.prototypeTabs?.length > 0 && (
                <PrototypeTabs tabs={project.prototypeTabs} />
            )}

            {/* ── High-Fidelity Mockups ── */}
            {project.hifi &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section hifi-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Hi-Fi"
                            />
                            <h2 className="section-title">
                                {project.hifi.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {sectionIntro("hifi", project.hifi.description)}
                            </p>
                            {hifiWhy && (
                                <p className="section-why-line">
                                    <strong>Why this choice:</strong> {hifiWhy}
                                </p>
                            )}
                            <BrowserMockup mediaDemo={project.hifi.mediaDemo} />
                            <PrincipleVerdict verdict={project.hifi.verdict} />

                            {project.hifi.embed && (
                                <FigmaEmbed
                                    src={project.hifi.embed.src}
                                    title={project.hifi.embed.title}
                                    type="figma-design"
                                />
                            )}

                            {project.hifi.screens?.length > 0 && (
                                <div className="hifi-screens accordion-group">
                                    {project.hifi.screens.map((screen, i) => (
                                        <HifiAccordion
                                            key={i}
                                            screen={screen}
                                            index={i}
                                            figIndex={nextImage()}
                                            project={project}
                                            previousScreenDescription={
                                                i > 0
                                                    ? project.hifi?.screens?.[i - 1]
                                                        ?.description
                                                    : ""
                                            }
                                        />
                                    ))}
                                </div>
                            )}

                            {project.hifi.improvements?.length > 0 && (
                                <div className="hifi-improvements">
                                    <h3 className="subsection-title">
                                        Key Improvements
                                    </h3>
                                    <ul className="objectives-list">
                                        {project.hifi.improvements.map(
                                            (imp, i) => (
                                                <motion.li
                                                    key={i}
                                                    className="objective-item"
                                                    initial={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: i * 0.1,
                                                    }}
                                                >
                                                    <span className="objective-icon">
                                                        ✓
                                                    </span>
                                                    <span className="objective-text">
                                                        {imp}
                                                    </span>
                                                </motion.li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            {project.hifi.images?.length > 0 && (
                                <ImageGallery
                                    images={project.hifi.images}
                                    captionContext="Hi-fi execution"
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* Development Approach */}
            {project.development &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section development-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Development"
                            />
                            <h2 className="section-title">
                                {project.development.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {sectionIntro("development", project.development.description)}
                            </p>
                            {developmentWhy && (
                                <p className="section-why-line">
                                    <strong>Why this choice:</strong> {developmentWhy}
                                </p>
                            )}
                            <BrowserMockup mediaDemo={project.development.mediaDemo} />
                            <PrincipleVerdict verdict={project.development.verdict} />

                            {project.development.technicalDecisions?.length >
                                0 && (
                                <div className="technical-decisions">
                                    <h3 className="subsection-title">
                                        Technical Decisions
                                    </h3>
                                    <ul className="decisions-list">
                                        {project.development.technicalDecisions.map(
                                            (decision, i) => (
                                                <motion.li
                                                    key={i}
                                                    className="decision-item"
                                                    initial={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        duration: 0.4,
                                                        delay: i * 0.1,
                                                    }}
                                                >
                                                    <span className="decision-icon">
                                                        ✓
                                                    </span>
                                                    <span>{decision}</span>
                                                </motion.li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}

                            {project.development.constraints?.length > 0 && (
                                <div className="development-constraints">
                                    <h3 className="subsection-title">
                                        Constraints
                                    </h3>
                                    <ul className="constraints-list">
                                        {project.development.constraints.map(
                                            (c, i) => (
                                                <li
                                                    key={i}
                                                    className="constraint-item"
                                                >
                                                    {c}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}
                        </motion.section>
                    );
                })()}

            {/* ── Usability Testing ── */}
            {project.userTesting &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section usability-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Testing"
                            />
                            <h2 className="section-title">
                                {project.userTesting.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {sectionIntro("userTesting", project.userTesting.description)}
                            </p>

                            {/* Test report links */}
                            {project.userTesting.reportLinks && (
                                <div className="test-report-links">
                                    {project.userTesting.reportLinks.lofi && (
                                        <FigmaEmbed
                                            linkOnly
                                            caption="Lo-fi usability test report"
                                            prototypeLink={
                                                project.userTesting.reportLinks
                                                    .lofi
                                            }
                                        />
                                    )}
                                    {project.userTesting.reportLinks.hifi && (
                                        <FigmaEmbed
                                            linkOnly
                                            caption="Hi-fi usability test report"
                                            prototypeLink={
                                                project.userTesting.reportLinks
                                                    .hifi
                                            }
                                        />
                                    )}
                                </div>
                            )}

                            {/* Testing rounds */}
                            {project.userTesting.rounds?.length > 0 && (
                                <div className="testing-rounds">
                                    {project.userTesting.rounds.map(
                                        (round, i) => (
                                            <motion.div
                                                key={i}
                                                className="testing-round"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: i * 0.15,
                                                }}
                                            >
                                                <h3 className="round-title">
                                                    Round {round.round}
                                                    {round.stage && (
                                                        <span className="round-focus">
                                                            {" "}
                                                            — {round.stage}
                                                        </span>
                                                    )}
                                                </h3>
                                                <div className="round-meta">
                                                    {round.participants && (
                                                        <span>
                                                            {round.participants}{" "}
                                                            participants
                                                        </span>
                                                    )}
                                                    {round.tool && (
                                                        <span>
                                                            {round.tool}
                                                        </span>
                                                    )}
                                                    {round.taskCompletionRate && (
                                                        <span>
                                                            Completion:{" "}
                                                            {
                                                                round.taskCompletionRate
                                                            }
                                                        </span>
                                                    )}
                                                </div>

                                                {round.tasks?.length > 0 && (
                                                    <div className="round-tasks">
                                                        <h4 className="round-sub-label">
                                                            Tasks
                                                        </h4>
                                                        <ul className="objectives-list">
                                                            {round.tasks.map(
                                                                (t, j) => (
                                                                    <li
                                                                        key={j}
                                                                        className="objective-item"
                                                                    >
                                                                        <span className="objective-icon">
                                                                            →
                                                                        </span>
                                                                        <span className="objective-text">
                                                                            {t}
                                                                        </span>
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}

                                                {round.findings?.length > 0 && (
                                                    <div className="round-findings">
                                                        <h4 className="round-sub-label">
                                                            Findings
                                                        </h4>
                                                        <div className="findings-table">
                                                            {round.findings.map(
                                                                (f, j) => (
                                                                    <div
                                                                        key={j}
                                                                        className="finding-row"
                                                                    >
                                                                        <span
                                                                            className={`finding-severity finding-severity--${f.severity}`}
                                                                        >
                                                                            {
                                                                                f.severity
                                                                            }
                                                                        </span>
                                                                        <div className="finding-detail">
                                                                            <p className="finding-text">
                                                                                {
                                                                                    f.finding
                                                                                }
                                                                            </p>
                                                                            {f.change && (
                                                                                <p className="finding-change">
                                                                                    →{" "}
                                                                                    {
                                                                                        f.change
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ),
                                    )}
                                </div>
                            )}

                            {/* Metrics summary */}
                            {project.userTesting.metrics && (
                                <div className="testing-metrics">
                                    <h3 className="subsection-title">
                                        Results
                                    </h3>
                                    <div className="metrics-row">
                                        {Object.entries(
                                            project.userTesting.metrics,
                                        ).map(([key, value], i) => (
                                            <motion.div
                                                key={key}
                                                className="metric-card"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: i * 0.1,
                                                }}
                                            >
                                                <div className="metric-value">
                                                    {value}
                                                </div>
                                                <div className="metric-label">
                                                    {key.replace(
                                                        /([A-Z])/g,
                                                        " $1",
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {project.userTesting.images?.length > 0 && (
                                <ImageGallery
                                    images={project.userTesting.images}
                                    captionContext="Testing evidence"
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* ── Final Presentation ── */}
            {project.finalPresentation &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section presentation-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Presentation"
                            />
                            <h2 className="section-title">
                                {project.finalPresentation.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            {project.finalPresentation.description && (
                                <p className="section-description">
                                    {sectionIntro("finalPresentation", project.finalPresentation.description)}
                                </p>
                            )}

                            {project.finalPresentation.embed && (
                                <FigmaEmbed
                                    src={project.finalPresentation.embed.src}
                                    title={
                                        project.finalPresentation.embed.title
                                    }
                                    type="figma-slides"
                                    caption="Complete design journey from research to final solution"
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* Objectives (legacy) */}
            {!project.iterations &&
                project.objectives?.length > 0 &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Objectives"
                            />
                            <h2 className="section-title">Goals</h2>
                            <SectionTag sectionIndex={s} />
                            <ul className="objectives-list">
                                {project.objectives.map((obj, i) => (
                                    <motion.li
                                        key={i}
                                        className="objective-item"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.4,
                                            delay: i * 0.1,
                                        }}
                                    >
                                        <span className="objective-icon">
                                            ✓
                                        </span>
                                        <span className="objective-text">
                                            {obj}
                                        </span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.section>
                    );
                })()}

            {/* Solution */}
            {project.solution &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section solution-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Final Solution"
                            />
                            <h2 className="section-title">
                                {project.solution.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.1"
                            />
                            <p className="section-description">
                                {sectionIntro("solution", project.solution.description)}
                            </p>
                            {solutionWhy && (
                                <p className="section-why-line">
                                    <strong>Why this choice:</strong> {solutionWhy}
                                </p>
                            )}
                            <BrowserMockup mediaDemo={project.solution.mediaDemo} />
                            <PrincipleVerdict verdict={project.solution.verdict} />

                            {project.solution.features?.length > 0 && (
                                <div className="features-list">
                                    {project.solution.features.map(
                                        (feature, i) => (
                                            <motion.div
                                                key={feature.id || i}
                                                className={`feature-item${feature.image ? " feature-item--has-media" : ""}`}
                                                initial={{ opacity: 0, y: 16 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.45,
                                                    delay: i * 0.08,
                                                }}
                                            >
                                                {feature.image && (
                                                    <div className="feature-media-wrap">
                                                        <div className="feature-media">
                                                            <FigLabel
                                                                index={nextImage()}
                                                            />
                                                            <CaseStudyImage
                                                                src={feature.image}
                                                                alt={feature.title}
                                                            />
                                                        </div>
                                                        <p className="image-caption">
                                                            {feature.caption || feature.title}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="feature-body">
                                                    <h3 className="feature-title">
                                                        {feature.title}
                                                    </h3>
                                                    {(() => {
                                                        const featureDescription = nestedCopy(
                                                            "featureDescription",
                                                            feature.description,
                                                            { maxSentences: 1, maxChars: 168 },
                                                        );
                                                        const prevFeatureDescription =
                                                            i > 0
                                                                ? nestedCopy(
                                                                    "featureDescription",
                                                                    project.solution?.features?.[
                                                                        i - 1
                                                                    ]?.description,
                                                                    {
                                                                        maxSentences: 1,
                                                                        maxChars: 168,
                                                                    },
                                                                )
                                                                : "";
                                                        const resolvedFeatureDescription =
                                                            i > 0
                                                                ? dedupeAdjacentCopy(
                                                                    featureDescription,
                                                                    prevFeatureDescription,
                                                                )
                                                                : featureDescription;
                                                        return resolvedFeatureDescription ? (
                                                            <p className="feature-description">
                                                                {resolvedFeatureDescription}
                                                            </p>
                                                        ) : null;
                                                    })()}
                                                    {feature.why && (
                                                        <p className="feature-why">
                                                            <strong>Why:</strong>{" "}
                                                            {feature.why}
                                                        </p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ),
                                    )}
                                </div>
                            )}

                            {project.solution.images?.length > 0 && (
                                <ImageGallery
                                    images={project.solution.images}
                                    captionContext="Solution details"
                                    startIndex={imageNum}
                                    onCount={(n) => {
                                        imageNum += n;
                                    }}
                                />
                            )}

                            {project.solution.prototype && (
                                <PrototypeEmbed
                                    project={project}
                                    prototype={project.solution.prototype}
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* Final Experience/Prototype */}
            {project.finalExperience &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section final-experience-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Solution"
                            />
                            <h2 className="section-title">
                                Complete Prototype
                            </h2>
                            <SectionTag sectionIndex={s} />
                            {project.finalExperience.intro && (
                                <p className="section-description">
                                    {sectionIntro("finalExperience", project.finalExperience.intro)}
                                </p>
                            )}
                            <BrowserMockup mediaDemo={project.finalExperience.mediaDemo} />
                            <PrincipleVerdict verdict={project.finalExperience.verdict} />
                            {project.finalExperience.prototype && (
                                <PrototypeEmbed
                                    project={project}
                                    prototype={
                                        project.finalExperience.prototype
                                    }
                                />
                            )}
                        </motion.section>
                    );
                })()}

            {/* Validation & Testing */}
            {project.validation &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section validation-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Outcome"
                            />
                            <h2 className="section-title">
                                {project.validation.title}
                            </h2>
                            <SectionTag
                                sectionIndex={s}
                                version="2.0"
                            />
                            <p className="section-description">
                                {compactValidationDescription}
                            </p>
                            {validationWhy && (
                                <p className="section-why-line">
                                    <strong>Why this choice:</strong> {validationWhy}
                                </p>
                            )}
                            <BrowserMockup mediaDemo={project.validation.mediaDemo} />
                            <PrincipleVerdict verdict={project.validation.verdict} />

                            {project.validation.method && (
                                <p className="validation-method">
                                    <strong>Method:</strong>{" "}
                                    {project.validation.method}
                                    {project.validation.participantCount &&
                                        ` • ${project.validation.participantCount} participants`}
                                </p>
                            )}

                            {normalizedValidationOutcomes.length > 0 && (
                                <div className="validation-outcomes">
                                    <h3 className="subsection-title">
                                        Outcomes
                                    </h3>
                                    <ul className="outcomes-list">
                                        {normalizedValidationOutcomes.map(
                                            (o, i) => (
                                                <li
                                                    key={i}
                                                    className="outcome-item"
                                                >
                                                    {o}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            )}
                        </motion.section>
                    );
                })()}

            {/* What I Learned */}
            {project.learnings &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section learnings-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Learnings"
                            />
                            <h2 className="section-title">
                                {project.learnings.title}
                            </h2>
                            <SectionTag sectionIndex={s} />

                            {project.learnings.insights?.length > 0 && (
                                <div className="insights-list">
                                    {project.learnings.insights.map(
                                        (insight, i) => (
                                            <motion.div
                                                key={i}
                                                className="insight-item"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: i * 0.1,
                                                }}
                                            >
                                                <h3 className="insight-title">
                                                    {insight.title}
                                                </h3>
                                                {(() => {
                                                    const insightDescription = nestedCopy(
                                                        "insightDescription",
                                                        insight.description,
                                                        { maxSentences: 1, maxChars: 170 },
                                                    );
                                                    const prevInsightDescription =
                                                        i > 0
                                                            ? nestedCopy(
                                                                "insightDescription",
                                                                project.learnings?.insights?.[
                                                                    i - 1
                                                                ]?.description,
                                                                {
                                                                    maxSentences: 1,
                                                                    maxChars: 170,
                                                                },
                                                            )
                                                            : "";
                                                    const resolvedInsightDescription =
                                                        i > 0
                                                            ? dedupeAdjacentCopy(
                                                                insightDescription,
                                                                prevInsightDescription,
                                                            )
                                                            : insightDescription;
                                                    return resolvedInsightDescription ? (
                                                        <p className="insight-description">
                                                            {resolvedInsightDescription}
                                                        </p>
                                                    ) : null;
                                                })()}
                                            </motion.div>
                                        ),
                                    )}
                                </div>
                            )}
                        </motion.section>
                    );
                })()}

            {/* Where It Evolves */}
            {project.evolution && (
                <EvolutionSection evolution={project.evolution} />
            )}

            {/* Impact */}
            {project.outcomes &&
                (() => {
                    const s = nextSection();
                    return (
                        <motion.section
                            className="project-section outcomes-section"
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.45 }}
                        >
                            <SectionIndex
                                caseIndex={ci}
                                sectionIndex={s}
                                title="Outcome"
                            />
                            <h2 className="section-title">
                                {project.outcomes.title}
                            </h2>
                            <SectionTag sectionIndex={s} />
                            <p className="section-description">
                                {sectionIntro("outcomes", project.outcomes.description)}
                            </p>

                            {project.outcomes.metrics?.length > 0 && (
                                <div className="outcomes-metrics">
                                    {project.outcomes.metrics.map(
                                        (metric, i) => (
                                            <motion.div
                                                key={i}
                                                className="outcome-metric"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.5,
                                                    delay: i * 0.1,
                                                }}
                                            >
                                                <div className="metric-value">
                                                    {metric.value}
                                                </div>
                                                <div className="metric-label">
                                                    {metric.label}
                                                </div>
                                            </motion.div>
                                        ),
                                    )}
                                </div>
                            )}
                        </motion.section>
                    );
                })()}

            {whatChangedClose && (
                <motion.section
                    className="project-section case-close-section"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.45 }}
                >
                    <h2 className="section-title">What changed</h2>
                    <p className="section-description">{whatChangedClose}</p>
                </motion.section>
            )}

            {/* ── Simulation Mode (InkLink only) ── */}
            {project.id === "inklink" && (
                <SimulationSection
                    caseIndex={ci}
                    sectionIndex={nextSection()}
                />
            )}
        </div>
    );
};

// Reusable Image Gallery Component with FIG.XX labels
// Shows all images stacked for ≤2 images; slideshow carousel for 3+
const getImageCaption = (image, captionContext = "case study") => {
    if (image?.caption && String(image.caption).trim().length > 3) {
        return toSentenceCaseLine(image.caption, 132);
    }
    if (image?.alt && String(image.alt).trim().length > 8) {
        const alt = String(image.alt).replace(/\.$/, "");
        return toSentenceCaseLine(`${alt} (${captionContext}).`, 132);
    }
    return toSentenceCaseLine(
        `Supporting visual from ${captionContext.toLowerCase()}.`,
        132,
    );
};

const ImageGallery = ({
    images,
    captionContext,
    startIndex = 0,
    onCount,
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = Array.isArray(images) ? images.length : 0;

    useEffect(() => {
        setCurrentSlide(0);
    }, [images]);

    if (!images || images.length === 0) return null;

    // Report image count to parent for counter tracking
    if (onCount) onCount(images.length);

    // ≤2 images: render stacked (original behavior)
    if (images.length <= 2) {
        return (
            <div className="section-images">
                {images.map((img, index) => (
                    <motion.div
                        key={index}
                        className="section-image"
                        initial={{
                            opacity: 0,
                            y: 40,
                            rotate: index % 2 === 0 ? -1 : 1,
                        }}
                        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                            duration: 0.7,
                            delay: index * 0.12,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        whileHover={{
                            scale: 1.01,
                            rotate: index % 2 === 0 ? 0.5 : -0.5,
                            transition: {
                                duration: 0.4,
                                ease: [0.16, 1, 0.3, 1],
                            },
                        }}
                    >
                        <FigLabel index={startIndex + index + 1} />
                        <motion.div
                            className="section-image-overlay"
                            initial={{ opacity: 0 }}
                            whileHover={{
                                opacity: 1,
                                transition: { duration: 0.3 },
                            }}
                        />
                        <CaseStudyImage
                            src={img.src}
                            alt={img.alt}
                        />
                        <p className="image-caption">
                            {getImageCaption(img, captionContext)}
                        </p>
                    </motion.div>
                ))}
            </div>
        );
    }

    // 3+ images: clickthrough slideshow
    const prev = () =>
        setCurrentSlide((s) => (s === 0 ? images.length - 1 : s - 1));
    const next = () =>
        setCurrentSlide((s) => (s === images.length - 1 ? 0 : s + 1));
    const onCarouselKeyDown = (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            prev();
        }
        if (event.key === "ArrowRight") {
            event.preventDefault();
            next();
        }
    };
    const img = images[currentSlide];

    return (
        <motion.div
            className="image-carousel"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            onKeyDown={onCarouselKeyDown}
        >
            <div className="carousel-viewport">
                <FigLabel index={startIndex + currentSlide + 1} />
                <AnimatePresence mode="wait">
                    <CaseStudyImage
                        key={currentSlide}
                        src={img.src}
                        alt={img.alt}
                    />
                </AnimatePresence>
            </div>

            <div className="carousel-controls">
                <button
                    className="carousel-btn"
                    onClick={prev}
                    aria-label="Previous image"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                    >
                        <path
                            d="M12 4L6 10l6 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                <span className="carousel-counter">
                    {currentSlide + 1} / {totalSlides}
                </span>

                <button
                    className="carousel-btn"
                    onClick={next}
                    aria-label="Next image"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                    >
                        <path
                            d="M8 4l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            <p className="image-caption">
                {getImageCaption(img, captionContext)}
            </p>

            {/* Dot indicators */}
            <div className="carousel-dots">
                {images.map((_, i) => (
                    <button
                        key={i}
                        className={`carousel-dot ${i === currentSlide ? "active" : ""}`}
                        onClick={() => setCurrentSlide(i)}
                        aria-label={`Go to image ${i + 1}`}
                    />
                ))}
            </div>
        </motion.div>
    );
};

// Accordion item for Hi-Fi screens — click name to reveal image
const HifiAccordion = ({
    screen,
    index,
    figIndex,
    project,
    previousScreenDescription = "",
}) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        setOpen(false);
    }, [screen?.name, screen?.image]);
    const currentScreenDescription = getNestedCopy(
        project,
        "screenDescription",
        screen.description,
        { maxSentences: 1, maxChars: 168 },
    );
    const priorScreenDescription = getNestedCopy(
        project,
        "screenDescription",
        previousScreenDescription,
        { maxSentences: 1, maxChars: 168 },
    );
    const screenDescription =
        index > 0
            ? dedupeAdjacentCopy(currentScreenDescription, priorScreenDescription)
            : currentScreenDescription;

    return (
        <motion.div
            className={`accordion-item ${open ? "accordion-open" : ""}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
        >
            <button
                className="accordion-trigger"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                <span className="accordion-label">{screen.name}</span>
                <motion.span
                    className="accordion-chevron"
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                    >
                        <path
                            d="M4 6l4 4 4-4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        className="accordion-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="accordion-content">
                            {screenDescription && (
                                <p className="accordion-desc">
                                    {screenDescription}
                                </p>
                            )}
                            {screen.image && (
                                <div className="hifi-screen-image">
                                    <FigLabel index={figIndex} />
                                    <CaseStudyImage
                                        src={screen.image}
                                        alt={screen.name}
                                        loading="lazy"
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// Reusable Prototype Embed Component
const PrototypeEmbed = ({ prototype, project }) => {
    if (!prototype) return null;
    const prototypeDescription = getNestedCopy(
        project,
        "prototypeDescription",
        prototype.description,
        { maxSentences: 1, maxChars: 168 },
    );

    return (
        <motion.div
            className="prototype-embed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            {prototypeDescription && (
                <p className="prototype-description">{prototypeDescription}</p>
            )}

            {/* Figma Embed (if embed_url exists) */}
            {prototype.embed_url && (
                <div className="prototype-iframe-container">
                    <iframe
                        src={prototype.embed_url}
                        className="prototype-iframe"
                        allowFullScreen
                        title="Interactive Prototype"
                    />
                </div>
            )}

            {/* Fallback to URL link if no embed */}
            {!prototype.embed_url && prototype.url && (
                <a
                    href={prototype.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="prototype-link"
                >
                    <span>View Prototype</span>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                    >
                        <path
                            d="M6 3h7v7M13 3L3 13"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </a>
            )}
        </motion.div>
    );
};

// Reusable IndexedSection with micro-index labels and FIG.XX images
const IndexedSection = ({
    caseIndex,
    sectionIndex,
    name,
    title,
    description,
    images,
    mediaDemo,
    verdict,
    comparisons,
    captionContext,
    imageStartIndex = 0,
    onImageCount,
}) => {
    const resolvedDescription = toEditorialCopy(description, {
        fallback: CASE_SECTION_FALLBACKS.default,
        maxSentences: 2,
        maxChars: 228,
    });

    return (
        <motion.section
            className="project-section"
            initial={caseStudyMotion.sectionReveal.initial}
            whileInView={caseStudyMotion.sectionReveal.whileInView}
            viewport={caseStudyMotion.sectionReveal.viewport}
            transition={caseStudyMotion.sectionReveal.transition}
        >
            <SectionIndex
                caseIndex={caseIndex}
                sectionIndex={sectionIndex}
                title={name}
            />
            <h2 className="section-title">{title}</h2>
            <SectionTag
                sectionIndex={sectionIndex}
                version="2.0"
            />
            <p className="section-description">{resolvedDescription}</p>
            <BrowserMockup mediaDemo={mediaDemo} />
            <PrincipleVerdict verdict={verdict} />
            <BeforeAfterComparisons comparisons={comparisons} />

            {images && images.length > 0 && (
                <ImageGallery
                    images={images}
                    captionContext={captionContext || title || name}
                    startIndex={imageStartIndex}
                    onCount={onImageCount}
                />
            )}
        </motion.section>
    );
};

export default ProjectDetail;
