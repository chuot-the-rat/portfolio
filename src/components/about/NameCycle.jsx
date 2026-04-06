/**
 * NameCycle.jsx
 * Stable identity headline with a cycling bracket-suffix.
 *
 * Renders: Hi! It's LeanaLe[.com]
 * The base text is stable. Only the bracketed suffix cycles.
 *
 * To edit suffixes — update SUFFIXES below.
 * Weighted entries appear more often and linger longer automatically.
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./NameCycle.css";

// ── Edit this list to change available suffixes ──────────────────────────────
const SUFFIXES = [
    { text: ".com",     weight: 1 },
    { text: ".svg",     weight: 1 },
    { text: ".png",     weight: 1 },
    { text: ".pdf",     weight: 1 },
    { text: ".html",    weight: 1 },
    { text: ".tsx",     weight: 1 },
    { text: ".fig",     weight: 1 },
    { text: ".ux",      weight: 1 },
    { text: ".json",    weight: 1 },
];

// Dwell duration per suffix (ms on screen before switching)
const DWELL = (text) => {
    if (text === ".com")  return 2800;
    if (text === ".fig")  return 2600;
    if (text === ".ux")   return 2400;
    return 2000;
};

// Build weighted pool + shuffle once
function buildPool() {
    const pool = SUFFIXES.flatMap(({ text, weight }) => Array(weight).fill(text));
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool;
}

const POOL = buildPool();

// ── Component ────────────────────────────────────────────────────────────────
export default function NameCycle() {
    const [idx, setIdx] = useState(0);
    const suffix = POOL[idx];

    // Respect prefers-reduced-motion — pause cycling
    const reducedMotion = useRef(
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );

    useEffect(() => {
        if (reducedMotion.current) return; // stay on first suffix, no cycling
        const t = setTimeout(
            () => setIdx((i) => (i + 1) % POOL.length),
            DWELL(suffix),
        );
        return () => clearTimeout(t);
    }, [idx, suffix]);

    return (
        <span className="nc">
            {/* Visible cycling display — hidden from a11y tree */}
            <span className="nc__visual" aria-hidden="true">
                Hi! It&apos;s LeanaLe
                <span className="nc__bracket">[</span>
                <AnimatePresence mode="wait">
                    <motion.span
                        key={`${suffix}-${idx}`}
                        className="nc__suffix"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.11, ease: "easeOut" }}
                    >
                        {suffix}
                    </motion.span>
                </AnimatePresence>
                <span className="nc__bracket">]</span>
            </span>

            {/* Stable screen-reader text */}
            <span className="nc__sr">Hi! It&apos;s Leana Le.</span>
        </span>
    );
}
