import { useState, useEffect, useRef } from "react";
import { useMode, MODES } from "../context/ModeContext";
import { motion } from "framer-motion";
import "./SkillsSection.css";

// Work Mode: Skills organized with terminal symbols
const skillsDataWorkMode = [
    { name: "UI/UX", symbol: "[]", level: "expert", category: "design" },
    { name: "Figma", symbol: "<>", level: "expert", category: "tools" },
    { name: "Motion", symbol: "[]", level: "advanced", category: "design" },
    { name: "Framer", symbol: "<>", level: "advanced", category: "tools" },
    { name: "Prototyping", symbol: "[]", level: "expert", category: "design" },
    { name: "React", symbol: "<>", level: "intermediate", category: "dev" },
    { name: "User Research", symbol: "[]", level: "advanced", category: "design" },
    { name: "Illustrator", symbol: "<>", level: "advanced", category: "tools" },
    { name: "Front-End", symbol: "{}", level: "intermediate", category: "dev" },
    { name: "HTML/CSS", symbol: "<>", level: "expert", category: "dev" },
    { name: "Wireframing", symbol: "[]", level: "expert", category: "design" },
    { name: "JavaScript", symbol: "{}", level: "intermediate", category: "dev" },
    { name: "Typography", symbol: "_", level: "expert", category: "design" },
    { name: "After Effects", symbol: "<>", level: "learning", category: "tools" },
    { name: "Design Systems", symbol: "[]", level: "intermediate", category: "design" },
    { name: "VS Code", symbol: "<>", level: "expert", category: "tools" },
    { name: "Accessibility", symbol: "*", level: "intermediate", category: "design" },
    { name: "Git/GitHub", symbol: "{}", level: "intermediate", category: "dev" },
    { name: "Color Theory", symbol: "_", level: "expert", category: "design" },
    { name: "Notion", symbol: "<>", level: "expert", category: "tools" },
];

// Clean/Chaos Mode: Original categorized data
const skillsData = {
    design: {
        label: "Design",
        skills: [
            { name: "User Research", level: "advanced" },
            { name: "Wireframing", level: "advanced" },
            { name: "Prototyping", level: "advanced" },
            { name: "User Testing", level: "intermediate" },
            { name: "User Flows", level: "advanced" },
            { name: "Journey Mapping", level: "intermediate" },
        ],
    },
    ui: {
        label: "UI Design",
        skills: [
            { name: "Figma", level: "advanced" },
            { name: "Typography", level: "advanced" },
            { name: "Color Theory", level: "advanced" },
            { name: "Accessibility", level: "intermediate" },
            { name: "Responsive Design", level: "advanced" },
            { name: "Design Systems", level: "intermediate" },
        ],
    },
    development: {
        label: "Development",
        skills: [
            { name: "HTML/CSS", level: "advanced" },
            { name: "JavaScript", level: "intermediate" },
            { name: "React", level: "intermediate" },
            { name: "Next.js", level: "learning" },
            { name: "Python", level: "intermediate" },
            { name: "Git/GitHub", level: "intermediate" },
        ],
    },
    tools: {
        label: "Tools",
        skills: [
            { name: "Adobe Illustrator", level: "advanced" },
            { name: "Photoshop", level: "intermediate" },
            { name: "After Effects", level: "learning" },
            { name: "Framer", level: "intermediate" },
            { name: "VS Code", level: "advanced" },
            { name: "Notion", level: "advanced" },
        ],
    },
};

const levelLabels = {
    advanced: "Proficient",
    intermediate: "Experienced",
    learning: "Learning",
};

export default function SkillsSection({ variant = "grid" }) {
    const [hoveredSkill, setHoveredSkill] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [terminalLabel, setTerminalLabel] = useState("");
    const sectionRef = useRef(null);
    const { mode } = useMode();
    const isWorkMode = mode === MODES.WORK;
    const prefersReducedMotion = useRef(
        typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 },
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleMouseEnter = (skill) => {
        if (!prefersReducedMotion.current) {
            if (isWorkMode) {
                setHoveredSkill(skill.name);
                setTerminalLabel(`[level: ${skill.level}]`);
            } else {
                setHoveredSkill(skill.name || skill);
            }
        }
    };

    const handleMouseLeave = () => {
        setHoveredSkill(null);
        setTerminalLabel("");
    };

    return (
        <section
            ref={sectionRef}
            className={`skills-section ${variant} ${isVisible ? "visible" : ""}`}
            aria-label="Skills"
        >
            <header className="skills-header">
                <span className="skills-eyebrow">Expertise</span>
                <h2 className="skills-title">Skills & Tools</h2>
                <p className="skills-description">
                    A curated toolkit refined through hands-on projects and
                    continuous learning.
                </p>
            </header>

            <div className="skills-grid">
                {Object.entries(skillsData).map(
                    ([key, category], categoryIndex) => (
                        <div
                            key={key}
                            className="skills-category"
                            style={{
                                "--stagger-delay": prefersReducedMotion.current
                                    ? "0ms"
                                    : `${categoryIndex * 100}ms`,
                            }}
                        >
                            <h3 className="skills-category-label">
                                {category.label}
                            </h3>
                            <ul className="skills-list">
                                {category.skills.map((skill, skillIndex) => (
                                    <li
                                        key={skill.name}
                                        className={`skill-item ${hoveredSkill === skill.name ? "hovered" : ""}`}
                                        style={{
                                            "--skill-delay":
                                                prefersReducedMotion.current
                                                    ? "0ms"
                                                    : `${(categoryIndex * 6 + skillIndex) * 50}ms`,
                                        }}
                                        onMouseEnter={() =>
                                            handleMouseEnter(skill.name)
                                        }
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <span className="skill-name">
                                            {skill.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ),
                )}
            </div>
        </section>
    );
}
