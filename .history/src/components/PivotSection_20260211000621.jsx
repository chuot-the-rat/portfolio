import { motion } from "framer-motion";
import "./PivotSection.css";

/**
 * ProcessTimeline — Horizontal process timeline showing a project's turning point.
 *
 * Props:
 *   steps          — string[] of timeline step labels
 *   highlightedStep — which step to emphasize (default: "Realization")
 */
const ProcessTimeline = ({
    steps = ["Research", "Overexpansion", "Realization", "Refocus", "Build"],
    highlightedStep = "Realization",
}) => {
    return (
        <div className="process-timeline-track">
            {steps.map((step, i) => {
                const isHighlighted = step === highlightedStep;
                return (
                    <div
                        key={i}
                        className={`process-timeline-step ${isHighlighted ? "is-highlighted" : ""}`}
                    >
                        <span className="process-timeline-dot" />
                        {i < steps.length - 1 && (
                            <span className="process-timeline-connector" />
                        )}
                        <span className="process-timeline-label">{step}</span>
                    </div>
                );
            })}
        </div>
    );
};

/**
 * FeatureGraveyard — Shows features intentionally removed during a pivot.
 *
 * Props:
 *   removedFeatures — string[] of cut features
 *   reflection      — a summary sentence displayed below the list
 *
 * Renders nothing if removedFeatures is empty or absent.
 */
const FeatureGraveyard = ({ removedFeatures = [], reflection = "" }) => {
    if (!removedFeatures || removedFeatures.length === 0) return null;

    return (
        <div className="feature-graveyard">
            <h3 className="feature-graveyard-heading">
                What We Chose Not to Build
            </h3>
            <ul className="feature-graveyard-list">
                {removedFeatures.map((feature, i) => (
                    <motion.li
                        key={i}
                        className="feature-graveyard-item"
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: i * 0.06 }}
                    >
                        {feature}
                    </motion.li>
                ))}
            </ul>
            {reflection && (
                <p className="feature-graveyard-reflection">{reflection}</p>
            )}
        </div>
    );
};

/**
 * PivotSection — Wrapper that renders both ProcessTimeline and FeatureGraveyard
 * inside the existing "Challenges & Pivots" area.
 *
 * Props:
 *   pivot — { timelineSteps, highlightedStep, removedFeatures, reflection }
 *
 * Renders nothing if pivot is absent.
 */
const PivotSection = ({ pivot }) => {
    if (!pivot) return null;

    return (
        <motion.div
            className="pivot-section-block"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
        >
            {/* Timeline marker */}
            {pivot.timelineSteps && pivot.timelineSteps.length > 0 && (
                <ProcessTimeline
                    steps={pivot.timelineSteps}
                    highlightedStep={pivot.highlightedStep}
                />
            )}

            {/* Feature graveyard */}
            <FeatureGraveyard
                removedFeatures={pivot.removedFeatures}
                reflection={pivot.reflection}
            />
        </motion.div>
    );
};

export { ProcessTimeline, FeatureGraveyard };
export default PivotSection;
