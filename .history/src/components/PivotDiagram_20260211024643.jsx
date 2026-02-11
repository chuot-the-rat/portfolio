import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./PivotDiagram.css";

/* ─────────────────────────────────────────────
   PivotRow
   FROM → connector → TO → WHY
   Alternates direction per row for visual rhythm.
   ───────────────────────────────────────────── */
const PivotRow = ({ from, to, reason, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const reversed = index % 2 === 1;

    const base = 0.15;
    const stagger = {
        from: base,
        line: base + 0.25,
        to: base + 0.5,
        why: base + 0.75,
    };

    return (
        <div
            ref={ref}
            className={`pvt-row${reversed ? " pvt-row--reversed" : ""}`}
        >
            {/* FROM block */}
            <motion.div
                className="pvt-block pvt-block--from"
                initial={{ opacity: 0, x: reversed ? 16 : -16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: stagger.from, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="pvt-tag">From</span>
                <p className="pvt-text">{from}</p>
            </motion.div>

            {/* Connector */}
            <motion.div
                className="pvt-connector"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.5, delay: stagger.line, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="pvt-connector-line" />
                <span className="pvt-connector-arrow" />
            </motion.div>

            {/* TO block */}
            <motion.div
                className="pvt-block pvt-block--to"
                initial={{ opacity: 0, x: reversed ? -16 : 16 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: stagger.to, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="pvt-tag">To</span>
                <p className="pvt-text">{to}</p>
            </motion.div>

            {/* WHY annotation */}
            <motion.div
                className="pvt-why"
                initial={{ opacity: 0, y: 6 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, delay: stagger.why, ease: "easeOut" }}
            >
                <span className="pvt-why-label">Why</span>
                <span className="pvt-why-text">{reason}</span>
            </motion.div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   PivotDiagram
   Scroll-animated transformation diagram list.
   ───────────────────────────────────────────── */
const PivotDiagram = ({ pivots = [] }) => {
    if (!pivots.length) return null;

    return (
        <div className="pvt-diagram">
            <div className="pvt-rail" aria-hidden="true" />
            {pivots.map((pivot, i) => (
                <PivotRow key={i} index={i} {...pivot} />
            ))}
        </div>
    );
};

export default PivotDiagram;
