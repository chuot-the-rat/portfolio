import { motion } from "framer-motion";
import "./PivotDiagram.css";

/* ─────────────────────────────────────────────
   PivotCard
   Figma-panel–style card: FROM → TO → WHY
   Selection-highlight animates in on scroll.
   ───────────────────────────────────────────── */
const PivotCard = ({ from, to, reason, index }) => {
    const delay = index * 0.08;

    return (
        <motion.div
            className="pvt-card"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
        >
            {/* Selection accent bar — sweeps in */}
            <motion.span
                className="pvt-accent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                    duration: 0.35,
                    delay: delay + 0.15,
                    ease: [0.25, 0.1, 0.25, 1],
                }}
            />

            <div className="pvt-states">
                {/* FROM */}
                <motion.div
                    className="pvt-state pvt-state--from"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.3, delay: delay + 0.1 }}
                >
                    <span className="pvt-label">From</span>
                    <p className="pvt-value">{from}</p>
                </motion.div>

                {/* Chevron */}
                <span className="pvt-chevron" aria-hidden="true">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                    >
                        <path
                            d="M5 3l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>

                {/* TO */}
                <motion.div
                    className="pvt-state pvt-state--to"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.3, delay: delay + 0.2 }}
                >
                    <span className="pvt-label">To</span>
                    <p className="pvt-value">{to}</p>
                    {/* Subtle underline reveal on TO */}
                    <motion.span
                        className="pvt-underline"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{
                            duration: 0.3,
                            delay: delay + 0.35,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                    />
                </motion.div>
            </div>

            {/* Divider */}
            <hr className="pvt-divider" />

            {/* WHY */}
            <motion.div
                className="pvt-why"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.3, delay: delay + 0.3 }}
            >
                <span className="pvt-label">Why</span>
                <p className="pvt-why-text">{reason}</p>
            </motion.div>
        </motion.div>
    );
};

/* ─────────────────────────────────────────────
   PivotDiagram
   Renders a vertical stack of Figma-panel cards.
   ───────────────────────────────────────────── */
const PivotDiagram = ({ pivots = [] }) => {
    if (!pivots.length) return null;

    return (
        <div className="pvt-list">
            {pivots.map((pivot, i) => (
                <PivotCard key={i} index={i} {...pivot} />
            ))}
        </div>
    );
};

export default PivotDiagram;
