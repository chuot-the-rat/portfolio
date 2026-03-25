import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./SkillsSection.css";

// ASCII Animation sequences for hover overlays
const asciiAnimations = {
    arrows: ["→", "→ →", "→ → →"],
    loading: ["[    ]", "[=   ]", "[==  ]", "[=== ]", "[====]"],
    cube: ["[□]", "[◧]", "[■]", "[◨]", "[□]"],
    brackets: ["[ ]", "[< >]", "[{ }]", "[< >]", "[ ]"],
    dots: [".", "..", "..."],
};

// Skill overlay data mapped by skill name
const asciiScripts = {
    "User Research": { code: "user.study();", ascii: "cube", level: "v2.0" },
    Wireframing: {
        code: "sketch.wireframe();",
        ascii: "brackets",
        level: "v3.0",
    },
    Prototyping: { code: "proto.build();", ascii: "loading", level: "v3.0" },
    "User Testing": { code: "test.observe();", ascii: "dots", level: "v1.0" },
    "User Flows": { code: "flow.map();", ascii: "arrows", level: "v2.0" },
    "Journey Mapping": {
        code: "journey.trace();",
        ascii: "arrows",
        level: "v1.0",
    },
    Figma: { code: "design.create();", ascii: "arrows", level: "v3.0" },
    Typography: { code: "font.setStyle();", ascii: "dots", level: "v3.0" },
    "Color Theory": {
        code: "color.harmonize();",
        ascii: "cube",
        level: "v3.0",
    },
    Accessibility: { code: "a11y.check();", ascii: "brackets", level: "v1.0" },
    "Responsive Design": {
        code: "layout.adapt();",
        ascii: "loading",
        level: "v2.0",
    },
    "Design Systems": { code: "sys.organize();", ascii: "cube", level: "v1.0" },
    "HTML/CSS": { code: "<div>style</div>", ascii: "arrows", level: "v3.0" },
    JavaScript: { code: "()=>{code()}", ascii: "loading", level: "v1.0" },
    React: { code: "render(<App />);", ascii: "cube", level: "v1.0" },
    "Next.js": { code: "next.build();", ascii: "loading", level: "beta" },
    Python: { code: "python.run();", ascii: "dots", level: "v1.0" },
    "Git/GitHub": { code: "git.commit();", ascii: "brackets", level: "v1.0" },
    "Adobe Illustrator": {
        code: "vector.draw();",
        ascii: "arrows",
        level: "v2.0",
    },
    Photoshop: { code: "px.edit();", ascii: "loading", level: "v1.0" },
    "After Effects": {
        code: "anim.keyframe();",
        ascii: "arrows",
        level: "beta",
    },
    Framer: { code: "motion.animate();", ascii: "cube", level: "v1.0" },
    "VS Code": { code: "editor.code();", ascii: "loading", level: "v3.0" },
    Notion: { code: "notes.sync();", ascii: "dots", level: "v3.0" },
};

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
    const [asciiFrame, setAsciiFrame] = useState(0);
    const [currentAsciiType, setCurrentAsciiType] = useState(null);
    const [terminalLabel, setTerminalLabel] = useState("");
    const sectionRef = useRef(null);
    const asciiInterval = useRef(null);
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

    useEffect(() => {
        return () => {
            if (asciiInterval.current) {
                clearInterval(asciiInterval.current);
            }
        };
    }, []);

    const handleMouseEnter = (skill) => {
        const skillName =
            typeof skill === "string" ? skill : skill.name || skill;
        setHoveredSkill(skillName);

        if (!prefersReducedMotion.current) {
            const script = asciiScripts[skillName];
            if (script) {
                setCurrentAsciiType(script.ascii);
                setAsciiFrame(0);
                setTerminalLabel(
                    `[${(script.level || "v1.0").toUpperCase()}] SYSTEM_LOADED`,
                );

                if (asciiInterval.current) clearInterval(asciiInterval.current);
                asciiInterval.current = setInterval(() => {
                    setAsciiFrame((prev) => {
                        const frames =
                            asciiAnimations[script.ascii] ||
                            asciiAnimations.arrows;
                        return (prev + 1) % frames.length;
                    });
                }, 150);
            }
        }
    };

    const handleMouseLeave = () => {
        setHoveredSkill(null);
        setTerminalLabel("");
        setCurrentAsciiType(null);
        setAsciiFrame(0);
        if (asciiInterval.current) {
            clearInterval(asciiInterval.current);
            asciiInterval.current = null;
        }
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
