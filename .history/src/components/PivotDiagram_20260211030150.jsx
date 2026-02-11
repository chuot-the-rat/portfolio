import { motion } from "framer-motion";
import "./PivotDiagram.css";

/* ─────────────────────────────────────────────
   PivotCard
   TO-dominant card: the decision is the hero.
   FROM = contextual metadata ("Previously: …")
   WHY  = the insight
   ───────────────────────────────────────────── */
const PivotCard = ({ from, to, reason, index }) => {
    const d = index * 0.06;

    return (
        <motion.article
            className="pvt-card"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: d, ease: [0.25, 0.1, 0.25, 1] }}
        >
            {/* FROM — small contextual line */}
            <motion.p
                className="pvt-previously"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.3, delay: d + 0.18 }}
            >
                Previously: {from}
            </motion.p>

            {/* TO — hero decision */}
            <motion.div
                className="pvt-decision"
                initial={{ opacity: 0, scale: 0.985 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.38, delay: d + 0.06, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <h4 className="pvt-decision-text">{to}</h4>
                <motion.span
                    className="pvt-decision-underline"
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                        duration: 0.35,
                        delay: d + 0.2,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                />
            </motion.div>

            {/* WHY — insight */}
            <motion.p
                className="pvt-insight"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.3, delay: d + 0.28 }}
            >
                {reason}
            </motion.p>
        </motion.article>
    );
};

/* ─────────────────────────────────────────────
   PivotDiagram — vertical card stack
   ───────────────────────────────────────────── */
const PivotDiagram = ({ pivots = [] }) => {
    if (!pivots.length) return null;

    return (
        <div className="pvt-stack">
            {pivots.map((p, i) => (
                <PivotCard key={i} index={i} {...p} />
            ))}
        </div>
    );
};

export default PivotDiagram;
