import { useRef, useState } from "react";
import {
    motion,
    useScroll,
    useTransform,
    AnimatePresence,
    useMotionValueEvent,
} from "framer-motion";
import "./ClaritySubtractionScene.css";

/* ─────────────────────────────────────────────
   Phase definitions
   ───────────────────────────────────────────── */
const PHASES = [
    {
        key: "overloaded",
        label: "Overloaded",
        text: "Too many ways to start.",
    },
    {
        key: "subtraction",
        label: "Subtraction",
        text: "We removed competing actions so one choice could lead.",
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
   Pill (nav secondary action)
   ───────────────────────────────────────────── */
const Pill = ({ label, style }) => (
    <motion.div className="css-pill" style={style}>
        {label}
    </motion.div>
);

/* ─────────────────────────────────────────────
   Main Component — Pinned Scroll Scene
   ───────────────────────────────────────────── */
const ClaritySubtractionScene = ({
    principleLabel = "Clarity through subtraction",
    title = "From a feature-heavy homepage to a single clear action",
    caption,
}) => {
    const sceneRef = useRef(null);
    const [phase, setPhase] = useState(0);

    /* Progress: 0 → 1 across the full spacer height.
       "start start" = spacer top hits viewport top
       "end start"   = spacer bottom hits viewport top
       While sticky is pinned, scrolling scrubs p from 0 → 1. */
    const { scrollYProgress: p } = useScroll({
        target: sceneRef,
        offset: ["start start", "end start"],
    });

    /* Track current phase for annotation */
    useMotionValueEvent(p, "change", (v) => {
        setPhase(getPhase(v));
    });

    /* ── Scene enter / exit feel ── */
    const sceneOpacity = useTransform(p, [0, 0.08, 0.92, 1], [0, 1, 1, 0.96]);
    const sceneY = useTransform(p, [0, 0.08, 0.92, 1], [10, 0, 0, -6]);

    /* ── Phase B: Feature Collapse (p 0.20 – 0.55) ── */
    const pills = ["Browse", "Discover", "Trending", "New", "Genres", "Filters"];

    const pillTransforms = pills.map((_, i) => {
        const start = 0.2 + i * 0.025;
        const end = Math.min(start + 0.18, 0.55);
        return {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            opacity: useTransform(p, [start, end], [1, 0.12]),
            // eslint-disable-next-line react-hooks/rules-of-hooks
            scale: useTransform(p, [start, end], [1, 0.94]),
        };
    });

    /* Filters row */
    const filtersOpacity = useTransform(p, [0.24, 0.44], [1, 0]);
    const filtersY = useTransform(p, [0.24, 0.44], [0, -10]);

    /* Sidebar */
    const sidebarOpacity = useTransform(p, [0.26, 0.48], [1, 0]);
    const sidebarX = useTransform(p, [0.26, 0.48], [0, -24]);

    /* ── Phase D: Magnetic Focus (p 0.80 – 1.00) ── */
    const ctaScale = useTransform(p, [0.8, 0.9, 1.0], [1, 1.04, 1]);
    const ctaGlow = useTransform(p, [0.8, 0.93], [0, 1]);
    const contentDim = useTransform(p, [0.8, 0.95], [1, 0.65]);

    const currentPhase = PHASES[phase];
    const isCompressed = phase >= 2;

    return (
        <section ref={sceneRef} className="css-spacer">
            <div className="css-sticky">
                <motion.div
                    className="css-content"
                    style={{ opacity: sceneOpacity, y: sceneY }}
                >
                    {/* Header */}
                    <div className="css-header">
                        <span className="css-label">{principleLabel}</span>
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
                                        Get Started
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

                    {/* Optional caption */}
                    {caption && <p className="css-caption">{caption}</p>}
                </motion.div>
            </div>
        </section>
    );
};

export default ClaritySubtractionScene;
