import { motion } from "framer-motion";
import { SKILL_CATEGORIES } from "../data/skills/skillsData";
import "./SkillsSection.css";

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.45 },
};

export default function SkillsSection() {
    return (
        <motion.div className="skills-row" {...fadeUp}>
            <span className="skills-row-label">Skills</span>
            <div className="skills-row-content">
                {SKILL_CATEGORIES.map((category) => (
                    <div key={category.id} className="skills-group">
                        <span className="skills-group-label">{category.label}</span>
                        <div className="skills-pills">
                            {category.skills.map((skill) => (
                                <span key={skill.name} className="skills-pill">
                                    <span className="skills-pill-name">{skill.name}</span>
                                    <span className="skills-pill-level">{skill.level}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
