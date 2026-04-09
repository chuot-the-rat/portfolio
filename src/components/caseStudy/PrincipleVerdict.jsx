import { motion } from "framer-motion";
import { caseStudyMotion } from "../../utils/motion/caseStudyMotion";
import "./PrincipleVerdict.css";

const VerdictIcon = ({ type }) => {
    const positive = type === "do";
    return (
        <span className={`cs-verdict-mark cs-verdict-mark--${type}`} aria-hidden="true">
            {positive ? "✓" : "✕"}
        </span>
    );
};

const VerdictCard = ({ type, item }) => {
    if (!item?.rule) return null;

    const title = item.title || (type === "do" ? "Do" : "Don't");
    const illustration = item.illustration || item.illustrationText;

    return (
        <motion.article
            className={`cs-verdict-card cs-verdict-card--${type}`}
            variants={caseStudyMotion.verdictItem}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
            <VerdictIcon type={type} />
            <p className="cs-verdict-title">{title}</p>
            <p className="cs-verdict-rule">{item.rule}</p>
            {illustration && <p className="cs-verdict-illustration">{illustration}</p>}
        </motion.article>
    );
};

export default function PrincipleVerdict({ verdict }) {
    if (!verdict || (!verdict.do && !verdict.dont)) return null;

    return (
        <motion.div
            className="cs-principle-verdict"
            variants={caseStudyMotion.verdictContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
        >
            <VerdictCard type="do" item={verdict.do} />
            <VerdictCard type="dont" item={verdict.dont} />
        </motion.div>
    );
}
