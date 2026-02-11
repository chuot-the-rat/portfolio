import { useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    AnimatePresence,
    useMotionValueEvent,
} from "framer-motion";
import { useState } from "react";
import "./ClaritySubtractionDemo.css";

const EASE = [0.22, 1, 0.36, 1];

/* ─────────────────────────────────────────────
   Phase labels + annotation copy
   ───────────────────────────────────────────── */
const PHASES = [
    {
        key: "overloaded",
        label: "Overloaded",
        text: "The homepage had too many ways to start.",
    },
    {
        key: "subtraction",
        label: "Subtraction",
        text: "We removed competing actions so one choice could stand out.",
    },
    {
        key: "compression",
        label: "Compression",
        text: "Layout collapsed into a single path—less scanning, more momentum.",
    },
    {
        key: "focus",
        label: "Focus",
        text: "One clear call-to-action reduced hesitation.",
    },
];

function getPhase(p) {
    if (p < 0.2) return 0;
    if (p < 0.55) return 1;
    if (p < 0.8) return 2;
    return 3;
}

/* ─────────────────────────────────────────────
   Pill CTA (secondary action)
   ───────────────────────────────────────────── */
const Pill = ({ label, style }) => (
    <motion.div
        className="cs-pill"
        style={style}
    >
        {label}
    </motion.div>
);

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */
const ClaritySubtractionDemo = ({
    principleLabel = "Clarity through subtraction",
    title = "From a feature-heavy homepage to a single clear action",
    caption,
}) => {
    const sectionRef = useRef(null);
    const [phase, setPhase] = useState(0);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start 0.8", "end 0.2"],
    });

    /* Track phase for annotation */
    useMotionValueEvent(scrollYProgress, "change", (p) => {
        setPhase(getPhase(p));
    });

    /* ── Phase B: Feature Collapse (p 0.20–0.55) ── */
    const pills = [
        "Browse",
        "Discover",
        "Trending",
        "New",
        "Genres",
        "Filters",
    ];

    const pillTransforms = pills.map((_, i) => {
        const start = 0.2 + i * 0.02;
        const end = Math.min(start + 0.2, 0.55);
        return {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            opacity: useTransform(scrollYProgress, [start, end], [1, 0.15]),
            // eslint-disable-next-line react-hooks/rules-of-hooks
            scale: useTransform(scrollYProgress, [start, end], [1, 0.96]),
        };
    });

    /* Filters row */
    const filtersOpacity = useTransform(scrollYProgress, [0.25, 0.45], [1, 0]);
    const filtersY = useTransform(scrollYProgress, [0.25, 0.45], [0, -10]);

    /* Sidebar */
    const sidebarOpacity = useTransform(scrollYProgress, [0.28, 0.5], [1, 0]);
    const sidebarX = useTransform(scrollYProgress, [0.28, 0.5], [0, -24]);

    /* ── Phase C: Compression (p 0.55–0.80) ── */
    /* Layout switch driven by phase state (class toggle) */

    /* ── Phase D: Magnetic Focus (p 0.80–1.00) ── */
    const ctaScale = useTransform(
        scrollYProgress,
        [0.8, 0.9, 1.0],
        [1, 1.03, 1],
    );
    const ctaGlow = useTransform(scrollYProgress, [0.8, 0.92], [0, 1]);
    const contentDim = useTransform(scrollYProgress, [0.8, 0.95], [1, 0.7]);

    const currentPhase = PHASES[phase];
    const isCompressed = phase >= 2;

    return (
        <section
            ref={sectionRef}
            className="cs-section"
        >
            {/* Section header */}
            <div className="cs-header">
                <span className="cs-label">{principleLabel}</span>
                <h3 className="cs-heading">{title}</h3>
            </div>

            {/* ── Animated Canvas ── */}
            <div
                className={`cs-canvas ${isCompressed ? "cs-canvas--compressed" : ""}`}
            >
                {/* Nav bar */}
                <div className="cs-nav">
                    <div className="cs-nav-logo" />
                    <div className="cs-nav-pills">
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
                <div className="cs-body">
                    {/* Sidebar */}
                    <motion.div
                        className="cs-sidebar"
                        style={{
                            opacity: sidebarOpacity,
                            x: sidebarX,
                        }}
                    >
                        <div className="cs-sidebar-block cs-sidebar-block--tall" />
                        <div className="cs-sidebar-block cs-sidebar-block--short" />
                        <div className="cs-sidebar-block cs-sidebar-block--short" />
                    </motion.div>

                    {/* Main content */}
                    <motion.div
                        className="cs-main"
                        style={{ opacity: contentDim }}
                    >
                        {/* Filters row */}
                        <motion.div
                            className="cs-filters"
                            style={{
                                opacity: filtersOpacity,
                                y: filtersY,
                            }}
                        >
                            <div className="cs-filter-chip" />
                            <div className="cs-filter-chip" />
                            <div className="cs-filter-chip" />
                            <div className="cs-filter-chip cs-filter-chip--wide" />
                        </motion.div>

                        {/* Content blocks */}
                        <div className="cs-content-row">
                            <div className="cs-content-block cs-content-block--lg" />
                            <div className="cs-content-block cs-content-block--sm" />
                        </div>
                        <div className="cs-content-row">
                            <div className="cs-content-block cs-content-block--sm" />
                            <div className="cs-content-block cs-content-block--lg" />
                        </div>

                        {/* Primary CTA */}
                        <motion.div
                            className="cs-cta"
                            style={{
                                scale: ctaScale,
                                "--glow": ctaGlow,
                            }}
                        >
                            <span className="cs-cta-label">Get Started</span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* ── Annotation ── */}
            <div className="cs-annotation">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPhase.key}
                        className="cs-annotation-inner"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <span className="cs-phase-label">
                            {currentPhase.label}
                        </span>
                        <p className="cs-phase-text">{currentPhase.text}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Optional caption */}
            {caption && <p className="cs-caption">{caption}</p>}
        </section>
    );
};

export default ClaritySubtractionDemo;
