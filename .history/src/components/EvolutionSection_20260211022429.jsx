import { motion } from "framer-motion";
import "./EvolutionSection.css";

/**
 * EvolutionSection — "Where It Evolves"
 *
 * Figma-inspired layered panels with accent strips,
 * uppercase tag labels, clean dividers, and subtle depth.
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

            <div className="evolution-canvas">
                {evolution.items.map((item, index) => (
                    <motion.div
                        key={index}
                        className={`evolution-panel${index === 0 ? " evolution-panel--lead" : ""}`}
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 0.45,
                            delay: index * 0.1,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <div className="evolution-accent" aria-hidden="true" />

                        <div className="evolution-body">
                            {item.tag && (
                                <span className="evolution-tag">
                                    {item.tag}
                                </span>
                            )}

                            <h3 className="evolution-title">{item.title}</h3>

                            {item.outcome && (
                                <>
                                    <hr className="evolution-divider" />
                                    <p className="evolution-outcome">
                                        {item.outcome}
                                    </p>
                                </>
                            )}

                            {item.impact && (
                                <>
                                    <hr className="evolution-divider" />
                                    <p className="evolution-impact">
                                        {item.impact}
                                    </p>
                                </>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
};

export default EvolutionSection;
