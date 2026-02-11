import { motion } from "framer-motion";
import "./PivotSection.css";

/* ─────────────────────────────────────────────
   Block 1 — ProcessTimeline
   Horizontal turning-point marker.
   ───────────────────────────────────────────── */
const ProcessTimeline = ({
    steps = ["Research", "Overexpansion", "Realization", "Refocus", "Build"],
    highlightedStep = "Realization",
}) => (
    <div className="pivot-block pivot-block--timeline">
        <div className="process-timeline-track">
            {steps.map((step, i) => {
                const active = step === highlightedStep;
                return (
                    <div
                        key={i}
                        className={`process-timeline-step${active ? " is-active" : ""}`}
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
        <hr className="pivot-divider" />
    </div>
);

/* ─────────────────────────────────────────────
   Block 2 — FeatureGraveyard
   Clean vertical list of removed features + reflection.
   ───────────────────────────────────────────── */
const FeatureGraveyard = ({ removedFeatures = [], reflection = "" }) => {
    if (!removedFeatures?.length) return null;

    return (
        <div className="pivot-block pivot-block--graveyard">
            <h3 className="graveyard-heading">What We Chose Not to Build</h3>

            <ul className="graveyard-list">
                {removedFeatures.map((feature, i) => (
                    <motion.li
                        key={i}
                        className="graveyard-item"
                        initial={{ opacity: 0, x: -6 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                        {feature}
                    </motion.li>
                ))}
            </ul>

            {reflection && (
                <p className="graveyard-reflection">{reflection}</p>
            )}
        </div>
    );
};

/* ─────────────────────────────────────────────
   PivotSection — Orchestrator
   Renders Timeline → Graveyard as two clearly separated blocks.
   ───────────────────────────────────────────── */
const PivotSection = ({ pivot }) => {
    if (!pivot) return null;

    return (
        <motion.div
            className="pivot-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
        >
            {pivot.timelineSteps?.length > 0 && (
                <ProcessTimeline
                    steps={pivot.timelineSteps}
                    highlightedStep={pivot.highlightedStep}
                />
            )}

            <FeatureGraveyard
                removedFeatures={pivot.removedFeatures}
                reflection={pivot.reflection}
            />
        </motion.div>
    );
};

export { ProcessTimeline, FeatureGraveyard };
export default PivotSection;
