import { useRef, useState, useMemo } from "react";
import {
    motion,
    useScroll,
    useTransform,
    AnimatePresence,
    useMotionValueEvent,
} from "framer-motion";
import ScrollHighlightText from "./ScrollHighlightText";
import "./ClaritySubtractionScene.css";

/* ─────────────────────────────────────────────
   Default phase fallbacks
   ───────────────────────────────────────────── */
const DEFAULT_PHASES = [
    { key: "overloaded", label: "Overloaded", text: "Too many options." },
    {
        key: "subtraction",
        label: "Subtraction",
        text: "We removed what competed.",
    },
    {
        key: "compression",
        label: "Compression",
        text: "Fewer choices. Faster decisions.",
    },
    { key: "focus", label: "Focus", text: "One clear path." },
];

function getPhase(p) {
    if (p < 0.15) return 0;
    if (p < 0.4) return 1;
    if (p < 0.58) return 2;
    return 3;
}

/* ─────────────────────────────────────────────
   Pill (nav secondary action)
   ───────────────────────────────────────────── */
const Pill = ({ label, style }) => (
    <motion.div
        className="css-pill"
        style={style}
    >
        {label}
    </motion.div>
);

/* ─────────────────────────────────────────────
   Main Component — Pinned Scroll Scene (data-driven)
   ───────────────────────────────────────────── */
const ClaritySubtractionScene = ({ data }) => {
    /* ── Guard: no data = render nothing ── */
    if (!data || !data.before || !data.after) return null;

    const {
        kicker = "Clarity through subtraction",
        title = "",
        before,
        after,
        ctaLabel,
        annotation_phases,
        caption,
        highlight_caption,
    } = data;

    /* Derive pills from before.chips */
    const pills = before.chips || [];
    const ctaText = ctaLabel || after.chips?.[0] || "Get Started";

    /* Build phases from annotation_phases or fall back */
    const phases = useMemo(() => {
        if (!annotation_phases) return DEFAULT_PHASES;
        return ["p0", "p1", "p2", "p3"].map((key, i) => {
            const src = annotation_phases[key];
            return src
                ? {
                      key: DEFAULT_PHASES[i].key,
                      label: src.label,
                      text: src.text,
                  }
                : DEFAULT_PHASES[i];
        });
    }, [annotation_phases]);

    return (
        <ClaritySubtractionSceneInner
            kicker={kicker}
            title={title}
            pills={pills}
            ctaText={ctaText}
            phases={phases}
            caption={caption}
            highlightCaption={highlight_caption}
        />
    );
};

/* ─────────────────────────────────────────────
   Inner component (hooks must not be behind conditional)
   ───────────────────────────────────────────── */
const ClaritySubtractionSceneInner = ({
    kicker,
    title,
    pills,
    ctaText,
    phases,
    caption,
    highlightCaption,
}) => {
    const sceneRef = useRef(null);
    const [phase, setPhase] = useState(0);

    const { scrollYProgress: p } = useScroll({
        target: sceneRef,
        offset: ["start start", "end start"],
    });

    useMotionValueEvent(p, "change", (v) => {
        setPhase(getPhase(v));
    });

    /* ── Scene enter / exit feel ── */
    const sceneOpacity = useTransform(p, [0, 0.06, 0.96, 1], [0, 1, 1, 0.96]);
    const sceneY = useTransform(p, [0, 0.06, 0.96, 1], [10, 0, 0, -6]);

    /* ── Phase B: Feature Collapse ── */
    const pillTransforms = pills.map((_, i) => {
        const start = 0.15 + i * (0.2 / Math.max(pills.length, 1));
        const end = Math.min(start + 0.14, 0.4);
        return {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            opacity: useTransform(p, [start, end], [1, 0.12]),
            // eslint-disable-next-line react-hooks/rules-of-hooks
            scale: useTransform(p, [start, end], [1, 0.94]),
        };
    });

    /* Filters row */
    const filtersOpacity = useTransform(p, [0.18, 0.35], [1, 0]);
    const filtersY = useTransform(p, [0.18, 0.35], [0, -10]);

    /* Sidebar */
    const sidebarOpacity = useTransform(p, [0.2, 0.38], [1, 0]);
    const sidebarX = useTransform(p, [0.2, 0.38], [0, -24]);

    /* ── Phase D: Magnetic Focus ── */
    const ctaScale = useTransform(p, [0.58, 0.68, 0.75], [1, 1.04, 1]);
    const ctaGlow = useTransform(p, [0.58, 0.72], [0, 1]);
    const contentDim = useTransform(p, [0.58, 0.72], [1, 0.65]);

    const currentPhase = phases[phase];
    const isCompressed = phase >= 2;

    return (
        <section
            ref={sceneRef}
            className="css-spacer"
        >
            <div className="css-sticky">
                <motion.div
                    className="css-content"
                    style={{ opacity: sceneOpacity, y: sceneY }}
                >
                    {/* Header */}
                    <div className="css-header">
                        <span className="css-label">{kicker}</span>
                        <h3 className="css-heading">{title}</h3>
                    </div>

                    {/* ── Animated Canvas ── */}
                    <div
                        className={`css-canvas ${isCompressed ? "css-canvas--compressed" : ""}`}
                    >
                        {/* Nav bar */}
                        <div className="css-nav">
                            <div className="css-nav-logo" />
                            <div className="css-nav-pills">
                                {pills.map((label, i) => (
                                    <Pill
                                        key={label}
                                        label={label}
                                        style={{
                                            opacity: pillTransforms[i].opacity,
                                            scale: pillTransforms[i].scale,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Body area */}
                        <div className="css-body">
                            {/* Sidebar */}
                            <motion.div
                                className="css-sidebar"
                                style={{
                                    opacity: sidebarOpacity,
                                    x: sidebarX,
                                }}
                            >
                                <div className="css-sidebar-block css-sidebar-block--tall" />
                                <div className="css-sidebar-block css-sidebar-block--short" />
                                <div className="css-sidebar-block css-sidebar-block--short" />
                            </motion.div>

                            {/* Main content */}
                            <motion.div
                                className="css-main"
                                style={{ opacity: contentDim }}
                            >
                                {/* Filters row */}
                                <motion.div
                                    className="css-filters"
                                    style={{
                                        opacity: filtersOpacity,
                                        y: filtersY,
                                    }}
                                >
                                    <div className="css-filter-chip" />
                                    <div className="css-filter-chip" />
                                    <div className="css-filter-chip" />
                                    <div className="css-filter-chip css-filter-chip--wide" />
                                </motion.div>

                                {/* Content blocks */}
                                <div className="css-content-row">
                                    <div className="css-content-block css-content-block--lg" />
                                    <div className="css-content-block css-content-block--sm" />
                                </div>
                                <div className="css-content-row">
                                    <div className="css-content-block css-content-block--sm" />
                                    <div className="css-content-block css-content-block--lg" />
                                </div>

                                {/* Primary CTA */}
                                <motion.div
                                    className="css-cta"
                                    style={{
                                        scale: ctaScale,
                                        "--glow": ctaGlow,
                                    }}
                                >
                                    <span className="css-cta-label">
                                        {ctaText}
                                    </span>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>

                    {/* ── Annotation ── */}
                    <div className="css-annotation">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPhase.key}
                                className="css-annotation-inner"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{
                                    duration: 0.22,
                                    ease: "easeOut",
                                }}
                            >
                                <span className="css-phase-badge">
                                    {currentPhase.label}
                                </span>
                                <p className="css-phase-text">
                                    {currentPhase.text}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Optional caption — with scroll highlight if available */}
                    {highlightCaption ? (
                        <ScrollHighlightText
                            mode="stepped"
                            accent="auto"
                            className="css-caption"
                            offset={["start 0.6", "end 0.2"]}
                        >
                            {highlightCaption}
                        </ScrollHighlightText>
                    ) : (
                        caption && <p className="css-caption">{caption}</p>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default ClaritySubtractionScene;
