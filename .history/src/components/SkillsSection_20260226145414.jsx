import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./SkillsSection.css";

// Chaos Mode: Original categorized data
const skillsData = {
    design: {
        label: "Design",
        skills: [
            { name: "User Research", level: "v2.0" },
            { name: "Wireframing", level: "v3.0" },
            { name: "Prototyping", level: "v3.0" },
            { name: "User Testing", level: "v1.0" },
            { name: "User Flows", level: "v2.0" },
            { name: "Journey Mapping", level: "v1.0" },
        ],
    },
    ui: {
        label: "UI Design",
        skills: [
            { name: "Figma", level: "v3.0" },
            { name: "Typography", level: "v3.0" },
            { name: "Color Theory", level: "v3.0" },
            { name: "Accessibility", level: "v1.0" },
            { name: "Responsive Design", level: "v2.0" },
            { name: "Design Systems", level: "v1.0" },
        ],
    },
    development: {
        label: "Development",
        skills: [
            { name: "HTML/CSS", level: "v3.0" },
            { name: "JavaScript", level: "v1.0" },
            { name: "React", level: "v1.0" },
            { name: "Next.js", level: "beta" },
            { name: "Python", level: "v1.0" },
            { name: "Git/GitHub", level: "v1.0" },
        ],
    },
    tools: {
        label: "Tools",
        skills: [
            { name: "Adobe Illustrator", level: "v2.0" },
            { name: "Photoshop", level: "v1.0" },
            { name: "After Effects", level: "beta" },
            { name: "Framer", level: "v1.0" },
            { name: "VS Code", level: "v3.0" },
            { name: "Notion", level: "v3.0" },
        ],
    },
};

export default function SkillsSection({ variant = "grid" }) {
    const [hoveredSkill, setHoveredSkill] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

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
        const skillName =
            typeof skill === "string" ? skill : skill.name || skill;
        setHoveredSkill(skillName);
    };

    const handleMouseLeave = () => {
        setHoveredSkill(null);
    };

    // Clean/Chaos Mode: Original Grid Layout
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
                                {category.skills.map((skill, skillIndex) => {
                                    const script = asciiScripts[skill.name];
                                    const isHovered =
                                        hoveredSkill === skill.name;
                                    return (
                                        <li
                                            key={skill.name}
                                            className={`skill-item ${isHovered ? "hovered" : ""}`}
                                            style={{
                                                "--skill-delay":
                                                    prefersReducedMotion.current
                                                        ? "0ms"
                                                        : `${(categoryIndex * 6 + skillIndex) * 50}ms`,
                                            }}
                                            onMouseEnter={(e) => {
                                                handleMouseEnter(skill.name, e);
                                            }}
                                            onMouseLeave={handleMouseLeave}
                                            onFocus={() =>
                                                handleMouseEnter(skill.name)
                                            }
                                            onBlur={handleMouseLeave}
                                            tabIndex={0}
                                        >
                                            <span className="skill-name">
                                                {skill.name}
                                            </span>

                                            {/* Floating overlay — same pattern as Work Mode */}
                                            {isHovered && script && (
                                                <>
                                                    {/* Terminal label */}
                                                    <motion.div
                                                        className="skill-terminal-label"
                                                        initial={{
                                                            opacity: 0,
                                                            y: -8,
                                                            scale: 0.9,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                            scale: 1,
                                                        }}
                                                        transition={{
                                                            duration: 0.22,
                                                            ease: [
                                                                0.25, 0.8, 0.25,
                                                                1,
                                                            ],
                                                        }}
                                                    >
                                                        <div className="label-text">
                                                            {terminalLabel}
                                                        </div>
                                                        <div className="label-cursor"></div>
                                                    </motion.div>

                                                    {/* ASCII animation */}
                                                    <motion.div
                                                        className="skill-ascii-animation"
                                                        initial={{
                                                            opacity: 0,
                                                            x: 8,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            x: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.18,
                                                            delay: 0.04,
                                                        }}
                                                    >
                                                        {asciiAnimations[
                                                            currentAsciiType
                                                        ]?.[asciiFrame] || "→"}
                                                    </motion.div>

                                                    {/* Code snippet */}
                                                    <motion.div
                                                        className="skill-code-snippet"
                                                        initial={{
                                                            opacity: 0,
                                                            y: 5,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: 5,
                                                        }}
                                                        transition={{
                                                            duration: 0.2,
                                                            delay: 0.05,
                                                        }}
                                                    >
                                                        {script.code}
                                                    </motion.div>
                                                </>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ),
                )}
            </div>
        </section>
    );
}
