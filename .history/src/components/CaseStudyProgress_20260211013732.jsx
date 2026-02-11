import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CaseStudyProgress.css";

/**
 * CaseStudyTOCProgress — Notion-style Table of Contents + scroll progress.
 *
 * Reads actual .project-section elements from the content container,
 * builds a clickable TOC, tracks scroll progress, and highlights the
 * currently-visible section via IntersectionObserver.
 *
 * Rendered inside a two-column layout managed by ProjectDetail.
 *
 * Props:
 *   contentRef — ref to the .project-content element
 */
const CaseStudyTOCProgress = ({ contentRef }) => {
    const [tocItems, setTocItems] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const observerRef = useRef(null);

    /* ── Build TOC items from DOM ── */
    useEffect(() => {
        if (!contentRef?.current) return;

        // Small delay so all sections are rendered
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
                    // Strip leading "01 — " numbering
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

                items.push({ id, label });
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
                setActiveId(visible[0].target.id);
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

    /* ── Scroll progress through content ── */
    useEffect(() => {
        if (!contentRef?.current) return;

        const handleScroll = () => {
            const el = contentRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const total = el.scrollHeight;
            const scrolled = -rect.top + window.innerHeight * 0.35;
            setScrollProgress(Math.max(0, Math.min(1, scrolled / total)));
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [contentRef]);

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

                {/* Progress rail */}
                <div className="toc-rail">
                    <div
                        className="toc-rail-fill"
                        style={{ height: `${scrollProgress * 100}%` }}
                    />
                </div>

                {/* TOC entries */}
                <ul className="toc-list">
                    {tocItems.map(({ id, label }) => {
                        const isActive = id === activeId;
                        return (
                            <li
                                key={id}
                                className="toc-item"
                            >
                                <button
                                    className={`toc-link${isActive ? " toc-link--active" : ""}`}
                                    onClick={() => scrollTo(id)}
                                    type="button"
                                >
                                    <span className="toc-dot" />
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
