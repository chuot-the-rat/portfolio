import { useState, useEffect, useRef } from "react";
import { useMode, MODES } from "../context/ModeContext";
import { motion } from "framer-motion";
import "./SkillsSection.css";

// ASCII Animation sequences for hover
const asciiAnimations = {
    arrows: ["→", "→ →", "→ → →"],
    loading: ["[    ]", "[=   ]", "[==  ]", "[=== ]", "[====]"],
    cube: ["[□]", "[◧]", "[■]", "[◨]", "[□]"],
    brackets: ["[ ]", "[< >]", "[{ }]", "[< >]", "[ ]"],
    dots: [".", "..", "..."],
};

// Work Mode: Skills organized in 4 columns with category headers and code snippets
const skillsDataWorkMode = {
    columns: [
        {
            id: "ui-ux",
            header: "UI/UX",
            skills: [
                { name: "Figma", symbol: "<>", level: "expert", code: "design.create();", ascii: "arrows" },
                { name: "Prototyping", symbol: "[]", level: "expert", code: "proto.build();", ascii: "loading" },
                { name: "User Research", symbol: "[]", level: "advanced", code: "user.study();", ascii: "cube" },
                { name: "Wireframing", symbol: "[]", level: "expert", code: "sketch.wireframe();", ascii: "brackets" },
                { name: "Design Systems", symbol: "[]", level: "intermediate", code: "sys.organize();", ascii: "dots" },
            ],
        },
        {
            id: "front-end",
            header: "FRONT-END",
            skills: [
                { name: "HTML/CSS", symbol: "<>", level: "expert", code: "<div>style</div>", ascii: "arrows" },
                { name: "React", symbol: "<>", level: "intermediate", code: "render(<App />);", ascii: "cube" },
                { name: "JavaScript", symbol: "{}", level: "intermediate", code: "()=>{code()}", ascii: "loading" },
                { name: "Git/GitHub", symbol: "{}", level: "intermediate", code: "git.commit();", ascii: "brackets" },
            ],
        },
        {
            id: "motion",
            header: "MOTION",
            skills: [
                { name: "After Effects", symbol: "<>", level: "learning", code: "anim.keyframe();", ascii: "arrows" },
                { name: "Framer", symbol: "<>", level: "advanced", code: "motion.animate();", ascii: "cube" },
                { name: "Typography", symbol: "_", level: "expert", code: "font.setStyle();", ascii: "loading" },
                { name: "Color Theory", symbol: "_", level: "expert", code: "color.harmonize();", ascii: "dots" },
            ],
        },
        {
            id: "tools",
            header: "TOOLSET",
            skills: [
                { name: "Illustrator", symbol: "<>", level: "advanced", code: "vector.draw();", ascii: "arrows" },
                { name: "VS Code", symbol: "<>", level: "expert", code: "editor.code();", ascii: "cube" },
                { name: "Notion", symbol: "<>", level: "expert", code: "notes.sync();", ascii: "loading" },
                { name: "Accessibility", symbol: "*", level: "intermediate", code: "a11y.check();", ascii: "brackets" },
            ],
        },
    ],
};

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
    const [asciiFrame, setAsciiFrame] = useState(0);
    const [currentAsciiType, setCurrentAsciiType] = useState(null);
    const sectionRef = useRef(null);
    const asciiInterval = useRef(null);
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
                setCurrentAsciiType(skill.ascii);
                setAsciiFrame(0);

                // Start ASCII animation loop
                if (asciiInterval.current) clearInterval(asciiInterval.current);
                asciiInterval.current = setInterval(() => {
                    setAsciiFrame((prev) => {
                        const frames = asciiAnimations[skill.ascii] || asciiAnimations.arrows;
                        return (prev + 1) % frames.length;
                    });
                }, 150); // 150ms per frame

                // Enhanced terminal info
                const levelText = skill.level.toUpperCase();
                setTerminalLabel(`[${levelText}] SYSTEM_LOADED`);

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
        setCurrentAsciiType(null);
        setAsciiFrame(0);
        if (asciiInterval.current) {
            clearInterval(asciiInterval.current);
            asciiInterval.current = null;
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (asciiInterval.current) {
                clearInterval(asciiInterval.current);
            }
        };
    }, []);

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

                <div className="skills-column-grid">
                    {skillsDataWorkMode.columns.map((column, columnIndex) => {
                        const symbolMap = {
                            "[]": "[",
                            "<>": "<",
                            "{}": "{",
                            _: "_",
                            "*": "*",
                        };
                        const endMap = {
                            "[]": "]",
                            "<>": ">",
                            "{}": "}",
                            _: "_",
                            "*": "*",
                        };

                        return (
                            <motion.div
                                key={column.id}
                                className="skill-column"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: columnIndex * 0.08,
                                    ease: [0.25, 0.8, 0.25, 1],
                                }}
                            >
                                {/* Column Header */}
                                <motion.h3
                                    className="skill-column-header"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: columnIndex * 0.08 + 0.1,
                                    }}
                                >
                                    {column.header}
                                </motion.h3>

                                {/* Skill Items */}
                                <div className="skill-list">
                                    {column.skills.map((skill, skillIndex) => (
                                        <motion.div
                                            key={skill.name}
                                            className={`skill-holo-item ${hoveredSkill === skill.name ? "hovered glitch-active" : ""}`}
                                            style={{
                                                "--skill-index": skillIndex,
                                                "--float-delay": `${(columnIndex * 5 + skillIndex) * 0.15}s`,
                                            }}
                                            initial={{
                                                opacity: 0,
                                                scale: 0.95,
                                            }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{
                                                duration: 0.3,
                                                delay:
                                                    columnIndex * 0.08 +
                                                    skillIndex * 0.04,
                                                ease: [0.25, 0.8, 0.25, 1],
                                            }}
                                            onMouseEnter={(e) =>
                                                handleMouseEnter(skill, e)
                                            }
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            {/* Holographic glow layers */}
                                            <div className="holo-glow-inner"></div>
                                            <div className="holo-glow-outer"></div>

                                            {/* Scanline overlay on panel */}
                                            <div className="skill-scanlines"></div>

                                            {/* Symbol with glitch on hover */}
                                            <motion.span
                                                className="skill-symbol-start"
                                                animate={{
                                                    rotate:
                                                        hoveredSkill ===
                                                        skill.name
                                                            ? [0, -2, 2, 0]
                                                            : 0,
                                                    x:
                                                        hoveredSkill ===
                                                        skill.name
                                                            ? [0, -1, 1, 0]
                                                            : 0,
                                                }}
                                                transition={{
                                                    duration: 0.18,
                                                    ease: [0.25, 0.8, 0.25, 1],
                                                }}
                                            >
                                                {symbolMap[skill.symbol] || "["}
                                            </motion.span>

                                            {/* Skill name with character glitch */}
                                            <motion.span
                                                className="skill-name-holo"
                                                animate={{
                                                    x:
                                                        hoveredSkill ===
                                                        skill.name
                                                            ? [0, -1, 1, -1, 0]
                                                            : 0,
                                                }}
                                                transition={{
                                                    duration: 0.15,
                                                    ease: [0.25, 0.8, 0.25, 1],
                                                }}
                                            >
                                                {skill.name}
                                            </motion.span>

                                            <motion.span
                                                className="skill-symbol-end"
                                                animate={{
                                                    rotate:
                                                        hoveredSkill ===
                                                        skill.name
                                                            ? [0, 2, -2, 0]
                                                            : 0,
                                                    x:
                                                        hoveredSkill ===
                                                        skill.name
                                                            ? [0, 1, -1, 0]
                                                            : 0,
                                                }}
                                                transition={{
                                                    duration: 0.18,
                                                    ease: [0.25, 0.8, 0.25, 1],
                                                }}
                                            >
                                                {endMap[skill.symbol] || "]"}
                                            </motion.span>

                                            {/* ASCII Animation on hover */}
                                            {hoveredSkill === skill.name && currentAsciiType && (
                                                <motion.div
                                                    className="skill-ascii-animation"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.15 }}
                                                >
                                                    {asciiAnimations[currentAsciiType]?.[asciiFrame] || "→"}
                                                </motion.div>
                                            )}

                                            {/* Code Snippet on hover */}
                                            {hoveredSkill === skill.name && (
                                                <motion.div
                                                    className="skill-code-snippet"
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 5 }}
                                                    transition={{ 
                                                        duration: 0.2,
                                                        delay: 0.05 
                                                    }}
                                                >
                                                    {skill.code}
                                                </motion.div>
                                            )}

                                            {/* Terminal label */}
                                            {hoveredSkill === skill.name && (
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
                                                            0.25, 0.8, 0.25, 1,
                                                        ],
                                                    }}
                                                >
                                                    <div className="label-text">
                                                        {terminalLabel}
                                                    </div>
                                                    <div className="label-cursor"></div>
                                                </motion.div>
                                            )}

                                            {/* Ripple effect */}
                                            {showRipple &&
                                                hoveredSkill === skill.name && (
                                                    <motion.div
                                                        className="skill-ripple"
                                                        style={{
                                                            left: ripplePosition.x,
                                                            top: ripplePosition.y,
                                                        }}
                                                        initial={{
                                                            scale: 0,
                                                            opacity: 0.6,
                                                        }}
                                                        animate={{
                                                            scale: 3,
                                                            opacity: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.6,
                                                            ease: "easeOut",
                                                        }}
                                                    />
                                                )}
                                        </motion.div>
                                    ))}
                                </div>
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
