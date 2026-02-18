import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useMode, MODES } from "../context/ModeContext";
import "./PreviewPanel.css";

/**
 * PreviewPanel - Scattered overlapping image preview on hover
 *
 * Shows 3-5 randomly selected project images in a scattered,
 * slightly overlapping layout with staggered reveal animation.
 */

const PreviewPanel = ({ project, hoverPattern = "pattern-a" }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const { mode } = useMode();
    const isWorkMode = mode === MODES.WORK;

    // Use pre-shuffled hoverImages (re-shuffled on each hover in Home.jsx)
    const previewMedia = (project.hoverImages || []).filter(Boolean);

    // Generate scattered positions for each image — memoized per set
    const scatterPositions = useMemo(() => {
        const count = previewMedia.length;
        if (count === 0) return [];

        // Pre-defined scatter slots that overlap slightly
        const slots = [
            { top: 20, left: 10, rotate: -3, width: 220 },
            { top: 60, left: 180, rotate: 2, width: 200 },
            { top: 180, left: 40, rotate: -1.5, width: 210 },
            { top: 140, left: 220, rotate: 3, width: 190 },
            { top: 280, left: 130, rotate: -2, width: 200 },
        ];

        return slots.slice(0, count).map((slot, i) => ({
            top: `${slot.top + (Math.random() * 20 - 10)}px`,
            left: `${slot.left + (Math.random() * 20 - 10)}px`,
            rotate: slot.rotate + (Math.random() * 2 - 1),
            width: `${slot.width + (Math.random() * 20 - 10)}px`,
            zIndex: 10 + i,
        }));
    }, [previewMedia.length]);

    return (
        <>
            {/* Scattered overlapping images */}
            {previewMedia.length > 0 ? (
                previewMedia.map((media, index) => {
                    const pos = scatterPositions[index];
                    if (!pos) return null;

                    return (
                        <motion.div
                            key={`${project.id}-${index}`}
                            className="preview-scatter-card"
                            initial={{
                                opacity: 0,
                                y: 30,
                                rotate: pos.rotate - 4,
                                scale: 0.9,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                rotate: pos.rotate,
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: -20,
                                scale: 0.92,
                            }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                                ease: [0.2, 0.8, 0.2, 1],
                            }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                position: "absolute",
                                top: pos.top,
                                left: pos.left,
                                width: pos.width,
                                zIndex: hoveredIndex === index ? 30 : pos.zIndex,
                            }}
                        >
                            <div className="preview-scatter-img-wrap">
                                <img
                                    src={media.src || media}
                                    alt={media.alt || `${project.title} preview ${index + 1}`}
                                    loading="lazy"
                                    className="preview-scatter-img"
                                />
                            </div>
                        </motion.div>
                    );
                })
            ) : (
                // Fallback: Single thumbnail
                project.thumbnail && (
                    <motion.div
                        className="preview-scatter-card"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                        style={{
                            position: "absolute",
                            top: "80px",
                            left: "60px",
                            width: "320px",
                            zIndex: 10,
                        }}
                    >
                        <div className="preview-scatter-img-wrap">
                            <img
                                src={project.thumbnail}
                                alt={project.title}
                                loading="lazy"
                                className="preview-scatter-img"
                            />
                        </div>
                    </motion.div>
                )
            )}

            {/* Work Mode: Holographic Metadata Panel */}
            {isWorkMode && (
                <motion.div
                    className="holographic-panel"
                    initial={{ opacity: 0, x: 80, scale: 0.95 }}
                    animate={{ opacity: 0.95, x: 0, scale: 1.02 }}
                    exit={{ opacity: 0, x: 40, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.25, 0.8, 0.25, 1] }}
                >
                    <div className="holo-edge"></div>
                    <div className="holo-content">
                        <div className="holo-metadata">
                            <span className="holo-label">[status]</span>
                            <span className="holo-value">
                                {project.systemMetadata?.status || "shipped"}
                            </span>
                        </div>
                        {project.role && (
                            <div className="holo-metadata">
                                <span className="holo-label">[role]</span>
                                <span className="holo-value">
                                    {project.role}
                                </span>
                            </div>
                        )}
                        <div className="holo-metadata">
                            <span className="holo-label">[preview_loaded]</span>
                        </div>
                    </div>
                    <div className="scanline-overlay"></div>
                </motion.div>
            )}
        </>
    );
};

export default PreviewPanel;
