import { motion } from "framer-motion";
import DecorativeDivider from "./DecorativeDivider";
import { caseStudyMotion } from "../../utils/motion/caseStudyMotion";
import "./ChecklistSection.css";

export default function ChecklistSection({ checklist }) {
    if (!checklist?.items?.length) return null;

    return (
        <motion.section
            className="project-section checklist-section"
            initial={caseStudyMotion.sectionReveal.initial}
            whileInView={caseStudyMotion.sectionReveal.whileInView}
            viewport={caseStudyMotion.sectionReveal.viewport}
            transition={caseStudyMotion.sectionReveal.transition}
        >
            <DecorativeDivider svgSrc={checklist.dividerSvg} />
            <h2 className="section-title">{checklist.title || "Checklist"}</h2>
            {checklist.subtitle && (
                <p className="section-description">{checklist.subtitle}</p>
            )}

            {checklist.diagramSrc && (
                <figure className="checklist-diagram">
                    <img
                        src={checklist.diagramSrc}
                        alt={checklist.diagramAlt || "Case study anatomy diagram"}
                        loading="lazy"
                    />
                </figure>
            )}

            <ol className="checklist-items">
                {checklist.items.map((item, index) => (
                    <motion.li
                        key={`${item.title}-${index}`}
                        className="checklist-item"
                        variants={caseStudyMotion.checklistItem}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.45, delay: index * 0.1 }}
                    >
                        <span className="checklist-number">{index + 1}</span>
                        <div>
                            <h3 className="checklist-item-title">{item.title}</h3>
                            <p className="checklist-item-copy">{item.description}</p>
                        </div>
                    </motion.li>
                ))}
            </ol>
        </motion.section>
    );
}
