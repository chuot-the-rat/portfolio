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
    const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
    const [showRipple, setShowRipple] = useState(false);
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

    const handleMouseEnter = (skill, event) => {
        if (!prefersReducedMotion.current) {
            if (isWorkMode) {
                setHoveredSkill(skill.name);
                
                // Enhanced terminal info
                const levelText = skill.level.toUpperCase();
                const categoryText = skill.category.toUpperCase();
                setTerminalLabel(`[${levelText}] ${categoryText}_MODULE`);
                
                // Ripple effect
                if (event && event.currentTarget) {
                    const rect = event.currentTarget.getBoundingClientRect();
                    setRipplePosition({
                        x: event.clientX - rect.left,
                        y: event.clientY - rect.top,
                    });
                    setShowRipple(true);
                    setTimeout(() => setShowRipple(false), 600);
                }
            } else {
                setHoveredSkill(skill.name || skill);
            }
        }
    };

    const handleMouseLeave = () => {
        setHoveredSkill(null);
        setTerminalLabel("");
        setShowRipple(false);
    };

    // Work Mode: Holographic System Index
    if (isWorkMode) {
        return (
            <section
                ref={sectionRef}
                className={`skills-section skills-work-mode ${isVisible ? "visible" : ""}`}
                aria-label="Skills"
            >
                {/* Background effects layer */}
                <div className="holo-background">
                    <div className="scanlines"></div>
                    <div className="code-stream"></div>
                    <div className="nano-grid"></div>
                    <div className="noise-overlay"></div>
                </div>

                <header className="skills-header-work">
                    <span className="terminal-prompt">&gt;_</span>
                    <h2 className="skills-title-work">system_modules.list()</h2>
                    <div className="terminal-cursor"></div>
                </header>

                <div className="skills-holographic-grid">
                    {skillsDataWorkMode.map((skill, index) => {
                        const symbolMap = {
                            "[]": "[",
                            "<>": "<",
                            "{}": "{",
                            "_": "_",
                            "*": "*",
                        };
                        const endSymbol = {
                            "[]": "]",
                            "<>": ">",
                            "{}": "}",
                            "_": "_",
                            "*": "*",
                        };

                        return (
                            <motion.div
                                key={skill.name}
                                className={`skill-holo-item ${hoveredSkill === skill.name ? "hovered" : ""}`}
                                style={{
                                    "--skill-index": index,
                                    "--float-delay": `${index * 0.15}s`,
                                }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.03,
                                    ease: [0.25, 0.8, 0.25, 1],
                                }}
                                onMouseEnter={(e) => handleMouseEnter(skill, e)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {/* Holographic glow layers */}
                                <div className="holo-glow-inner"></div>
                                <div className="holo-glow-outer"></div>

                                {/* Symbol with rotation animation */}
                                <motion.span
                                    className="skill-symbol-start"
                                    animate={{
                                        rotate: hoveredSkill === skill.name ? [0, -2, 2, 0] : 0,
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.25, 0.8, 0.25, 1],
                                    }}
                                >
                                    {symbolMap[skill.symbol] || "["}
                                </motion.span>

                                <span className="skill-name-holo">
                                    {skill.name}
                                </span>

                                {/* Symbol with rotation animation */}
                                <motion.span
                                    className="skill-symbol-end"
                                    animate={{
                                        rotate: hoveredSkill === skill.name ? [0, 2, -2, 0] : 0,
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.25, 0.8, 0.25, 1],
                                    }}
                                >
                                    {endSymbol[skill.symbol] || "]"}
                                </motion.span>

                                {/* Enhanced terminal label */}
                                {hoveredSkill === skill.name && (
                                    <motion.div
                                        className="skill-terminal-label"
                                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.18, ease: [0.25, 0.8, 0.25, 1] }}
                                    >
                                        <div className="label-text">{terminalLabel}</div>
                                        <div className="label-cursor"></div>
                                    </motion.div>
                                )}

                                {/* Ripple effect */}
                                {showRipple && hoveredSkill === skill.name && (
                                    <motion.div
                                        className="skill-ripple"
                                        style={{
                                            left: ripplePosition.x,
                                            top: ripplePosition.y,
                                        }}
                                        initial={{ scale: 0, opacity: 0.5 }}
                                        animate={{ scale: 3, opacity: 0 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </section>
        );
    }

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
