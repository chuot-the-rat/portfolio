import { motion } from "framer-motion";
import "./PivotDiagram.css";

/* ─────────────────────────────────────────────
   PivotCard
   Figma-panel card with selection-sweep animation.
   Two-column FROM / TO + WHY below.
   ───────────────────────────────────────────── */
const PivotCard = ({ from, to, reason, index }) => {
    const d = index * 0.06; // base stagger per card

    return (
        <motion.article
            className="fpv-card"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: d, ease: [0.25, 0.1, 0.25, 1] }}
        >
            {/* Selection strip — left edge, sweeps in vertically */}
            <motion.span
                className="fpv-select-strip"
                aria-hidden="true"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                    duration: 0.3,
                    delay: d + 0.12,
                    ease: [0.25, 0.1, 0.25, 1],
                }}
            />

            {/* States row: FROM — chevron — TO */}
            <div className="fpv-columns">
                <motion.div
                    className="fpv-col fpv-col--from"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.3, delay: d + 0.08 }}
                >
                    <span className="fpv-tag">From</span>
                    <p className="fpv-body">{from}</p>
                </motion.div>

                <span className="fpv-arrow" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path
                            d="M6 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>

                <motion.div
                    className="fpv-col fpv-col--to"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.3, delay: d + 0.18 }}
                >
                    <span className="fpv-tag">To</span>
                    <p className="fpv-body fpv-body--emphasis">{to}</p>
                </motion.div>
            </div>

            {/* WHY — below the columns */}
            <motion.div
                className="fpv-reason"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.28, delay: d + 0.28 }}
            >
                <span className="fpv-tag">Why</span>
                <p className="fpv-body fpv-body--muted">{reason}</p>
            </motion.div>
        </motion.article>
    );
};

/* ─────────────────────────────────────────────
   PivotDiagram — vertical card stack
   ───────────────────────────────────────────── */
const PivotDiagram = ({ pivots = [] }) => {
    if (!pivots.length) return null;

    return (
        <div className="fpv-stack">
            {pivots.map((p, i) => (
                <PivotCard key={i} index={i} {...p} />
            ))}
        </div>
    );
};

export default PivotDiagram;
