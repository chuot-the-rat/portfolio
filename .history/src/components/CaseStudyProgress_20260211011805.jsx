import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CaseStudyProgress.css";

/**
 * CaseStudyProgress — Vertical progress indicator for case study pages.
 *
 * Sits on the right side of the content on desktop. Hidden on mobile
 * (replaced with a compact horizontal bar above the content).
 *
 * Props:
 *   steps           — string[] e.g. ["Research", "Overexpansion", "Realization", "Refocus", "Build"]
 *   highlightedStep — the "key turning point" step (renders with accent ring)
 *   contentRef      — ref to the scrollable content container (.project-content)
 */
const CaseStudyProgress = ({ steps = [], highlightedStep, contentRef }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [visible, setVisible] = useState(false);
    const observerRef = useRef(null);

    useEffect(() => {
        if (!contentRef?.current || steps.length === 0) return;

        const contentEl = contentRef.current;

        // Show the progress bar only when the content area is in view
        const visibilityObserver = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { threshold: 0 },
        );
        visibilityObserver.observe(contentEl);

        // Calculate active step from scroll position through the content
        const handleScroll = () => {
            const rect = contentEl.getBoundingClientRect();
            const contentTop = contentEl.offsetTop;
            const contentHeight = contentEl.scrollHeight;
            const scrollY = window.scrollY || window.pageYOffset;
            const viewportH = window.innerHeight;

            // How far through the content are we? 0 = top, 1 = bottom
            const progress = Math.max(
                0,
                Math.min(
                    1,
                    (scrollY + viewportH * 0.35 - contentTop) / contentHeight,
                ),
            );

            const newIndex = Math.min(
                steps.length - 1,
                Math.floor(progress * steps.length),
            );

            setActiveIndex(newIndex);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // initial calculation

        return () => {
            visibilityObserver.disconnect();
            window.removeEventListener("scroll", handleScroll);
        };
    }, [contentRef, steps.length]);

    if (steps.length === 0) return null;

    return (
        <>
            {/* ─── Desktop: Vertical sidebar ─── */}
            <AnimatePresence>
                {visible && (
                    <motion.nav
                        className="csp"
                        aria-label="Case study progress"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16 }}
                        transition={{ duration: 0.35 }}
                    >
                        {/* Vertical track line */}
                        <div className="csp-track">
                            {/* Filled portion */}
                            <motion.div
                                className="csp-track-fill"
                                animate={{
                                    height: `${(activeIndex / Math.max(steps.length - 1, 1)) * 100}%`,
                                }}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            />
                        </div>

                        {/* Step markers */}
                        <div className="csp-steps">
                            {steps.map((step, i) => {
                                const isActive = i <= activeIndex;
                                const isCurrent = i === activeIndex;
                                const isHighlighted =
                                    step === highlightedStep;

                                return (
                                    <div
                                        key={i}
                                        className={[
                                            "csp-step",
                                            isActive && "csp-step--active",
                                            isCurrent && "csp-step--current",
                                            isHighlighted &&
                                                "csp-step--highlighted",
                                        ]
                                            .filter(Boolean)
                                            .join(" ")}
                                    >
                                        <span className="csp-dot" />
                                        <span className="csp-label">
                                            {step}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>

            {/* ─── Mobile: Compact horizontal bar ─── */}
            <AnimatePresence>
                {visible && (
                    <motion.div
                        className="csp-mobile"
                        aria-label="Case study progress"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="csp-mobile-track">
                            {steps.map((step, i) => (
                                <div
                                    key={i}
                                    className={[
                                        "csp-mobile-dot",
                                        i <= activeIndex &&
                                            "csp-mobile-dot--active",
                                        i === activeIndex &&
                                            "csp-mobile-dot--current",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                    title={step}
                                />
                            ))}
                        </div>
                        <span className="csp-mobile-label">
                            {steps[activeIndex]}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CaseStudyProgress;
