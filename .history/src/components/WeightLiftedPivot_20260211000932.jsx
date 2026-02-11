import { motion } from "framer-motion";
import "./WeightLiftedPivot.css";

/**
 * WeightLiftedPivot — Visual before/after comparison of simplification.
 *
 * Shows what was removed (before) vs what remained (after), demonstrating
 * that intentional subtraction strengthens the core experience.
 *
 * Props:
 *   title           — heading for the comparison (e.g. "From 8 features to 1 clear action")
 *   beforeItems     — string[] of features/elements that existed before
 *   afterPrimary    — the single primary item that survived
 *   afterSecondary  — string[] of supporting items that remained (optional)
 *   caption         — reflection text below the comparison
 *   principleLabel  — optional label above the title (e.g. "Design Principle")
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
            className="weight-lifted"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
        >
            {principleLabel && (
                <span className="weight-lifted-principle">{principleLabel}</span>
            )}

            {title && <h3 className="weight-lifted-title">{title}</h3>}

            <div className="weight-lifted-comparison">
                {/* Before column */}
                <div className="weight-lifted-col weight-lifted-before">
                    <span className="weight-lifted-col-label">Before</span>
                    <div className="weight-lifted-items">
                        {beforeItems.map((item, i) => (
                            <motion.span
                                key={i}
                                className="weight-lifted-chip weight-lifted-chip--removed"
                                initial={{ opacity: 0, x: -6 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: i * 0.04 }}
                            >
                                {item}
                            </motion.span>
                        ))}
                    </div>
                </div>

                {/* Arrow divider */}
                <div className="weight-lifted-arrow" aria-hidden="true">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M5 12h14m0 0l-4-4m4 4l-4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* After column */}
                <div className="weight-lifted-col weight-lifted-after">
                    <span className="weight-lifted-col-label">After</span>
                    <div className="weight-lifted-items">
                        {afterPrimary && (
                            <motion.span
                                className="weight-lifted-chip weight-lifted-chip--primary"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: 0.15 }}
                            >
                                {afterPrimary}
                            </motion.span>
                        )}
                        {afterSecondary.map((item, i) => (
                            <motion.span
                                key={i}
                                className="weight-lifted-chip weight-lifted-chip--secondary"
                                initial={{ opacity: 0, x: 6 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.25 + i * 0.04 }}
                            >
                                {item}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </div>

            {caption && (
                <motion.p
                    className="weight-lifted-caption"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    {caption}
                </motion.p>
            )}
        </motion.div>
    );
};

export default WeightLiftedPivot;
