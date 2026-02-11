import { motion } from "framer-motion";
import "./EvolutionSection.css";

/**
 * EvolutionSection — "Where It Evolves"
 *
 * Reframes "next steps" as intentional evolution.
 * Studio board aesthetic: floating cards with subtle rotation,
 * paper-clip accents, and gentle drop-in motion.
 */
const EvolutionSection = ({ evolution }) => {
    if (!evolution?.items?.length) return null;

    // Alternate slight rotations and offsets
    const cardVariants = [
        { rotate: -0.6, x: -6 },
        { rotate: 0.5, x: 8 },
        { rotate: -0.4, x: -4 },
        { rotate: 0.7, x: 6 },
        { rotate: -0.3, x: -8 },
        { rotate: 0.4, x: 4 },
    ];

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

            <div className="evolution-board">
                {evolution.items.map((item, index) => {
                    const v = cardVariants[index % cardVariants.length];
                    return (
                        <motion.div
                            key={index}
                            className="evolution-card"
                            style={{
                                transform: `rotate(${v.rotate}deg) translateX(${v.x}px)`,
                            }}
                            initial={{ opacity: 0, y: 4 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.45,
                                delay: index * 0.1,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            {/* Paper clip accent */}
                            <span className="evolution-clip" aria-hidden="true" />

                            <h3 className="evolution-title">{item.title}</h3>

                            {item.outcome && (
                                <p className="evolution-outcome">
                                    {item.outcome}
                                </p>
                            )}

                            {item.impact && (
                                <p className="evolution-impact">
                                    {item.impact}
                                </p>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
};

export default EvolutionSection;
