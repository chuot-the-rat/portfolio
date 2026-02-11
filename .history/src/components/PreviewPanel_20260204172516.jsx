import { motion } from "framer-motion";
import "./PreviewPanel.css";

/**
 * PreviewPanel - Jackie Hu Free-Floating Media
 *
 * Media exists directly in whitespace - no containers, cards, or backgrounds.
 * Snappy, confident motion. Intentional positioning.
 *
 * Design Philosophy:
 * - Media floats freely in space, not boxed
 * - Quick, confident animations
 * - Absolute positioning for intentional layout
 * - Support images and videos
 * - Prevent accidental overlap
 */

const PreviewPanel = ({ project }) => {
    // Determine layout type
    const layoutType =
        project.previewLayout ||
        (project.category?.toLowerCase().includes("mobile")
            ? "mobile"
            : project.category?.toLowerCase().includes("web")
              ? "desktop"
              : "mixed");

    // Gather preview media (images and videos)
    const previewMedia = [
        ...(project.hoverImages || []),
        ...(project.solution?.images?.slice(0, 3) || []),
        ...(project.overview?.images?.slice(0, 1) || []),
    ]
        .filter(Boolean)
        .slice(0, 3); // Max 3 items to prevent overlap

    // Bold diagonal pop-out - editorial fashion feel
    const getMediaVariants = (index) => ({
        hidden: {
            opacity: 0,
            x: 80 + index * 20,
            y: -40 + index * 25,
            rotate: 2 + index * 1,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            transition: {
                duration: 0.3,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
            },
        },
        exit: {
            opacity: 0,
            x: 40,
            y: -20,
            rotate: -2,
            transition: {
                duration: 0.2,
                ease: [0.6, 0, 0.8, 1],
            },
        },
    });

    // Editorial diagonal positioning - asymmetric and bold
    const getMediaPosition = (index, total) => {
        if (layoutType === "mobile") {
            return {
                top: `${60 + index * 200}px`,
                right: `${40 + (index % 2) * 80}px`,
            };
        } else if (layoutType === "desktop") {
            return {
                top: `${120 + index * 280}px`,
                right: `${20 + index * 30}px`,
            };
        } else {
            // Mixed: magazine-like composition with diagonal offset
            const positions = [
                { top: "80px", right: "100px" },
                { top: "320px", right: "20px" },
                { top: "180px", right: "380px" },
            ];
            return positions[index] || positions[0];
        }
    };

    return (
        <>
            {/* Free-Floating Media - No Container */}
            {previewMedia.length > 0 ? (
                previewMedia.map((media, index) => {
                    const isVideo =
                        media.type === "video" || media.src?.endsWith(".mp4");
                    const position = getMediaPosition(
                        index,
                        previewMedia.length,
                    );

                    // Bold sizing for editorial impact
                    const size =
                        layoutType === "mobile"
                            ? { width: "240px", height: "auto" }
                            : layoutType === "desktop"
                              ? { width: "480px", height: "auto" }
                              : index === 0
                                ? { width: "420px", height: "auto" }
                                : { width: "300px", height: "auto" };

                    return (
                        <motion.div
                            key={index}
                            className="preview-media-float"
                            variants={getMediaVariants(index)}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            style={{
                                position: "absolute",
                                ...position,
                                ...size,
                                zIndex: 10 + index,
                            }}
                        >
                            {isVideo ? (
                                <video
                                    src={media.src || media}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="preview-video"
                                />
                            ) : (
                                <img
                                    src={media.src || media}
                                    alt={
                                        media.alt ||
                                        `${project.title} preview ${index + 1}`
                                    }
                                    loading="lazy"
                                    className="preview-image"
                                />
                            )}
                        </motion.div>
                    );
                })
            ) : (
                // Fallback: Single thumbnail
                <motion.div
                    className="preview-media-float"
                    variants={getMediaVariants(0)}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{
                        position: "absolute",
                        top: "80px",
                        right: "60px",
                        width: "340px",
                        zIndex: 10,
                    }}
                >
                    <img
                        src={project.thumbnail}
                        alt={project.title}
                        loading="lazy"
                        className="preview-image"
                    />
                </motion.div>
            )}
        </>
    );
};

export default PreviewPanel;
