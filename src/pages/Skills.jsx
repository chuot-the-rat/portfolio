import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { SKILL_CATEGORIES } from "../data/skills/skillsData";
import "./Skills.css";

function LiveClock() {
    const formatTime = () =>
        new Date().toLocaleTimeString("en-US", {
            timeZone: "America/Vancouver",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

    const [time, setTime] = useState(formatTime);

    useEffect(() => {
        const id = setInterval(() => setTime(formatTime()), 30_000);
        return () => clearInterval(id);
    }, []);

    return <span className="skills-status-time">{time}</span>;
}

export default function Skills() {
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

    return (
        <div className="skills-page">
            <main className="skills-main">
                <motion.section
                    className="skills-hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="skills-status" aria-label="Availability status">
                        <span className="skills-status-dot" aria-hidden="true" />
                        <span>Available</span>
                        <span className="skills-status-sep" aria-hidden="true">·</span>
                        <span>Vancouver, BC</span>
                        <span className="skills-status-sep" aria-hidden="true">·</span>
                        <LiveClock />
                    </div>
                    <h1 className="skills-title">Skills & Expertise</h1>
                    <p className="skills-subtitle">
                        A toolkit of design and development capabilities
                    </p>
                </motion.section>

                <section
                    ref={sectionRef}
                    className={`skills-content ${isVisible ? "visible" : ""}`}
                >
                    {SKILL_CATEGORIES.map((category, categoryIndex) => (
                            <motion.div
                                key={category.id}
                                className="skills-category"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                transition={{
                                    duration: 0.5,
                                    delay: categoryIndex * 0.1,
                                    ease: [0.4, 0, 0.2, 1],
                                }}
                            >
                                <h2 className="skills-category-title">
                                    {category.label}
                                </h2>

                                <div className="skills-list">
                                    {category.skills.map((skill, skillIndex) => (
                                            <motion.div
                                                key={skill.name}
                                                className="skill-pill"
                                                initial={{ opacity: 0 }}
                                                animate={
                                                    isVisible
                                                        ? { opacity: 1 }
                                                        : {}
                                                }
                                                transition={{
                                                    duration: 0.4,
                                                    delay:
                                                        categoryIndex * 0.1 +
                                                        skillIndex * 0.05,
                                                }}
                                            >
                                                <span className="skill-pill-name">
                                                    {skill.name}
                                                </span>
                                            </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                    ))}
                </section>
            </main>
        </div>
    );
}
