import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./FigmaEmbed.css";

/* ─────────────────────────────────────────────
   FigmaEmbed — Responsive iframe with loading state
   Supports: figma-design, figma-slides, figma-proto
   ───────────────────────────────────────────── */

const ASPECT_RATIOS = {
    "figma-slides": "16 / 9",
    "figma-design": "16 / 10",
    "figma-proto": "9 / 16",
    default: "16 / 10",
};

const FigmaEmbed = ({
    src,
    title = "Figma embed",
    type = "figma-design",
    caption,
    prototypeLink,
    linkOnly = false,
}) => {
    const [loaded, setLoaded] = useState(false);
    const [inView, setInView] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const wrapperRef = useRef(null);

    /* ── Close modal on Escape ── */
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Escape" && expanded) setExpanded(false);
        },
        [expanded],
    );

    useEffect(() => {
        if (expanded) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [expanded, handleKeyDown]);

    /* ── Lazy-load: only mount iframe when near viewport ── */
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "200px" },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const aspectRatio = ASPECT_RATIOS[type] || ASPECT_RATIOS.default;
    const isPrototype = type === "figma-proto";

    return (
        <motion.div
            className="fe-wrapper"
            ref={wrapperRef}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* ── Prototype link — above viewport ── */}
            {prototypeLink && (
                <div className="fe-header">
                    <a
                        href={prototypeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fe-proto-link"
                    >
                        <span className="fe-proto-link-text">
                            View prototype
                        </span>
                        <svg
                            className="fe-proto-link-icon"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                        >
                            <path
                                d="M5.25 2.625H3.5a.875.875 0 0 0-.875.875V10.5a.875.875 0 0 0 .875.875H10.5a.875.875 0 0 0 .875-.875V8.75"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M8.75 2.625h2.625V5.25M7.875 6.125l3.5-3.5"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </a>
                </div>
            )}

            {/* ── Viewport: iframe + skeleton (skipped in linkOnly mode) ── */}
            {!linkOnly && (
                <div
                    className={`fe-viewport ${isPrototype ? "fe-viewport--proto" : ""}`}
                    style={{ aspectRatio }}
                >
                    {/* Loading skeleton */}
                    <AnimatePresence>
                        {!loaded && (
                            <motion.div
                                className="fe-skeleton"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="fe-skeleton-pulse" />
                                <span className="fe-skeleton-label">
                                    Loading Figma…
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Iframe — only mounts when near viewport */}
                    {inView && (
                        <iframe
                            className={`fe-iframe ${loaded ? "fe-iframe--ready" : ""}`}
                            src={src}
                            title={title}
                            allowFullScreen
                            loading="lazy"
                            onLoad={() => setLoaded(true)}
                        />
                    )}

                    {/* Expand button — appears on hover */}
                    {loaded && (
                        <button
                            className="fe-expand-btn"
                            onClick={() => setExpanded(true)}
                            aria-label="Expand to full screen"
                            title="Expand"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10 2h4v4M6 14H2v-4M14 2l-5 5M2 14l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    )}
                </div>
            )}

            {/* ── Caption — below viewport ── */}
            {caption && (
                <div className="fe-footer">
                    <p className="fe-caption">{caption}</p>
                </div>
            )}

            {/* ── Expanded modal ── */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        className="fe-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setExpanded(false)}
                    >
                        <motion.div
                            className="fe-modal-inner"
                            initial={{ scale: 0.96, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.96, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="fe-modal-toolbar">
                                <span className="fe-modal-title">{title}</span>
                                <button
                                    className="fe-modal-close"
                                    onClick={() => setExpanded(false)}
                                    aria-label="Close"
                                >
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            </div>
                            <div className="fe-modal-frame">
                                <iframe
                                    src={src}
                                    title={title}
                                    allowFullScreen
                                    className="fe-modal-iframe"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FigmaEmbed;
