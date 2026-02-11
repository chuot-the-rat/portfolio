import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useMode, MODES } from "../context/ModeContext";
import "./ProjectCard.css";

/**
 * ProjectCard Component - Mode-Specific Hover System
 *
 * Work Mode: Technical/Cyber Editorial with holographic popups
 * - System labels [preview_loaded], [media_active]
 * - De-emphasis of neighboring projects
 * - Fast, precise animations
 * - No card lift effects
 *
 * Clean Mode: Original smooth hover
 * - Soft lift and scale
 * - Smooth overlay previews
 * - Gentle easing and transitions
 *
 * Each project uses a different hover pattern (A, B, C, D)
 */

const ProjectCard = ({
    project,
    onHover,
    onLeave,
    isHovered,
    isOtherHovered,
    hoverPattern = "pattern-a",
}) => {
    const cardRef = useRef(null);
    const [systemLabel, setSystemLabel] = useState("[idle]");
    const { mode } = useMode();
    const isWorkMode = mode === MODES.WORK;
    const isChaosMode = mode === MODES.CHAOS;

    // Cursor-aware parallax (minimal for technical feel)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Reduced parallax for technical aesthetic
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [0.5, -0.5]), {
        stiffness: 300,
        damping: 25,
    });
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-0.5, 0.5]), {
        stiffness: 300,
        damping: 25,
    });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mouseX.set((e.clientX - centerX) / rect.width);
        mouseY.set((e.clientY - centerY) / rect.height);
    };

    // Cancel animations when mode changes mid-hover
    useEffect(() => {
        if (isHovered) {
            // Re-trigger appropriate hover animation for new mode
            setSystemLabel(isWorkMode ? "[preview_loaded]" : "[idle]");
        }
    }, [mode, isHovered, isWorkMode]);

    const handleMouseEnter = () => {
        if (isWorkMode) {
            // Work Mode: Fast system labels
            setSystemLabel("[preview_loaded]");
            setTimeout(() => setSystemLabel("[media_active]"), 120);
        } else if (isCleanMode) {
            // Clean Mode: No system labels, smooth hover
            setSystemLabel("");
        }
        onHover();
    };

    const handleMouseLeave = () => {
        setSystemLabel("[idle]");
        mouseX.set(0);
        mouseY.set(0);
        onLeave();
    };

    return (
        <Link
            to={`/projects/${project.id}`}
            className="project-card-link"
        >
            <motion.article
                ref={cardRef}
                className={`project-card ${hoverPattern} ${isOtherHovered ? "de-emphasized" : ""}`}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: isOtherHovered ? 0.65 : 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.2,
                    ease: [0.2, 0.8, 0.2, 1],
                }}
                style={{
                    rotateX,
                    rotateY,
                    transformPerspective: 1200,
                }}
            >
                {/* System Label - Technical Indicator */}
                <motion.div
                    className="project-system-label"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: isHovered ? 0.5 : 0,
                    }}
                    transition={{
                        duration: 0.18,
                        ease: [0.2, 0.8, 0.2, 1],
                    }}
                >
                    {systemLabel}
                </motion.div>

                {/* Text Content - Technical Editorial */}
                <div className="project-card-content">
                    <motion.h3
                        className="project-card-title"
                        animate={{
                            x: isHovered ? 6 : 0,
                            letterSpacing: isHovered ? "-0.048em" : "-0.04em",
                        }}
                        transition={{
                            duration: 0.2,
                            ease: [0.2, 0.8, 0.2, 1],
                        }}
                    >
                        {project.title}

                        {/* Title Underline - Draws in quickly */}
                        <motion.span
                            className="project-title-underline"
                            initial={{ scaleX: 0 }}
                            animate={{
                                scaleX: isHovered ? 1 : 0,
                            }}
                            transition={{
                                duration: 0.18,
                                ease: [0.2, 0.8, 0.2, 1],
                            }}
                        />
                    </motion.h3>

                    <motion.div
                        className="project-card-meta"
                        animate={{
                            opacity: isOtherHovered
                                ? 0.3
                                : isHovered
                                  ? 0.9
                                  : 0.6,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: [0.2, 0.8, 0.2, 1],
                        }}
                    >
                        <span className="project-card-category">
                            {project.category}
                        </span>
                        <span className="project-card-separator">•</span>
                        <span className="project-card-year">
                            {project.year}
                        </span>
                    </motion.div>

                    {/* View Case Study Label */}
                    <motion.div
                        className="project-view-label"
                        initial={{ opacity: 0, x: -4 }}
                        animate={{
                            opacity: isHovered ? 0.7 : 0,
                            x: isHovered ? 0 : -4,
                        }}
                        transition={{
                            duration: 0.2,
                            delay: isHovered ? 0.1 : 0,
                            ease: [0.2, 0.8, 0.2, 1],
                        }}
                    >
                        [view_case_study]
                    </motion.div>
                </div>
            </motion.article>
        </Link>
    );
};

export default ProjectCard;
