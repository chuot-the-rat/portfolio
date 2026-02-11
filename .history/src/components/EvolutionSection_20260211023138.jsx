import { motion } from "framer-motion";
import "./EvolutionSection.css";

/**
 * EvolutionSection — "Where It Evolves"
 *
 * Flow-block diagram with stacked-surface depth, chip labels,
 * vertical connector lines, and a floating utility pill.
 * Product-UI inspired — clean, intentional, no scrapbook.
 */
const EvolutionSection = ({ evolution }) => {
    if (!evolution?.items?.length) return null;

    return (
        <motion.section
            className="project-section evolution-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
        >
            <span className="section-label">09 — Where It Evolves</span>
            <h2 className="section-title">{evolution.title}</h2>

            <div className="evo-flow">
                {evolution.items.map((item, index) => (
                    <div className="evo-step" key={index}>
                        {/* Connector line between blocks */}
                        {index > 0 && (
                            <div className="evo-connector" aria-hidden="true" />
                        )}

                        <motion.div
                            className="evo-block"
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.45,
                                delay: index * 0.12,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            {/* Stacked surface layers */}
                            <span
                                className="evo-layer evo-layer--2"
                                aria-hidden="true"
                            />
                            <span
                                className="evo-layer evo-layer--1"
                                aria-hidden="true"
                            />

                            {/* Floating utility pill (first item only) */}
                            {index === 0 && (
                                <span className="evo-pill">Next iteration</span>
                            )}

                            {/* Chip tag */}
                            {item.tag && (
                                <span className="evo-chip">{item.tag}</span>
                            )}

                            <h3 className="evo-title">{item.title}</h3>

                            {item.outcome && (
                                <p className="evo-outcome">{item.outcome}</p>
                            )}

                            {item.impact && (
                                <div className="evo-impact-wrap">
                                    <span className="evo-impact-label">
                                        Why this matters
                                    </span>
                                    <p className="evo-impact">{item.impact}</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
};

export default EvolutionSection;
