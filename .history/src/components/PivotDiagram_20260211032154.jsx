import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import "./PivotDiagram.css";

const SETTLE = [0.22, 1, 0.36, 1];

/* ─────────────────────────────────────────────
   BeforeFrame — chaotic wireframe SVG
   ───────────────────────────────────────────── */
const BeforeFrame = () => (
    <div className="pvt-frame pvt-frame--before">
        <svg className="pvt-frame-svg" viewBox="0 0 320 200" fill="none">
            <rect width="320" height="200" rx="6" className="pvt-frame-bg" />
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
        <span className="pvt-frame-chip">Before</span>
    </div>
);

/* ─────────────────────────────────────────────
   AfterFrame — clean, structured wireframe SVG
   ───────────────────────────────────────────── */
const AfterFrame = () => (
    <div className="pvt-frame pvt-frame--after">
        <svg className="pvt-frame-svg" viewBox="0 0 320 200" fill="none">
            <rect width="320" height="200" rx="6" className="pvt-frame-bg" />
            <rect x="24" y="20" width="130" height="10" rx="3" opacity="0.14" fill="#888" />
            <rect x="24" y="38" width="200" height="5" rx="1.5" opacity="0.07" fill="#888" />
            <rect x="24" y="50" width="170" height="5" rx="1.5" opacity="0.06" fill="#888" />
            <rect x="24" y="68" width="272" height="70" rx="4" opacity="0.05" fill="#888" />
            <rect x="24" y="150" width="100" height="28" rx="5" opacity="0.14" fill="currentColor" className="pvt-frame-cta" />
            <rect x="42" y="160" width="64" height="6" rx="2" opacity="0.25" fill="#fff" />
            <rect x="136" y="156" width="60" height="8" rx="2" opacity="0.06" fill="#888" />
            <rect x="136" y="168" width="45" height="5" rx="1.5" opacity="0.04" fill="#888" />
        </svg>
        <span className="pvt-frame-chip">After</span>
    </div>
);

/* ─────────────────────────────────────────────
   PivotCard
   ───────────────────────────────────────────── */
const PivotCard = ({ from, to, reason, index, onReveal }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const [revealed, setRevealed] = useState(false);
    const d = index * 0.07;

    /* Single boolean state drives ALL effects — no fragile CSS selectors */
    useEffect(() => {
        if (inView && !revealed) {
            setRevealed(true);
            onReveal?.(index);
        }
    }, [inView, revealed, index, onReveal]);

    return (
        <motion.article
            ref={ref}
            className="pvt-card"
            data-revealed={revealed || undefined}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={revealed ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: d, ease: SETTLE }}
        >
            {/* Spotlight — only on the active (most recently revealed) card */}
            <div className="pvt-spotlight" aria-hidden="true" />

            {/* ── BEFORE column ── */}
            <div className="pvt-side pvt-side--before">
                <motion.div
                    initial={{ y: 10 }}
                    animate={revealed ? { y: 0 } : {}}
                    transition={{ duration: 0.55, delay: d + 0.06, ease: SETTLE }}
                >
                    <BeforeFrame />
                </motion.div>
                {/*
                    Strike-through: uses an overlay <span> positioned over the
                    text container. This works reliably regardless of text wrap.
                    Driven by data-revealed on the card ancestor.
                */}
                <div className="pvt-prev-wrap">
                    <p className="pvt-prev-text">Previously: {from}</p>
                    <span className="pvt-strike" aria-hidden="true" />
                </div>
            </div>

            {/* ── AFTER column ── */}
            <div className="pvt-side pvt-side--after">
                <div className="pvt-depth-layer" />

                <motion.div
                    className="pvt-after-wrap"
                    initial={{ y: 22 }}
                    animate={revealed ? { y: 0 } : {}}
                    transition={{ duration: 0.6, delay: d + 0.04, ease: SETTLE }}
                >
                    {/* Mask-reveal wrapper for After thumbnail */}
                    <div className="pvt-mask-reveal">
                        <AfterFrame />
                    </div>

                    <span className="pvt-handle pvt-handle--tl" />
                    <span className="pvt-handle pvt-handle--tr" />
                    <span className="pvt-handle pvt-handle--bl" />
                    <span className="pvt-handle pvt-handle--br" />
                </motion.div>

                <motion.h4
                    className="pvt-to-title"
                    initial={{ opacity: 0, y: 6 }}
                    animate={revealed ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.38, delay: d + 0.42, ease: "easeOut" }}
                >
                    {to}
                </motion.h4>

                <motion.p
                    className="pvt-why"
                    initial={{ opacity: 0 }}
                    animate={revealed ? { opacity: 1 } : {}}
                    transition={{ duration: 0.3, delay: d + 0.52 }}
                >
                    {reason}
                </motion.p>
            </div>
        </motion.article>
    );
};

/* ─────────────────────────────────────────────
   PivotDiagram — stack with active-card spotlight
   ───────────────────────────────────────────── */
const PivotDiagram = ({ pivots = [] }) => {
    const [activeIndex, setActiveIndex] = useState(-1);

    const handleReveal = useCallback((idx) => {
        setActiveIndex(idx);
    }, []);

    if (!pivots.length) return null;

    return (
        <div className="pvt-stack" data-active-card={activeIndex}>
            <div className="pvt-atmosphere" aria-hidden="true" />
            {pivots.map((p, i) => (
                <PivotCard
                    key={i}
                    index={i}
                    onReveal={handleReveal}
                    {...p}
                />
            ))}
        </div>
    );
};

export default PivotDiagram;
