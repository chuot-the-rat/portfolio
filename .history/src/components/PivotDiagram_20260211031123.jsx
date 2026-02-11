import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./PivotDiagram.css";

/* ─────────────────────────────────────────────
   FramePlaceholder
   Grey SVG thumbnail mimicking a Figma frame.
   Corner label chip (BEFORE / AFTER).
   ───────────────────────────────────────────── */
const FramePlaceholder = ({ label, className = "" }) => (
    <div className={`pvt-frame ${className}`}>
        <svg
            className="pvt-frame-svg"
            viewBox="0 0 320 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                width="320"
                height="200"
                rx="6"
                fill="currentColor"
                className="pvt-frame-bg"
            />
            {/* Inner wireframe lines */}
            <rect
                x="24"
                y="24"
                width="120"
                height="10"
                rx="3"
                opacity="0.12"
                fill="#888"
            />
            <rect
                x="24"
                y="44"
                width="180"
                height="6"
                rx="2"
                opacity="0.07"
                fill="#888"
            />
            <rect
                x="24"
                y="58"
                width="160"
                height="6"
                rx="2"
                opacity="0.07"
                fill="#888"
            />
            <rect
                x="24"
                y="80"
                width="272"
                height="80"
                rx="4"
                opacity="0.06"
                fill="#888"
            />
            <rect
                x="24"
                y="172"
                width="60"
                height="8"
                rx="2"
                opacity="0.08"
                fill="#888"
            />
            <rect
                x="94"
                y="172"
                width="60"
                height="8"
                rx="2"
                opacity="0.05"
                fill="#888"
            />
        </svg>
        <span className="pvt-frame-chip">{label}</span>
    </div>
);

/* ─────────────────────────────────────────────
   PivotCard
   Before/After two-column card with:
   - Animated strike-through on "Previously" (pseudo-el)
   - Selection highlight on After thumbnail
   - Figma-style selection handles on After
   ───────────────────────────────────────────── */
const PivotCard = ({ from, to, reason, index }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const d = index * 0.07;

    return (
        <motion.article
            ref={ref}
            className={`pvt-card${inView ? " is-revealed" : ""}`}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
                duration: 0.45,
                delay: d,
                ease: [0.25, 0.1, 0.25, 1],
            }}
        >
            {/* ── BEFORE column ── */}
            <div
                className={`pvt-side pvt-side--before${inView ? " is-retired" : ""}`}
            >
                <FramePlaceholder
                    label="Before"
                    className="pvt-frame--before"
                />
                <p className="pvt-prev-text">
                    <span className="pvt-prev-inner">Previously: {from}</span>
                </p>
            </div>

            {/* ── AFTER column ── */}
            <div className="pvt-side pvt-side--after">
                <motion.div
                    className={`pvt-after-wrap${inView ? " is-selected" : ""}`}
                    initial={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
                    animate={
                        inView
                            ? { boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }
                            : {}
                    }
                    transition={{ duration: 0.4, delay: d + 0.35 }}
                >
                    <FramePlaceholder
                        label="After"
                        className="pvt-frame--after"
                    />

                    {/* Selection handles (tiny corner ticks) */}
                    <span className="pvt-handle pvt-handle--tl" />
                    <span className="pvt-handle pvt-handle--tr" />
                    <span className="pvt-handle pvt-handle--bl" />
                    <span className="pvt-handle pvt-handle--br" />
                </motion.div>

                <motion.h4
                    className="pvt-to-title"
                    initial={{ opacity: 0, y: 6 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                        duration: 0.35,
                        delay: d + 0.4,
                        ease: "easeOut",
                    }}
                >
                    {to}
                </motion.h4>

                <motion.p
                    className="pvt-why"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.3, delay: d + 0.5 }}
                >
                    {reason}
                </motion.p>
            </div>
        </motion.article>
    );
};

/* ─────────────────────────────────────────────
   PivotDiagram — vertical card stack
   ───────────────────────────────────────────── */
const PivotDiagram = ({ pivots = [] }) => {
    if (!pivots.length) return null;

    return (
        <div className="pvt-stack">
            {pivots.map((p, i) => (
                <PivotCard
                    key={i}
                    index={i}
                    {...p}
                />
            ))}
        </div>
    );
};

export default PivotDiagram;
