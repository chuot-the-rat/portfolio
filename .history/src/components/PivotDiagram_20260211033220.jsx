import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import "./PivotDiagram.css";

/* No bounce, no elastic, no spring overshoot. */
const SETTLE = [0.22, 1, 0.36, 1];

/* ─────────────────────────────────────────────
   BeforeFrame — chaotic wireframe SVG
   Slightly blurry, slightly desaturated, smaller.
   ───────────────────────────────────────────── */
const BeforeFrame = () => (
    <svg className="pvt-thumb-svg" viewBox="0 0 320 200" fill="none">
        <rect width="320" height="200" rx="6" className="pvt-thumb-bg" />
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
   AfterFrame — clean, structured wireframe SVG
   Crisp, slightly larger, accent-highlighted CTA.
   ───────────────────────────────────────────── */
const AfterFrame = () => (
    <svg className="pvt-thumb-svg" viewBox="0 0 320 200" fill="none">
        <rect width="320" height="200" rx="6" className="pvt-thumb-bg" />
        <rect x="24" y="20" width="130" height="10" rx="3" opacity="0.14" fill="#888" />
        <rect x="24" y="38" width="200" height="5" rx="1.5" opacity="0.07" fill="#888" />
        <rect x="24" y="50" width="170" height="5" rx="1.5" opacity="0.06" fill="#888" />
        <rect x="24" y="68" width="272" height="70" rx="4" opacity="0.05" fill="#888" />
        <rect x="24" y="150" width="100" height="28" rx="5" opacity="0.14"
              fill="currentColor" className="pvt-cta-rect" />
        <rect x="42" y="160" width="64" height="6" rx="2" opacity="0.25" fill="#fff" />
        <rect x="136" y="156" width="60" height="8" rx="2" opacity="0.06" fill="#888" />
        <rect x="136" y="168" width="45" height="5" rx="1.5" opacity="0.04" fill="#888" />
    </svg>
);

/* ─────────────────────────────────────────────
   PivotCard — Figma Layer Replacement
   FrameStack: BEFORE behind, AFTER in front.
   Single stacked composition per pivot.
   ───────────────────────────────────────────── */
const PivotCard = ({ from, to, reason, index }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.5 });
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        if (inView && !revealed) setRevealed(true);
    }, [inView, revealed]);

    /* ── BEFORE: archives itself ── */
    const beforeVariants = {
        idle: { y: 0, scale: 1, opacity: 0.9 },
        revealed: { y: 32, scale: 0.92, opacity: 0.6 },
    };

    /* ── AFTER: comes forward + micro-snap ── */
    const afterVariants = {
        idle: { y: 28, scale: 0.96, opacity: 0 },
        revealed: {
            y: 0,
            scale: [0.96, 1.015, 1],
            opacity: 1,
        },
    };

    const state = revealed ? "revealed" : "idle";

    return (
        <motion.article
            ref={ref}
            className="pvt-card"
            data-revealed={revealed || undefined}
            initial={{ opacity: 0, y: 24 }}
            animate={revealed ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: SETTLE }}
        >
            {/* ── Frame Stack — stacked thumbnails ── */}
            <div className="pvt-frame-stack">
                {/* BEFORE layer (behind) */}
                <motion.div
                    className="pvt-layer pvt-layer--before"
                    variants={beforeVariants}
                    initial="idle"
                    animate={state}
                    transition={{ duration: 0.5, ease: SETTLE }}
                >
                    <BeforeFrame />
                </motion.div>

                {/* AFTER layer (front / hero) */}
                <motion.div
                    className="pvt-layer pvt-layer--after"
                    variants={afterVariants}
                    initial="idle"
                    animate={state}
                    transition={{
                        duration: 0.6,
                        delay: 0.3,
                        ease: SETTLE,
                        scale: {
                            duration: 0.6,
                            delay: 0.3,
                            times: [0, 0.73, 1],
                            ease: SETTLE,
                        },
                    }}
                >
                    <AfterFrame />
                    {/* Selection handles — Figma corner ticks */}
                    <span className="pvt-handle pvt-handle--tl" />
                    <span className="pvt-handle pvt-handle--tr" />
                    <span className="pvt-handle pvt-handle--bl" />
                    <span className="pvt-handle pvt-handle--br" />
                </motion.div>
            </div>

            {/* ── Explanation below the stack ── */}
            <div className="pvt-explanation">
                {/* Previously label + strike */}
                <div className="pvt-prev-wrap">
                    <p className="pvt-prev-text">Previously: {from}</p>
                    <span className="pvt-strike" aria-hidden="true" />
                </div>

                {/* AFTER title — hero typography, no label */}
                <motion.h4
                    className="pvt-title"
                    initial={{ opacity: 0, y: 8 }}
                    animate={revealed ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.55, ease: SETTLE }}
                >
                    {to}
                </motion.h4>

                {/* WHY copy */}
                <motion.p
                    className="pvt-why"
                    initial={{ opacity: 0 }}
                    animate={revealed ? { opacity: 1 } : {}}
                    transition={{ duration: 0.35, delay: 0.65 }}
                >
                    {reason}
                </motion.p>
            </div>
        </motion.article>
    );
};

/* ─────────────────────────────────────────────
   PivotDiagram — card stack with atmosphere
   ───────────────────────────────────────────── */
const PivotDiagram = ({ pivots = [] }) => {
    if (!pivots.length) return null;

    return (
        <div className="pvt-stack">
            <div className="pvt-atmosphere" aria-hidden="true" />
            {pivots.map((p, i) => (
                <PivotCard key={i} index={i} {...p} />
            ))}
        </div>
    );
};

export default PivotDiagram;
