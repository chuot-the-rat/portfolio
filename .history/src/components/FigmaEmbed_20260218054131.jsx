import { useState, useRef, useEffect } from "react";
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
    const wrapperRef = useRef(null);

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
            {/* ── Viewport (hidden in linkOnly mode) ── */}
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
            </div>
            )}

            {/* Caption + optional prototype link */}
            {(caption || prototypeLink) && (
                <div className="fe-footer">
                    {caption && <p className="fe-caption">{caption}</p>}
                    {prototypeLink && (
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
                    )}
                </div>
            )}
        </motion.div>
    );
};

export default FigmaEmbed;
