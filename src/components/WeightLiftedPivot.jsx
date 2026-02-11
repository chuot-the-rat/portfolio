import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import "./WeightLiftedPivot.css";

/* ─────────────────────────────────────────────────────────────────────
   IMAGE PLACEHOLDER — shown when screenshots haven't been added yet.
   A wireframe-style preview with the pill data inside, so the layout
   still communicates the concept even without real images.
   ───────────────────────────────────────────────────────────────────── */
const ImagePlaceholder = ({ items = [], variant = "before" }) => (
    <div className={`wl-ph wl-ph--${variant}`}>
        <div className="wl-ph-pills">
            {items.map((item, i) => (
                <span
                    key={i}
                    className="wl-ph-pill"
                >
                    {item}
                </span>
            ))}
        </div>
        <span className="wl-ph-hint">Screenshot coming soon</span>
    </div>
);

/* ─────────────────────────────────────────────────────────────────────
   MODE A — SIDE-BY-SIDE
   Two columns: muted before on left, vivid after on right.
   Captions beneath each image let readers scan without reading.
   Semplice: "If we scroll through and only read your captions,
   we should still understand the project."
   ───────────────────────────────────────────────────────────────────── */
const SideBySideView = ({
    beforeImage,
    afterImage,
    beforeItems,
    afterPrimary,
    afterSecondary,
}) => (
    <div className="wl-sbs">
        {/* Before column */}
        <motion.div
            className="wl-sbs-col"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
            <span className="wl-sbs-tag">Before</span>
            <div className="wl-sbs-frame wl-sbs-frame--muted">
                {beforeImage ? (
                    <img
                        src={beforeImage.src}
                        alt={beforeImage.alt || "Before"}
                        className="wl-sbs-img"
                        loading="lazy"
                    />
                ) : (
                    <ImagePlaceholder
                        items={beforeItems}
                        variant="before"
                    />
                )}
            </div>
            <ul className="wl-sbs-captions">
                {beforeItems.map((item, i) => (
                    <li
                        key={i}
                        className="wl-sbs-caption wl-sbs-caption--muted"
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </motion.div>

        {/* After column */}
        <motion.div
            className="wl-sbs-col"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
                duration: 0.55,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            <span className="wl-sbs-tag">
                <svg
                    className="wl-arrow-icon"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M5 12h14m0 0l-4-4m4 4l-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                After
            </span>
            <div className="wl-sbs-frame">
                {afterImage ? (
                    <img
                        src={afterImage.src}
                        alt={afterImage.alt || "After"}
                        className="wl-sbs-img"
                        loading="lazy"
                    />
                ) : (
                    <ImagePlaceholder
                        items={[afterPrimary, ...afterSecondary]}
                        variant="after"
                    />
                )}
            </div>
            <ul className="wl-sbs-captions">
                {afterPrimary && (
                    <li className="wl-sbs-caption wl-sbs-caption--primary">
                        {afterPrimary}
                    </li>
                )}
                {afterSecondary.map((item, i) => (
                    <li
                        key={i}
                        className="wl-sbs-caption wl-sbs-caption--secondary"
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </motion.div>
    </div>
);

/* ─────────────────────────────────────────────────────────────────────
   MODE B — STACKED
   Full-width vertical layout. Before on top, divider draws itself,
   After appears below on scroll. Reveals the transformation step by
   step — like turning a magazine page.
   Semplice: "Think of each case study like a magazine feature."
   ───────────────────────────────────────────────────────────────────── */
const StackedView = ({
    beforeImage,
    afterImage,
    beforeItems,
    afterPrimary,
    afterSecondary,
}) => (
    <div className="wl-stack">
        {/* Before block */}
        <motion.div
            className="wl-stack-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
        >
            <span className="wl-stack-tag">Before</span>
            <div className="wl-stack-frame wl-stack-frame--muted">
                {beforeImage ? (
                    <img
                        src={beforeImage.src}
                        alt={beforeImage.alt || "Before"}
                        className="wl-stack-img"
                        loading="lazy"
                    />
                ) : (
                    <ImagePlaceholder
                        items={beforeItems}
                        variant="before"
                    />
                )}
            </div>
            <p className="wl-stack-summary">{beforeItems.join(" · ")}</p>
        </motion.div>

        {/* Divider that draws from left to right */}
        <motion.div
            className="wl-stack-divider"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.45,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            <div className="wl-stack-divider-line" />
            <svg
                className="wl-stack-divider-arrow"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
            >
                <path
                    d="M12 5v14m0 0l-4-4m4 4l4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <div className="wl-stack-divider-line" />
        </motion.div>

        {/* After block */}
        <motion.div
            className="wl-stack-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <span className="wl-stack-tag">After</span>
            <div className="wl-stack-frame">
                {afterImage ? (
                    <img
                        src={afterImage.src}
                        alt={afterImage.alt || "After"}
                        className="wl-stack-img"
                        loading="lazy"
                    />
                ) : (
                    <ImagePlaceholder
                        items={[afterPrimary, ...afterSecondary]}
                        variant="after"
                    />
                )}
            </div>
            <p className="wl-stack-summary wl-stack-summary--primary">
                {afterPrimary}
            </p>
        </motion.div>
    </div>
);

/* ─────────────────────────────────────────────────────────────────────
   MODE C — OVERLAY SLIDER
   Interactive before/after comparison with a draggable divider.
   The most "show don't tell" option. Starts at 65% (mostly Before)
   to invite dragging. Handle pulses gently 3 times on first view.
   Uses clip-path for the overlay, hidden range input for a11y.
   Semplice: "Don't add a bunch of photos without context."
   ───────────────────────────────────────────────────────────────────── */
const SliderView = ({
    beforeImage,
    afterImage,
    beforeItems,
    afterPrimary,
    afterSecondary,
}) => {
    const [pos, setPos] = useState(65);
    const containerRef = useRef(null);
    const dragging = useRef(false);

    const updatePos = useCallback((clientX) => {
        if (!containerRef.current) return;
        const { left, width } = containerRef.current.getBoundingClientRect();
        setPos(Math.max(5, Math.min(95, ((clientX - left) / width) * 100)));
    }, []);

    useEffect(() => {
        const up = () => {
            dragging.current = false;
        };
        const move = (e) => {
            if (dragging.current) updatePos(e.clientX);
        };
        const touchMove = (e) => {
            if (dragging.current) updatePos(e.touches[0].clientX);
        };

        window.addEventListener("mouseup", up);
        window.addEventListener("mousemove", move);
        window.addEventListener("touchend", up);
        window.addEventListener("touchmove", touchMove, { passive: true });
        return () => {
            window.removeEventListener("mouseup", up);
            window.removeEventListener("mousemove", move);
            window.removeEventListener("touchend", up);
            window.removeEventListener("touchmove", touchMove);
        };
    }, [updatePos]);

    return (
        <motion.div
            className="wl-slider"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
        >
            <div
                className="wl-slider-box"
                ref={containerRef}
                onMouseDown={() => {
                    dragging.current = true;
                }}
                onTouchStart={() => {
                    dragging.current = true;
                }}
            >
                {/* Before layer — full width, underneath */}
                <div className="wl-slider-layer wl-slider-layer--before">
                    {beforeImage ? (
                        <img
                            src={beforeImage.src}
                            alt={beforeImage.alt || "Before"}
                            draggable={false}
                        />
                    ) : (
                        <ImagePlaceholder
                            items={beforeItems}
                            variant="before"
                        />
                    )}
                    <span className="wl-slider-tag wl-slider-tag--left">
                        Before
                    </span>
                </div>

                {/* After layer — overlaid, clipped from the left */}
                <div
                    className="wl-slider-layer wl-slider-layer--after"
                    style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
                >
                    {afterImage ? (
                        <img
                            src={afterImage.src}
                            alt={afterImage.alt || "After"}
                            draggable={false}
                        />
                    ) : (
                        <ImagePlaceholder
                            items={[afterPrimary, ...afterSecondary]}
                            variant="after"
                        />
                    )}
                    <span className="wl-slider-tag wl-slider-tag--right">
                        After
                    </span>
                </div>

                {/* Draggable divider line + handle */}
                <div
                    className="wl-slider-divider"
                    style={{ left: `${pos}%` }}
                >
                    <div className="wl-slider-handle">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M8 5l-4 7 4 7M16 5l4 7-4 7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>

                {/* Hidden range input — keyboard + screen reader a11y */}
                <input
                    type="range"
                    className="wl-slider-range"
                    min="0"
                    max="100"
                    value={pos}
                    onChange={(e) => setPos(Number(e.target.value))}
                    aria-label="Drag to compare before and after"
                />
            </div>

            {/* Caption row below the slider */}
            <div className="wl-slider-captions">
                <span className="wl-slider-cap">{beforeItems.join(", ")}</span>
                <span className="wl-slider-cap wl-slider-cap--primary">
                    {afterPrimary}
                </span>
            </div>
        </motion.div>
    );
};

/* ─────────────────────────────────────────────────────────────────────
   PILLS VIEW — original layout, used as fallback when no images
   are available and no displayMode is set.
   ───────────────────────────────────────────────────────────────────── */
const PillsView = ({ beforeItems, afterPrimary, afterSecondary }) => (
    <div className="wl-grid">
        <div className="wl-side wl-side--before">
            <span className="wl-side-label">Before</span>
            <div className="wl-pills">
                {beforeItems.map((item, i) => (
                    <motion.span
                        key={i}
                        className="wl-pill wl-pill--muted"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                    >
                        {item}
                    </motion.span>
                ))}
            </div>
        </div>

        <div className="wl-side wl-side--after">
            <span className="wl-side-label">
                <svg
                    className="wl-arrow-icon"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M5 12h14m0 0l-4-4m4 4l-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                After
            </span>
            <div className="wl-pills">
                {afterPrimary && (
                    <motion.span
                        className="wl-pill wl-pill--primary"
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: 0.12 }}
                    >
                        {afterPrimary}
                    </motion.span>
                )}
                {afterSecondary.map((item, i) => (
                    <motion.span
                        key={i}
                        className="wl-pill wl-pill--secondary"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.25,
                            delay: 0.2 + i * 0.04,
                        }}
                    >
                        {item}
                    </motion.span>
                ))}
            </div>
        </div>
    </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT

   Picks a display mode based on available data:
     1. Explicit displayMode prop → use that mode (with placeholder if no images)
     2. Images provided but no mode → defaults to "side-by-side"
     3. No images, no mode → falls back to "pills"

   Each case study can choose its own comparison style. All modes
   gracefully handle missing screenshots with a placeholder that
   still communicates the concept visually.
   ═══════════════════════════════════════════════════════════════════════ */
const WeightLiftedPivot = ({
    title,
    beforeItems = [],
    afterPrimary,
    afterSecondary = [],
    caption,
    principleLabel,
    beforeImage,
    afterImage,
    displayMode,
}) => {
    if (!beforeItems.length && !afterPrimary) return null;

    const hasImages = beforeImage && afterImage;
    const mode = displayMode || (hasImages ? "side-by-side" : "pills");

    const sharedProps = {
        beforeImage,
        afterImage,
        beforeItems,
        afterPrimary,
        afterSecondary,
    };

    return (
        <motion.div
            className="wl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
        >
            {/* Section label + title — always shown */}
            {principleLabel && (
                <span className="wl-label">{principleLabel}</span>
            )}
            {title && <h3 className="wl-title">{title}</h3>}

            {/* Mode-specific content */}
            {mode === "pills" && <PillsView {...sharedProps} />}
            {mode === "side-by-side" && <SideBySideView {...sharedProps} />}
            {mode === "stacked" && <StackedView {...sharedProps} />}
            {mode === "slider" && <SliderView {...sharedProps} />}

            {/* Takeaway caption — always shown */}
            {caption && (
                <motion.p
                    className="wl-caption"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.25 }}
                >
                    {caption}
                </motion.p>
            )}
        </motion.div>
    );
};

export default WeightLiftedPivot;
