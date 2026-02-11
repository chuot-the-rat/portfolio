import { motion } from "framer-motion";
import "./WeightLiftedPivot.css";

/**
 * WeightLiftedPivot — Before / After simplification comparison.
 *
 * Props:
 *   title           — e.g. "From 8 features to 1 clear action"
 *   beforeItems     — string[] of what existed before
 *   afterPrimary    — the single primary outcome
 *   afterSecondary  — string[] of supporting outcomes (optional)
 *   caption         — closing takeaway sentence
 *   principleLabel  — small label above title (e.g. "Clarity through subtraction")
 */
const WeightLiftedPivot = ({
    title,
    beforeItems = [],
    afterPrimary,
    afterSecondary = [],
    caption,
    principleLabel,
}) => {
    if (!beforeItems.length && !afterPrimary) return null;

    return (
        <motion.div
            className="wl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
        >
            {/* Label + Title */}
            {principleLabel && (
                <span className="wl-label">{principleLabel}</span>
            )}
            {title && <h3 className="wl-title">{title}</h3>}

            {/* Comparison grid */}
            <div className="wl-grid">
                {/* Before */}
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

                {/* After */}
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

            {/* Takeaway */}
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
