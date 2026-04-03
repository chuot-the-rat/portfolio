import { motion } from "framer-motion";
import "./SkillsSection.css";

const fadeUp = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.45 },
};

const SKILLS = {
    "UX / Design": [
        "User Research", "Wireframing", "Prototyping",
        "User Testing", "User Flows", "Journey Mapping",
        "Design Systems", "Accessibility",
    ],
    "UI / Visual": [
        "Figma", "Typography", "Color Theory",
        "Responsive Design", "After Effects", "Framer",
    ],
    "Development": [
        "HTML / CSS", "JavaScript", "React",
        "Git / GitHub", "VS Code",
    ],
    "Tools": [
        "Adobe Illustrator", "Photoshop", "Notion",
    ],
};

export default function SkillsSection() {
    return (
        <motion.div className="skills-row" {...fadeUp}>
            <span className="skills-row-label">Skills</span>
            <div className="skills-row-content">
                {Object.entries(SKILLS).map(([category, items]) => (
                    <div key={category} className="skills-group">
                        <span className="skills-group-label">{category}</span>
                        <div className="skills-pills">
                            {items.map((skill) => (
                                <span key={skill} className="skills-pill">{skill}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
