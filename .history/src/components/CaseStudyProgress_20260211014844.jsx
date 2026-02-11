import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CaseStudyProgress.css";

/* ─────────────────────────────────────────────────────────────────────
   Section-type detection — maps classnames / labels to glyph types.
   Used for CSS-only abstract glyph icons in the TOC.
   ───────────────────────────────────────────────────────────────────── */
const SECTION_TYPE_MAP = [
    { match: /research/i, type: "research" },
    { match: /challenges|pivot/i, type: "pivot" },
    { match: /lo.?fi|wireframe|iteration|hi.?fi|development|solution/i, type: "build" },
    { match: /validation|testing|outcome|impact|final|prototype|experience/i, type: "check" },
    /* Everything else (overview, learning, next-steps, etc.) falls through to "default" */
];

function detectSectionType(className, label) {
    const haystack = `${className} ${label}`.toLowerCase();
    for (const { match, type } of SECTION_TYPE_MAP) {
        if (match.test(haystack)) return type;
    }
    return "default";
}

/**
 * CaseStudyTOCProgress — Notion-style TOC + smooth scroll progress
 * with CSS-only abstract glyph icons and micro-motion transitions.
 *
 * Props:
 *   contentRef — ref to the .project-content element
 */
const CaseStudyTOCProgress = ({ contentRef }) => {
    const [tocItems, setTocItems] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [prevActiveId, setPrevActiveId] = useState(null);
    const railRef = useRef(null);
    const rafRef = useRef(null);
    const observerRef = useRef(null);

    /* ── Build TOC items from DOM ── */
    useEffect(() => {
        if (!contentRef?.current) return;

        const timer = setTimeout(() => {
            const container = contentRef.current;
            if (!container) return;

            const sections = container.querySelectorAll(
                ".project-section, .pivot-section, .wl",
            );

            const items = [];
            sections.forEach((el, i) => {
                const labelEl = el.querySelector(
                    ".section-label, .graveyard-heading, .wl-label",
                );
                const titleEl = el.querySelector(".section-title, .wl-title");

                let label = "";
                if (labelEl) {
                    label = labelEl.textContent
                        .replace(/^\d+\s*[—–\-]\s*/, "")
                        .trim();
                }
                if (!label && titleEl) {
                    label = titleEl.textContent.trim();
                }
                if (!label) return;

                const id = el.id || `toc-s-${i}`;
                if (!el.id) el.id = id;

                const sectionType = detectSectionType(el.className, label);

                items.push({ id, label, sectionType });
            });

            setTocItems(items);
            if (items.length > 0) setActiveId(items[0].id);
        }, 250);

        return () => clearTimeout(timer);
    }, [contentRef]);

    /* ── IntersectionObserver — detect visible section ── */
    useEffect(() => {
        if (tocItems.length === 0) return;
        if (observerRef.current) observerRef.current.disconnect();

        const callback = (entries) => {
            const visible = entries
                .filter((e) => e.isIntersecting)
                .sort(
                    (a, b) =>
                        a.boundingClientRect.top - b.boundingClientRect.top,
                );
            if (visible.length > 0) {
                const newId = visible[0].target.id;
                setActiveId((prev) => {
                    if (prev !== newId) setPrevActiveId(prev);
                    return newId;
                });
            }
        };

        observerRef.current = new IntersectionObserver(callback, {
            rootMargin: "-10% 0px -55% 0px",
            threshold: 0,
        });

        tocItems.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observerRef.current.observe(el);
        });

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [tocItems]);

    /* ── Smooth scroll progress via rAF ── */
    useEffect(() => {
        if (!contentRef?.current || !railRef.current) return;

        let ticking = false;

        const update = () => {
            const el = contentRef.current;
            const fill = railRef.current;
            if (!el || !fill) return;
            const rect = el.getBoundingClientRect();
            const total = el.scrollHeight;
            const scrolled = -rect.top + window.innerHeight * 0.35;
            const progress = Math.max(0, Math.min(1, scrolled / total));
            fill.style.height = `${progress * 100}%`;
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                ticking = true;
                rafRef.current = requestAnimationFrame(update);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        update(); // initial

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [contentRef, tocItems]);

    /* ── Click handler — smooth scroll to section ── */
    const scrollTo = useCallback((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
    }, []);

    if (tocItems.length === 0) return null;

    return (
        <>
            {/* ── Desktop / Tablet: Sticky sidebar TOC ── */}
            <nav
                className="toc"
                aria-label="Table of contents"
            >
                <span className="toc-heading">Contents</span>

                {/* Progress rail — updated via rAF, no React re-renders */}
                <div className="toc-rail">
                    <div
                        className="toc-rail-fill"
                        ref={railRef}
                    />
                </div>

                {/* TOC entries */}
                <ul className="toc-list">
                    {tocItems.map(({ id, label, sectionType }) => {
                        const isActive = id === activeId;
                        const wasActive = id === prevActiveId;
                        return (
                            <li
                                key={id}
                                className="toc-item"
                            >
                                <button
                                    className={[
                                        "toc-link",
                                        isActive && "toc-link--active",
                                        wasActive && "toc-link--leaving",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                    onClick={() => scrollTo(id)}
                                    type="button"
                                >
                                    <span
                                        className="toc-glyph"
                                        data-type={sectionType}
                                    />
                                    <span className="toc-text">{label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* ── Mobile: Sticky current-section bar ── */}
            <AnimatePresence>
                {activeId && (
                    <motion.div
                        className="toc-mobile"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="toc-mobile-dots">
                            {tocItems.map(({ id }) => (
                                <span
                                    key={id}
                                    className={`toc-mobile-dot${id === activeId ? " toc-mobile-dot--active" : ""}`}
                                />
                            ))}
                        </div>
                        <span className="toc-mobile-label">
                            {tocItems.find((t) => t.id === activeId)?.label}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CaseStudyTOCProgress;
