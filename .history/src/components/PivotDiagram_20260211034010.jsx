import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./PivotDiagram.css";

/* ─────────────────────────────────────────────
   BeforeFrame — chaotic wireframe SVG
   ───────────────────────────────────────────── */
const BeforeFrame = () => (
    <svg className="pvt-svg" viewBox="0 0 320 200" fill="none">
        <rect width="320" height="200" rx="6" className="pvt-svg-bg" />
        <rect x="16" y="14" width="90" height="9" rx="2" opacity="0.13" fill="#888" />
        <rect x="120" y="12" width="55" height="9" rx="2" opacity="0.09" fill="#888" />
        <rect x="16" y="32" width="140" height="5" rx="1.5" opacity="0.07" fill="#888" />
        <rect x="170" y="30" width="60" height="5" rx="1.5" opacity="0.06" fill="#888" />
        <rect x="16" y="48" width="180" height="60" rx="3" opacity="0.055" fill="#888" />
        <rect x="210" y="48" width="94" height="28" rx="3" opacity="0.06" fill="#888" />
        <rect x="210" y="84" width="94" height="24" rx="3" opacity="0.045" fill="#888" />
        <rect x="40" y="120" width="65" height="22" rx="3" opacity="0.07" fill="#888" />
        <rect x="16" y="120" width="18" height="22" rx="2" opacity="0.05" fill="#888" />
        <rect x="115" y="125" width="110" height="6" rx="1.5" opacity="0.05" fill="#888" />
        <rect x="115" y="136" width="80" height="6" rx="1.5" opacity="0.04" fill="#888" />
        <rect x="16" y="155" width="50" height="7" rx="2" opacity="0.08" fill="#888" />
        <rect x="75" y="155" width="50" height="7" rx="2" opacity="0.05" fill="#888" />
        <rect x="16" y="172" width="288" height="14" rx="3" opacity="0.04" fill="#888" />
    </svg>
);

/* ─────────────────────────────────────────────
   AfterFrame — clean wireframe SVG with accent CTA
   ───────────────────────────────────────────── */
const AfterFrame = () => (
    <svg className="pvt-svg" viewBox="0 0 320 200" fill="none">
        <rect width="320" height="200" rx="6" className="pvt-svg-bg" />
        <rect x="24" y="20" width="130" height="10" rx="3" opacity="0.14" fill="#888" />
        <rect x="24" y="38" width="200" height="5" rx="1.5" opacity="0.07" fill="#888" />
        <rect x="24" y="50" width="170" height="5" rx="1.5" opacity="0.06" fill="#888" />
        <rect x="24" y="68" width="272" height="70" rx="4" opacity="0.05" fill="#888" />
        <rect x="24" y="150" width="100" height="28" rx="5" opacity="0.14"
              fill="currentColor" className="pvt-cta" />
        <rect x="42" y="160" width="64" height="6" rx="2" opacity="0.25" fill="#fff" />
        <rect x="136" y="156" width="60" height="8" rx="2" opacity="0.06" fill="#888" />
        <rect x="136" y="168" width="45" height="5" rx="1.5" opacity="0.04" fill="#888" />
    </svg>
);

/* ─────────────────────────────────────────────
   Frame layer transition config
   ───────────────────────────────────────────── */
const layerVariants = {
    active: { opacity: 1, scale: 1 },
    inactive: { opacity: 0, scale: 0.98 },
};

const layerTransition = {
    opacity: { duration: 0.35, ease: "easeInOut" },
    scale: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};

/* ─────────────────────────────────────────────
   PivotCard — Click to toggle Before / After
   ───────────────────────────────────────────── */
const PivotCard = ({ from, to, reason }) => {
    const [isAfter, setIsAfter] = useState(true);

    return (
        <article className="pvt-card">
            {/* ── Clickable frame viewport ── */}
            <button
                className="pvt-viewport"
                onClick={() => setIsAfter((v) => !v)}
                aria-label={isAfter ? "Show earlier concept" : "Show final direction"}
                data-after={isAfter || undefined}
                type="button"
            >
                {/* BEFORE layer */}
                <motion.div
                    className="pvt-layer pvt-layer--before"
                    variants={layerVariants}
                    animate={isAfter ? "inactive" : "active"}
                    transition={layerTransition}
                >
                    <BeforeFrame />
                </motion.div>

                {/* AFTER layer */}
                <motion.div
                    className="pvt-layer pvt-layer--after"
                    variants={layerVariants}
                    animate={isAfter ? "active" : "inactive"}
                    transition={layerTransition}
                >
                    <AfterFrame />
                </motion.div>

                {/* Toggle indicator — top-right */}
                <span className="pvt-indicator">
                    {isAfter ? "Final Direction" : "Earlier Concept"}
                </span>
            </button>

            {/* ── Text block — swaps with active state ── */}
            <div className="pvt-text">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isAfter ? "after" : "before"}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <h4 className="pvt-title">{isAfter ? to : from}</h4>
                        {reason && <p className="pvt-desc">{reason}</p>}
                    </motion.div>
                </AnimatePresence>
            </div>
        </article>
    );
};

/* ─────────────────────────────────────────────
   PivotDiagram — vertical stack
   ───────────────────────────────────────────── */
const PivotDiagram = ({ pivots = [] }) => {
    if (!pivots.length) return null;

    return (
        <div className="pvt-stack">
            {pivots.map((p, i) => (
                <PivotCard key={i} {...p} />
            ))}
        </div>
    );
};

export default PivotDiagram;
