import { useRef, useEffect, useState, useCallback } from "react";
import "./MicroIndex.css";

/* ─────────────────────────────────────────────
   Pad a number to 2 digits: 1 → "01", 12 → "12"
   ───────────────────────────────────────────── */
const pad2 = (n) => String(n).padStart(2, "0");

/* ─────────────────────────────────────────────
   Pad a number to 3 digits: 1 → "007", 42 → "042"
   ───────────────────────────────────────────── */
const pad3 = (n) => String(n).padStart(3, "0");

/* ═════════════════════════════════════════════
   1. SectionIndex
   Renders:  02.03  PIVOT
   Props:
     caseIndex    — 1-based case study index
     sectionIndex — 1-based section index within the case study
     title        — section name (uppercased automatically)
   ═════════════════════════════════════════════ */
export const SectionIndex = ({ caseIndex = 1, sectionIndex = 1, title = "" }) => (
    <span className="mi-mono mi-section-index">
        {pad2(caseIndex)}.{pad2(sectionIndex)}&nbsp;&nbsp;{title.toUpperCase()}
    </span>
);

/* ═════════════════════════════════════════════
   2. SectionTag
   Renders:  [ S03 ]  v2.1
   Props:
     sectionIndex — section number
     version      — optional version string (e.g. "2.1")
   ═════════════════════════════════════════════ */
export const SectionTag = ({ sectionIndex = 1, version }) => (
    <div className="mi-section-meta">
        <span className="mi-mono mi-section-tag">
            [ S{pad2(sectionIndex)} ]
        </span>
        {version && (
            <span className="mi-section-version">v{version}</span>
        )}
    </div>
);

/* ═════════════════════════════════════════════
   3. ScrollProgress
   Renders:  [ 042% ]
   Updates via rAF, scoped to the contentRef container.
   Props:
     contentRef — ref to the scrollable content container
   ═════════════════════════════════════════════ */
export const ScrollProgress = ({ contentRef }) => {
    const [pct, setPct] = useState(0);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!contentRef?.current) return;

        let ticking = false;

        const update = () => {
            const el = contentRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const total = el.scrollHeight;
            const scrolled = -rect.top + window.innerHeight * 0.35;
            const progress = Math.max(0, Math.min(100, (scrolled / total) * 100));
            setPct(Math.round(progress));
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                ticking = true;
                rafRef.current = requestAnimationFrame(update);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        update();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [contentRef]);

    return (
        <aside className="mi-scroll-progress" aria-label="Reading progress">
            <span className="mi-mono mi-progress-value">
                [ {pad3(pct)}% ]
            </span>
        </aside>
    );
};

/* ═════════════════════════════════════════════
   4. FigLabel
   Renders:  FIG.02
   Props:
     index — 1-based image number
   ═════════════════════════════════════════════ */
export const FigLabel = ({ index = 1 }) => (
    <span className="mi-mono mi-fig-label">FIG.{pad2(index)}</span>
);
